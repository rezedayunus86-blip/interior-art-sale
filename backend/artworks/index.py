import json
import os
from typing import Dict, Any, List
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: CRUD операции для управления работами (картинами)
    Args: event - dict с httpMethod, body, queryStringParameters
          context - объект с request_id
    Returns: HTTP response с данными работ или результатом операции
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    try:
        database_url = os.environ.get('DATABASE_URL')
        if not database_url:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Database connection error'})
            }
        
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            artwork_id = params.get('id')
            
            if artwork_id:
                cursor.execute("SELECT * FROM artworks WHERE id = %s", (artwork_id,))
                artwork = cursor.fetchone()
                cursor.close()
                conn.close()
                
                if not artwork:
                    return {
                        'statusCode': 404,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': 'Работа не найдена'})
                    }
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps(dict(artwork), default=str)
                }
            else:
                cursor.execute("SELECT * FROM artworks ORDER BY created_at DESC")
                artworks = cursor.fetchall()
                cursor.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps([dict(art) for art in artworks], default=str)
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            title = body_data.get('title')
            description = body_data.get('description', '')
            price = body_data.get('price')
            size = body_data.get('size')
            image_url = body_data.get('image_url')
            is_available = body_data.get('is_available', True)
            
            if not all([title, price, size, image_url]):
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Все обязательные поля должны быть заполнены'})
                }
            
            cursor.execute(
                """
                INSERT INTO artworks (title, description, price, size, image_url, is_available)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING *
                """,
                (title, description, price, size, image_url, is_available)
            )
            new_artwork = cursor.fetchone()
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps(dict(new_artwork), default=str)
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            artwork_id = body_data.get('id')
            
            if not artwork_id:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'ID работы обязателен'})
                }
            
            cursor.execute(
                """
                UPDATE artworks 
                SET title = %s, description = %s, price = %s, size = %s, 
                    image_url = %s, is_available = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING *
                """,
                (
                    body_data.get('title'),
                    body_data.get('description'),
                    body_data.get('price'),
                    body_data.get('size'),
                    body_data.get('image_url'),
                    body_data.get('is_available', True),
                    artwork_id
                )
            )
            updated_artwork = cursor.fetchone()
            conn.commit()
            cursor.close()
            conn.close()
            
            if not updated_artwork:
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Работа не найдена'})
                }
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps(dict(updated_artwork), default=str)
            }
        
        elif method == 'DELETE':
            params = event.get('queryStringParameters') or {}
            artwork_id = params.get('id')
            
            if not artwork_id:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'ID работы обязателен'})
                }
            
            cursor.execute("DELETE FROM artworks WHERE id = %s RETURNING id", (artwork_id,))
            deleted = cursor.fetchone()
            conn.commit()
            cursor.close()
            conn.close()
            
            if not deleted:
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Работа не найдена'})
                }
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'message': 'Работа успешно удалена'})
            }
        
        else:
            cursor.close()
            conn.close()
            return {
                'statusCode': 405,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Method not allowed'})
            }
            
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': f'Server error: {str(e)}'})
        }
