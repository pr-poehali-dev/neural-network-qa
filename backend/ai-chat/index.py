import json
import os
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: AI chat endpoint - процессирует вопросы пользователей через Grok или OpenAI
    Args: event с httpMethod, body (содержит message)
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
    
    if not user_message:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Message is required'})
        }
    
    xai_key = os.environ.get('XAI_API_KEY')
    openai_key = os.environ.get('OPENAI_API_KEY')
    
    api_key = xai_key or openai_key
    
    if not api_key:
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({
                'response': f'Я получил ваш вопрос: "{user_message}". Система работает в демо-режиме. Добавьте XAI_API_KEY или OPENAI_API_KEY для полной функциональности.',
                'demo': True
            })
        }
    
    try:
        import openai
        
        if xai_key:
            client = openai.OpenAI(
                api_key=xai_key,
                base_url="https://api.x.ai/v1"
            )
            model = "grok-beta"
        else:
            client = openai.OpenAI(api_key=openai_key)
            model = "gpt-4o-mini"
        
        completion = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system", 
                    "content": "Ты Умный Помощник - AI-ассистент, который помогает пользователям с любыми вопросами. Отвечай кратко, по делу и на русском языке."
                },
                {"role": "user", "content": user_message}
            ],
            max_tokens=800,
            temperature=0.7
        )
        
        ai_response = completion.choices[0].message.content
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({
                'response': ai_response,
                'demo': False
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': f'AI processing error: {str(e)}'})
        }