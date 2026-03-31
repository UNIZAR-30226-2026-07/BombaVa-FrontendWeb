import BarraProgreso from "../componentes/barras_recursos/Barras.jsx";
import { useState, useEffect, useRef } from 'react';
import Mapa from "../componentes/mapa/Mapa.jsx";
import BoatInfoCard from "../componentes/BoatInfoCard.jsx";
import MenuPausa from "../componentes/botones/MenuPausa.jsx";
import BtnPasarTurno from "../componentes/botones/BtnPasarTurno.jsx";
import ActionButtons from "../componentes/ActionButtons.jsx";
import { ATAQUE_BASE, TAMANO_TABLERO, TERRENO } from "../utils/constantes.js";
import { useMovimientosBarco } from "../componentes/barco/movimientosBarco.js";
import { socket, peticionPasarTurno } from '../utils/socket.js';
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
        atacarCelda,
        cargarBarcosDesdeApi,
        moverBarcoAdelante
    } = useMovimientosBarco([]);

    // Estado para saber si es mi turno o el del oponente
    const [esMiTurno, setEsMiTurno] = useState(false);
    
    // Varaible para guardar el estado de la partida
    const matchStateRef = useRef(null);

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
                 
            setEsMiTurno(payload.matchInfo.currentTurnPlayer == payload.matchInfo.yourId);
        };

        // Al llegar a Combate.jsx el estado de la partida está guardado en el local storage
        const estadoGuardado = localStorage.getItem('bombaVa_matchState');
        if (estadoGuardado) {
            const parsed = JSON.parse(estadoGuardado);

            // Guardamos el estado de la partida en la variable matchStateRef
            matchStateRef.current = parsed;

            // Actualizamos la información de la partida en el front-end
            handleStartInfo(parsed);
            
            // Conectarse a la sala de la partida
            const gameId = parsed.matchInfo.matchId;
            socket.emit('game:join', gameId);
            // Chequea si es mi turno
            setEsMiTurno(parsed.matchInfo.currentTurnPlayer == parsed.matchInfo.yourId);
        }else{
            console.log("No hay estado previo de la partida");
            navigate('/menuInicial');
        }

        // Escucha las actualizaciones de la partida
        const handleVisionUpdate = (visionPayload) => {
            console.log("Nueva visión recibida:", visionPayload);
            cargarBarcosDesdeApi(visionPayload.myFleet, visionPayload.visibleEnemyFleet);
            
            // Actualizamos matchStateRef y guardamos los cambios en LocalStorage
            if (matchStateRef.current) {
                matchStateRef.current.playerFleet = visionPayload.myFleet || matchStateRef.current.playerFleet;
                matchStateRef.current.enemyFleet = visionPayload.visibleEnemyFleet || matchStateRef.current.enemyFleet;
                localStorage.setItem('bombaVa_matchState', JSON.stringify(matchStateRef.current));
            }
        };

       // Escuchamos devoluciones del  movimiento hacia adelante
        const handleShipMoved = (payload) => {
            console.log("Movimiento confirmado por el back-end:", payload);

            if (matchStateRef.current) {
                const miId = matchStateRef.current.matchInfo.yourId;
                
                // He movido yo el barco o mi oponente
                const yoHeMovido = payload.userId == miId;
                
                if(yoHeMovido){
                    // Restar consumo en las barras
                    setBarras(prev => ({ ...prev, combustible: payload.fuelReserve }));
                }

                // Actualizamos el barco 
                moverBarcoAdelante(payload.shipId);

                // Actualizamos matchStateRef y guardamos los cambios en LocalStorage
                matchStateRef.current.fuel = payload.fuelReserve;
                localStorage.setItem('bombaVa_matchState', JSON.stringify(matchStateRef.current));
            }
        };

       // Escuchamos devoluciones de rotaciones autorizadas
        const handleShipRotated = (payload) => {
            console.log("Rotación confirmada por el back-end:", payload);
            
            if (matchStateRef.current) {
                const miId = matchStateRef.current.matchInfo.yourId;
                
                // He movido yo el barco o mi oponente
                const yoHeMovido = payload.userId == miId;
                
                if(yoHeMovido){
                    // Restar consumo en las barras
                    setBarras(prev => ({ ...prev, combustible: payload.fuelReserve }));
                }
                
                // Actualizamos el barco visualmente
                rotarBarco(payload.shipId, payload.orientation);
                
                // Actualizamos matchStateRef y guardamos los cambios en LocalStorage
                matchStateRef.current.fuel = payload.fuelReserve;
                localStorage.setItem('bombaVa_matchState', JSON.stringify(matchStateRef.current));
            }
        };

        const handleTurnChanged = (payload) => {
            console.log("Turno cambiado:", payload);
            
            if (matchStateRef.current) {
                const miId = matchStateRef.current.matchInfo.yourId;

                // Actualizamos si es mi turno
                setEsMiTurno(payload.nextPlayerId == miId);

                // He movido yo el barco o mi oponente
                const yoHeMovido = payload.nextPlayerId == miId;
                
                if(yoHeMovido){
                    // Actualizamos las barras de recursos
                    setBarras(prev => ({
                        ...prev,
                        municion: payload.resources.ammo,
                        combustible: payload.resources.fuel
                    }));
                }

                // Actualizamos matchStateRef y guardamos los cambios en LocalStorage
                matchStateRef.current.ammo = payload.resources.ammo;
                matchStateRef.current.fuel = payload.resources.fuel;
                matchStateRef.current.matchInfo.currentTurnPlayer = payload.nextPlayerId;
                matchStateRef.current.matchInfo.turnNumber = payload.turnNumber;
                
                localStorage.setItem('bombaVa_matchState', JSON.stringify(matchStateRef.current));
            }
        };

        const handleShipAttacked = (payload) => {
            console.log("Ataque procesado por backend:", payload);
            if (matchStateRef.current) {
                const miId = matchStateRef.current.matchInfo.yourId;
                
                // Si he sido yo el que ha disparado, actualizo mi munición mostrada
                if (payload.attackerId == miId) {
                    setBarras(prev => ({ ...prev, municion: payload.ammoCurrent }));
                    matchStateRef.current.ammo = payload.ammoCurrent;
                    localStorage.setItem('bombaVa_matchState', JSON.stringify(matchStateRef.current));
                }
                
                if (payload.hit) {
                    if (payload.targetHp == 0) {
                        alert("Barco alcanzado. Barco hundido.");
                    } else {
                        alert("Barco alcanzado. Vida restante: " + payload.targetHp);
                    }
                } else {
                    alert("Agua. El ataque falló.");
                }
            }
        };

        socket.on('match:startInfo', handleStartInfo);
        socket.on('match:vision_update', handleVisionUpdate);
        socket.on('match:turn_changed', handleTurnChanged);
        socket.on('ship:moved', handleShipMoved);
        socket.on('ship:rotated', handleShipRotated);
        socket.on('ship:attacked', handleShipAttacked);

        return () => {
            socket.off('match:startInfo', handleStartInfo);
            socket.off('match:vision_update', handleVisionUpdate);
            socket.off('match:turn_changed', handleTurnChanged);
            socket.off('ship:moved', handleShipMoved);
            socket.off('ship:rotated', handleShipRotated);
            socket.off('ship:attacked', handleShipAttacked);
        };
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
            alert("No hay suficiente munición para atacar");
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