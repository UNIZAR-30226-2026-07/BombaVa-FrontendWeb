import { useState } from 'react';
import Celda from './Celda.jsx';
import { TAMANO_TABLERO, TERRENO, TAMANO_CELDA } from '../../utils/constantes.js';
import '../../styles/Tablero.css';

// Función para generar un mapa inicial de ejemplo
const generarMapaInicial = () => {
  const map = [];
  for (let y = 0; y < TAMANO_TABLERO; y++) {
    const fila = [];
    for (let x = 0; x < TAMANO_TABLERO; x++) {
      //Mapa con todo agua y una isla central
      let tipoterreno = TERRENO.AGUA;

      // Ejemplo de mapa con un isla -> Habría que cambiarlo para que sea mejor.
      if (x >= 6 && x < 9 && y >= 6 && y < 9) {
        tipoterreno = TERRENO.ISLA;
      }

      fila.push({ x, y, tipoterreno });
    }
    map.push(fila);
  }
  return map;
};

const generarMapaConfiguracion = () => {
  const map = [];
  for (let y = 0; y < TAMANO_TABLERO; y++) {
    const fila = [];
    for (let x = 0; x < TAMANO_TABLERO; x++) {
      //Mapa con todo agua y una isla central
      let tipoterreno = TERRENO.AGUA;

      // Ejemplo de mapa con un isla -> Habría que cambiarlo para que sea mejor.
      if (y >= 10) {
        tipoterreno = TERRENO.AGUA;
      } else if (y>=5){
        tipoterreno = TERRENO.NO_VISION;
      }else{
        tipoterreno = TERRENO.NO_VISION_ENEMIGO;
      }

      fila.push({ x, y, tipoterreno });
    }
    map.push(fila);
  }
  return map;
};

// Recibe la función onClick desde Mapa.jsx
/* Parametros: 
* onCellClick: función que se ejecuta al hacer click en una celda
* configurar: booleano que indica si se está configurando la flota
* celdasEnRango: tabla hash con las celdas que están en rango de ataque del barco seleccionado
*/
const Tablero = ({ onCellClick, configurar, celdasEnRango }) => {
  let mapaInicial;

  //Decidimos que mapa generar
  if (configurar == false) {
    mapaInicial = generarMapaInicial();
  } else {
    mapaInicial = generarMapaConfiguracion();
  }

  const [mapa, setMapa] = useState(mapaInicial);

  return (
    <div className="tablero"
      style={{
        // Aplicamos el formato de cuadricula
        gridTemplateColumns: `repeat(${TAMANO_TABLERO}, ${TAMANO_CELDA}px)`,
        gridTemplateRows: `repeat(${TAMANO_TABLERO}, ${TAMANO_CELDA}px)`
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