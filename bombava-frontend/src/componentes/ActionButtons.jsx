import React from 'react';

function moveFoward(boatId) {
    // API: mover el barco hacia adelante
    console.log(`Barco ${boatId} se mueve hacia adelante`);
}

function turnLeft(boatId) {
    // API: girar el barco a la izquierda
    console.log(`Barco ${boatId} gira a la izquierda`);
    // Mostrar Animaciones (Archivo Externo)
}

function turnRight(boatId) {
    // API: girar el barco a la derecha
    console.log(`Barco ${boatId} gira a la derecha`);
    // Mostrar Animaciones (Archivo Externo)
}

function attack(boatId, actionId) {
    // API: ejecutar la acción de ataque correspondiente
    console.log(`Barco ${boatId} ejecuta acción de ataque ${actionId}`);
    // Mostrar Animaciones (Archivo Externo)
}

function ActionButtons({ boatId }) {
    const [buttonList, setButtonList] = React.useState([
        { id: 1, label: '' },
        { id: 2, label: '' },
        { id: 3, label: '' },
        { id: 4, label: '' },
    ]);

    // API: obtener la lista de acciones posibles

    return (
        <div className="action-buttons">

            <div className="attack-buttons">
                {buttonList.map(button => (
                    <button key={button.id} onClick={() => attack(boatId, button.label)}>
                        {button.label || `Acción ${button.id}`}
                    </button>
                ))}
            </div>

            <div className="movement-buttons">
                <button onClick={() => moveFoward(boatId)}>Adelante</button>
                <button onClick={() => turnLeft(boatId)}>Girar Izquierda</button>
                <button onClick={() => turnRight(boatId)}>Girar Derecha</button>
            </div>

        </div>
    )
}

export default ActionButtons;