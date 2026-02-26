import React from 'react';

function moveFoward(boatId) {
    // API: mover el barco hacia adelante
    console.log(`Barco ${boatId} se mueve hacia adelante`);
    // Mostrar Animaciones (Archivo Externo)
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

function labelToImage(label) {
    const mapping = {
        'Cañón': '/assets/cannon-icon.png',
        'Torpedo': '/assets/torpedo-icon.png',
        'Ametralladora': '/assets/machinegun-icon.png',
        'Mina': '/assets/mine-icon.png',
    };
    return mapping[label] || '/assets/default-attack-icon.png';
}

function ActionButtons({ boatId }) {
    const [buttonList, setButtonList] = React.useState([
        { id: 1, label: '' },
        { id: 2, label: '' },
        { id: 3, label: '' },
        { id: 4, label: '' },
    ]);
    const [action, setAction] = React.useState(buttonList[0]);

    let current_action = 0;

    // API: obtener la lista de acciones posibles

    return (
        <div className="action-buttons">

            <div className="attack-buttons">

                <div className="attack-button" >

                    <button className="change-left" 
                    onClick={
                        () => {
                            current_action = (current_action + buttonList.length - 1) % buttonList.length;
                            setAction(buttonList[current_action]);
                        }
                    }/>

                    <div className="attack-label" onClick={() => attack(boatId, action.id)}>{labelToImage(action.label)}</div>

                    <button className="change-right" 
                    onClick={
                        () => {
                            current_action = (current_action + 1) % buttonList.length;
                            setAction(buttonList[current_action]);
                        }
                    }/>

                </div>

                <button className="fire-button" onClick={() => attack(boatId, 2)}>
                    Fuego
                </button>

            </div>

            <div className="movement-buttons">

                <button onClick={() => moveFoward(boatId)}>Adelante</button>
                <button onClick={() => turnLeft(boatId)}>Girar Izquierda</button>
                <button onClick={() => turnRight(boatId)}>Girar Derecha</button>
                <img src="/assets/attack-icon.png" alt="" className="mov-icon" />

            </div>

        </div>
    )
}

export default ActionButtons;