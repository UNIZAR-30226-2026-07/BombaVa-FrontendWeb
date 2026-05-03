import React from 'react';
import '../styles/CartelPerfil.css';
import cartelPerfil from '../assets/perfil/cartelPerfil.png';

/**
 * Cartel con la informacion del jugador
 * @param {Object} usuario - Objeto con la informacion del jugador
 * @param {boolean} editando - Booleano para saber si se esta editando el perfil
 * @param {string} nuevoNombre - Nombre del jugador
 * @param {function} setNuevoNombre - Setter del nombre del jugador
 * @param {string} nuevoEmail - Email del jugador
 * @param {function} setNuevoEmail - Setter del email del jugador
 */
function CartelPerfil({ usuario, editando, nuevoNombre, setNuevoNombre, nuevoEmail, setNuevoEmail }) {
  return (
    <div className="cartel_contenedor">
      <img src={cartelPerfil} alt="Cartel Perfil" className="cartel_fondo" />
      <div className="contenido_cartel">
        <div className="informacion">
          <h2 className="nombre_capitan">
            Capitán {editando ? (
              <input 
                type="text" 
                value={nuevoNombre} 
                onChange={(e) => setNuevoNombre(e.target.value)}
                className="input_perfil"
              />
            ) : (
              usuario.username
            )}
          </h2>
          <p>
            <strong>Correo:</strong> {editando ? (
              <input 
                type="email" 
                value={nuevoEmail} 
                onChange={(e) => setNuevoEmail(e.target.value)}
                className="input_perfil"
              />
            ) : (
              usuario.email
            )}
          </p>
          <p><strong>Reputación:</strong> {usuario.elo_rating} ELO</p>
          {/*Habría que completar con las victorias del jugador, ahora lo he puesto con 0*/}
          <p><strong>Victorias:</strong> {usuario.winRate}%</p>
        </div>
      </div>
    </div>
  );
}

export default CartelPerfil;
