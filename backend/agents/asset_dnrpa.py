import sys
import json
import time
from models import Asset

def scrape_dnrpa(ci_ruc):
    """
    Simula el scraping del registro automotor (DNRPA).
    En producción, usaría requests/BeautifulSoup y pytesseract para captchas.
    """
    # Simulación de delay de red y procesamiento OCR
    time.sleep(1.5)
    
    # Datos simulados
    vehiculos = [
        Asset(
            asset_type="Vehiculo",
            identifier="AAA 123",
            description="TOYOTA HILUX 2018",
            source="DNRPA"
        ).model_dump(),
        Asset(
            asset_type="Vehiculo",
            identifier="BCD 456",
            description="KIA RIO 2020",
            source="DNRPA"
        ).model_dump()
    ]
    
    return {
        "status": "success",
        "source": "DNRPA",
        "data": vehiculos
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Se requiere CI/RUC como argumento"}))
        sys.exit(1)
        
    ci_ruc = sys.argv[1]
    result = scrape_dnrpa(ci_ruc)
    print(json.dumps(result))
