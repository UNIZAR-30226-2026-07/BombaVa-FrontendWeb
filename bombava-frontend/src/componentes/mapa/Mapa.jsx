import { useState } from 'react';
import Tablero from '../tablero/Tablero.jsx';
import Barco from '../barco/Barco.jsx';
import { useMovimientosBarco} from '../barco/movimientosBarco.js';
import '../../styles/Mapa.css';

/*El mapa es la clase que engloba a todo el tablero de juego, para ello 
incluye varias capas(de abajo a arriba sería):
    > Tablero(Tablero.jsx)
    > Barcos(Barco.jsx)
    > Torpedos
    > Proyectiles
*/
const Mapa = () => {
  const { 
    barcos, 
    barcoSeleccionado, 
    setBarcoSeleccionado,
    rotarBarco,
    moverBarco 
  } = useMovimientosBarco([ 
    //BARCOS ALIADOS:
    { id: 'aliado_1', posicion: { x: 2, y: 12 }, orientacion: 'N', tamano: 1, tipo: 'lancha', vida: 100, esEnemigo: false },
    { id: 'aliado_2', posicion: { x: 6, y: 11 }, orientacion: 'N', tamano: 3, tipo: 'destructor', vida: 100, esEnemigo: false },
    { id: 'aliado_3', posicion: { x: 10, y: 9 }, orientacion: 'N', tamano: 5, tipo: 'portaaviones', vida: 100, esEnemigo: false },

    // BARCOS ENEMIGOS:
    { id: 'enemigo_1', posicion: { x: 2, y: 2 }, orientacion: 'S', tamano: 1, tipo: 'lancha', vida: 100, esEnemigo: true },
    { id: 'enemigo_2', posicion: { x: 6, y: 2 }, orientacion: 'S', tamano: 3, tipo: 'destructor', vida: 100, esEnemigo: true },
    { id: 'enemigo_3', posicion: { x: 10, y: 0 }, orientacion: 'S', tamano: 5, tipo: 'portaaviones', vida: 100, esEnemigo: true }
  ]);

  /*const gestionarClickMapa = (x, y) => {
    console.log(`Click en celda: ${x}, ${y}`);
    // Lógica de que pasa al clikar
  };*/

  // Función de DEBUG, si pulsamos un barco lo seleccionamos y si pulsamos un 
  // barco ya seleccionado lo retamos
  const gestionarClickBarco = (barco) => {
      // No se permite seleccionar barcos enemigos
      if (barco.esEnemigo) {
        // Si es un barco enemigo, no se selecciona
        // FUTUROS CAMBIOS -> Se podria implementar lógica de ataque aquí
        return; 
      }
      // Si clicamos un barco aliado, se selecciona o rota si ya estaba seleccionado
      if (barcoSeleccionado === barco.id) {
        // Si clicamos el barco que ya estaba seleccionado, se rota
        rotarBarco(barco.id, null);
      } else {
        setBarcoSeleccionado(barco.id);
      }
  };

  // Función de DEBUG, hay un barco seleccionado y pulsamos una casilla se va ahí
  const gestionarClickMapa = (x, y) => {
    if (barcoSeleccionado) {
      moverBarco(barcoSeleccionado, x, y);
    }
  };

  return (
    <div className="mapa">
      <Tablero onCellClick={gestionarClickMapa} configurar={false}/>
      
      {barcos.map((barco) => (
        <Barco 
          key={barco.id} 
          barco={barco} 
          estaSeleccionado={barcoSeleccionado === barco.id}
          onClick={() => gestionarClickBarco(barco)}
        />
      ))}
    </div>
  );
};

export default Mapa;