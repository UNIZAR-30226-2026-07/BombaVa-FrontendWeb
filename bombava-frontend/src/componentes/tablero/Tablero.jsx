import { useState } from 'react';
import Celda from './Celda.jsx';
import { TAMANO_TABLERO, TERRENO, TAMANO_CELDA } from '../../utils/constantes.js';
import '../../styles/Tablero.css';

// Recibe la función onClick desde Mapa.jsx
/* Parametros: 
* onCellClick: función que se ejecuta al hacer click en una celda
* configurar: booleano que indica si se está configurando la flota
* celdasEnRango: tabla hash con las celdas que están en rango de ataque del barco seleccionado
*/
const Tablero = ({ mapa, onCellClick, celdasEnRango }) => {

  //const [mapa, setMapa] = useState(mapaInicial);

  return (
    <div className="tablero"
      style={{
        // Aplicamos el formato de cuadricula usando fracciones (1fr) para ser responsive
        // Se crean TAMANO_TABLERO columnas y TAMANO_TABLERO filas. Cada columna y cada 
        // fila ocupa 1fr de espacio, es decir, del esapcio total se divide entre TAMANO_TABLERO
        gridTemplateColumns: `repeat(${TAMANO_TABLERO}, 1fr)`,
        gridTemplateRows: `repeat(${TAMANO_TABLERO}, 1fr)`
      }}
    >
      {/*Mapeamos el mapa para mostrar cada celda*/}
      {mapa.map((fila) => (
        fila.map((celda) => (
          <Celda
            key={`${celda.x}-${celda.y}`}
            x={celda.x}
            y={celda.y}
            tipo_terreno={celda.tipoterreno}
            // Si la celda está en el rango de ataque(tabla hash), se le aplica un efecto 
            // visual, para identificarla
            enRangoAtaque={celdasEnRango.has(`${celda.x},${celda.y}`)}
            onClick={onCellClick}
          />
        ))
      ))}
    </div>
  );
};

export default Tablero;