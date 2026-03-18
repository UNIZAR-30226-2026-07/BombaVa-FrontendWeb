import React from 'react';
import '../styles/ActionButtons.css';

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

function ActionButtons({ boatId, onAttackClick, modoAtaque }) {
    const [buttonList, setButtonList] = React.useState([
        { id: 1, label: '' },
        { id: 2, label: '' },
        { id: 3, label: '' },
        { id: 4, label: '' },
    ]);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [action, setAction] = React.useState(buttonList[0]);

    React.useEffect(() => {
        if (!buttonList || buttonList.length === 0) {
            setAction({ id: null, label: '' });
            return;
        }
        setAction(buttonList[(currentIndex % buttonList.length)]);
    }, [currentIndex, buttonList]);

    // API: obtener la lista de acciones posibles

    return (
        <div className="action-buttons">

            <div className="attack-buttons">

                <div className="attack-display" >

                    <button type="button" aria-label="Anterior" className="change-left"
                        onClick={() => {
                            setCurrentIndex(i => (i + buttonList.length - 1) % buttonList.length);
                            console.log('Previous action');
                        }}>
                    </button>

                    <div className="attack-label" onClick={() => {
                        if (onAttackClick) onAttackClick();
                        attack(boatId, action.id);
                    }}>
                        <img src={labelToImage(action.label)} alt={action.label} className="attack-icon" />
                    </div>

                    <button type="button" aria-label="Siguiente" className="change-right"
                        onClick={() => {
                            setCurrentIndex(i => (i + 1) % buttonList.length);
                            console.log('Next action');
                        }}>
                    </button>

                </div>

                <button
                    className={`fire-button ${modoAtaque ? 'activo' : ''}`}
                    onClick={() => {
                        if (onAttackClick) onAttackClick();
                        attack(boatId, action.id);
                    }}
                >
                    {modoAtaque ? 'Fuego' : 'Modo Ataque'}
                </button>

            </div>

            <div className="movement-buttons">

                <button onClick={() => turnLeft(boatId)} alt='Girar Izquierda' className='Izquierda'>↰</button>
                <div className="middle">
                    <button onClick={() => moveFoward(boatId)} alt='Adelante' className='Adelante'>↥</button>
                    <img src="/public/topview.png" alt="" className="" />
                </div>
                <button onClick={() => turnRight(boatId)} alt='Girar Derecha' className='Derecha'>↱</button>

            </div>

        </div>
    )
}

export default ActionButtons;