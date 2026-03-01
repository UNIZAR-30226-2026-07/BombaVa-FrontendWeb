import React from "react";
import "../../styles/Barras.css";

import iconoBalas from "../../assets/barras_recursos/balas.png"; 
import iconoGasolina from "../../assets/barras_recursos/gasolina.png";

const BarraProgreso = ({ etiqueta, maxValor = 100, valorActual = 0, tipo }) => {
    const porcentaje = (valorActual / maxValor) * 100;

    let imagenSrc;
    if(tipo === "municion") {
        imagenSrc = iconoBalas;
    } else if(tipo === "combustible") {
        imagenSrc = iconoGasolina;
    }


    return (
        <div className="barra-wrapper">
            <img src={imagenSrc} alt={tipo} className="barra-icono" />
            <div className={`barra-container ${tipo}`}>
                {/*Nombre que se ve*/}
                <span className="barra-nombre">{etiqueta}</span>
                
                <div 
                    className="barra-contenido" 
                    style={{ width: `${porcentaje}%` }} 
                />
            </div>
            {/*Barra con los numeros*/}
            <span className="barra-resumen">
                {valorActual} / {maxValor}
            </span>
        </div>
    );
};

export default BarraProgreso;