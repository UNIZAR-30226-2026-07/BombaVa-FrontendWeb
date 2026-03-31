import Tablero from '../tablero/Tablero.jsx';
import Barco from '../barco/Barco.jsx';
import { calcularCentroBarco } from '../barco/movimientosBarco.js';
import { ATAQUE_BASE, TAMANO_TABLERO } from '../../utils/constantes.js';
import '../../styles/Mapa.css';

/*El mapa es la clase que engloba a todo el tablero de juego, para ello 
incluye varias capas(de abajo a arriba sería):
    > Tablero(Tablero.jsx)
    > Barcos(Barco.jsx)
    > Torpedos
    > Proyectiles
*/
const Mapa = ({
  mapa,
  modoAtaque,
  onAtaqueRealizado,
  barcos,
  barcoSeleccionado,
  setBarcoSeleccionado,
  rotarBarco,
  atacarCelda
}) => {

  /*const gestionarClickMapa = (x, y) => {
    console.log(`Click en celda: ${x}, ${y}`);
    // Lógica de que pasa al clikar
  };*/

  // Si pulsamos un barco lo seleccionamos y si pulsamos un 
  // barco ya seleccionado lo deseleccionamos
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

    // Si clicamos un barco aliado, se selecciona o se deselecciona si ya estaba seleccionado
    if (barcoSeleccionado == barco.id) {
      // Si clicamos el barco que ya estaba seleccionado, se deselecciona
      setBarcoSeleccionado(null);
    } else {
      setBarcoSeleccionado(barco.id);
    }
  };

  // Si hay un barco seleccionado y pulsamos una casilla 
  // ataca si estamos en modo ataque.
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
      }
    }
  };

  // Calcular celdas en el rango de ataque del barco seleccionado
  // Devuelve: un Set(tabla hash) con las celdas que están en el rango de ataque
  const calcularCeldasEnRango = () => {
    // Solo mostrar rango de ataque si hemos pulsado Fuego
    if (!modoAtaque) return new Set();
    
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
      <Tablero mapa={mapa} onCellClick={gestionarClickMapa} configurar={false} celdasEnRango={celdasEnRango} />

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