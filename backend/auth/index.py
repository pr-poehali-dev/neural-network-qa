'''
Business: User authentication and authorization system
Args: event - dict with httpMethod, body, headers, queryStringParameters
      context - object with attributes: request_id, function_name
Returns: HTTP response with JWT tokens or error messages
'''

import json
import os
import hashlib
import secrets
import re
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, Tuple
import psycopg2
from psycopg2.extras import RealDictCursor

DATABASE_URL = os.environ.get('DATABASE_URL')

def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    pwd_hash = hashlib.sha256((password + salt).encode()).hexdigest()
    return f"{salt}${pwd_hash}"

def verify_password(password: str, stored_hash: str) -> bool:
    try:
        salt, pwd_hash = stored_hash.split('$')
        computed_hash = hashlib.sha256((password + salt).encode()).hexdigest()
        return computed_hash == pwd_hash
    except:
        return False

def generate_token(length: int = 32) -> str:
    return secrets.token_urlsafe(length)

def validate_email(email: str) -> bool:
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def validate_username(username: str) -> bool:
    if len(username) < 3 or len(username) > 30:
        return False
    pattern = r'^[a-zA-Z0-9_-]+$'
    return bool(re.match(pattern, username))

def validate_password(password: str) -> Tuple[bool, str]:
    if len(password) < 8:
        return False, "Пароль должен быть не менее 8 символов"
    if not re.search(r'[A-Za-z]', password):
        return False, "Пароль должен содержать буквы"
    if not re.search(r'[0-9]', password):
        return False, "Пароль должен содержать цифры"
    return True, ""

def create_user(conn, email: str, username: str, password: str, full_name: Optional[str] = None) -> Dict[str, Any]:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("SELECT id FROM users WHERE email = %s OR username = %s", (email, username))
    if cursor.fetchone():
        return {'error': 'Пользователь с таким email или username уже существует'}
    
    password_hash = hash_password(password)
    verification_token = generate_token()
    
    cursor.execute(
        """INSERT INTO users (email, username, password_hash, full_name, verification_token) 
           VALUES (%s, %s, %s, %s, %s) RETURNING id, email, username, full_name, created_at""",
        (email, username, password_hash, full_name, verification_token)
    )
    user = dict(cursor.fetchone())
    user_id = user['id']
    
    cursor.execute(
        "INSERT INTO user_stats (user_id) VALUES (%s)",
        (user_id,)
    )
    
    conn.commit()
    return user

def authenticate_user(conn, login: str, password: str) -> Optional[Dict[str, Any]]:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute(
        """SELECT id, email, username, password_hash, full_name, avatar_url, 
                  subscription_tier, is_active, is_verified 
           FROM users WHERE email = %s OR username = %s""",
        (login, login)
    )
    user = cursor.fetchone()
    
    if not user:
        return None
    
    if not verify_password(password, user['password_hash']):
        return None
    
    if not user['is_active']:
        return None
    
    user_dict = dict(user)
    del user_dict['password_hash']
    return user_dict

def create_session(conn, user_id: int, device_info: str, ip_address: str) -> Dict[str, str]:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    access_token = generate_token(32)
    refresh_token = generate_token(48)
    expires_at = datetime.now() + timedelta(days=30)
    
    cursor.execute(
        """INSERT INTO user_sessions (user_id, refresh_token, device_info, ip_address, expires_at)
           VALUES (%s, %s, %s, %s, %s)""",
        (user_id, refresh_token, device_info, ip_address, expires_at)
    )
    
    conn.commit()
    
    return {
        'access_token': access_token,
        'refresh_token': refresh_token,
        'expires_in': 1800
    }

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if not DATABASE_URL:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'DATABASE_URL not configured'})
        }
    
    try:
        conn = psycopg2.connect(DATABASE_URL)
        
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'register':
                email = body.get('email', '').strip().lower()
                username = body.get('username', '').strip()
                password = body.get('password', '')
                full_name = body.get('full_name', '').strip()
                
                if not email or not username or not password:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Email, username и password обязательны'})
                    }
                
                if not validate_email(email):
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Неверный формат email'})
                    }
                
                if not validate_username(username):
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Username должен быть 3-30 символов (буквы, цифры, _ и -)'})
                    }
                
                is_valid, error_msg = validate_password(password)
                if not is_valid:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': error_msg})
                    }
                
                user = create_user(conn, email, username, password, full_name or None)
                
                if 'error' in user:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps(user)
                    }
                
                device_info = event.get('headers', {}).get('user-agent', 'Unknown')
                ip_address = event.get('requestContext', {}).get('identity', {}).get('sourceIp', 'Unknown')
                
                tokens = create_session(conn, user['id'], device_info, ip_address)
                
                return {
                    'statusCode': 201,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'user': user,
                        'tokens': tokens,
                        'message': 'Регистрация успешна!'
                    })
                }
            
            elif action == 'login':
                login = body.get('login', '').strip()
                password = body.get('password', '')
                
                if not login or not password:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Login и password обязательны'})
                    }
                
                user = authenticate_user(conn, login, password)
                
                if not user:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Неверный логин или пароль'})
                    }
                
                device_info = event.get('headers', {}).get('user-agent', 'Unknown')
                ip_address = event.get('requestContext', {}).get('identity', {}).get('sourceIp', 'Unknown')
                
                tokens = create_session(conn, user['id'], device_info, ip_address)
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'user': user,
                        'tokens': tokens,
                        'message': 'Вход выполнен успешно!'
                    })
                }
            
            else:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Неизвестное действие'})
                }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
    finally:
        if 'conn' in locals():
            conn.close()
