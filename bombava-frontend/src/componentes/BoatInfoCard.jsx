import React, { useState, useEffect } from "react";
import "../styles/BoatInfoCard.css";
import { ARMAS } from "../utils/constantes";

function HealthBar({ maxHealth = 100, currentHealth = 0 }) {
    const healthPercentage = (maxHealth > 0) ? (currentHealth / maxHealth) * 100 : 0;

    return (
        <div className="health-bar-container">
            <div className="health-bar-fill" style={{ width: `${healthPercentage}%` }} />
            <p className="health-bar-text">{currentHealth} / {maxHealth}</p>
        </div>
    );
}

// Función para obtener la información del arma por ID
const obtenerInfoArma = (idArma) => {
    return ARMAS[idArma] || null;
};

function BoatInfoCard({ boat }) {

    // En caso de que no haya un barco seleccionado
    if (!boat) {
        return (
            <div className='boat-info-card'>
                <div className='info-card-content'>
                    <p>Selecciona un barco para ver su estado</p>
                </div>
            </div>
        )
    }

    // Debug: verificar estructura del barco
    console.log("Barco recibido en BoatInfoCard:", boat);

    // Datos del barco seleccionado
    const boatData = {
        boatName: `Barco ${boat.tipo}`,
        boatImg: "https://www.pngmart.com/files/23/Navy-Boat-PNG.png",
        boatMaxHealth: boat.vidaMax,
        boatHealth: boat.vida,
        boatSight: boat.rangoVision
    };

    // Obtener información de las armas (que son IDs en el barco)
    const armasEquipadas = boat.armas && boat.armas.length > 0
        ? boat.armas.map(idArma => obtenerInfoArma(idArma)).filter(arma => arma !== null)
        : [];

    // Caso de barco seleccionado.
    return (
        <div className='boat-info-card'>
            <div className='info-card-content'>
                <h2>{boatData.boatName}</h2>
                <img src={boatData.boatImg} alt='' className='boat-image' />
                <HealthBar maxHealth={boatData.boatMaxHealth} currentHealth={boatData.boatHealth} />
                
                {/* Rango de visión */}
                <div className="boat-stat">
                    <p><strong>Rango de Visión:</strong> {boatData.boatSight}</p>
                </div>

                {/* Armas equipadas */}
                <div className="boat-weapons">
                    <p><strong>Armas Equipadas:</strong></p>
                    {armasEquipadas.length > 0 ? (
                        <ul className="weapons-list">
                            {armasEquipadas.map((arma, index) => (
                                <li key={index} className="weapon-item">
                                    <span className="weapon-name">{arma.nombre}</span>
                                    <span className="weapon-range">
                                        Rango: {arma.rango}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-weapons">Sin armas equipadas</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BoatInfoCard;

export { HealthBar};