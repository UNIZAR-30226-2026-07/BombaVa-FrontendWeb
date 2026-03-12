import { useState, useEffect } from 'react';
import Tablero from '../tablero/Tablero.jsx';
import Barco from '../barco/Barco.jsx';
import { useMovimientosBarco, calcularCentroBarco } from '../barco/movimientosBarco.js';
import { ATAQUE_BASE, TAMANO_TABLERO } from '../../utils/constantes.js';
import '../../styles/Mapa.css';

/*El mapa es la clase que engloba a todo el tablero de juego, para ello 
incluye varias capas(de abajo a arriba sería):
    > Tablero(Tablero.jsx)
    > Barcos(Barco.jsx)
    > Torpedos
    > Proyectiles
*/
const Mapa = ({ modoAtaque, onAtaqueRealizado, onSeleccionarBarco }) => {
  const {
    barcos,
    barcoSeleccionado,
    setBarcoSeleccionado,
    rotarBarco,
    moverBarco,
    atacarCelda,
    celdaEsValida
  } = useMovimientosBarco([
    //BARCOS ALIADOS:
    { id: 'aliado_1', posicion: { x: 2, y: 12 }, orientacion: 'N', tamano: 1, tipo: 'lancha', vida: 100, esEnemigo: false },
    { id: 'aliado_2', posicion: { x: 6, y: 11 }, orientacion: 'N', tamano: 3, tipo: 'destructor', vida: 100, esEnemigo: false },
    { id: 'aliado_3', posicion: { x: 10, y: 9 }, orientacion: 'N', tamano: 5, tipo: 'portaaviones', vida: 100, esEnemigo: false },

    // BARCOS ENEMIGOS:
    { id: 'enemigo_1', posicion: { x: 2, y: 2 }, orientacion: 'S', tamano: 1, tipo: 'lancha', vida: 100, esEnemigo: true },
    { id: 'enemigo_2', posicion: { x: 6, y: 2 }, orientacion: 'E', tamano: 3, tipo: 'destructor', vida: 100, esEnemigo: true },
    { id: 'enemigo_3', posicion: { x: 10, y: 0 }, orientacion: 'S', tamano: 5, tipo: 'portaaviones', vida: 100, esEnemigo: true }
  ]);

  // Si cambia el barcoSeleccionado o cambian los datos de los barcos, le pasamos el objeto entero
  // al componente padre (Combate.jsx)
  useEffect(() => {
    if (onSeleccionarBarco) {
      if (barcoSeleccionado) {
        const barcoActual = barcos.find(b => b.id == barcoSeleccionado);
        onSeleccionarBarco(barcoActual);
      } else {
        onSeleccionarBarco(null);
      }
    }
  }, [barcoSeleccionado, barcos, onSeleccionarBarco]);

  /*const gestionarClickMapa = (x, y) => {
    console.log(`Click en celda: ${x}, ${y}`);
    // Lógica de que pasa al clikar
  };*/

  // Función de DEBUG, si pulsamos un barco lo seleccionamos y si pulsamos un 
  // barco ya seleccionado lo retamos
  const gestionarClickBarco = (barco, clickX, clickY) => {
    // No se permite seleccionar barcos enemigos para moverse/rotar, 
    // solo se puede seleccionar un barco enemigo si estamos en modo ataque.
    if (barco.esEnemigo) {
      // En modo ataque, clicar un barco enemigo ataca su posición
      if (modoAtaque && barcoSeleccionado) {
        const exito = atacarCelda(
          barcoSeleccionado,
          clickX,
          clickY,
          ATAQUE_BASE.DANO,
          ATAQUE_BASE.RANGO
        );
        if (exito) {
          onAtaqueRealizado();
        }
      }
      return;
    }

    // Si estamos en modo ataque, no permitir cambiar de barco ni rotarlo
    if (modoAtaque) return;

    // Si clicamos un barco aliado, se selecciona o rota si ya estaba seleccionado
    if (barcoSeleccionado == barco.id) {
      // Si clicamos el barco que ya estaba seleccionado, se rota
      rotarBarco(barco.id, null);
    } else {
      setBarcoSeleccionado(barco.id);
    }
  };

  // Función de DEBUG, hay un barco seleccionado y pulsamos una casilla se va ahí
  // o ataca si estamos en modo ataque.
  const gestionarClickMapa = (x, y) => {
    if (barcoSeleccionado) {
      if (modoAtaque) {
        // Si estamos en modo ataque, clicar una casilla ataca esa posición
        // aunque no haya un barco enemigo en esa posición.
        // Si hay un barco enemigo en esa posición, se ataca a ese barco.(eso está implementdao en gestionarClickBarco)
        const exito = atacarCelda(
          barcoSeleccionado,
          x,
          y,
          ATAQUE_BASE.DANO,
          ATAQUE_BASE.RANGO
        );
        if (exito) {
          onAtaqueRealizado();
        }
      } else {
        moverBarco(barcoSeleccionado, x, y, mapa);
      }
    }
  };

  // Calcular celdas en el rango de ataque del barco seleccionado
  // Devuelve: un Set(tabla hash) con las celdas que están en el rango de ataque
  const calcularCeldasEnRango = () => {
    // Si no hay un barco seleccionado, no hay celdas en rango, devolvemos un Set vacío
    if (!barcoSeleccionado) return new Set();
    // Buscamos el barco seleccionado
    const atacante = barcos.find(b => b.id == barcoSeleccionado);
    if (!atacante) return new Set();

    // Calculamos el centro del barco seleccionado
    const { centroX, centroY } = calcularCentroBarco(atacante);

    // Calculamos las celdas en el rango de ataque, y las agregamos a un Set(tabla hash)
    const celdas = new Set();
    for (let x = centroX - ATAQUE_BASE.RANGO; x <= centroX + ATAQUE_BASE.RANGO; x++) {
      for (let y = centroY - ATAQUE_BASE.RANGO; y <= centroY + ATAQUE_BASE.RANGO; y++) {
        // Si la celda está fuera del tablero, no la agregamos
        if (x >= 0 && x < TAMANO_TABLERO && y >= 0 && y < TAMANO_TABLERO) {
          const distancia = Math.abs(centroX - x) + Math.abs(centroY - y);
          // Si la celda está fuera del rango, no la agregamos
          if (distancia <= ATAQUE_BASE.RANGO) {
            celdas.add(`${x},${y}`);
          }
        }
      }
    }
    return celdas;
  };

  const celdasEnRango = calcularCeldasEnRango();

  return (
    <div className="mapa">
      <Tablero onCellClick={gestionarClickMapa} configurar={false} celdasEnRango={celdasEnRango} />

      {barcos.map((barco) => (
        <Barco
          key={barco.id}
          barco={barco}
          estaSeleccionado={barcoSeleccionado == barco.id}
          onClick={(x, y) => gestionarClickBarco(barco, x, y)}
        />
      ))}
    </div>
  );
};

export default Mapa;