import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { peticionAbandonarPartida, peticionPausarPartida } from '../../utils/socket';
import { cargarEstadoPartida, eliminarEstadoPartida } from '../../services/gameApi';
import '../../styles/MenuPausa.css';
import { notification } from '../../services/notificationService';

function MenuPausa() {
    // Estado para controlar si el pop-up del menú de pausa está visible
    const [cuadroPausaVisible, setCuadroPausaVisible] = useState(false);

    const navigate = useNavigate();


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
            notification.info("Peticion de pausa enviada");
            cerrarMenu();
        }
        //Una vez ya he pedido al backend que le diga si quiere pausar la partida al otro jugador espero a que llegue
        //confirmación de ese jugador en handlePauseAccept para pausar o no hace nada
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
                </div>
                
            )}
        </>
    );
}

export default MenuPausa;