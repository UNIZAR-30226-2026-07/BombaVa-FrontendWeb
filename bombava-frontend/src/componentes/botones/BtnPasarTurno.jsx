import React from 'react';
import '../../styles/BtnPasarTurno.css'; 

function BtnPasarTurno({ onPasarTurno }) {
    return (
        <div className="pasar-turno-contenedor">
            <button className="btn-pasar-turno" onClick={onPasarTurno}>
                Pasar Turno
            </button>
        </div>
    );
}

export default BtnPasarTurno;
