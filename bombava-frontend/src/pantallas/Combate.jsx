import BarraProgreso from "../componentes/barras_recursos/Barras.jsx";
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Mapa from "../componentes/mapa/Mapa.jsx";
import BoatInfoCard from "../componentes/BoatInfoCard.jsx";
import MenuPausa from "../componentes/botones/MenuPausa.jsx";
import BtnPasarTurno from "../componentes/botones/BtnPasarTurno.jsx";
import ActionButtons from "../componentes/ActionButtons.jsx";
import { ATAQUE_BASE, TAMANO_TABLERO, TERRENO } from "../utils/constantes.js";
import { useMovimientosBarco } from "../componentes/barco/movimientosBarco.js";
import { peticionPasarTurno } from '../utils/socket.js';
import { setupGameListeners, cargarEstadoPartida, guardarEstadoPartida, unirseASalaDeJuego, eliminarEstadoPartida } from '../services/gameApi.js';
import { notification } from '../services/notificationService.js';
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
      //if (x >= 6 && x < 9 && y >= 6 && y < 9) {
      //  tipoterreno = TERRENO.ISLA;
      //}

      fila.push({ x, y, tipoterreno });
    }
    map.push(fila);
  }
  return map;
};

function Combate() {
    const navigate = useNavigate();
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
        atacarCelda,
        cargarBarcosDesdeApi,
        moverBarcoAdelante,
        actualizarVidaBarco
    } = useMovimientosBarco([]);

    // Estado para saber si es mi turno o el del oponente
    const [esMiTurno, setEsMiTurno] = useState(false);
    
    // Varaible para guardar el estado de la partida
    const matchStateRef = useRef(null);

    useEffect(() => {
        // Cargar estado inicial de la partida
        const estadoPartida = cargarEstadoPartida();
        if (!estadoPartida) {
            console.log("No hay estado previo de la partida");
            return;
        }

        // Guardar en ref y conectarse a la sala
        matchStateRef.current = estadoPartida;
        unirseASalaDeJuego(estadoPartida.matchInfo.matchId);

        // Cargar barcos iniciales y verificar turno
        cargarBarcosDesdeApi(estadoPartida.playerFleet, estadoPartida.enemyFleet);
        setBarras(prev => ({
            ...prev,
            municion: estadoPartida.ammo,
            combustible: estadoPartida.fuel
        }));
        setEsMiTurno(estadoPartida.matchInfo.currentTurnPlayer == estadoPartida.matchInfo.yourId);

        // Definir handlers para los eventos del servidor
        const gameHandlers = {
            onVisionUpdate: (visionPayload) => {
                console.log("Nueva visión recibida:", visionPayload);
                cargarBarcosDesdeApi(visionPayload.myFleet, visionPayload.visibleEnemyFleet);
                
                if (matchStateRef.current) {
                    matchStateRef.current.playerFleet = visionPayload.myFleet || matchStateRef.current.playerFleet;
                    matchStateRef.current.enemyFleet = visionPayload.visibleEnemyFleet || matchStateRef.current.enemyFleet;
                    guardarEstadoPartida(matchStateRef.current);
                }
            },

            onShipMoved: (payload) => {
                console.log("Movimiento confirmado por el back-end:", payload);
                if (matchStateRef.current) {
                    const miId = matchStateRef.current.matchInfo.yourId;
                    if (payload.userId == miId) {
                        setBarras(prev => ({ ...prev, combustible: payload.fuelReserve }));
                    }
                    moverBarcoAdelante(payload.shipId);
                    matchStateRef.current.fuel = payload.fuelReserve;
                    guardarEstadoPartida(matchStateRef.current);
                }
            },

            onShipRotated: (payload) => {
                console.log("Rotación confirmada por el back-end:", payload);
                if (matchStateRef.current) {
                    const miId = matchStateRef.current.matchInfo.yourId;
                    if (payload.userId == miId) {
                        setBarras(prev => ({ ...prev, combustible: payload.fuelReserve }));
                    }
                    rotarBarco(payload.shipId, payload.orientation);
                    matchStateRef.current.fuel = payload.fuelReserve;
                    guardarEstadoPartida(matchStateRef.current);
                }
            },

            onTurnChanged: (payload) => {
                console.log("Turno cambiado:", payload);
                if (matchStateRef.current) {
                    const miId = matchStateRef.current.matchInfo.yourId;
                    setEsMiTurno(payload.nextPlayerId == miId);
                    if (payload.nextPlayerId == miId) {
                        setBarras(prev => ({
                            ...prev,
                            municion: payload.resources.ammo,
                            combustible: payload.resources.fuel
                        }));
                    }
                    matchStateRef.current.ammo = payload.resources.ammo;
                    matchStateRef.current.fuel = payload.resources.fuel;
                    matchStateRef.current.matchInfo.currentTurnPlayer = payload.nextPlayerId;
                    matchStateRef.current.matchInfo.turnNumber = payload.turnNumber;
                    guardarEstadoPartida(matchStateRef.current);
                }
            },

            onShipAttacked: (payload) => {
                console.log("Ataque procesado por backend:", payload);
                if (matchStateRef.current) {
                    const miId = matchStateRef.current.matchInfo.yourId;
                    if (payload.attackerId == miId) {
                        setBarras(prev => ({ ...prev, municion: payload.ammoCurrent }));
                        matchStateRef.current.ammo = payload.ammoCurrent;
                        guardarEstadoPartida(matchStateRef.current);
                    }
                    if (payload.hit) {
                        notification.success(payload.targetHp == 0 ? "¡Barco hundido!" : `¡Impacto! Vida: ${payload.targetHp}`);
                    } else {
                        notification.warning("¡Agua! Disparo fallido.");
                    }
                }
            },

            onMatchFinished: (payload) => {
                console.log("Partida finalizada", payload);
                const miId = matchStateRef.current.matchInfo.yourId;
                const soyGanador = payload.winnerId == miId;
                
                if (payload.reason == 'surrender') {
                    notification.success(soyGanador ? "¡VICTORIA! El oponente se ha rendido." : "DERROTA. Te has rendido.");
                } else {
                    notification.success(soyGanador ? "¡VICTORIA! Todos los barcos enemigos destruidos." : "DERROTA. Tu flota ha sido destruida.");
                }

                // Esperamos 4 segundos y volvemos al menú inicial
                // Antes de volver al menú inicial, eliminamos el estado de la partida
                setTimeout(() => {
                    eliminarEstadoPartida();
                    navigate('/menuInicial');
                }, 4000);
            }
        };

        // Registrar listeners y obener función cleanup
        const cleanup = setupGameListeners(gameHandlers);

        // Limpiar listeners al desmontar
        return cleanup;
    }, []);

    const handlePasarTurno = () => {
        const estado = localStorage.getItem('bombaVa_matchState');
        if (estado) {
            const matchId = JSON.parse(estado).matchInfo.matchId;
            peticionPasarTurno(matchId);
            setEsMiTurno(false);
        }
    };
    
    // Estado para obtener el objeto del barco seleccionado
    const barcoSeleccionado = barcos.find(b => b.id === idBarcoSeleccionado);

    // Estado para saber si estamos en modo ataque
    const [modoAtaque, setModoAtaque] = useState(false);

    // Función que se ejecutará al realizar un ataque en el mapa
    const handleAtaqueRealizado = () => {
        setModoAtaque(false); // Desactivamos el modo ataque para volver a la selección normal
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
            notification.warning("No hay suficiente munición para atacar");
            return;
        }
        setModoAtaque(true);
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
            {esMiTurno && (
                <BtnPasarTurno onPasarTurno={handlePasarTurno} />
            )}

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
                        atacarCelda={atacarCelda}
                    />
                </div>
            </div>

            {/*COLUMNA CENTRAL: Hueco para los botones de movimiento/ataque */}
            <div className="combate-columna-central">
                <h3 className="titulo-acciones">
                    Panel de control
                    <div className="turno-indicador">
                        {esMiTurno ? "" : "Esperando al oponente..."}
                    </div>
                </h3>
                <div className="acciones">
                    {esMiTurno && (
                        <ActionButtons
                            boat={barcoSeleccionado}
                            onAttackClick={activarModoAtaque}
                            modoAtaque={modoAtaque}
                        />
                    )}
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