import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface OsintNode {
  id: string;
  tool: string;
  data: string;
  enriched_zap: boolean;
  certeza_nivel: number;
}

export interface SocialProfile {
  platform: string;
  username: string;
  url: string;
  is_verified: boolean;
  metadata: Record<string, any>;
}

export interface Asset {
  asset_type: string;
  identifier: string;
  description: string;
  estimated_value_usd?: number;
  source: string;
}

export interface ThreatIntel {
  category: string;
  description: string;
  date_detected: string;
  severity: number;
  url_source?: string;
}

export interface TimelineEvent {
  year: string;
  event_type: string;
  description: string;
}

export interface OmniProfile {
  full_name: string;
  document_id: string;
  tax_id?: string;
  date_of_birth?: string;
  address_electoral?: string;
  
  ips_status?: string;
  employer?: string;
  assets: Asset[];
  
  phone_numbers: Array<{ number: string; tag: string }>;
  emails: string[];
  social_profiles: SocialProfile[];
  
  threats: ThreatIntel[];
  timeline: TimelineEvent[];
  
  risk_score: number;
  confidence_score: number;
  last_updated: string;
  
  nodos: OsintNode[];
}

export async function runOsintInvestigation(params: {
  ci_ruc: string;
  nombre: string;
  alias: string;
  email: string;
  telefono: string;
  notas_adicionales: string;
}): Promise<OmniProfile> {
  const response = await fetch('/api/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: params }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to run OSINT investigation');
  }

  const data = await response.json();
  return data.profile as OmniProfile;
}
