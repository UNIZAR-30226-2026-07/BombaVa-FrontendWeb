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
const Niebla = ({ celdasVisibles }) => {
  const grid = [];

  for (let y = 0; y < TAMANO_TABLERO; y++) {
    for (let x = 0; x < TAMANO_TABLERO; x++) {
      const esVisible = celdasVisibles.has(`${x},${y}`);
      
      grid.push(
        <div 
          key={`${x},${y}`} 
          className={`celda-niebla ${esVisible ? 'visible' : 'oculta'}`}
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
