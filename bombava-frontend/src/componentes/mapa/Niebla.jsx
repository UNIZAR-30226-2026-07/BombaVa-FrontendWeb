import React from 'react';
import { TAMANO_TABLERO } from '../../utils/constantes';
import '../../styles/Niebla.css';

/**
 * Componente Niebla que representa la Niebla de Guerra.
 * Recibe un conjunto de coordenadas visibles y crea una capa de niebla sobre el tablero, 
 * ocultando las celdas que no son visibles. Las celdas visibles se muestran transparentes, 
 * mientras que las celdas ocultas se muestran con un fondo oscuro. 
 * 
 * @param {Set<string>} celdasVisibles - Conjunto de coordenadas "x,y" que son visibles.
 */
const Niebla = ({ celdasVisibles, celdasEnRango }) => {
  const grid = [];

  for (let y = 0; y < TAMANO_TABLERO; y++) {
    for (let x = 0; x < TAMANO_TABLERO; x++) {
      const coordenadas = `${x},${y}`;
      const esVisible = celdasVisibles.has(coordenadas);
      const enRangoAtaque = celdasEnRango?.has(coordenadas);
      
      grid.push(
        <div 
          key={coordenadas} 
          className={`celda-niebla ${esVisible ? 'visible' : 'oculta'} ${enRangoAtaque ? 'en-rango-ataque-niebla' : ''}`}
          style={{
            gridColumn: x + 1,
            gridRow: y + 1
          }}
        />
      );
    }
  }

  return (
    <div 
      className="capa-niebla"
      style={{
        gridTemplateColumns: `repeat(${TAMANO_TABLERO}, 1fr)`,
        gridTemplateRows: `repeat(${TAMANO_TABLERO}, 1fr)`
      }}
    >
      {grid}
    </div>
  );
};

export default Niebla;
