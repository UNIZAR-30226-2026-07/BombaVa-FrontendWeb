import { TAMANO_CELDA } from '../../utils/constantes.js';
import './Barco.css';

/* Estructura de 'barco':
> id: identificador, 
> posicion: 
    > x: posición eje X
    > y: posición eje Y 
> orientacion: Orientación del barco puede ser 'N','S','E','O', 
> tamano: Número de casilla que ocupa 
> tipo: Nombre del tipo de barco.
> vida: Vida del barco
*/
const Barco = ({ barco, estaSeleccionado, onClick }) => {
  
  // Calculamos la posición del barco
  const PosIzq = barco.posicion.x * TAMANO_CELDA;
  const PosArriba = barco.posicion.y * TAMANO_CELDA;

  const esHorizontal = barco.orientacion === 'E' || barco.orientacion === 'O';

  let ancho, alto;
  if(esHorizontal){
    ancho = TAMANO_CELDA * barco.tamano;
    alto = TAMANO_CELDA;
  }else{
    ancho = TAMANO_CELDA;
    alto = TAMANO_CELDA * barco.tamano;
  }

  const nombreClase = (estaSeleccionado)? `barco-entidad seleccionado` : `barco-entidad`;

  return (
    <div 
      className={nombreClase}
      style={{
        left: `${PosIzq}px`,
        top: `${PosArriba}px`,
        width: `${ancho}px`,
        height: `${alto}px`,
      }}
    >
      {/*Divido la parte visual y la de la entidad de barco, 
        Para introducir la imagen del barco sería aquí*/ }
      <div className="barco-visual"
        onClick={() => {onClick();}}
      ></div>
    </div>
  );
};

export default Barco;