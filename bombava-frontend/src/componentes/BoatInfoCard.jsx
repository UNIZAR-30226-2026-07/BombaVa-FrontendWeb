import React, { useState, useEffect } from "react";
import "../styles/BoatInfoCard.css";

function HealthBar({ maxHealth = 100, currentHealth = 0 }) {
    const healthPercentage = (maxHealth > 0) ? (currentHealth / maxHealth) * 100 : 0;

    return (
        <div className="health-bar-container">
            <div className="health-bar-fill" style={{width: `${healthPercentage}%`}} />
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

function BoatInfoCard({ boatId }) {

    // En caso de que no haya un barco seleccionado
    if (!boatId) {
        return( 
            <div className='boat-info-card'>
                <div className='info-card-content'>
                    <p>Selecciona un barco para ver su estado</p>
                </div>
            </div>
        )
    }

    const [boatData, setBoatData] = useState(null);

    useEffect(() => {
        // Demo: inicializa datos del barco una sola vez o cuando cambie `boatId`.
        // En producción aquí se haría la llamada a la API para obtener los datos.
        if (!boatId) {
            setBoatData(null);
            return;
        }

        const demoData = {
            boatName: "Barco de Prueba",
            boatImg: "https://www.pngmart.com/files/23/Navy-Boat-PNG.png",
            boatMaxHealth: 100,
            boatHealth: 75,
            modules: [
                {
                    moduleId: 1,
                    moduleName: "Motor Principal",
                    moduleImg: "https://www.pngmart.com/files/23/Navy-Boat-PNG.png",
                    moduleAlt: "Imagen del Motor Principal",
                    moduleMaxHealth: 50,
                    moduleHealth: 25
                },
                {
                    moduleId: 2,
                    moduleName: "Timón",
                    moduleImg: "https://www.pngmart.com/files/23/Navy-Boat-PNG.png",
                    moduleAlt: "Imagen del Timón",
                    moduleMaxHealth: 30,
                    moduleHealth: 30
                },
                {
                    moduleId: 3,
                    moduleName: "Velas",
                    moduleImg: "https://www.pngmart.com/files/23/Navy-Boat-PNG.png",
                    moduleAlt: "Imagen de las Velas",
                    moduleMaxHealth: 20,
                    moduleHealth: 10
                }
            ]
        };

        setBoatData(demoData);
    }, [boatId]);

    //Por Hacer: Cargar la informacion del barco a traves de la API.

    if(boatData === null) {
        return( 
            <div className='boat-info-card'>
                <div className='info-card-content'>
                    <p>Cargando información del barco...</p>
                </div>
            </div>
        )
    }
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