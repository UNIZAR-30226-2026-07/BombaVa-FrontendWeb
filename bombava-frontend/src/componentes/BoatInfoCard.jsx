import React from "react";
import {useState} from "react";

function HealthBar({ maxHealth = 100, currentHealth = 0 }) {
    const healthPercentage = (maxHealth > 0) ? (currentHealth / maxHealth) * 100 : 0;
    const containerStyle = {
        position: 'relative',
        width: '100%',
        backgroundColor: 'black',
        borderRadius: '5px',
        height: '20px',
        overflow: 'hidden'
    };

    const fillStyle = {
        position: 'absolute',
        left: 0,
        top: 0,
        width: `${healthPercentage}%`,
        height: '100%',
        backgroundColor: 'red',
        borderRadius: '5px',
        transition: 'width 0.3s ease-in-out'
    };

    const textStyle = {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'white',
        margin: 0,
        fontSize: '12px',
        zIndex: 1,
        pointerEvents: 'none'
    };

    return (
        <div style={containerStyle}>
            <div style={fillStyle} />
            <p style={textStyle}>{currentHealth} / {maxHealth}</p>
        </div>
    );
} 


function ModuleInfo({ moduleName, moduleImg, moduleAlt, moduleMaxHealth, moduleHealth }) {
    return (
        <div className='module-info'>
            <h4>{moduleName}</h4>
            <div className='module-display'>
                <img src={moduleImg} alt={moduleAlt} className='module-image' />
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
                <p>Selecciona un barco para ver su estado</p>
            </div>
        )
    }

    const [boatdata, setBoatData] = useState();

    //Por Hacer: Cargar la informacion del barco a traves de la API.

    // Caso de barco seleccionado.
    return (
        <div className='boat-info-card'>
            <h2>{boatdata.boatName}</h2>
            <img src={boatdata.boatImg} alt='' className='boat-image' />
            <ol>
                {boatdata.modules.map((module => (
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
            </ol>
        </div>
    )
}

export default BoatInfoCard;