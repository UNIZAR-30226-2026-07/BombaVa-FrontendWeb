import React from 'react';
import '../styles/ContadorTurnos.css';

/**
 * Componente que muestra el número de turno actual en la pantalla de combate.
 * 
 * @param {number} turno - El número de turno actual.
 */
function ContadorTurnos({ turno }) {
    return (
        <div className="contador-turnos-contenedor">
            <div className="contador-turnos-turno">
                Turno: {turno}
            </div>
        </div>
    );
}

export default ContadorTurnos;
