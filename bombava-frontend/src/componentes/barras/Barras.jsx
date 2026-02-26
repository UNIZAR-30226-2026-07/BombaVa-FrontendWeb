import React from "react";
import "../../styles/Barras.css";

const BarraProgreso = ({ etiqueta, maxValor = 100, valorActual = 0, tipo }) => {
    const porcentaje = (valorActual / maxValor) * 100;

    return (
        <div className="barra-wrapper">
            <div className={`barra-container ${tipo}`}>
                <span className="barra-nombre">{etiqueta}</span>
                
                <div 
                    className="barra-contenido" 
                    style={{ width: `${porcentaje}%` }} 
                />
                
                <span className="barra-resumen">
                    {valorActual} / {maxValor}
                </span>
            </div>
        </div>
    );
};

export default BarraProgreso;