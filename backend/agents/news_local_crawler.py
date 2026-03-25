import sys
import json
import time
from models import ThreatIntel

def crawl_news(nombre):
    """
    Simula el crawling de noticias locales (ABC, Ultima Hora, etc.).
    """
    time.sleep(2.5)
    
    noticias = [
        ThreatIntel(
            category="Noticia",
            description=f"El señor {nombre} fue mencionado en un artículo sobre desarrollo urbano.",
            date_detected="2023-01-15",
            severity=3,
            url_source="https://abc.com.py/noticia/123"
        ).model_dump(),
        ThreatIntel(
            category="Noticia",
            description=f"{nombre} asume nuevo cargo en el ministerio.",
            date_detected="2021-08-22",
            severity=2,
            url_source="https://ultimahora.com/noticia/456"
        ).model_dump()
    ]
    
    return {
        "status": "success",
        "source": "LocalNews",
        "data": noticias
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Se requiere nombre como argumento"}))
        sys.exit(1)
        
    nombre = sys.argv[1]
    result = crawl_news(nombre)
    print(json.dumps(result))
