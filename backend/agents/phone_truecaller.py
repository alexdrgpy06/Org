import sys
import json
import time
from models import PhoneNumber

def query_truecaller(phone):
    """
    Simula una consulta a la API de TrueCaller o similar.
    """
    time.sleep(1.8)
    
    # Datos simulados basados en el número
    if phone.startswith("+595"):
        data = [
            PhoneNumber(
                number=phone,
                tag="Cobranzas, Spam, Ventas (Juan Perez - Tigo)"
            ).model_dump()
        ]
    else:
        data = [
            PhoneNumber(
                number=phone,
                tag="Desconocido"
            ).model_dump()
        ]
        
    return {
        "status": "success",
        "source": "TrueCaller",
        "data": data
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Se requiere número de teléfono como argumento"}))
        sys.exit(1)
        
    phone = sys.argv[1]
    result = query_truecaller(phone)
    print(json.dumps(result))
