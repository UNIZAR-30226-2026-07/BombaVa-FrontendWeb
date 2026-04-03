import React from 'react';
import '../styles/ActionButtons.css';
import { TAMANO_TABLERO, COSTES, CANON, TORPEDO, MINA, METRALLETA, ARMAS } from '../utils/constantes.js';
import { peticionMoverse, peticionRotar } from '../utils/socket.js';
import { notification } from '../services/notificationService.js';
import imgCanon from "../assets/armas/canon.png";
import imgTorpedo from "../assets/armas/torpedoLanzador.png";
import imgMina from "../assets/armas/mina.png";

function attack(boatId, actionId) {
    // API: ejecutar la acción de ataque correspondiente
    console.log(`Barco ${boatId} ejecuta acción de ataque ${actionId}`);
    // Mostrar Animaciones (Archivo Externo)
}

function labelToImage(label) {
    const mapping = {
        'Cañón': imgCanon,
        'Torpedo': imgTorpedo,
        'Ametralladora': '../assets/armas/ametralladora.png',
        'Mina': imgMina
    };
    return mapping[label] || '/assets/default-attack-icon.png';
}

function ActionButtons({ boat, onAttackClick, notifyWeaponChange, modoAtaque, combustible }) {
    const boatId = boat?.id;

    const moveFoward = () => {
        if (!boat) return;

        // Comprobación de combustible
        if (combustible < COSTES.MOVIMIENTO) {
            notification.warning("No tienes suficiente combustible para moverte");
            return;
        }

        //Chekear si no se sale del límite:
        if(boat.orientacion === 'N' && boat.posicion.y === 0) return;
        if(boat.orientacion === 'E' && boat.posicion.x === TAMANO_TABLERO - 1) return;
        if(boat.orientacion === 'S' && boat.posicion.y === TAMANO_TABLERO - 1) return;
        if(boat.orientacion === 'W' && boat.posicion.x === 0) return;

        // Recuperamos el ID de la partida actual
        const estadoPartida = localStorage.getItem('bombaVa_matchState');
        if (estadoPartida) {
            const matchId = JSON.parse(estadoPartida).matchInfo.matchId;
            peticionMoverse(matchId, boat.id, boat.orientacion);
        }
    };

    const turnLeft = () => {
        if (!boat) return;

        // Comprobación de combustible
        if (combustible < COSTES.ROTACION) {
            notification.warning("No tienes suficiente combustible para girar");
            return;
        }
        
        // Recuperamos el ID de la partida actual
        const estadoPartida = localStorage.getItem('bombaVa_matchState');
        if (estadoPartida) {
            const matchId = JSON.parse(estadoPartida).matchInfo.matchId;
            // -90 Grados es girar a la izquierda
            peticionRotar(matchId, boat.id, -90);
        }
    };

    const turnRight = () => {
        if (!boat) return;

        // Comprobación de combustible
        if (combustible < COSTES.ROTACION) {
            notification.warning("No tienes suficiente combustible para girar");
            return;
        }

        // Recuperamos el ID de la partida actual
        const estadoPartida = localStorage.getItem('bombaVa_matchState');
        if (estadoPartida) {
            const matchId = JSON.parse(estadoPartida).matchInfo.matchId;
            // 90 Grados es girar a la derecha
            peticionRotar(matchId, boat.id, 90);
        }
    };

    const [buttonList, setButtonList] = React.useState([]);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [action, setAction] = React.useState({ id: CANON, label: 'Cañón' });

    // Cuando cambia el barco seleccionado, actualizamos la lista de armas 
    // y reseteamos el índice a 0.
    React.useEffect(() => {
        if (!boat || boat.armas.length == 0) {
            // Si el barco no tiene armas o no hay barco seleccionado, 
            // dejamos el cañón por defecto
            setButtonList([{ id: CANON, label: 'Cañón' }]);
            setCurrentIndex(0);
            return;
        }

        const armasBarco = [];
        for (let i = 0; i < boat.armas.length; i++) {
            const idArma = boat.armas[i];
            armasBarco.push({ id: idArma, label: ARMAS[idArma].nombre });
        }

        setButtonList(armasBarco);
        setCurrentIndex(0);
    }, [boat]);

    React.useEffect(() => {
        if (!buttonList || buttonList.length === 0) {
            // Si el barco no tiene armas, dejamos el cañón por defecto
            setAction({ id: CANON, label: 'Cañón' });
            return;
        }
        const selectedWeapon = buttonList[(currentIndex % buttonList.length)];
        setAction(selectedWeapon);
        // Notificar a la pantalla de combate del cambio de arma
        notifyWeaponChange(selectedWeapon.id);
        
    }, [currentIndex, buttonList, notifyWeaponChange]);

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
                    {modoAtaque ? 'Selecciona objetivo' : 'Disparar'}
                </button>

            </div>

            <div className="movement-buttons">

                <button onClick={turnLeft} alt='Girar Izquierda' className='Izquierda'>↰</button>
                <div className="middle">
                    <button onClick={moveFoward} alt='Adelante' className='Adelante'>↥</button>
                    <img src="/topview.png" alt="" className="" />
                </div>
                <button onClick={turnRight} alt='Girar Derecha' className='Derecha'>↱</button>

            </div>

        </div>
    )
}

export default ActionButtons;