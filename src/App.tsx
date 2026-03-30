import React, { useState, useEffect, useRef } from 'react'
import {
  Terminal,
  ShieldAlert,
  Search,
  User,
  MapPin,
  Briefcase,
  Phone,
  Share2,
  Car,
  Home,
  AlertTriangle,
  Activity,
} from 'lucide-react'

export default function App() {
  const [query, setQuery] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)
  const [logs, setLogs] = useState<
    { time: string; src: string; msg: string; isError?: boolean }[]
  >([])
  const [activeTab, setActiveTab] = useState('overview')
  const [profile, setProfile] = useState<any>(null)
  const terminalEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query) return

    setIsScanning(true)
    setScanComplete(false)
    setLogs([])
    setProfile(null)

    // Start showing some initial logs
    setLogs([
      {
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        src: 'SYSTEM',
        msg: 'Initializing Kuarahy Apex Syndicate framework...',
      },
      {
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        src: 'SYSTEM',
        msg: 'Establishing secure connection to PyGov APIs...',
      },
    ])

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch profile')
      }

      setLogs((prev) => [
        ...prev,
        {
          time: new Date().toLocaleTimeString('en-US', { hour12: false }),
          src: 'SYSTEM',
          msg: 'Hyper-Velocity extraction complete.',
        },
      ])

      setProfile(data.profile)
      setScanComplete(true)
    } catch (error: any) {
      setLogs((prev) => [
        ...prev,
        {
          time: new Date().toLocaleTimeString('en-US', { hour12: false }),
          src: 'ERROR',
          msg: error.message,
          isError: true,
        },
      ])
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 font-mono flex flex-col selection:bg-cyan-900 selection:text-cyan-100">
      {/* NAVEGACIÓN SUPERIOR */}
      <header className="border-b border-cyan-900/50 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="text-cyan-500 animate-pulse" />
            <div>
              <h1 className="text-xl font-bold text-white tracking-widest leading-none">
                OSINTPY <span className="text-cyan-500">v10.0</span>
              </h1>
              <p className="text-[10px] text-cyan-500/70 tracking-widest">
                KUARAHY APEX SYNDICATE
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold tracking-widest text-neutral-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>{' '}
              HYPER-VELOCITY ACTIVE
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-500"></span> SYSTEM
              ONLINE
            </span>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full p-4 py-8 flex flex-col gap-6">
        {/* BARRA DE BÚSQUEDA */}
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-cyan-500" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-neutral-900 border-2 border-neutral-800 focus:border-cyan-500 rounded-lg py-4 pl-12 pr-32 text-lg text-white placeholder-neutral-600 outline-none transition-all"
            placeholder="Ingrese Vector (CI, Nombre, Teléfono, Alias)..."
            disabled={isScanning}
          />
          <button
            type="submit"
            disabled={isScanning}
            className="absolute right-2 top-2 bottom-2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 font-bold tracking-wider rounded transition-colors disabled:opacity-50"
          >
            {isScanning ? 'SCANNING...' : 'INITIATE'}
          </button>
        </form>

        {/* CONSOLA TÁCTICA (Visible durante y después del escaneo) */}
        {(isScanning || logs.length > 0) && (
          <div className="bg-black border border-neutral-800 rounded-lg overflow-hidden shadow-2xl">
            <div className="bg-neutral-900 border-b border-neutral-800 px-4 py-2 flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-500 flex items-center gap-2">
                <Terminal size={14} /> CONSOLA TÁCTICA
              </span>
              {isScanning && (
                <span className="text-xs text-cyan-500 animate-pulse">
                  EXTRAYENDO NODOS...
                </span>
              )}
            </div>
            <div className="p-4 h-48 overflow-y-auto font-mono text-xs md:text-sm space-y-1">
              {logs.map((log, i) => (
                <div
                  key={i}
                  className={`${log.isError ? 'text-red-400' : 'text-neutral-400'}`}
                >
                  <span className="text-neutral-600">[{log.time}]</span>{' '}
                  <span
                    className={
                      log.src === 'SYSTEM'
                        ? 'text-cyan-500'
                        : log.isError
                          ? 'text-red-500'
                          : 'text-purple-400'
                    }
                  >
                    [{log.src}]
                  </span>{' '}
                  {log.msg}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>
          </div>
        )}

        {/* DOSSIER 360 (Aparece tras el escaneo) */}
        {scanComplete && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* ENCABEZADO DEL PERFIL */}
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg mb-6 flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden">
              {/* Efecto de fondo */}
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-900/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex items-center gap-6 relative z-10">
                <div className="h-20 w-20 bg-neutral-950 rounded border border-cyan-500/50 flex items-center justify-center relative shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  <User size={32} className="text-cyan-500" />
                  <div className="absolute -bottom-3 bg-cyan-950 border border-cyan-500 text-cyan-400 text-[10px] px-2 py-0.5 rounded font-bold tracking-widest">
                    MATCH
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tight">
                    {profile.full_name}
                  </h2>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-neutral-400">
                    <span className="flex items-center gap-1 bg-neutral-950 px-2 py-1 rounded border border-neutral-800">
                      <ShieldAlert size={14} className="text-neutral-500" /> CI:{' '}
                      <span className="text-neutral-200">
                        {profile.document_id}
                      </span>
                    </span>
                    <span className="flex items-center gap-1 bg-neutral-950 px-2 py-1 rounded border border-neutral-800">
                      <Briefcase size={14} className="text-neutral-500" /> RUC:{' '}
                      <span className="text-neutral-200">{profile.tax_id}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 md:mt-0 flex flex-col items-end relative z-10 w-full md:w-auto">
                <div className="text-[10px] font-bold tracking-widest text-neutral-500 mb-1">
                  NIVEL DE RIESGO DE ENTIDAD
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <div className="w-full md:w-32 h-2 bg-neutral-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500"
                      style={{ width: `${profile.risk_score}%` }}
                    ></div>
                  </div>
                  <span className="text-2xl font-black text-red-500">
                    {profile.risk_score}
                  </span>
                </div>
              </div>
            </div>

            {/* NAVEGACIÓN DE TABS */}
            <div className="flex border-b border-neutral-800 mb-6 overflow-x-auto scrollbar-hide">
              {[
                { id: 'overview', label: 'Inteligencia General' },
                { id: 'assets', label: 'Patrimonio & Finanzas' },
                { id: 'digital', label: 'Huella Digital' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-950/20'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* CONTENIDO TABS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* COLUMNA IZQUIERDA (Widgets Rápidos) */}
              <div className="lg:col-span-1 space-y-6">
                {/* Contacto */}
                <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-lg">
                  <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Phone size={14} /> Vectores de Contacto
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="text-cyan-600 mt-0.5" />
                      <div className="text-sm text-neutral-300">
                        {profile.address}
                      </div>
                    </div>
                    {profile.phones.map((p: any, i: number) => (
                      <div
                        key={i}
                        className="flex flex-col gap-1 bg-neutral-950 p-2 rounded border border-neutral-800/50"
                      >
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-white font-medium">
                            {p.num}
                          </span>
                          <span className="text-[10px] text-cyan-500 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-900">
                            SIGINT VERIFIED
                          </span>
                        </div>
                        <div className="text-xs text-neutral-500">
                          ID Tag: "{p.tag}"
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amenazas */}
                <div className="bg-neutral-900 border border-red-900/30 p-5 rounded-lg relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                  <h3 className="text-xs font-bold text-red-500/70 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <AlertTriangle size={14} /> Alertas Críticas
                  </h3>
                  <div className="space-y-3">
                    {profile.threats.map((t: any, i: number) => (
                      <div
                        key={i}
                        className="text-sm text-neutral-300 leading-snug"
                      >
                        <span
                          className={`inline-block w-2 h-2 rounded-full mr-2 ${t.severity === 'High' ? 'bg-red-500' : 'bg-yellow-500'}`}
                        ></span>
                        {t.description || t.desc}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* COLUMNA CENTRAL/DERECHA (Contenido Dinámico) */}
              <div className="lg:col-span-2">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* GRAFO SIMULADO */}
                    <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-lg">
                      <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Share2 size={14} /> Grafo de Vínculos (Kuarahy Engine)
                      </h3>
                      <div className="h-64 bg-neutral-950 border border-neutral-800 rounded relative overflow-hidden flex items-center justify-center">
                        {/* Red de lineas */}
                        <svg
                          className="absolute inset-0 w-full h-full stroke-neutral-800"
                          strokeWidth="1.5"
                        >
                          <line x1="50%" y1="50%" x2="25%" y2="25%" />
                          <line x1="50%" y1="50%" x2="75%" y2="25%" />
                          <line x1="50%" y1="50%" x2="50%" y2="80%" />
                        </svg>

                        {/* Nodos */}
                        <div className="absolute top-[25%] left-[25%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 cursor-pointer hover:scale-110 transition-transform">
                          <div className="w-10 h-10 rounded-full bg-purple-950 border border-purple-500 flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                            <Car size={16} className="text-purple-400" />
                          </div>
                          <span className="text-[10px] text-purple-400 font-bold bg-neutral-950 px-1 rounded">
                            DNRPA
                          </span>
                        </div>

                        <div className="absolute top-[25%] left-[75%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 cursor-pointer hover:scale-110 transition-transform">
                          <div className="w-10 h-10 rounded-full bg-green-950 border border-green-500 flex items-center justify-center shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                            <Briefcase size={16} className="text-green-400" />
                          </div>
                          <span className="text-[10px] text-green-400 font-bold bg-neutral-950 px-1 rounded">
                            IPS/SFP
                          </span>
                        </div>

                        <div className="absolute top-[80%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 cursor-pointer hover:scale-110 transition-transform">
                          <div className="w-10 h-10 rounded-full bg-blue-950 border border-blue-500 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                            <Search size={16} className="text-blue-400" />
                          </div>
                          <span className="text-[10px] text-blue-400 font-bold bg-neutral-950 px-1 rounded">
                            Redes
                          </span>
                        </div>

                        <div className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer">
                          <div className="w-16 h-16 rounded-full bg-cyan-950 border-2 border-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:bg-cyan-900 transition-colors">
                            <User size={24} className="text-cyan-400" />
                          </div>
                          <span className="text-xs font-bold text-white bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                            TARGET
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* LÍNEA DE TIEMPO */}
                    <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-lg">
                      <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Activity size={14} /> Cronología de Datos
                      </h3>
                      <div className="relative border-l border-neutral-800 ml-3 space-y-6 pb-2">
                        {profile.timeline.map((item: any, idx: number) => (
                          <div key={idx} className="pl-6 relative">
                            <div className="absolute w-3 h-3 bg-neutral-950 border border-cyan-500 rounded-full -left-[6.5px] top-1"></div>
                            <div className="text-[10px] font-bold text-cyan-500 mb-0.5">
                              {item.year}
                            </div>
                            <div className="text-sm text-neutral-300">
                              {item.description || item.desc}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'assets' && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="grid grid-cols-2 gap-4">
                      {profile.assets.map((a: any, i: number) => (
                        <div
                          key={i}
                          className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg flex flex-col justify-between hover:border-cyan-900/50 transition-colors cursor-default"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="w-8 h-8 rounded bg-neutral-950 border border-neutral-800 flex items-center justify-center">
                              {a.asset_type === 'Vehículo' ||
                              a.type === 'Vehículo' ? (
                                <Car size={16} className="text-neutral-400" />
                              ) : (
                                <Home size={16} className="text-neutral-400" />
                              )}
                            </div>
                            <span className="text-[10px] font-bold tracking-wider text-cyan-600 bg-cyan-950/30 px-2 py-1 rounded uppercase">
                              {a.source}
                            </span>
                          </div>
                          <div>
                            <div className="text-xs text-neutral-500 mb-1 uppercase tracking-wider">
                              {a.asset_type || a.type}
                            </div>
                            <div className="text-sm font-medium text-neutral-200">
                              {a.description || a.desc}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
                      <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        Vínculo Laboral
                      </h4>
                      <div className="flex items-center justify-between bg-neutral-950 border border-neutral-800 p-3 rounded">
                        <span className="text-sm text-neutral-300">
                          {profile.employer}
                        </span>
                        <span className="text-xs text-green-500 font-bold tracking-widest">
                          ACTIVO
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'digital' && (
                  <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-lg animate-in fade-in duration-300">
                    <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4">
                      Vectores Encontrados (Sherlock / WhatsMyName)
                    </h3>
                    <div className="space-y-3">
                      {profile.social.map((s: any, i: number) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 bg-neutral-950 border border-neutral-800 rounded hover:border-cyan-900 transition-colors group cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                            <div>
                              <div className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                                {s.platform || s.plat}
                              </div>
                              <div className="text-xs text-neutral-500">
                                {s.username || s.desc}
                              </div>
                            </div>
                          </div>
                          <Search
                            size={14}
                            className="text-neutral-600 group-hover:text-cyan-500 transition-colors"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
