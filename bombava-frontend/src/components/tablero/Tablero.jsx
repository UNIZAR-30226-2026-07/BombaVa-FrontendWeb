import { useState } from 'react';
import Celda from './Celda';
import { TAMANO_TABLERO, TERRENO, TAMANO_CELDA } from '../../utils/constantes.js';
import './Tablero.css';

// Función para generar un mapa inicial de ejemplo
const generarMapaInicial = () => {
  const map = [];
  for (let y = 0; y < TAMANO_TABLERO; y++) {
    const fila = [];
    for (let x = 0; x < TAMANO_TABLERO; x++) {
      //Mapa con todo agua y una isla central
      let tipoterreno = TERRENO.AGUA;

      // Ejemplo de mapa con un isla -> Habría que cambiarlo para que sea mejor.
      if (x >= 6 && x < 9 && y >= 6 && y < 9){
        tipoterreno = TERRENO.ISLA;
      } 

      fila.push({ x, y, tipoterreno });
    }
    map.push(fila);
  }
  return map;
};

// Recibe la función onClick desde Mapa.jsx
const Tablero = ({ onCellClick }) => {
   // Generar mapa
  const [mapa] = useState(generarMapaInicial());

  return (
    <div className="tablero"
    style={{
        // Aplicamos el formato de cuadricula
        gridTemplateColumns: `repeat(${TAMANO_TABLERO}, ${TAMANO_CELDA}px)`,
        gridTemplateRows: `repeat(${TAMANO_TABLERO}, ${TAMANO_CELDA}px)`
      }}
    >
      {mapa.map((fila) => (
        fila.map((celda) => (
          <Celda
            key={`${celda.x}-${celda.y}`}
            x={celda.x}
            y={celda.y}
            tipo_terreno={celda.tipoterreno}
            onClick={onCellClick}
          />
        ))
      ))}
    </div>
  );
};

export default Tablero;