import { TAMANO_CELDA } from '../../utils/constantes.js';
import '../../styles/Barco.css';

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
  if (esHorizontal) {
    ancho = TAMANO_CELDA * barco.tamano;
    alto = TAMANO_CELDA;
  } else {
    ancho = TAMANO_CELDA;
    alto = TAMANO_CELDA * barco.tamano;
  }

  //Nombre de la clase basado en el estado y tipo del barco
  let nombreClase = 'barco-entidad';
  if (estaSeleccionado) nombreClase += ' seleccionado';
  if (barco.esEnemigo) nombreClase += ' enemigo';
  else nombreClase += ' aliado';

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
        onClick={(e) => {
          e.stopPropagation();
          // Calculamos la celda exacta en la que se hizo click

          // Obtenemos la posición exacta del clic dentro de la pantalla
          // e.target es el elemento HTML y getBoundingClientRect() devuelve 
          // información sobre su posición en el navegador, es decir, dónde 
          // empieza el barco en la pantalla, sus márgenes left y top
          const rect = e.target.getBoundingClientRect();
          const clickXEnPixeles = e.clientX - rect.left;
          const clickYEnPixeles = e.clientY - rect.top;

          // Calculamos el offset de las celdas respecto a la posición celda de
          // arriba a la izquierda.
          const movimientoCeldasX = Math.floor(clickXEnPixeles / TAMANO_CELDA);
          const movimientoCeldasY = Math.floor(clickYEnPixeles / TAMANO_CELDA);

          // Calculamos la celda clicada sumando el offset a la
          // posición del barco.
          const celdaClicadaX = barco.posicion.x + movimientoCeldasX;
          const celdaClicadaY = barco.posicion.y + movimientoCeldasY;

          // Llamamos a la función onClick que nos llega por parametro con la
          // celda clicada.
          onClick(celdaClicadaX, celdaClicadaY);
        }}
        style={{/*Color de fondo diferente para barcos enemigos y aliados*/
          backgroundColor: barco.esEnemigo ? 'rgba(253, 2, 2, 1)' : 'rgb(12, 26, 54)',
        }}
      ></div>
    </div>
  );
};

export default Barco;