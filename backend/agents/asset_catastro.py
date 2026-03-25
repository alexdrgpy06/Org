import sys
import json
import time
from models import Asset

def query_catastro(ci):
    """
    Simula la consulta al Servicio Nacional de Catastro.
    """
    time.sleep(1.2)
    
    propiedades = [
        Asset(
            asset_type="Inmueble",
            identifier="Finca 12345",
            description="Cta Cte: 14-0001-01",
            source="Catastro"
        ).model_dump(),
        Asset(
            asset_type="Inmueble",
            identifier="Finca 67890",
            description="Cta Cte: 14-0002-05",
            source="Catastro"
        ).model_dump()
    ]
    
    return {
        "status": "success",
        "source": "Catastro",
        "data": propiedades
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Se requiere CI como argumento"}))
        sys.exit(1)
        
    ci = sys.argv[1]
    result = query_catastro(ci)
    print(json.dumps(result))
