import React from "react";
import "../../styles/Barras.css";

import iconoBalas from "../../assets/barras_recursos/balas.png"; 
import iconoGasolina from "../../assets/barras_recursos/gasolina.png";

const BarraProgreso = ({ etiqueta, maxValor = 100, valorActual = 0, tipo }) => {
    const porcentaje = (valorActual / maxValor) * 100;

    // Determinar el icono según el tipo de barra (munición o combustible)
    let imagenSrc;
    if(tipo === "municion") {
        imagenSrc = iconoBalas;
    } else if(tipo === "combustible") {
        imagenSrc = iconoGasolina;
    }


    return (
        <div className="barra-wrapper">
            {/*Icono a la izquierda de la barra, dependiendo del tipo*/}
            <img src={imagenSrc} alt={tipo} className="barra-icono" />
            {/*Contenedor de la barra con el nombre y el relleno*/}
            <div className={`barra-container ${tipo}`}>
                {/*Nombre que se ve*/}
                <span className="barra-nombre">{etiqueta}</span>

                {/*Relleno de la barra*/}
                <div 
                    className="barra-contenido" 
                    style={{ width: `${porcentaje}%` }} 
                />
            </div>
            {/*Números de como de avanzada esta  la barra*/}
            <span className="barra-resumen">
                {valorActual} / {maxValor}
            </span>
        </div>
    );
};

export default BarraProgreso;