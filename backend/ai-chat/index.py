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

def call_free_api(message: str) -> str:
    import re
    
    # Получаем vqd токен
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "text/event-stream",
        "x-vqd-accept": "1"
    }
    
    status_response = requests.get("https://duckduckgo.com/duckchat/v1/status", headers=headers)
    vqd = status_response.headers.get("x-vqd-4", "")
    
    if not vqd:
        return "Извините, сервис временно недоступен. Попробуйте позже."
    
    # Отправляем запрос в чат
    chat_headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "text/event-stream",
        "Content-Type": "application/json",
        "x-vqd-4": vqd
    }
    
    payload = {
        "model": "gpt-3.5-turbo-0125",
        "messages": [
            {"role": "system", "content": "Ты виртуальный помощник. Отвечай ТОЛЬКО на основе предоставленной информации. Если информации нет - скажи 'Информация не найдена в загруженных данных'."},
            {"role": "user", "content": message}
        ]
    }
    
    chat_response = requests.post(
        "https://duckduckgo.com/duckchat/v1/chat",
        headers=chat_headers,
        json=payload,
        timeout=25,
        stream=True
    )
    
    full_text = ""
    for line in chat_response.iter_lines():
        if line:
            line_str = line.decode('utf-8')
            if line_str.startswith('data: '):
                data_str = line_str[6:]
                if data_str != "[DONE]":
                    try:
                        data = json.loads(data_str)
                        if 'message' in data:
                            full_text += data['message']
                    except:
                        pass
    
    return full_text if full_text else "Не удалось получить ответ"

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
    
    database_url = os.environ.get('DATABASE_URL')
    
    knowledge_base = ""
    
    # Загружаем ВСЕ файлы как базу знаний
    if database_url:
        try:
            conn = psycopg2.connect(database_url)
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            
            cursor.execute("SELECT file_name, file_data FROM files ORDER BY id DESC LIMIT 10")
            files = cursor.fetchall()
            
            if files:
                knowledge_base = "\n\n=== БАЗА ЗНАНИЙ ===\n"
                for file_record in files:
                    file_content = bytes(file_record['file_data'])
                    file_name = file_record['file_name']
                    file_text = extract_text_from_file(file_content, file_name)
                    knowledge_base += f"\n--- Файл: {file_name} ---\n{file_text[:5000]}\n"
            
            cursor.close()
            conn.close()
        except Exception as e:
            knowledge_base = ""
    
    if not knowledge_base:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Загрузите хотя бы один файл с данными для ответов помощника'})
        }
    
    full_message = f"{knowledge_base}\n\nВОПРОС ПОЛЬЗОВАТЕЛЯ: {user_message}\n\nОтветь на основе ТОЛЬКО информации из базы знаний выше."
    
    ai_response = call_free_api(full_message)
    model_used = "DuckDuckGo AI"
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({
            'response': ai_response,
            'file_analyzed': bool(knowledge_base),
            'model': model_used
        }, ensure_ascii=False)
    }