"""
Script para probar el endpoint de YouTube directamente
"""
import requests
import json

# URL del endpoint
url = "http://localhost:8000/analyze/youtube"

# Datos de prueba
data = {
    "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "max_comments": 10,  # Empezar con muy pocos
    "sort_by": "top"
}

print("🧪 Probando endpoint de YouTube...")
print(f"URL: {url}")
print(f"Datos: {json.dumps(data, indent=2)}")
print()

try:
    response = requests.post(url, json=data, timeout=60)
    print(f"Status Code: {response.status_code}")
    print(f"Response Headers: {dict(response.headers)}")
    print()
    
    if response.status_code == 200:
        result = response.json()
        print("✅ Éxito!")
        print(f"Total comentarios: {result.get('total_comments', 0)}")
        print(f"Tóxicos: {result.get('toxic_count', 0)}")
    else:
        print("❌ Error!")
        print(f"Response: {response.text}")
        
except requests.exceptions.ConnectionError:
    print("❌ Error: No se puede conectar al servidor")
    print("   Asegúrate de que el backend esté corriendo en http://localhost:8000")
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()

