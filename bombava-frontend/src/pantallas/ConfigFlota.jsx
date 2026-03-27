import { useState } from 'react';
import Tablero from '../componentes/tablero/Tablero';
import Barco from '../componentes/barco/Barco.jsx';
import { useMovimientosBarco} from '../componentes/barco/movimientosBarco.js';
import '../styles/ConfigFlota.css';
import { BARCO1x1, BARCO1x3, BARCO1x5, Metralleta, Misiles, Torpedos, TAMANO_TABLERO, TERRENO } from '../utils/constantes.js'; 

/**
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
 */

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
      } else if (y >= 5) {
        tipoterreno = TERRENO.NO_VISION;
      } else {
        tipoterreno = TERRENO.NO_VISION_ENEMIGO;
      }

      fila.push({ x, y, tipoterreno });
    }
    map.push(fila);
  }
  return map;
};

/*El mapa es la clase que engloba a todo el tablero de juego, para ello 
incluye varias capas(de abajo a arriba sería):
    > Tablero(Tablero.jsx)
    > Barcos(Barco.jsx)
    > Torpedos
    > Proyectiles
*/
const ConfigFlota = () => {
    let mapaInicial;
    //generamos el mapa inicial
    mapaInicial = generarMapaConfiguracion();

    const [barcoAPoner, setBarcoAPoner] = useState(0); // 0 significa que no hay ninguno seleccionado
    const [barcosPuestos, setbarcosPuestos] = useState([0,0,0,0,0,0]) //Barcos puestos de cada tipo, realmente por ahora solo uso los indices 1, 3 y 5
    const [mapa, setMapa] = useState(mapaInicial);//El mapa
    const { 
        barcos, 
        barcoSeleccionado, 
        setBarcoSeleccionado, 
        rotarBarco, 
        anadirBarco, 
        setArmas,
        borrarBarco,
        celdaEsValida
    } = useMovimientosBarco([],mapa); // Empezamos con tablero vacío

    // Si pulsamos un barco podremos cambiar sus armas y sale un panel con sus datos 
    const gestionarClickBarco = (id) => {
    if (barcoSeleccionado == id) {
        // Si clicamos el barco que ya estaba seleccionado, se rota
        rotarBarco(id, null);
    } else {
        setBarcoSeleccionado(id);
    }
    };

    // Función para poner un barco, la celda en la que haces click te devuelve su x e y
    const gestionarClickMapa = (x, y) => {
        
        if(barcoAPoner != 0 && barcosPuestos[barcoAPoner] == 0){
            let nombreTipo = ""; // Declaramos la variable
            let numArmas = 0; //Para saber cuántas armas puede tener según el tamaño del barco
            switch (barcoAPoner){
                case BARCO1x1: 
                    nombreTipo = "Barco1x1"; 
                    numArmas = 1;
                    break;
                case BARCO1x3: 
                    nombreTipo = "Barco1x3"; 
                    numArmas = 2;
                    break;
                case BARCO1x5: 
                    nombreTipo = "Barco1x5";
                    numArmas = 3; 
                    break;
                default: nombreTipo = "BarcoRaro";
            }
            
            let celdasFinales = [];
            let encaja = false;
            let intentoY = y; 

            for (let desplazamiento = 0; desplazamiento < barcoAPoner; desplazamiento++) {
                let celdasTemporales = [];
                let todasValidas = true;
                
                for (let i = 0; i < barcoAPoner; i++) {
                    let yActual = intentoY + i;
                    
                    //Miro si cabe o no, si el barco no cabe entero subo la fila de la celda que tiene la punta superior del barco
                    if (!celdaEsValida(x, yActual,barcos)) {
                        todasValidas = false;
                        break; 
                    }
                    
                    celdasTemporales.push({ x: x, y: yActual });
                }
                
                if (todasValidas) {
                    celdasFinales = celdasTemporales;
                    encaja = true;
                    break; 
                } else {
                    intentoY--; // Probamos a subir el punto de origen a ver si así cabe
                }
                
            }
            if(encaja){
                const nuevoBarco = {
                    id: nombreTipo,
                    posicion: { x: x, y: intentoY },
                    orientacion: 'N',
                    tamano: barcoAPoner,
                    tipo: `Barco 1x-${barcoAPoner}`,
                    vida: 100,
                    armas: Array(numArmas).fill(0),
                    celdas: celdasFinales
                };
                anadirBarco(nuevoBarco);
                const nuevosBarcosPuestos = [...barcosPuestos]; // Copia
                nuevosBarcosPuestos[barcoAPoner] = 1; // Modifica la copia
                setbarcosPuestos(nuevosBarcosPuestos); // Actualiza el estado
                setBarcoAPoner(0)
            }
            
            
            
        }
    };

    return (
    <div className="mapa_config" onClick={() => setBarcoSeleccionado()}>

        <div className="main-content">

            {/* Zona del Tablero */}
            <div className="tablero-contenedor">

                <Tablero mapa= {mapa} onCellClick={gestionarClickMapa} configurar={true} celdasEnRango={new Set()} />
                {barcos.map((barco) => (
                <Barco 
                    key={barco.id} 
                    barco={barco} 
                    estaSeleccionado={barcoSeleccionado === barco.id}
                    onClick={(x, y) => { gestionarClickBarco(barco.id); }}
                />
                ))}

            </div>

            <div className="botones_barco_config">
                <button className="ponerBarco-btn" onClick={() => setBarcoAPoner(BARCO1x1)}>PONER BARCO 1x1</button>
                <button className="ponerBarco-btn" onClick={() => setBarcoAPoner(BARCO1x3)}>PONER BARCO 1x3</button>
                <button className="ponerBarco-btn" onClick={() => setBarcoAPoner(BARCO1x5)}>PONER BARCO 1x5</button>
            </div>

        </div>

        {/* Panel Lateral Derecho (Solo se ve si hay un barco seleccionado) */}
        {barcoSeleccionado && (
            <div className="panel-lateral">

                <h3>EQUIPAR ARMAS</h3>
                <p>BARCO: {barcoSeleccionado}</p>
                <button className="ponerBarco-btn" onClick={() => setArmas(barcoSeleccionado,Metralleta)}>Metralleta</button>
                <button className="ponerBarco-btn" onClick={() => setArmas(barcoSeleccionado,Misiles)}>Misiles</button>
                <button className="ponerBarco-btn" onClick={() => setArmas(barcoSeleccionado,Torpedos)}>Torpedos</button>
                <button className="eliminarBarco-btn" onClick={() => borrarBarco(barcoSeleccionado, setbarcosPuestos, barcosPuestos)}>Eliminar Barco</button>
                
                
            </div>
        )}
        
    </div>

    );
};

export default ConfigFlota;