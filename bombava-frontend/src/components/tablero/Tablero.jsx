import { useState } from 'react';
import Celda from './Celda';
import { TAMANO_TABLERO, TERRENO } from '../../utils/constantes.js';
import './tablero.css';

// Función para generar un mapa inicial de ejemplo
const generarMapaInicial = () => {
  const map = [];
  for (let y = 0; y < TAMANO_TABLERO; y++) {
    const row = [];
    for (let x = 0; x < TAMANO_TABLERO; x++) {
      //Mapa con todo agua y una isla central
      let tipoterreno = TERRENO.AGUA;
      
      // Ejemplo de mapa con un isla -> Habría que cambiarlo para que sea mejor.
      if (x >= 6 && x < 9 && y >= 6 && y < 9) tipoterreno = TERRENO.ISLA;

      row.push({ x, y, tipoterreno });
    }
    map.push(row);
  }
  return map;
};

const Tablero = () => {
  // Generar mapa
  const [mapa] = useState(generarMapaInicial());

  // CAMBIAR -> Ejemplo de como se verias los barcos
  const [barcos] = useState([
    { id: 'Barco1', x: 2, y: 2, size: 3, vertical: false },
    { id: 'Barco2', x: 5, y: 5, size: 4, vertical: true }
  ]);

  // Función para saber si hay un barco en la posicion(X, Y)
  const hayBarco = (x, y) => {
    const barcoEncontrado = barcos.find((barco) => {
      // Hay un barco vertical
      const tocaVertical = barco.vertical && barco.x === x && y >= barco.y && y < (barco.y + barco.size);

      // Hay un barco horizontal
      const tocaHorizontal = !barco.vertical && barco.y === y && x >= barco.x && x < (barco.x + barco.size);

      return tocaVertical || tocaHorizontal;
    });
    if(!barcoEncontrado) return false;
    else return true;
  };

  const gestionarClick = (x, y) => {
    console.log(`Click en celda: ${x}, ${y}`);
    // Lógica de que pasa al clikar
  };

  return (
    <div className="componente-tablero">
      <div className="tablero">
        {/* Imprimir el mapa */}
        {mapa.map((fila) => (
          fila.map((celda) => {
            const barco = hayBarco(celda.x, celda.y);
            
            return (
              <Celda
                key={`${celda.x}-${celda.y}`}
                x={celda.x}
                y={celda.y}
                tipo_terreno={celda.tipoterreno}
                barco={barco}
                onClick={gestionarClick}
              />
            );
          })
        ))}
      </div>
    </div>
  );
};

export default Tablero;