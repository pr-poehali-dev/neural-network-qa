import json
import base64
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def is_image_file(file_name: str) -> bool:
    """Check if file is an image based on extension"""
    image_extensions = ('.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg')
    return file_name.lower().endswith(image_extensions)

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
                "SELECT id, file_name, file_type, file_size, file_data, session_id, uploaded_at FROM files ORDER BY uploaded_at DESC"
            )
            
            files = cursor.fetchall()
            
            cursor.close()
            conn.close()
            
            files_list = []
            for f in files:
                file_info = {
                    'id': f['id'],
                    'name': f['file_name'],
                    'type': f['file_type'],
                    'size': f['file_size'],
                    'uploadedAt': f['uploaded_at'].isoformat() if f['uploaded_at'] else None
                }
                
                # Add base64 data for images
                if is_image_file(f['file_name']):
                    file_data = bytes(f['file_data'])
                    file_info['isImage'] = True
                    file_info['base64'] = base64.b64encode(file_data).decode('utf-8')
                else:
                    file_info['isImage'] = False
                
                files_list.append(file_info)
            
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
        
        # Handle base64 images or text content
        if is_image_file(filename):
            # Decode base64 for images
            try:
                file_data = base64.b64decode(content)
            except:
                file_data = content.encode('utf-8')
        else:
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