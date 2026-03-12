import React, { useState, useEffect } from "react";
import "../styles/BoatInfoCard.css";

function HealthBar({ maxHealth = 100, currentHealth = 0 }) {
    const healthPercentage = (maxHealth > 0) ? (currentHealth / maxHealth) * 100 : 0;

    return (
        <div className="health-bar-container">
            <div className="health-bar-fill" style={{ width: `${healthPercentage}%` }} />
            <p className="health-bar-text">{currentHealth} / {maxHealth}</p>
        </div>
    );
}

function ModuleInfo({ moduleName, moduleImg, moduleAlt, moduleMaxHealth, moduleHealth }) {
    return (
        <div className='module-info'>
            <h4>{moduleName}</h4>
            <div className='module-display'>
                <img src={moduleImg} alt={moduleAlt} />
                <HealthBar maxHealth={moduleMaxHealth} currentHealth={moduleHealth} />
            </div>
        </div>
    )
}

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

    let modulosArray = [];
    if (boat.modulos) {
        modulosArray = boat.modulos.map((mod) => ({
            moduleId: mod.id,
            moduleName: mod.nombre,
            moduleImg: "https://www.pngmart.com/files/23/Navy-Boat-PNG.png",
            moduleAlt: `Imagen del módulo ${mod.nombre}`,
            moduleMaxHealth: mod.vidaMax,
            moduleHealth: mod.vida
        }));
    }

    // Datos del barco seleccionado
    const boatData = {
        boatName: `Barco ${boat.tipo} (${boat.id})`,
        boatImg: "https://www.pngmart.com/files/23/Navy-Boat-PNG.png",
        boatMaxHealth: boat.vidaMax,
        boatHealth: boat.vida,
        modules: modulosArray
    };
    // Caso de barco seleccionado.
    return (
        <div className='boat-info-card'>
            <div className='info-card-content'>
                <h2>{boatData.boatName}</h2>
                <img src={boatData.boatImg} alt='' className='boat-image' />
                <HealthBar maxHealth={boatData.boatMaxHealth} currentHealth={boatData.boatHealth} />
                <ul>
                    {boatData.modules.map((module => (
                        <li key={module.moduleId}>
                            <ModuleInfo
                                moduleName={module.moduleName}
                                moduleImg={module.moduleImg}
                                moduleAlt={module.moduleAlt}
                                moduleMaxHealth={module.moduleMaxHealth}
                                moduleHealth={module.moduleHealth}
                            />
                        </li>
                    )))}
                </ul>
            </div>
        </div>
    )
}

export default BoatInfoCard;

export { HealthBar, ModuleInfo };