import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Управление историей чатов - сохранение, загрузка, удаление
    Args: event с httpMethod, body, queryStringParameters
          context с request_id
    Returns: HTTP response с данными чатов
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Database not configured'})
        }
    
    try:
        conn = psycopg2.connect(dsn)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            query_params = event.get('queryStringParameters', {}) or {}
            session_id = query_params.get('session_id')
            
            if not session_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'session_id required'})
                }
            
            cur.execute(
                "SELECT c.id, c.title, c.created_at, c.updated_at, c.tags FROM chats c WHERE c.session_id = %s ORDER BY c.updated_at DESC LIMIT 10",
                (session_id,)
            )
            chats = cur.fetchall()
            
            result = []
            for chat in chats:
                cur.execute(
                    "SELECT role, content, created_at FROM messages WHERE chat_id = %s ORDER BY created_at ASC",
                    (chat['id'],)
                )
                messages = cur.fetchall()
                result.append({
                    'id': chat['id'],
                    'title': chat['title'],
                    'created_at': chat['created_at'].isoformat() if chat['created_at'] else None,
                    'messages': [{'role': m['role'], 'text': m['content']} for m in messages],
                    'tags': chat['tags'] or []
                })
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'chats': result})
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            session_id = body_data.get('session_id')
            title = body_data.get('title', 'Новый чат')
            messages = body_data.get('messages', [])
            tags = body_data.get('tags', [])
            
            if not session_id or not messages:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'session_id and messages required'})
                }
            
            cur.execute(
                "INSERT INTO chats (session_id, title, tags) VALUES (%s, %s, %s) RETURNING id",
                (session_id, title, tags)
            )
            chat_id = cur.fetchone()['id']
            
            for msg in messages:
                cur.execute(
                    "INSERT INTO messages (chat_id, role, content) VALUES (%s, %s, %s)",
                    (chat_id, msg.get('role'), msg.get('text'))
                )
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'success': True, 'chat_id': chat_id})
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            chat_id = body_data.get('chat_id')
            tags = body_data.get('tags', [])
            
            if not chat_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'chat_id required'})
                }
            
            cur.execute(
                "UPDATE chats SET tags = %s, updated_at = NOW() WHERE id = %s",
                (tags, chat_id)
            )
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'success': True})
            }
        
        elif method == 'DELETE':
            query_params = event.get('queryStringParameters', {}) or {}
            chat_id = query_params.get('chat_id')
            
            if not chat_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'chat_id required'})
                }
            
            cur.execute("DELETE FROM messages WHERE chat_id = %s", (chat_id,))
            cur.execute("DELETE FROM chats WHERE id = %s", (chat_id,))
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'success': True})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': f'Database error: {str(e)}'})
        }