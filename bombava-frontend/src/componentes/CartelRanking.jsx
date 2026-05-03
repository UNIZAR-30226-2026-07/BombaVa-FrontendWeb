import React from 'react';
import '../styles/CartelRanking.css';
import cartelRanking from '../assets/perfil/cartelRanking.png';

/**
 * Cartel con el ranking de los mejores jugadores
 * @param {Array} ranking - Array de jugadores con su ranking
 * @param {boolean} cargandoRanking - Booleano para saber si se esta cargando el ranking
 * @param {string} nombreUsuarioActual - Nombre del jugador actual
 */
function CartelRanking({ ranking, cargandoRanking, nombreUsuarioActual }) {
  return (
    <div className="cartel_contenedor">
      <img src={cartelRanking} alt="Cartel Ranking" className="cartel_fondo" />
      <div className="contenido_ranking">
        <div className="lista_ranking">
          {cargandoRanking ? (
            <p>Cargando ranking</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Pos</th>
                  <th>Capitán</th>
                  <th>Reputación</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((jugador, index) => (
                  <tr 
                    key={index} 
                    //compara el nombre del jugador con el nombre del jugador actual
                    //si son iguales, se resalta la fila
                    className={jugador.username == nombreUsuarioActual ? "resaltado" : ""}
                  >
                    <td>{index + 1}</td>
                    <td>{jugador.username}</td>
                    <td>{jugador.elo_rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartelRanking;
