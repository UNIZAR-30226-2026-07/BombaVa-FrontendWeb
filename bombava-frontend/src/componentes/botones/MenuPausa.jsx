import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { peticionAbandonarPartida, peticionPausarPartida } from '../../utils/socket';
import { cargarEstadoPartida, eliminarEstadoPartida } from '../../services/gameApi';
import '../../styles/MenuPausa.css';
import { socket } from '../../utils/socket';
import { notification } from '../../services/notificationService';

function MenuPausa() {
    // Estado para controlar si el pop-up del menú de pausa está visible
    const [cuadroPausaVisible, setCuadroPausaVisible] = useState(false);

    const navigate = useNavigate();

    // Enseña el cuadro para decidir si aceptar la solictud de pausa o no
    const [cuadroDecidirSiPausarVisible, setCuadroDecidirSiPausarVisible] = useState(false);


    // Configurar los listeners del socket al llegar a la pantalla
    useEffect(() => {

        //Recibe la señal de que han pedido pausar con el nombre del usuario que la ha aceptado
        const handlePauseRequested = (payload) => {
            notification.info(payload.from + "ha pedido pausar.");
            setCuadroDecidirSiPausarVisible(true);
        };

        // Se ha pausado la partida, o yo he aceptado o el otro ha aceptado pausar
        const handleMatchPaused = (payload) => {
            notification.info(payload.message);
            navigate('/menuInicial');
        };

        // Si rechaza el otro pausar la partida
        const handlePauseReject = (payload) => {
            notification.info(payload.message);
            cerrarMenu();
        };

        // Escuchamos los siguientes eventos:
        socket.on('match:pause_requested', handlePauseRequested);
        socket.on('match:paused', handleMatchPaused);
        socket.on('match:pause_rejected', handlePauseReject);

        // Cerramos los listeners al salir de la pantalla
        return () => {
            socket.off('match:pause_requested', handlePauseRequested);
            socket.off('match:paused', handleMatchPaused);
            socket.off('match:pause_rejected', handlePauseReject);
        };
    }, []);

    // Función para abrir el menú
    const abrirMenu = () => {
        setCuadroPausaVisible(true);
    };

    // Función para cerrar el menú 
    const cerrarMenu = () => {
        setCuadroPausaVisible(false);
    };

    // Función para abandonar la partida
    const AbandonarPartida = () => {
        const estado = cargarEstadoPartida();
        if (estado) {
            const matchId = estado.matchInfo.matchId;
            // Notificamos al backend de la rendición
            peticionAbandonarPartida(matchId);

            // Eliminamos el estado de la partida
            eliminarEstadoPartida();
        }
        navigate('/menuInicial');
    };

    // Función para guardar el estado de la partida y seguir luego
    const IntentarGuardarYSeguirLuego = () => {
        const estado = cargarEstadoPartida();
        if (estado) {
            const matchId = estado.matchInfo.matchId;
            peticionPausarPartida(matchId);
        }
        //Una vez ya he pedido al backend que le diga si quiere pausar la partida al otro jugador espero a que llegue
        //confirmación de ese jugador en handlePauseAccept para pausar o no hace nada
    };

    const aceptarPausa = () =>{
        const estado = cargarEstadoPartida();
        if (estado) {
            const matchId = estado.matchInfo.matchId;
            socket.emit('match:pause_accept',matchId);
            setCuadroDecidirSiPausarVisible(false);
        }
        
    };

    const rechazarPausa = () =>{
        const estado = cargarEstadoPartida();
        if (estado) {
            const matchId = estado.matchInfo.matchId;
            socket.emit('match:pause_reject',matchId);
            setCuadroDecidirSiPausarVisible(false);
        }
    };

    return (
        <>
            {/*Botón de Pausa en la esquina superior derecha */}
            <div className="pausa-contenedor">
                <button className="btn-pausa" onClick={abrirMenu}>
                    {/* Icono de pausa*/}
                    <span >||</span>
                </button>
            </div>

            {/*El menu de pausa. Solo se muestra si cuadroPausaVisible es true */}
            {cuadroPausaVisible && (
                // Fondo oscuro (si haces click puedes cerrar el menu)
                <div className="menu-pausa-fondo" onClick={cerrarMenu}>
                    {/* El menu de diálogo (stopPropagation evita que se cierre el menu al clicar en un botón) */}
                    <div className="menu-pausa" onClick={(e) => e.stopPropagation()}>
                        <h2>¿Qué quiere hacer capitán?</h2>

                        <div className="menu-botones">
                            <button className="btn-menu btn-continuar" onClick={cerrarMenu}>
                                Continuar la partida
                            </button>

                            <button className="btn-menu btn-guardar" onClick={IntentarGuardarYSeguirLuego}>
                                Pausar la partida
                            </button>

                            <button className="btn-menu btn-abandonar" onClick={AbandonarPartida}>
                                Abandonar la partida
                            </button>
                        </div>
                    </div>
                    {/* CUADRO PARA EL JUGADOR QUE RECIBE LA PETICIÓN */}
                    {cuadroDecidirSiPausarVisible && (
                        <div className="menu-pausa-fondo">
                            <div className="menu-pausa">
                                <h2>El oponente quiere pausar la partida</h2>
                                <p>¿Aceptas guardar el estado actual y salir?</p>
                                <div className="menu-botones">
                                    <button className="btn-menu btn-continuar" onClick={aceptarPausa}>
                                        Aceptar y Salir
                                    </button>
                                    <button className="btn-menu btn-abandonar" onClick={rechazarPausa}>
                                        Rechazar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
            )}
        </>
    );
}

export default MenuPausa;