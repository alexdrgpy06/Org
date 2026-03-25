import sys
import json
import time
from models import SocialProfile

def scrape_social(alias):
    """
    Simula la búsqueda de perfiles en redes sociales.
    """
    time.sleep(2.0)
    
    perfiles = [
        SocialProfile(
            platform="Twitter",
            username=f"@{alias}",
            url=f"https://twitter.com/{alias}",
            is_verified=False
        ).model_dump(),
        SocialProfile(
            platform="Instagram",
            username=f"@{alias}",
            url=f"https://instagram.com/{alias}",
            is_verified=True
        ).model_dump(),
        SocialProfile(
            platform="LinkedIn",
            username=f"{alias}",
            url=f"https://linkedin.com/in/{alias}",
            is_verified=False
        ).model_dump()
    ]
    
    return {
        "status": "success",
        "source": "SocialMedia",
        "data": perfiles
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Se requiere alias como argumento"}))
        sys.exit(1)
        
    alias = sys.argv[1]
    result = scrape_social(alias)
    print(json.dumps(result))
