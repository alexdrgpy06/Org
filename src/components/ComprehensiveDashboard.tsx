import React, { useState } from 'react';
import { 
  User, Car, Home, Briefcase, AlertTriangle, 
  Search, MapPin, Phone, Mail, FileText, Share2, ShieldAlert
} from 'lucide-react';
import { OmniProfile } from '../services/osintService';

interface Props {
  profile: OmniProfile;
  onExportPDF: () => void;
}

export default function ComprehensiveDashboard({ profile, onExportPDF }: Props) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="bg-neutral-950 text-neutral-200 p-4 font-mono">
      {/* HEADER TÁCTICO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-neutral-900 border border-neutral-800 p-6 rounded-lg mb-6">
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 bg-neutral-800 rounded-full border-2 border-cyan-500 flex items-center justify-center relative overflow-hidden">
             {/* Fallback avatar */}
            <User size={40} className="text-cyan-500" />
            <div className="absolute bottom-0 w-full bg-cyan-500/20 text-cyan-400 text-[10px] text-center py-1 font-bold tracking-widest">
              MATCH {profile.confidence_score || 98}%
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">{profile.full_name}</h1>
            <div className="flex gap-4 mt-2 text-sm text-neutral-400">
              <span className="flex items-center gap-1"><FileText size={14}/> CI: {profile.document_id}</span>
              {profile.tax_id && <span className="flex items-center gap-1"><Briefcase size={14}/> RUC: {profile.tax_id}</span>}
              {profile.address_electoral && <span className="flex items-center gap-1"><MapPin size={14}/> {profile.address_electoral}</span>}
            </div>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col items-end">
          <div className="text-xs text-neutral-500 mb-1">NIVEL DE RIESGO / ANOMALÍA</div>
          <div className="flex items-center gap-3">
            <div className="w-48 h-3 bg-neutral-800 rounded-full overflow-hidden">
              <div 
                className={`h-full ${profile.risk_score > 70 ? 'bg-red-500' : 'bg-yellow-500'}`} 
                style={{ width: `${profile.risk_score}%` }}
              ></div>
            </div>
            <span className={`text-2xl font-bold ${profile.risk_score > 70 ? 'text-red-500' : 'text-yellow-500'}`}>
              {profile.risk_score}
            </span>
          </div>
          <button onClick={onExportPDF} className="mt-4 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded text-sm font-semibold transition-colors flex items-center gap-2">
            <Share2 size={16} /> EXPORTAR DOSSIER PDF
          </button>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex border-b border-neutral-800 mb-6 overflow-x-auto">
        {['overview', 'patrimonio', 'digital_footprint', 'noticias_breaches'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-semibold uppercase tracking-wider whitespace-nowrap ${
              activeTab === tab 
                ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-400/5' 
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: OVERVIEW (Timeline & Graph Placeholder) */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LÍNEA DE TIEMPO */}
          <div className="lg:col-span-1 bg-neutral-900 border border-neutral-800 rounded-lg p-5">
            <h3 className="text-cyan-500 font-bold mb-4 flex items-center gap-2">
              <Search size={18} /> TIMELINE DE VIDA
            </h3>
            <div className="relative border-l border-neutral-700 ml-3 space-y-6 pb-4">
              {profile.timeline?.map((item, idx) => (
                <div key={idx} className="pl-6 relative">
                  <div className="absolute w-3 h-3 bg-cyan-500 rounded-full -left-[6.5px] top-1"></div>
                  <div className="text-xs font-bold text-neutral-400">{item.year}</div>
                  <div className="text-sm text-neutral-200 mt-1">{item.description}</div>
                </div>
              ))}
              {(!profile.timeline || profile.timeline.length === 0) && (
                <div className="pl-6 text-sm text-neutral-500">No hay eventos registrados.</div>
              )}
            </div>
          </div>

          {/* VISTAZO RÁPIDO & GRAFO */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
                <div className="text-xs text-neutral-500 flex items-center gap-1 mb-2"><Phone size={14}/> SIGINT: CONTACTO</div>
                {profile.phone_numbers?.map((p, i) => (
                  <div key={i} className="text-sm mb-2">
                    <span className="text-white">{p.number}</span>
                    <span className="ml-2 text-cyan-400 text-xs bg-cyan-900/30 px-2 py-1 rounded">Tag: {p.tag}</span>
                  </div>
                ))}
                {(!profile.phone_numbers || profile.phone_numbers.length === 0) && (
                  <div className="text-sm text-neutral-500">Sin datos de contacto.</div>
                )}
              </div>
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
                <div className="text-xs text-neutral-500 flex items-center gap-1 mb-2"><Briefcase size={14}/> LABORAL (IPS/SFP)</div>
                <div className="text-sm text-white">{profile.employer || 'Sin datos laborales'}</div>
                {profile.ips_status && <div className="text-xs text-neutral-400 mt-1">IPS: {profile.ips_status}</div>}
              </div>
            </div>
            
            {/* GRAPH PLACEHOLDER */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 h-80 flex flex-col">
               <h3 className="text-cyan-500 font-bold mb-4 flex items-center gap-2">
                <Share2 size={18} /> GRAFO DE VÍNCULOS
              </h3>
              <div className="flex-grow border border-neutral-800 bg-neutral-950 rounded flex items-center justify-center relative overflow-hidden">
                 {/* Visual representation of a network graph */}
                 <div className="absolute w-16 h-16 bg-cyan-900/50 rounded-full border border-cyan-500 flex items-center justify-center text-xs z-10">Target</div>
                 <div className="absolute top-10 left-10 w-12 h-12 bg-purple-900/50 rounded-full border border-purple-500 flex items-center justify-center text-[10px] z-10">IPS</div>
                 <div className="absolute bottom-10 right-10 w-12 h-12 bg-green-900/50 rounded-full border border-green-500 flex items-center justify-center text-[10px] z-10">Auto</div>
                 
                 <svg className="absolute w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                    <line x1="50%" y1="50%" x2="20%" y2="25%" stroke="#374151" strokeWidth="2" />
                    <line x1="50%" y1="50%" x2="80%" y2="75%" stroke="#374151" strokeWidth="2" />
                 </svg>
                 <span className="absolute bottom-2 right-2 text-xs text-neutral-600 z-10">[Interactive Graph Rendered Here]</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: PATRIMONIO */}
      {activeTab === 'patrimonio' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
            <h3 className="text-cyan-500 font-bold mb-4 flex items-center gap-2"><Car size={18} /> PARQUE AUTOMOTOR (DNRPA)</h3>
            <div className="space-y-3">
              {profile.assets?.filter(a => a.asset_type === 'Vehiculo' || a.asset_type === 'Vehículo').map((a, i) => (
                <div key={i} className="p-3 bg-neutral-950 border border-neutral-800 rounded flex justify-between items-center">
                  <span className="text-sm">{a.description} ({a.identifier})</span>
                  <span className="text-xs text-neutral-500 bg-neutral-800 px-2 py-1 rounded">{a.source}</span>
                </div>
              ))}
              {(!profile.assets || profile.assets.filter(a => a.asset_type.includes('Veh')).length === 0) && (
                <div className="text-sm text-neutral-500">No se encontraron vehículos.</div>
              )}
            </div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
            <h3 className="text-cyan-500 font-bold mb-4 flex items-center gap-2"><Home size={18} /> INMUEBLES (CATASTRO)</h3>
            <div className="space-y-3">
              {profile.assets?.filter(a => a.asset_type === 'Inmueble').map((a, i) => (
                <div key={i} className="p-3 bg-neutral-950 border border-neutral-800 rounded flex justify-between items-center">
                  <span className="text-sm">{a.description} ({a.identifier})</span>
                  <span className="text-xs text-neutral-500 bg-neutral-800 px-2 py-1 rounded">{a.source}</span>
                </div>
              ))}
              {(!profile.assets || profile.assets.filter(a => a.asset_type === 'Inmueble').length === 0) && (
                <div className="text-sm text-neutral-500">No se encontraron inmuebles.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: DIGITAL FOOTPRINT */}
      {activeTab === 'digital_footprint' && (
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
            <h3 className="text-cyan-500 font-bold mb-4 flex items-center gap-2"><Search size={18} /> PERFILES SOCIALES</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.social_profiles?.map((s, i) => (
                <div key={i} className="p-4 bg-neutral-950 border border-neutral-800 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-cyan-400">{s.platform}</span>
                    {s.is_verified && <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded">Verificado</span>}
                  </div>
                  <div className="text-sm text-neutral-300 mb-1">{s.username}</div>
                  <a href={s.url} target="_blank" rel="noreferrer" className="text-xs text-neutral-500 hover:text-cyan-400 truncate block">{s.url}</a>
                </div>
              ))}
              {(!profile.social_profiles || profile.social_profiles.length === 0) && (
                <div className="text-sm text-neutral-500">No se encontraron perfiles sociales.</div>
              )}
            </div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
            <h3 className="text-cyan-500 font-bold mb-4 flex items-center gap-2"><Mail size={18} /> CORREOS ELECTRÓNICOS</h3>
            <div className="space-y-2">
              {profile.emails?.map((e, i) => (
                <div key={i} className="text-sm text-neutral-300 p-2 bg-neutral-950 border border-neutral-800 rounded">{e}</div>
              ))}
              {(!profile.emails || profile.emails.length === 0) && (
                <div className="text-sm text-neutral-500">No se encontraron correos.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: THREATS */}
      {activeTab === 'noticias_breaches' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
           <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2"><ShieldAlert size={18} /> ALERTAS Y FILTRACIONES</h3>
           <div className="space-y-4">
              {profile.threats?.map((t, i) => (
                <div key={i} className={`p-4 border rounded-lg ${t.severity > 7 ? 'bg-red-950/20 border-red-900/50' : 'bg-yellow-950/20 border-yellow-900/50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle size={16} className={t.severity > 7 ? 'text-red-500' : 'text-yellow-500'} />
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Severidad: {t.severity}/10 | {t.category}</span>
                    <span className="text-xs text-neutral-500 ml-auto">{t.date_detected}</span>
                  </div>
                  <p className="text-sm text-neutral-200 ml-6">{t.description}</p>
                  {t.url_source && <a href={t.url_source} target="_blank" rel="noreferrer" className="text-xs text-cyan-500 hover:underline ml-6 mt-2 block">Ver fuente</a>}
                </div>
              ))}
              {(!profile.threats || profile.threats.length === 0) && (
                <div className="text-sm text-neutral-500">No se encontraron amenazas o filtraciones.</div>
              )}
           </div>
        </div>
      )}

    </div>
  );
}
