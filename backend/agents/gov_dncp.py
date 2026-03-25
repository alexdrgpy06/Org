import sys
import json
import time
from models import TimelineEvent

def query_dncp(ruc):
    """
    Simula la consulta a la Dirección Nacional de Contrataciones Públicas.
    """
    time.sleep(1.0)
    
    licitaciones = [
        TimelineEvent(
            year="2023",
            event_type="Licitación DNCP",
            description="Provisión de insumos informáticos - Monto: ₲ 150.000.000"
        ).model_dump(),
        TimelineEvent(
            year="2022",
            event_type="Licitación DNCP",
            description="Mantenimiento de equipos - Monto: ₲ 85.000.000"
        ).model_dump()
    ]
    
    return {
        "status": "success",
        "source": "DNCP",
        "data": licitaciones
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Se requiere RUC como argumento"}))
        sys.exit(1)
        
    ruc = sys.argv[1]
    result = query_dncp(ruc)
    print(json.dumps(result))
