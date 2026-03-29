import BarraProgreso from "../componentes/barras_recursos/Barras.jsx";
import { useState, useEffect } from 'react';
import Mapa from "../componentes/mapa/Mapa.jsx";
import BoatInfoCard from "../componentes/BoatInfoCard.jsx";
import MenuPausa from "../componentes/botones/MenuPausa.jsx";
import BtnPasarTurno from "../componentes/botones/BtnPasarTurno.jsx";
import ActionButtons from "../componentes/ActionButtons.jsx";
import { ATAQUE_BASE, TAMANO_TABLERO, TERRENO } from "../utils/constantes.js";
import { useMovimientosBarco } from "../componentes/barco/movimientosBarco.js";
import { socket } from '../utils/socket.js';
import '../styles/Combate.css';

/*ESTRUCTURA DE LA PANTALLA DE COMBATE:
    > COLUMNA IZQUIERDA: Recursos (arriba) y Mapa (abajo) 
    > COLUMNA CENTRAL: Hueco para los botones de movimiento/ataque
    > COLUMNA DERECHA: Información del barco seleccionado
*/

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

function Combate() {
    const [mapa, setMapa] = useState(generarMapaInicial());

    //Valores de prueba de las barras de recursos,  se actualizarán dinámicamente según el estado del juego
    const [barras, setBarras] = useState({
        municion: 10,
        maxMunicion: 100,
        combustible: 100,
        maxCombustible: 100
    });

    // Función para actualizar la munición, restando el coste de munición al valor actual
    const actualizarMunicion = (coste) => {
        setBarras(prev => ({
            ...prev,
            // Evitamos que pueda ser negativo el valor de la munición
            municion: Math.max(0, prev.municion - coste)
        }));
    };

    // Función para actualizar el combustible, restando el coste de combustible al valor actual.
    const actualizarCombustible = (coste) => {
        setBarras(prev => ({
            ...prev,
            // Evitamos que pueda ser negativo el valor del combustible
            combustible: Math.max(0, prev.combustible - coste)
        }));
    };

    // Hook para manejar los movimientos de los barcos
    // Inicializamos con un array de barcos vacío. Se rellenará al recibir match:startInfo
    const {
        barcos,
        barcoSeleccionado: idBarcoSeleccionado,
        setBarcoSeleccionado: setIdBarcoSeleccionado,
        rotarBarco,
        moverBarco,
        atacarCelda,
        cargarBarcosDesdeApi
    } = useMovimientosBarco([]);

    useEffect(() => {
        const handleStartInfo = (payload) => {
                        
            // Cargar los barcos pasandole lo que llega del local storage
            cargarBarcosDesdeApi(payload.playerFleet, payload.enemyFleet);

            // Actualizar munición y combustible iniciales según el local storage
            setBarras(prev => ({
                     ...prev,
                     municion: payload.ammo,
                     combustible: payload.fuel
                 }));
        };

        // Al llegar a Combate.jsx está guardado en el local storage el estado de la partida
        const guardado = localStorage.getItem('bombaVa_matchState');
        if (guardado) {
            const parsed = JSON.parse(guardado);
            handleStartInfo(parsed);
        }else{
            console.log("No hay estado previo de la partida");
            navigate('/menuInicial');
        }

        // Escucha las actualizaciones de la partida
        const handleVisionUpdate = (visionPayload) => {
             console.log("Nueva visión recibida:", visionPayload);
             cargarBarcosDesdeApi(visionPayload.myFleet, visionPayload.visibleEnemyFleet);
             
             // Añadir los datos de la actualización al Local storage.
             const estadoPrevio = localStorage.getItem('bombaVa_matchState');
             if (estadoPrevio) {
                 const estadoActualizado = JSON.parse(estadoPrevio);
                 estadoActualizado.playerFleet = visionPayload.myFleet || estadoActualizado.playerFleet;
                 estadoActualizado.enemyFleet = visionPayload.visibleEnemyFleet || estadoActualizado.enemyFleet;
                 localStorage.setItem('bombaVa_matchState', JSON.stringify(estadoActualizado));
             }
        };

        socket.on('match:vision_update', handleVisionUpdate);

        return () => {
            socket.off('match:vision_update', handleVisionUpdate);
        };
    }, []);
    
    // Estado para obtener el objeto del barco seleccionado
    const barcoSeleccionado = barcos.find(b => b.id === idBarcoSeleccionado);

    // Estado para saber si estamos en modo ataque
    const [modoAtaque, setModoAtaque] = useState(false);

    // Función que se ejecutará al realizar un ataque en el mapa
    const handleAtaqueRealizado = () => {
        actualizarMunicion(ATAQUE_BASE.COSTE);
        setModoAtaque(false); // Desactivamos el modo ataque tras realizarlo
    };

    // Función que se activa al pulsar en atacar en el panel de control
    const activarModoAtaque = () => {
        if (modoAtaque) {
            // Si estas en modo ataque y vuelves a pulsar en atacar, 
            // se desactiva el modo ataque
            setModoAtaque(false);
            return;
        }
        if (barras.municion < ATAQUE_BASE.COSTE) {
            alert("No hay suficiente munición para atacar");
            return;
        }
        setModoAtaque(true);
    };

    const handlePasarTurno = () => {
        alert("Turno pasado");
        // CUIDADO!!! -> Completar con el backend la lógica de pasar el turno
    };

    return (
        <div className="combate-contenedor">
            {
                /*ESTRUCTURA DE LA PANTALLA DE COMBATE:
                    > COLUMNA IZQUIERDA: Recursos (arriba) y Mapa (abajo) 
                    > COLUMNA CENTRAL: Hueco para los botones de movimiento/ataque
                    > COLUMNA DERECHA: Información del barco seleccionado
                */
            }

            {/*Botón para pasar el turno*/}
            <BtnPasarTurno onPasarTurno={handlePasarTurno} />

            {/*Botón para pausar la partida. Esta en el esquina superior derecha */}
            <MenuPausa />
            {/*COLUMNA IZQUIERDA: Recursos (arriba) y Mapa (abajo) */}
            <div className="combate-columna-izquierda">
                {/* Barras de recursos */}
                <div className="recursos-contendor">
                    <BarraProgreso
                        etiqueta="Combustible"
                        tipo="combustible"
                        valorActual={barras.combustible}
                        maxValor={barras.maxCombustible}
                    />
                    <BarraProgreso
                        etiqueta="Munición"
                        tipo="municion"
                        valorActual={barras.municion}
                        maxValor={barras.maxMunicion}
                    />
                </div>

                {/* Contenedor del Mapa (Incluye tablero y barcos) */}
                <div className="mapa-contendor">
                    <Mapa
                        mapa={mapa}
                        modoAtaque={modoAtaque}
                        onAtaqueRealizado={handleAtaqueRealizado}
                        barcos={barcos}
                        barcoSeleccionado={idBarcoSeleccionado}
                        setBarcoSeleccionado={setIdBarcoSeleccionado}
                        rotarBarco={rotarBarco}
                        moverBarco={moverBarco}
                        atacarCelda={atacarCelda}
                    />
                </div>
            </div>

            {/*COLUMNA CENTRAL: Hueco para los botones de movimiento/ataque */}
            <div className="combate-columna-central">
                <h3 className="titulo-acciones">Panel de control</h3>
                <div className="acciones">
                    <ActionButtons
                        boat={barcoSeleccionado}
                        onAttackClick={activarModoAtaque}
                        modoAtaque={modoAtaque}
                        rotarBarco={rotarBarco}
                        moverBarco={moverBarco}
                    />
                </div>
            </div>

            {/* COLUMNA DERECHA: Información del barco seleccionado */}
            <div className="combate-columna-derecha">
                <BoatInfoCard boat={barcoSeleccionado} />
            </div>
        </div>
    );
}

export default Combate;