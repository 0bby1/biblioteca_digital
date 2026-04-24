import React, { useState, useEffect } from 'react';
import './App.css';

import seccion1 from './base_de_datos/Seccion_1.json';
import seccion2 from './base_de_datos/Seccion_2.json';
import seccion3 from './base_de_datos/Seccion_3.json';

const SECCIONES = [
  { id: 'Sección 1', label: 'Sección 1', img: 'Seccion 1.jpg', prefix: '1' },
  { id: 'Sección 2', label: 'Sección 2', img: 'Seccion 2.jpg', prefix: '2' },
  { id: 'Sección 3', label: 'Sección 3', img: 'Seccion 3.jpg', prefix: '3' },
];

function App() {
  const [busqueda, setBusqueda] = useState('');
  const [inventario, setInventario] = useState([]);
  const [discoSeleccionado, setDiscoSeleccionado] = useState(null);
  const [imagenGrande, setImagenGrande] = useState(false);
  const [seccionPrincipal, setSeccionPrincipal] = useState('Todas');
  const [subSeccion, setSubSeccion] = useState('Todas');
  const [seccionVistaPrevia, setSeccionVistaPrevia] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    const s1 = seccion1.albums ?? [];
    const s2 = seccion2.albums ?? [];
    const s3 = seccion3.albums ?? [];
    setInventario([...s1, ...s2, ...s3]);
  }, []);

  const subSeccionesDisponibles = [
    'Todas',
    ...new Set(
      inventario
        .filter(d => {
          if (seccionPrincipal === 'Sección 1') return d.section?.startsWith('1');
          if (seccionPrincipal === 'Sección 2') return d.section?.startsWith('2');
          if (seccionPrincipal === 'Sección 3') return d.section?.startsWith('3');
          return true;
        })
        .map(d => d.section)
    ),
  ];

  const discosFiltrados = inventario.filter(disco => {
    const termino = busqueda.toLowerCase();
    const coincideBusqueda =
      disco.title?.toLowerCase().includes(termino) ||
      disco.artist?.toLowerCase().includes(termino) ||
      disco.composers?.some(c => c.toLowerCase().includes(termino));
    const coincideSeccion =
      seccionPrincipal === 'Todas' ||
      (seccionPrincipal === 'Sección 1' && disco.section?.startsWith('1')) ||
      (seccionPrincipal === 'Sección 2' && disco.section?.startsWith('2')) ||
      (seccionPrincipal === 'Sección 3' && disco.section?.startsWith('3'));
    const coincideSubSeccion = subSeccion === 'Todas' || disco.section === subSeccion;
    return coincideBusqueda && coincideSeccion && coincideSubSeccion;
  });

  const handleSeccionChange = (val) => {
    setSeccionPrincipal(val);
    setSubSeccion('Todas');
    setMenuAbierto(false);
  };

  return (
    <div className="biblioteca-container">

      {/* ── HEADER ── */}
      <header className="header-ismea">
        <div className="header-inner">

          {/* Logo + título */}
          <div className="header-brand">
            <img src="logo_ismea.png" alt="ISMEA" className="logo-img" />
            <div className="header-titles">
              <span className="header-title">Fundación Azteca</span>
              <span className="header-subtitle">Biblioteca Digital de Vinilos</span>
            </div>
          </div>

          {/* Buscador */}
          <div className="search-wrap">
            <span className="search-icon">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="8.5" cy="8.5" r="5.5" />
                <line x1="13" y1="13" x2="18" y2="18" />
              </svg>
            </span>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar obra, artista o compositor…"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </div>

          {/* Botón secciones (mobile + desktop) */}
          <button
            className="btn-secciones"
            onClick={() => setMenuAbierto(prev => !prev)}
            aria-label="Ver secciones"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            <span>Secciones</span>
          </button>

        </div>

        {/* Filtros secundarios */}
        <div className="filters-bar">
          <div className="filter-group">
            <label className="filter-label">Sección</label>
            <select
              className="filter-select"
              value={seccionPrincipal}
              onChange={e => handleSeccionChange(e.target.value)}
            >
              {['Todas', 'Sección 1', 'Sección 2', 'Sección 3'].map(s => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Sub-sección</label>
            <select
              className="filter-select"
              value={subSeccion}
              onChange={e => setSubSeccion(e.target.value)}
            >
              {subSeccionesDisponibles.map(s => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <span className="contador-pill">
            {discosFiltrados.length} disco{discosFiltrados.length !== 1 ? 's' : ''}
          </span>
        </div>
      </header>

      {/* ── PANEL SECCIONES ── */}
      {menuAbierto && (
        <div className="secciones-overlay" onClick={() => setMenuAbierto(false)}>
          <div className="secciones-panel" onClick={e => e.stopPropagation()}>
            <div className="secciones-panel-header">
              <h2>Secciones de la fonoteca</h2>
              <button className="close-panel" onClick={() => setMenuAbierto(false)}>×</button>
            </div>
            <div className="secciones-grid">
              {SECCIONES.map(sec => (
                <div
                  key={sec.id}
                  className="seccion-card"
                  onClick={() => setSeccionVistaPrevia(sec)}
                >
                  <div className="seccion-card-img-wrap">
                    <img src={sec.img} alt={sec.label} />
                    <div className="seccion-card-overlay">
                      <span className="seccion-card-zoom">&#128269;</span>
                    </div>
                  </div>
                  <div className="seccion-card-info">
                    <strong>{sec.label}</strong>
                    <button
                      className="btn-filtrar-seccion"
                      onClick={e => {
                        e.stopPropagation();
                        handleSeccionChange(sec.id);
                      }}
                    >
                      Ver discos
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── IMAGEN GRANDE DE SECCIÓN ── */}
      {seccionVistaPrevia && (
        <div
          className="imagen-overlay"
          onClick={() => setSeccionVistaPrevia(null)}
        >
          <button className="cerrar-imagen" onClick={() => setSeccionVistaPrevia(null)}>×</button>
          <img
            src={seccionVistaPrevia.img}
            alt={seccionVistaPrevia.label}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

      {/* ── GRID PRINCIPAL ── */}
      <main className="main-content">
        {discosFiltrados.length === 0 ? (
          <div className="empty-state">
            <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" width="56" height="56">
              <circle cx="32" cy="32" r="28" />
              <circle cx="32" cy="32" r="8" />
              <circle cx="32" cy="32" r="2" fill="currentColor" />
            </svg>
            <p>No se encontraron discos con esos filtros.</p>
          </div>
        ) : (
          <div className="grid-discos">
            {discosFiltrados.map((disco, index) => (
              <div
                key={`${disco.id}-${index}`}
                className="card-disco"
                onClick={() => {
                  setDiscoSeleccionado(disco);
                  setImagenGrande(false);
                }}
              >
                <div className="card-image">
                  <img
                    src={disco.coverUrl || 'disco_generico.png'}
                    alt={disco.title}
                    onError={e => { e.target.src = 'disco_generico.png'; }}
                  />
                  <div className="card-hover-overlay">
                    <span className="card-hover-icon">♪</span>
                  </div>
                </div>
                <div className="card-info">
                  <p className="card-title">{disco.title}</p>
                  <p className="card-artist">{disco.artist}</p>
                  <span className="tag-seccion">{disco.section}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── MODAL DISCO ── */}
      {discoSeleccionado && (
        <div className="modal-overlay" onClick={() => setDiscoSeleccionado(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={() => setDiscoSeleccionado(null)}>×</button>

            <div className="modal-body">
              <div className="modal-cover-wrap">
                <img
                  src={discoSeleccionado.coverUrl || 'disco_generico.png'}
                  alt={discoSeleccionado.title}
                  className="modal-cover"
                  onClick={() => setImagenGrande(true)}
                  onError={e => { e.target.src = 'disco_generico.png'; }}
                />
                <span className="modal-zoom-hint">Clic para ampliar</span>
              </div>

              <div className="modal-info">
                <span className="modal-tag">{discoSeleccionado.section}</span>
                <h2 className="modal-title">{discoSeleccionado.title}</h2>
                <p className="modal-artist">{discoSeleccionado.artist}</p>

                <div className="modal-details">
                  {[
                    ['Año', discoSeleccionado.releaseYear],
                    ['Género', discoSeleccionado.genre],
                    ['Duración', discoSeleccionado.totalDuration],
                    ['Compositores', discoSeleccionado.composers?.join(', ')],
                  ].map(([k, v]) => v ? (
                    <div className="detail-row" key={k}>
                      <span className="detail-key">{k}</span>
                      <span className="detail-val">{v}</span>
                    </div>
                  ) : null)}
                </div>
              </div>
            </div>
          </div>

          {/* Imagen grande del disco */}
          {imagenGrande && (
            <div
              className="imagen-overlay"
              onClick={e => { e.stopPropagation(); setImagenGrande(false); }}
            >
              <button
                className="cerrar-imagen"
                onClick={e => { e.stopPropagation(); setImagenGrande(false); }}
              >×</button>
              <img
                src={discoSeleccionado.coverUrl}
                alt={discoSeleccionado.title}
                onClick={e => e.stopPropagation()}
              />
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default App;