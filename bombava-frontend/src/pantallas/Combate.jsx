import BarraProgreso from "../componentes/barras_recursos/Barras.jsx";
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Mapa from "../componentes/mapa/Mapa.jsx";
import BoatInfoCard from "../componentes/BoatInfoCard.jsx";
import MenuPausa from "../componentes/botones/MenuPausa.jsx";
import BtnPasarTurno from "../componentes/botones/BtnPasarTurno.jsx";
import ActionButtons from "../componentes/ActionButtons.jsx";
import { TAMANO_TABLERO, TERRENO, ARMAS, CANON, TORPEDO } from "../utils/constantes.js";
import { useMovimientosBarco } from "../componentes/barco/movimientosBarco.js";
import { peticionPasarTurno } from '../utils/socket.js';
import { setupGameListeners, cargarEstadoPartida, guardarEstadoPartida, unirseASalaDeJuego, eliminarEstadoPartida, actualizarEstadoPartida, actualizarProyectilEnEstado, actualizarProyectilLanzadoEnEstado } from '../services/gameApi.js';
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

    // Estado para saber si estamos en modo ataque
    const [modoAtaque, setModoAtaque] = useState(false);

    // Estado para saber qué arma está seleccionada, por defecto el cañon
    const [armaSeleccionada, setArmaSeleccionada] = useState(CANON);

    // Estado para borrar proyectiles al cambiar de turno (cuando explotan o caducan)
    const [proyectilesABorrar, setProyectilesABorrar] = useState([]);

    // Hook para manejar los movimientos de los barcos
    // Inicializamos con un array de barcos vacío. Se rellenará al recibir match:startInfo
    const {
        barcos,
        proyectiles,
        barcoSeleccionado: idBarcoSeleccionado,
        setBarcoSeleccionado: setIdBarcoSeleccionado,
        rotarBarco,
        atacarCelda,
        cargarBarcosDesdeApi,
        moverBarcoAdelante,
        actualizarVidaBarco,
        quitarProyectil,
        anadirProyectil,
        actualizarProyectil,
        cargarProyectilesDesdeApi
    } = useMovimientosBarco([], { setModoAtaque });

    // Estado para saber si es mi turno o el del oponente
    const [esMiTurno, setEsMiTurno] = useState(false);
    // Ref para acceder al valor actual de esMiTurno
    const esMiTurnoRef = useRef(false);
    
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
        cargarProyectilesDesdeApi(estadoPartida.proyEnemigos, estadoPartida.proyPropios);
        setBarras(prev => ({
            ...prev,
            municion: estadoPartida.ammo,
            combustible: estadoPartida.fuel
        }));
        const turnoInicial = estadoPartida.matchInfo.currentTurnPlayer == estadoPartida.matchInfo.yourId;
        setEsMiTurno(turnoInicial);
        esMiTurnoRef.current = turnoInicial;

        // Definir handlers para los eventos del servidor
        const gameHandlers = {
            onVisionUpdate: (visionPayload) => {
                console.log("Nueva visión recibida:", visionPayload);
                // Actualizamos los barcos
                cargarBarcosDesdeApi(visionPayload.myFleet, visionPayload.visibleEnemyFleet);
                // Cargar los proyectiles
                cargarProyectilesDesdeApi(
                    visionPayload.proyEnemigos || [],
                    visionPayload.proyPropios || []
                );
                if (matchStateRef.current) {
                    matchStateRef.current = actualizarEstadoPartida(matchStateRef.current, {
                        playerFleet: visionPayload.myFleet,
                        enemyFleet: visionPayload.visibleEnemyFleet,
                        proyEnemigos: visionPayload.proyEnemigos,
                        proyPropios: visionPayload.proyPropios
                    });
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
                    matchStateRef.current = actualizarEstadoPartida(matchStateRef.current, { fuel: payload.fuelReserve });
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
                    matchStateRef.current = actualizarEstadoPartida(matchStateRef.current, { fuel: payload.fuelReserve });
                }
            },

            onTurnChanged: (payload) => {
                console.log("Turno cambiado:", payload);
                if (matchStateRef.current) {
                    const miId = matchStateRef.current.matchInfo.yourId;
                    const ahora = payload.nextPlayerId == miId;
                    setEsMiTurno(ahora);
                    esMiTurnoRef.current = ahora;
                    if (ahora) {
                        setBarras(prev => ({
                            ...prev,
                            municion: payload.resources.ammo,
                            combustible: payload.resources.fuel
                        }));
                    }

                    // Actualizar proyectiles que deben borrarse
                    let proyEnemigos = matchStateRef.current.proyEnemigos;
                    let proyPropios = matchStateRef.current.proyPropios;

                    if (proyectilesABorrar.length > 0) {
                        for (const id of proyectilesABorrar) {
                            quitarProyectil(id);
                            proyEnemigos = proyEnemigos.filter(p => p.id !== id);
                            proyPropios = proyPropios.filter(p => p.id !== id);
                        }
                        setProyectilesABorrar([]);
                    }

                    matchStateRef.current = actualizarEstadoPartida(matchStateRef.current, {
                        ammo: payload.resources.ammo,
                        fuel: payload.resources.fuel,
                        proyEnemigos,
                        proyPropios,
                        matchInfo: {
                            ...matchStateRef.current.matchInfo,
                            currentTurnPlayer: payload.nextPlayerId,
                            turnNumber: payload.turnNumber
                        }
                    });
                }
            },

            onShipAttacked: (payload) => {
                console.log("Ataque procesado por backend:", payload);
                if (matchStateRef.current) {
                    const miId = matchStateRef.current.matchInfo.yourId;
                    if (payload.attackerId == miId) {
                        setBarras(prev => ({ ...prev, municion: payload.ammoCurrent }));
                        matchStateRef.current = actualizarEstadoPartida(matchStateRef.current, { ammo: payload.ammoCurrent });
                        
                        //Mensajes al atacante:
                        if (payload.hit) {
                            notification.success(payload.targetHp == 0 ? "¡Barco hundido!" : `¡Barco impactado! Vida: ${payload.targetHp}`);
                        } else {
                            notification.warning("¡Agua! Disparo fallido.");
                        }
                    }else{
                        //Mensajes al atacado:
                        if (payload.hit) {
                            notification.info(payload.targetHp == 0 ? "Te han hundido un barco" : `Te han impactado un barco. Vida: ${payload.targetHp}`);
                        } 
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
            },

            onMatchPaused: (payload) => {
                console.log("Oponente ha solicitado pausar la partida:", payload);
                notification.warning(`El jugador ${payload.from} ha pausado la partida.`);
            },

            onProyectileHit: (payload) => {
                console.log("Ha dado un proyectil", payload);
                quitarProyectil(payload.proyectilColisionado);
                // Restamos la vida quitada
                actualizarVidaBarco(payload.shipId, payload.newHp);
                notification.success("¡Impacto de proyectil!");
                if (matchStateRef.current) {
                    const actualizarLista = (lista) => lista.map(b => {
                        if (b.id === payload.shipId) {
                            return { ...b, hp: payload.newHp };
                        }
                        return b;
                    });

                    matchStateRef.current = actualizarEstadoPartida(matchStateRef.current, {
                        playerFleet: actualizarLista(matchStateRef.current.playerFleet),
                        enemyFleet: actualizarLista(matchStateRef.current.enemyFleet)
                    });
                }
            
            },

            onProyectileUpdate: (payload) => {
                actualizarProyectil(payload);
                if (matchStateRef.current) {
                    if (payload.status == "ENDOFLIFE" || payload.status == "HIT") {
                        setProyectilesABorrar(prev => [...prev, payload.projectile]);
                    }
                    matchStateRef.current = actualizarProyectilEnEstado(matchStateRef.current, payload);
                }
            },

            onProyectileLaunch: (payload) => {
                console.log('Procesando lanzamiento:', payload);
                const miTurno = esMiTurnoRef.current;
                anadirProyectil(payload, miTurno);
                // Lo guardamos localmente
                if (matchStateRef.current) {
                    const miTurno = esMiTurnoRef.current;
                    if (miTurno) {
                        setBarras(prev => ({ ...prev, municion: payload.ammoCurrent }));
                    }
                    
                    matchStateRef.current = actualizarProyectilLanzadoEnEstado(matchStateRef.current, payload, miTurno);
                }
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
        const arma = ARMAS[armaSeleccionada];
        if (barras.municion < arma.coste) {
            notification.warning("No hay suficiente munición para atacar");
            return;
        }

        // Si es un torpedo, se lanza directamente sin seleccionar objetivo
        // ya que un torpedo siempre se lanza hacia donde esté apuntando el barco
        if (armaSeleccionada == TORPEDO) {
            // Como no ataa una celda en concreto, le pasamos (-1, -1)
            const exito = atacarCelda(idBarcoSeleccionado, -1, -1, TORPEDO);
            if (exito) {
                // No necesitamos entrar en modo ataque
                setModoAtaque(false);
            }
        } else {
            setModoAtaque(true);
        }
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
                        armaSeleccionada={armaSeleccionada}
                        proyectiles={proyectiles}
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
                            notifyWeaponChange={setArmaSeleccionada}
                            modoAtaque={modoAtaque}
                            combustible={barras.combustible}
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