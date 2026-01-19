import React, { useState, useEffect } from 'react';
import './App.css';

import seccion1 from './base_de_datos/Seccion_1.json';
import seccion2 from './base_de_datos/Seccion_2.json';
import seccion3 from './base_de_datos/Seccion_3.json';

function App() {
  const [busqueda, setBusqueda] = useState('');
  const [inventario, setInventario] = useState([]);
  const [discoSeleccionado, setDiscoSeleccionado] = useState(null);
  const [imagenGrande, setImagenGrande] = useState(false);

  const [seccionPrincipal, setSeccionPrincipal] = useState('Sección 1');
  const [subSeccion, setSubSeccion] = useState('1-A');
  const [genero, setGenero] = useState('Todos');

  useEffect(() => {
    const s1 = seccion1.albums ?? [];
    const s2 = seccion2.albums ?? [];
    const s3 = seccion3.albums ?? [];
    setInventario([...s1, ...s2, ...s3]);
  }, []);

  const seccionesPrincipales = ['Todas', 'Sección 1', 'Sección 2', 'Sección 3'];

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
    )
  ];

  const generosDisponibles = [
    'Todos',
    ...new Set(inventario.map(d => d.genre).filter(Boolean))
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

    const coincideSubSeccion =
      subSeccion === 'Todas' || disco.section === subSeccion;

    const coincideGenero =
      genero === 'Todos' || disco.genre === genero;

    return coincideBusqueda && coincideSeccion && coincideSubSeccion && coincideGenero;
  });

  return (
    <div className="biblioteca-container">

      {/* HEADER */}
      <header className="header-ismea">
        <div className="header-wrapper">

          <img src="logo_ismea.png" alt="ISMEA" className="logo-img" />

          <div className="header-text">
            <h1>Fundación Azteca</h1>
            <p>Biblioteca Digital de Vinilos</p>
          </div>

          <div className="search-filters">
            <input
              type="text"
              placeholder="Buscar obra, artista o compositor..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            <select
              className="select-genero"
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
            >
              {generosDisponibles.map(g => (
                <option key={g}>{g}</option>
              ))}
            </select>

            <select
              value={seccionPrincipal}
              onChange={(e) => {
                setSeccionPrincipal(e.target.value);
                setSubSeccion('Todas');
              }}
            >
              {seccionesPrincipales.map(s => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <select value={subSeccion} onChange={(e) => setSubSeccion(e.target.value)}>
              {subSeccionesDisponibles.map(s => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

        </div>
      </header>

      {/* CONTENIDO */}
      <main className="main-content">

        <p className="contador-discos">
          Discos encontrados: <strong>{discosFiltrados.length}</strong>
        </p>

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
                <img src={disco.coverUrl} alt={disco.title} />
              </div>

              <div className="card-info">
                <span className="tag-seccion">{disco.section}</span>
                <h3>{disco.title}</h3>
                <p className="artist-name">{disco.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL */}
      {discoSeleccionado && (
        <div className="modal-overlay" onClick={() => setDiscoSeleccionado(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={() => setDiscoSeleccionado(null)}>×</button>

            <div className="modal-body">
              <img
                src={discoSeleccionado.coverUrl}
                alt={discoSeleccionado.title}
                className="modal-cover"
                onClick={() => setImagenGrande(true)}
              />

              <div className="modal-info">
                <h2>{discoSeleccionado.title}</h2>
                <p className="modal-artist">{discoSeleccionado.artist}</p>

                <ul>
                  <li><strong>Sección:</strong> {discoSeleccionado.section}</li>
                  <li><strong>Año:</strong> {discoSeleccionado.releaseYear}</li>
                  <li><strong>Género:</strong> {discoSeleccionado.genre}</li>
                  <li><strong>Duración:</strong> {discoSeleccionado.totalDuration}</li>
                  <li><strong>Compositores:</strong> {discoSeleccionado.composers?.join(', ')}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* IMAGEN GRANDE */}
          {imagenGrande && (
            <div
              className="imagen-overlay"
              onClick={(e) => {
                e.stopPropagation();
                setImagenGrande(false);
              }}
            >
              <button
                className="cerrar-imagen"
                onClick={(e) => {
                  e.stopPropagation();
                  setImagenGrande(false);
                }}
              >
                ×
              </button>

              <img
                src={discoSeleccionado.coverUrl}
                alt={discoSeleccionado.title}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default App;
