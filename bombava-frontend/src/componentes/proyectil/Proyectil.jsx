import { TAMANO_TABLERO } from '../../utils/constantes.js';
import '../../styles/Proyectil.css';

import imgMina from '../../assets/proyectiles/mina.png';
import imgTorpedo from '../../assets/proyectiles/torpedo.png';

const IMAGENES_PROYECTILES = {
    0: imgMina,
    1: imgTorpedo
};


const Proyectil = ({ proyectil}) => {
    // Calculamos la posición y dimensiones en porcentajes relativos al tablero
      // Ya que el tablero será responsive, el tamaño de la celda cambia, por lo que hay que calcularlo
      // en base al tamaño del tablero.
      const porcentajeCelda = 100 / TAMANO_TABLERO;
      const PosIzq = proyectil.x * porcentajeCelda;
      const PosArriba = proyectil.y * porcentajeCelda;
    
      //Nombre de la clase basado en el estado y tipo del barco
      let nombreClase = 'proyectil-entidad';
      if (estaSeleccionado) nombreClase += ' seleccionado';
      if (proyectil.esEnemigo) nombreClase += ' enemigo';
      else nombreClase += ' aliado';

      let tipoProyectil = -1;
      switch(proyectil.type){
        case "MINE":
          tipoProyectil=0;
          break
        case "TORPEDO":
          tipoProyectil=1;
          break
      }

      return (
        <div
          className={nombreClase}
          style={{
            left: `${PosIzq}%`,
            top: `${PosArriba}%`,
          }}
        >
          {/*Divido la parte visual y la de la entidad de barco*/}
          <div 
            className="proyectil-visual"
          >
            
            <img 
              src={IMAGENES_PROYECTILES[tipoProyectil]} 
              className={`proyectil-imagen ${barco.orientacion} ${proyectil.esEnemigo ? 'enemigo' : 'aliado'}`}
            />
    
          </div>
        </div>
    );
    
};

export default Proyectil;