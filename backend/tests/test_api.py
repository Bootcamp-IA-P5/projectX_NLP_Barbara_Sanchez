"""
Tests para la API REST.
"""
import pytest
from fastapi.testclient import TestClient
from pathlib import Path
import sys

# Añadir src al path
project_root = Path(__file__).parent.parent
src_path = project_root / 'src'
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))

# Importar app
try:
    from api.main import app
    API_AVAILABLE = True
except ImportError:
    API_AVAILABLE = False


@pytest.mark.skipif(not API_AVAILABLE, reason="API no disponible")
class TestAPIEndpoints:
    """Tests para endpoints de la API."""
    
    @pytest.fixture
    def client(self):
        """Cliente de prueba para la API."""
        return TestClient(app)
    
    def test_health_check(self, client):
        """Test endpoint de health check."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert data["status"] == "ok"
    
    def test_predict_single_text(self, client):
        """Test predicción de texto único."""
        response = client.post(
            "/predict",
            json={"text": "This is a test comment"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "is_toxic" in data
        assert "toxicity_label" in data
        assert "probability_toxic" in data
        assert "confidence" in data
        assert isinstance(data["is_toxic"], bool)
        assert data["toxicity_label"] in ["Toxic", "Not Toxic"]
        assert 0 <= data["probability_toxic"] <= 1
        assert 0 <= data["confidence"] <= 1
    
    def test_predict_empty_text(self, client):
        """Test predicción con texto vacío."""
        response = client.post(
            "/predict",
            json={"text": ""}
        )
        # Debe manejar texto vacío sin error
        assert response.status_code in [200, 400]
    
    def test_predict_batch(self, client):
        """Test predicción por lotes."""
        response = client.post(
            "/predict/batch",
            json={
                "texts": [
                    "This is a normal comment",
                    "I hate you so much!"
                ]
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "predictions" in data
        assert isinstance(data["predictions"], list)
        assert len(data["predictions"]) == 2
    
    def test_predict_invalid_request(self, client):
        """Test request inválido."""
        response = client.post(
            "/predict",
            json={"invalid": "field"}
        )
        # Debe retornar error 422 (validation error)
        assert response.status_code == 422

