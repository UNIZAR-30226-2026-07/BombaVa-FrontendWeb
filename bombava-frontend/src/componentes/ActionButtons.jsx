import React from 'react';
import '../styles/ActionButtons.css';
import { TAMANO_TABLERO } from '../utils/constantes.js';
import { peticionMoverse } from '../utils/socket.js';

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

function ActionButtons({ boat, onAttackClick, modoAtaque, rotarBarco }) {
    const boatId = boat?.id;

    const moveFoward = () => {
        if (!boat) return;
        //Chekear si no se sale del límite:
        if(boat.orientacion === 'N' && boat.posicion.y === 0) return;
        if(boat.orientacion === 'E' && boat.posicion.x === TAMANO_TABLERO - 1) return;
        if(boat.orientacion === 'S' && boat.posicion.y === TAMANO_TABLERO - 1) return;
        if(boat.orientacion === 'W' && boat.posicion.x === 0) return;

        // Recuperamos el ID de la partida actual
        const estadoPartida = localStorage.getItem('bombaVa_matchState');
        if (estadoPartida) {
            const matchId = JSON.parse(estadoPartida)?.matchInfo?.matchId;
            peticionMoverse(matchId, boat.id, boat.orientacion);
        }
    };

    const turnLeft = () => {
        if (!boat) return;
        const orden = ['N', 'E', 'S', 'W'];
        // Indice de la orientacion actual
        const idxActual = orden.indexOf(boat.orientacion);
        // Nueva orientacion girando a la izquierda
        const nuevaOrientacion = orden[(idxActual + 3) % 4];

        // API: girar el barco a la izquierda

        rotarBarco(boat.id, nuevaOrientacion);
        console.log(`Barco ${boat.id} gira a la izquierda`);
    };

    const turnRight = () => {
        if (!boat) return;

        // API: girar el barco a la derecha

        // Llamamos a la funcion rotarBarco, por defecto gira a la derecha
        rotarBarco(boat.id, null);
        console.log(`Barco ${boat.id} gira a la derecha`);
    };

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

                <button onClick={turnLeft} alt='Girar Izquierda' className='Izquierda'>↰</button>
                <div className="middle">
                    <button onClick={moveFoward} alt='Adelante' className='Adelante'>↥</button>
                    <img src="/public/topview.png" alt="" className="" />
                </div>
                <button onClick={turnRight} alt='Girar Derecha' className='Derecha'>↱</button>

            </div>

        </div>
    )
}

export default ActionButtons;