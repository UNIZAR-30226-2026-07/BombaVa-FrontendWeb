import { TAMANO_TABLERO } from '../../utils/constantes.js';
import '../../styles/Proyectil.css';

import imgMina from '../../assets/proyectiles/mina.png';
import imgTorpedo from '../../assets/proyectiles/torpedo.png';

const IMAGENES_PROYECTILES = {
    "MINE": imgMina,
    "TORPEDO": imgTorpedo
};


const Proyectil = ({ proyectil}) => {
    // Calculamos la posición y dimensiones en porcentajes relativos al tablero
    // Ya que el tablero será responsive, el tamaño de la celda cambia, por lo que hay que calcularlo
    // en base al tamaño del tablero.
    const porcentajeCelda = 100 / TAMANO_TABLERO;
    const PosIzq = proyectil.x * porcentajeCelda;
    const PosArriba = proyectil.y * porcentajeCelda;
    
    // Nombre de la clase basado en el tipo y bando
    let nombreClase = 'proyectil-entidad';
    if (proyectil.esEnemigo) nombreClase += ' enemigo';
    else nombreClase += ' aliado';
    
    switch(proyectil.type){
        case "MINE":
            nombreClase += ' tipo-mina';
            break;
        case "TORPEDO":
            nombreClase += ' tipo-torpedo';
            break;
    }

    const imagenProyectil = IMAGENES_PROYECTILES[proyectil.type];

    return (
        <div
            className={nombreClase}
            style={{
                left: `${PosIzq}%`,
                top: `${PosArriba}%`,
                width: `${porcentajeCelda}%`,
                height: `${porcentajeCelda}%`,
            }}
        >
            {/*Divido la parte visual y la de la entidad de barco*/}
            <div className="proyectil-visual">
                <img 
                    src={imagenProyectil} 
                    alt={proyectil.type}
                    className={`proyectil-imagen ${proyectil.esEnemigo ? 'enemigo' : 'aliado'}`}
                />
            </div>
        </div>
    );
};

export default Proyectil;