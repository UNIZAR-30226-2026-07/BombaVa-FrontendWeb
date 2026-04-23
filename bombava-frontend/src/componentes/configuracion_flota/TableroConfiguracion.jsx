import React from 'react';
import Tablero from '../tablero/Tablero.jsx';
import Barco from '../barco/Barco.jsx';
import '../../styles/configuracion_flota/TableroConfiguracion.css';

/**
Panel donde se muestra el tablero y los barcos
    @param {Array} mapa - Array bidimensional que representa el mapa
    @param {function} gestionarClickMapa - Función para gestionar el click en el mapa
    @param {Array} barcos - Array de barcos
    @param {string} barcoSeleccionado - Id del barco seleccionado
    @param {function} gestionarClickBarco - Función para gestionar el click en un barco
    @param {function} enviarFlota - Función para enviar la flota al backend
**/
const TableroConfiguracion = ({ 
    mapa, 
    gestionarClickMapa, 
    barcos, 
    barcoSeleccionado, 
    gestionarClickBarco, 
    enviarFlota 
}) => {
    return (
        <div className="columna-izquierda">
            {/* Contenedor del tablero donde se muestra el mapa y los barcos*/}
            <div className={`tablero-contenedor ${barcoSeleccionado ? 'barco-seleccionado' : ''}`}>
                <Tablero 
                    mapa={mapa} 
                    onCellClick={gestionarClickMapa} 
                    configurar={true} 
                    celdasEnRango={new Set()} 
                />
                {barcos.map((barco) => (
                    <Barco 
                        key={barco.id} 
                        barco={barco} 
                        estaSeleccionado={barcoSeleccionado == barco.id}
                        onClick={() => gestionarClickBarco(barco.id)}
                    />
                ))}
            </div>

            {/* Botón para guardar la flota, conecta con el backend para guardar*/}
            <div className="controles-inferiores">
                <button 
                    className="confirmar-btn" 
                    onClick={(e) => { e.stopPropagation(); enviarFlota(); }}
                >
                    CONFIRMAR FLOTA
                </button>
            </div>
        </div>
    );
};

export default TableroConfiguracion;
