from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime

# ==========================================
# ESTRUCTURA DE DATOS PARA OSINTPY v5
# ==========================================
# Todos los agentes deben retornar datos que encajen en estos modelos
# para que el Frontend y el Grafo puedan renderizarlos correctamente.

class SocialProfile(BaseModel):
    platform: str # Ej: "Instagram", "Facebook Marketplace"
    username: str
    url: str
    is_verified: bool = False
    metadata: Dict = Field(default_factory=dict) # Ej: {"articulos_en_venta": 5, "ubicacion": "Asunción"}

class Asset(BaseModel):
    asset_type: str # "Vehiculo", "Inmueble", "Empresa"
    identifier: str # Chapa, Nro Finca, RUC Empresa
    description: str # "Toyota Hilux 2021", "Terreno 500m2 San Lorenzo"
    estimated_value_usd: Optional[float] = None
    source: str # "DNRPA", "Catastro", "Gaceta Oficial"

class ThreatIntel(BaseModel):
    category: str # "Breach", "Judicial", "Sanctions"
    description: str
    date_detected: str
    severity: int # 1-10
    url_source: Optional[str] = None

class TimelineEvent(BaseModel):
    year: str
    event_type: str
    description: str

class PhoneNumber(BaseModel):
    number: str
    tag: str

class OsintNode(BaseModel):
    id: str
    tool: str
    data: str
    enriched_zap: bool = False
    certeza_nivel: int = 50

class OmniProfile(BaseModel):
    full_name: str
    document_id: str
    tax_id: Optional[str] = None
    date_of_birth: Optional[str] = None
    address_electoral: Optional[str] = None
    
    ips_status: Optional[str] = None
    employer: Optional[str] = None
    assets: List[Asset] = Field(default_factory=list)
    
    phone_numbers: List[PhoneNumber] = Field(default_factory=list)
    emails: List[str] = Field(default_factory=list)
    social_profiles: List[SocialProfile] = Field(default_factory=list)
    
    threats: List[ThreatIntel] = Field(default_factory=list)
    timeline: List[TimelineEvent] = Field(default_factory=list)
    
    risk_score: int = 0
    confidence_score: int = 0
    last_updated: str = Field(default_factory=lambda: datetime.now().isoformat())
    
    nodos: List[OsintNode] = Field(default_factory=list)
