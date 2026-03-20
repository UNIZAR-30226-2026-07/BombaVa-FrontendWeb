import { TAMANO_TABLERO } from '../../utils/constantes.js';
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

  const esHorizontal = barco.orientacion === 'E' || barco.orientacion === 'O';

  // Calculamos la posición y dimensiones en porcentajes relativos al tablero
  // Ya que el tablero será responsive, el tamaño de la celda cambia, por lo que hay que calcularlo
  // en base al tamaño del tablero.
  const porcentajeCelda = 100 / TAMANO_TABLERO;
  const PosIzq = barco.posicion.x * porcentajeCelda;
  const PosArriba = barco.posicion.y * porcentajeCelda;

  let ancho, alto;
  if (esHorizontal) {
    ancho = porcentajeCelda * barco.tamano;
    alto = porcentajeCelda;
  } else {
    ancho = porcentajeCelda;
    alto = porcentajeCelda * barco.tamano;
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
        left: `${PosIzq}%`,
        top: `${PosArriba}%`,
        width: `${ancho}%`,
        height: `${alto}%`,
      }}
    >
      {/*Divido la parte visual y la de la entidad de barco, 
        Para introducir la imagen del barco sería aquí*/ }
      <div className="barco-visual"
        onClick={(e) => {
          // Calculamos la celda exacta en la que se hizo click

          // Obtenemos la posición del barco en pixeles, respecto al contenedor del tablero
          const rect = e.target.getBoundingClientRect();
          // Posición del click respecto a la esquina superior izquierda del barco
          const clickXEnPixeles = e.clientX - rect.left;
          const clickYEnPixeles = e.clientY - rect.top;

          // Calculamos el tamaño en pixeles que ocupa una sola celda visualmente ahora mismo
          // Como es responsive, el tamaño de la celda cambia, por lo que hay que calcularlo
          const tamanoCeldaPxWidth = rect.width / (esHorizontal ? barco.tamano : 1);
          const tamanoCeldaPxHeight = rect.height / (esHorizontal ? 1 : barco.tamano);

          // Dado el tamaño en pixeles de una celda y la posición en pixeles del click, 
          // calculamos el numero de celdas respecto a la posición superior izquierda del barco.
          const movimientoCeldasX = Math.floor(clickXEnPixeles / tamanoCeldaPxWidth);
          const movimientoCeldasY = Math.floor(clickYEnPixeles / tamanoCeldaPxHeight);

          // Calculamos la celda clicada sumando el offset(número de celdas) a la
          // posición del barco(la posición de la primera celda del barco).
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