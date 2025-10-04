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

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: AI chat - вопросы через DeepSeek AI + анализ файлов
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
    
    deepseek_key = os.environ.get('DEEPSEEK_API_KEY')
    openrouter_key = os.environ.get('OPENROUTER_API_KEY')
    database_url = os.environ.get('DATABASE_URL')
    
    use_fallback = False
    if not deepseek_key and not openrouter_key:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'API ключ не установлен. Добавьте DEEPSEEK_API_KEY или OPENROUTER_API_KEY.'})
        }
    
    file_context = ""
    file_name_info = ""
    
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
                file_name_info = f" (анализирую файл: {file_name})"
            
            cursor.close()
            conn.close()
        except Exception as e:
            file_context = f"\n\n(Ошибка чтения файла: {str(e)})"
    
    full_message = user_message + file_context
    
    try:
        if deepseek_key:
            url = "https://api.deepseek.com/v1/chat/completions"
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {deepseek_key}"
            }
            payload = {
                "messages": [
                    {
                        "role": "system",
                        "content": "Ты Богдан ИИ - умный AI-помощник на базе DeepSeek. Анализируешь документы, отвечаешь на вопросы кратко и точно на русском языке. Если прикреплен файл - обязательно анализируй его содержимое в контексте вопроса."
                    },
                    {"role": "user", "content": full_message}
                ],
                "model": "deepseek-chat",
                "stream": False,
                "temperature": 0.7,
                "max_tokens": 2000
            }
        else:
            use_fallback = True
            url = "https://openrouter.ai/api/v1/chat/completions"
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {openrouter_key}",
                "HTTP-Referer": "https://poehali.dev",
                "X-Title": "Богдан ИИ"
            }
            payload = {
                "messages": [
                    {
                        "role": "system",
                        "content": "Ты Богдан ИИ - умный AI-помощник. Анализируешь документы, отвечаешь на вопросы кратко и точно на русском языке."
                    },
                    {"role": "user", "content": full_message}
                ],
                "model": "meta-llama/llama-3.2-3b-instruct:free",
                "temperature": 0.7,
                "max_tokens": 1500
            }
        
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        
        result = response.json()
        ai_response = result['choices'][0]['message']['content']
        
        model_name = "OpenRouter (Llama 3.2)" if use_fallback else "DeepSeek"
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({
                'response': ai_response,
                'file_analyzed': bool(file_id and file_context),
                'model': model_name
            }, ensure_ascii=False)
        }
        
    except requests.exceptions.HTTPError as e:
        if e.response.status_code in [401, 403]:
            error_msg = 'API ключ недействителен. Проверьте ключ в секретах.'
            return {
                'statusCode': 403,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': error_msg})
            }
        elif e.response.status_code == 402 and deepseek_key and openrouter_key:
            try:
                url = "https://openrouter.ai/api/v1/chat/completions"
                headers = {
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {openrouter_key}",
                    "HTTP-Referer": "https://poehali.dev",
                    "X-Title": "Богдан ИИ"
                }
                payload = {
                    "messages": [
                        {"role": "system", "content": "Ты Богдан ИИ - AI-помощник. Отвечай кратко на русском."},
                        {"role": "user", "content": full_message}
                    ],
                    "model": "meta-llama/llama-3.2-3b-instruct:free",
                    "temperature": 0.7,
                    "max_tokens": 1500
                }
                
                fallback_response = requests.post(url, headers=headers, json=payload, timeout=30)
                fallback_response.raise_for_status()
                fallback_result = fallback_response.json()
                fallback_ai_response = fallback_result['choices'][0]['message']['content']
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'response': fallback_ai_response + "\n\n⚠️ (Ответ от бесплатной модели - DeepSeek требует пополнения)",
                        'file_analyzed': bool(file_id and file_context),
                        'model': 'OpenRouter Fallback (Llama 3.2)'
                    }, ensure_ascii=False)
                }
            except:
                pass
        
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': f'AI processing error: {str(e)}'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': f'AI processing error: {str(e)}'})
        }