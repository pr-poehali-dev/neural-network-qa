import json
import base64
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Handle file uploads and store in database with binary data
    Args: event with httpMethod, body containing file data
    Returns: Success response with file_id for later analysis
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'GET':
        database_url = os.environ.get('DATABASE_URL')
        
        if not database_url:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Database not configured'})
            }
        
        try:
            conn = psycopg2.connect(database_url)
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            
            cursor.execute(
                "SELECT id, file_name, file_type, file_size, session_id, uploaded_at FROM files ORDER BY uploaded_at DESC"
            )
            
            files = cursor.fetchall()
            
            cursor.close()
            conn.close()
            
            files_list = []
            for f in files:
                files_list.append({
                    'id': f['id'],
                    'name': f['file_name'],
                    'type': f['file_type'],
                    'size': f['file_size'],
                    'uploadedAt': f['uploaded_at'].isoformat() if f['uploaded_at'] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'files': files_list})
            }
        
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': str(e)})
            }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        filename = body.get('filename', 'unknown')
        file_type = body.get('fileType', 'unknown')
        file_size = body.get('fileSize', 0)
        content = body.get('content', '')
        session_id = body.get('sessionId', 'anonymous')
        
        database_url = os.environ.get('DATABASE_URL')
        
        if not database_url:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Database not configured'})
            }
        
        file_data = content.encode('utf-8')
        
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        cursor.execute(
            "INSERT INTO files (file_name, file_data, file_type, file_size, session_id) VALUES (%s, %s, %s, %s, %s) RETURNING id",
            (filename, file_data, file_type, file_size, session_id)
        )
        
        file_id = cursor.fetchone()['id']
        
        conn.commit()
        cursor.close()
        conn.close()
        
        result = {
            'success': True,
            'file_id': file_id,
            'file': {
                'filename': filename,
                'type': file_type,
                'size': file_size
            }
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps(result)
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }