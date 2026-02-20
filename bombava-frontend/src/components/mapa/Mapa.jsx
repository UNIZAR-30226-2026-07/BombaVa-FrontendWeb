import { useState } from 'react';
import Tablero from '../tablero/Tablero';
import Barco from '../barco/Barco.jsx';
import { useMovimientosBarco} from '../barco/movimientosBarco.js';
import './Mapa.css';

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
  } = useMovimientosBarco([ // Un par de barcos de ejemplo de como iría, luego CAMBIAR
    { id: '1', posicion: { x: 2, y: 2 }, orientacion: 'S', tamano: 3, tipo: 'lancha', vida: 100 },
    { id: '2', posicion: { x: 5, y: 5 }, orientacion: 'E', tamano: 4, tipo: 'crucero', vida: 100 }
  ]);

  /*const gestionarClickMapa = (x, y) => {
    console.log(`Click en celda: ${x}, ${y}`);
    // Lógica de que pasa al clikar
  };*/

  // Función de DEBUG, si pulsamos un barco lo seleccionamos y si pulsamos un 
  // barco ya seleccionado lo retamos
  const gestionarClickBarco = (id) => {
    if (barcoSeleccionado == id) {
      // Si clicamos el barco que ya estaba seleccionado, se rota
      rotarBarco(id, null);
    } else {
      setBarcoSeleccionado(id);
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
      <Tablero onCellClick={gestionarClickMapa} />
      
      {barcos.map((barco) => (
        <Barco 
          key={barco.id} 
          barco={barco} 
          estaSeleccionado={barcoSeleccionado === barco.id}
          onClick={() => gestionarClickBarco(barco.id)}
        />
      ))}
    </div>
  );
};

export default Mapa;