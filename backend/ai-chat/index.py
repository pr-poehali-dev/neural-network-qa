import json
import os
from typing import Dict, Any, Optional
import psycopg2
from psycopg2.extras import RealDictCursor
import requests

def is_image_file(file_name: str) -> bool:
    """Check if file is an image based on extension"""
    image_extensions = ('.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg')
    return file_name.lower().endswith(image_extensions)

def extract_text_from_file(file_content: bytes, file_name: str) -> str:
    file_lower = file_name.lower()
    
    if is_image_file(file_name):
        return f"[Изображение: {file_name}]"
    
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

def simple_search_answer(question: str, knowledge_base: str, descriptions: list) -> str:
    """Улучшенный поиск по ключевым словам с учетом описаний файлов"""
    question_lower = question.lower()
    kb_lower = knowledge_base.lower()
    
    # Ключевые слова для поиска
    words = [w.strip('?.,!') for w in question_lower.split() if len(w) > 3]
    
    # Разбиваем базу знаний на предложения
    sentences = knowledge_base.split('\n')
    
    # Находим релевантные предложения
    relevant = []
    for sentence in sentences:
        if len(sentence.strip()) < 10:
            continue
        sentence_lower = sentence.lower()
        score = sum(1 for word in words if word in sentence_lower)
        
        # Увеличиваем вес, если совпадает с описанием
        for desc in descriptions:
            if desc and any(word in desc.lower() for word in words):
                score += 2
        
        if score > 0:
            relevant.append((score, sentence.strip()))
    
    # Сортируем по релевантности
    relevant.sort(reverse=True, key=lambda x: x[0])
    
    if not relevant:
        # Попробуем найти в описаниях
        desc_matches = [desc for desc in descriptions if desc and any(word in desc.lower() for word in words)]
        if desc_matches:
            return "Информация по вашему запросу:\n\n" + "\n\n".join(desc_matches)
        return "К сожалению, я не нашёл информацию по вашему вопросу в загруженных документах."
    
    # Берём топ-5 самых релевантных предложений
    answer_parts = [s[1] for s in relevant[:7]]
    answer = "\n\n".join(answer_parts)
    
    return answer

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
    image_files = []
    descriptions = []
    
    # Загружаем ВСЕ файлы как базу знаний
    if database_url:
        try:
            conn = psycopg2.connect(database_url)
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            
            cursor.execute("SELECT file_name, file_data, file_type, description FROM files ORDER BY id DESC LIMIT 10")
            files = cursor.fetchall()
            
            if files:
                knowledge_base = "\n\n=== БАЗА ЗНАНИЙ ===\n"
                for file_record in files:
                    file_content = bytes(file_record['file_data'])
                    file_name = file_record['file_name']
                    file_description = file_record.get('description', '')
                    
                    if file_description:
                        descriptions.append(file_description)
                    
                    # Separate images from text
                    if is_image_file(file_name):
                        import base64
                        image_files.append({
                            'name': file_name,
                            'base64': base64.b64encode(file_content).decode('utf-8'),
                            'mimeType': file_record.get('file_type', 'image/jpeg')
                        })
                        # Add description to knowledge base for images
                        if file_description:
                            knowledge_base += f"\n--- Файл: {file_name} [ИЗОБРАЖЕНИЕ] ---\n{file_description}\n"
                        else:
                            knowledge_base += f"\n--- Файл: {file_name} [ИЗОБРАЖЕНИЕ] ---\n"
                    else:
                        file_text = extract_text_from_file(file_content, file_name)
                        if file_description:
                            knowledge_base += f"\n--- Файл: {file_name} ---\nОписание: {file_description}\n{file_text[:5000]}\n"
                        else:
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
    
    ai_response = simple_search_answer(user_message, knowledge_base, descriptions)
    model_used = "Умный поиск по документам"
    
    response_data = {
        'response': ai_response,
        'file_analyzed': bool(knowledge_base),
        'model': model_used
    }
    
    # Add images to response if found
    if image_files:
        response_data['images'] = image_files
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps(response_data, ensure_ascii=False)
    }