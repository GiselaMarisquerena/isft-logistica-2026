import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import './style.css';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = url && key ? createClient(url, key) : null;
const colors = { Entregado: [34, 197, 94], 'En camino': [59, 130, 246], Pendiente: [245, 158, 11] };
const initialViewState = { longitude: -58.53, latitude: -34.53, zoom: 9.3, pitch: 0, bearing: 0 };

function App() {
  const [puntos, setPuntos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [hover, setHover] = useState(null);
  const [selected, setSelected] = useState(null);
  const [filtro, setFiltro] = useState('Todos');
  useEffect(() => {
    async function cargar() {
      if (!supabase) { setError('Falta configurar Supabase. Revisá el archivo .env.local.'); setLoading(false); return; }
      const { data, error: err } = await supabase.from('puntos').select('id,nombre,categoria,latitud,longitud,valor,fecha,descripcion').order('id');
      if (err) setError('No se pudieron consultar los datos: ' + err.message);
      else { console.log('Datos recibidos desde Supabase:', data); setPuntos(data || []); }
      setLoading(false);
    }
    cargar();
  }, []);
  const visibles = useMemo(() => filtro === 'Todos' ? puntos : puntos.filter(p => p.categoria === filtro), [puntos, filtro]);
  const entregados = puntos.filter(p => p.categoria === 'Entregado').length;
  const demorados = puntos.filter(p => p.valor > 60).length;
  const layers = [new ScatterplotLayer({
    id: 'entregas', data: visibles, pickable: true, radiusUnits: 'pixels', getRadius: 9, radiusMinPixels: 7,
    getPosition: d => [Number(d.longitud), Number(d.latitud)],
    getFillColor: d => colors[d.categoria] || [150, 150, 150],
    getLineColor: [255, 255, 255], lineWidthMinPixels: 1.5, stroked: true,
    onHover: info => setHover(info.object ? { punto: info.object, x: info.x, y: info.y } : null),
    onClick: info => setSelected(info.object || null)
  })];
  return <main>
    <header><div className="eyebrow">ISFT · Logística · Prueba de concepto</div><h1>Mapa de entregas en Buenos Aires</h1><p>Seguimiento geográfico de pedidos con datos de Supabase.</p></header>
    <section className="stats"><article><span>Entregas registradas</span><strong>{puntos.length}</strong></article><article><span>Entregadas</span><strong>{entregados}</strong></article><article><span>Con demora (más de 60 min)</span><strong>{demorados}</strong></article></section>
    <section className="panel"><div className="panelhead"><div><h2>Ubicación de las entregas</h2><p>Elegí un estado y tocá un punto para ver sus datos.</p></div><label>Estado <select value={filtro} onChange={e => setFiltro(e.target.value)}><option>Todos</option><option>Entregado</option><option>En camino</option><option>Pendiente</option></select></label></div>
    {error && <div className="error">{error}</div>}{loading && <div className="notice">Cargando entregas...</div>}
    <div className="mapbox"><DeckGL initialViewState={initialViewState} controller={true} layers={layers}>
      <Map mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" />
    </DeckGL>
    {hover && <div className="tooltip" style={{left: Math.min(hover.x + 12, 310), top: Math.max(8, hover.y - 78)}}><b>{hover.punto.nombre}</b><br/>{hover.punto.categoria} · {hover.punto.valor} min</div>}
    </div><div className="legend"><span><i className="green"/> Entregado</span><span><i className="blue"/> En camino</span><span><i className="yellow"/> Pendiente</span></div>
    {selected && <div className="detail"><b>{selected.nombre}</b><span>Estado: {selected.categoria}</span><span>Tiempo de entrega estimado/registrado: {selected.valor} minutos</span><span>{selected.descripcion}</span><button onClick={() => setSelected(null)}>Cerrar</button></div>}
    </section><footer>Datos ficticios para fines educativos · React + Vite + Supabase + deck.gl</footer>
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
