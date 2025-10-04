import json
import os
from typing import Dict, Any, Optional
import psycopg2
from psycopg2.extras import RealDictCursor
import requests

def extract_text_from_file(file_content: bytes, file_name: str) -> str:
    file_lower = file_name.lower()
    
    if file_lower.endswith('.txt'):
        return file_content.decode('utf-8', errors='ignore')
    
    elif file_lower.endswith('.json'):
        try:
            data = json.loads(file_content.decode('utf-8'))
            return json.dumps(data, indent=2, ensure_ascii=False)
        except:
            return file_content.decode('utf-8', errors='ignore')
    
    elif file_lower.endswith(('.pdf', '.doc', '.docx')):
        return f"[Содержимое файла {file_name}]\n\n{file_content.decode('utf-8', errors='ignore')[:5000]}"
    
    else:
        return file_content.decode('utf-8', errors='ignore')[:10000]

def call_huggingface(message: str, api_key: str) -> str:
    url = "https://api-inference.huggingface.co/models/google/flan-t5-large"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "inputs": f"Ответь на русском языке кратко: {message}",
        "parameters": {
            "max_new_tokens": 500,
            "temperature": 0.7
        }
    }
    
    response = requests.post(url, headers=headers, json=payload, timeout=30)
    response.raise_for_status()
    result = response.json()
    
    if isinstance(result, list) and len(result) > 0:
        return result[0].get('generated_text', '')
    elif isinstance(result, dict) and 'generated_text' in result:
        return result['generated_text']
    return str(result)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: AI chat - DeepSeek/OpenRouter с автоматическим fallback
    Args: event с httpMethod, body (message, file_id)
          context с request_id
    Returns: HTTP response с ответом от AI
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    user_message: str = body_data.get('message', '')
    file_id: Optional[int] = body_data.get('file_id')
    
    if not user_message:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Message is required'})
        }
    
    hf_key = os.environ.get('HUGGINGFACE_API_KEY')
    database_url = os.environ.get('DATABASE_URL')
    
    if not hf_key:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'HUGGINGFACE_API_KEY не установлен. Получите бесплатно на https://huggingface.co/settings/tokens'})
        }
    
    file_context = ""
    
    if file_id and database_url:
        try:
            conn = psycopg2.connect(database_url)
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            
            cursor.execute("SELECT file_name, file_data FROM files WHERE id = %s", (file_id,))
            file_record = cursor.fetchone()
            
            if file_record:
                file_content = bytes(file_record['file_data'])
                file_name = file_record['file_name']
                file_text = extract_text_from_file(file_content, file_name)
                file_context = f"\n\nСодержимое прикрепленного файла '{file_name}':\n{file_text[:15000]}"
            
            cursor.close()
            conn.close()
        except Exception as e:
            file_context = f"\n\n(Ошибка чтения файла: {str(e)})"
    
    full_message = user_message + file_context
    
    ai_response = call_huggingface(full_message, hf_key)
    model_used = "Hugging Face (Flan-T5)"
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({
            'response': ai_response,
            'file_analyzed': bool(file_id and file_context),
            'model': model_used
        }, ensure_ascii=False)
    }