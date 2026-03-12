import React, { useState } from 'react';
import '../../styles/MenuPausa.css';

function MenuPausa() {
    // Estado para controlar si el pop-up del menú de pausa está visible
    const [cuadroPausaVisible, setCuadroPausaVisible] = useState(false);

    // Función para abrir el menú
    const abrirMenu = () => {
        setCuadroPausaVisible(true);
    };

    // Función para cerrar el menú 
    const cerrarMenu = () => {
        setCuadroPausaVisible(false);
    };

    // Función para abandonar la partida (Redirige al menú principal)
    const AbandonarPartida = () => {
        // AÑADIR -> Implementar lógica con el backend para abandonar la partida
        window.location.href = '/'; // Redirige al menú principal 
    };

    // Función para guardar el estado de la partida y seguir luego
    const GuardarYSeguirLuego = () => {
        console.log("Guardando estado de la partida para continuar después.");
        // AÑADIR -> Implementar lógica de guardado con el backend
        window.location.href = '/'; // Redirige al menú principal después de guardar
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
                        <h2>Partida Pausada</h2>

                        <div className="menu-botones">
                            <button className="btn-menu btn-continuar" onClick={cerrarMenu}>
                                Continuar la partida
                            </button>

                            <button className="btn-menu btn-guardar" onClick={GuardarYSeguirLuego}>
                                Seguir en otro momento
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