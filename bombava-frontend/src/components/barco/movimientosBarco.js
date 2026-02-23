import { useState } from 'react';

export const useMovimientosBarco = (barcosIniciales) => {

    const [barcos, setBarcos] = useState(barcosIniciales);
    const [barcoSeleccionado, setBarcoSeleccionado] = useState(null);

    // Función para rotar el barco "id" al sentido "sentido", pudiendo ser uno
    // uno de estos valores: ['N', 'E', 'S', 'O']. En caso de no indicar un 
    // sentido iterara al siguiete sentido de orientación de la lista.
    // Para rotar seleccióna el pivote de rotación mediante la siguiente norma: 
    // Nº de casilla impar => casilla del centro como pivote
    // Nº de casilla par => la casilla de atrás de los dos del medio será el pivote.
    const rotarBarco = (id, sentido) => {
    setBarcos(barcos.map(b => {
        if (b.id !== id) return b;

        let nuevaOrientacion;
        if(sentido == null){
             // Secuencia de rotación: N -> E -> S -> O
            const orden = ['N', 'E', 'S', 'O'];
            const idxActual = orden.indexOf(b.orientacion);
            nuevaOrientacion = orden[(idxActual + 1) % 4];
        }else{
            nuevaOrientacion= sentido;
        }

        // Pivote de la rotación: Impar => centro o Par => el de atrás de los dos del medio.
        const pivoteIdx = Math.floor(b.tamano / 2);
        
        const esHorizontal = b.orientacion === 'E' || b.orientacion === 'O';

        // Calculamos la celda que será el pivote de la rotación
        const pivoteX = esHorizontal ? b.posicion.x + pivoteIdx : b.posicion.x;
        const pivoteY = esHorizontal ? b.posicion.y : b.posicion.y + pivoteIdx;

        const nuevoEsHorizontal = !esHorizontal;//Es horizontal al rotarlo
        // Calculamos la nueva posición (x,y) para que el pivote se mantenga en su sitio
        const nuevoX = nuevoEsHorizontal ? pivoteX - pivoteIdx : pivoteX;
        const nuevoY = nuevoEsHorizontal ? pivoteY : pivoteY - pivoteIdx;
        console.log(`Rotación en sentido: ${nuevaOrientacion}`);

        return {
            id: b.id,
            orientacion: nuevaOrientacion, // Nueva orientación
            tamano: b.tamano,
            tipo: b.tipo,
            vida: b.vida,
            posicion: { x: nuevoX, y: nuevoY } //Nueva posicion
        };
        }));
  };

  // Función para mover el barco "id" a la posición X e Y.
  // Solo esta diseñada para hacer movimientos en línea recta
  const moverBarco = (id, nuevoX, nuevoY) => {
    setBarcos(barcos.map(b => {
        if (b.id != id) return b;
        
        let nuevaPosicionX = nuevoX;
        let nuevaPosicionY = nuevoY;

        if (b.orientacion == 'E' || b.orientacion == 'O') {
            if (b.orientacion == 'E') {
                if (nuevoX > b.posicion.x) nuevaPosicionX = nuevoX - b.tamano + 1; //Avanza
                else nuevaPosicionX = nuevoX; 
            } 
            else if (b.orientacion == 'O') {
                if (nuevoX < b.posicion.x) nuevaPosicionX = nuevoX; //Avanza
                else nuevaPosicionX = nuevoX - b.tamano + 1;//Retrocede
            }
        }

        else if (b.orientacion == 'N' || b.orientacion == 'S') {
            if (b.orientacion == 'S') {
                if (nuevoY > b.posicion.y) nuevaPosicionY = nuevoY - b.tamano + 1; //Avanza
                else nuevaPosicionY = nuevoY;//Retrocede
            } 
            else if (b.orientacion == 'N') {
                if (nuevoY < b.posicion.y) nuevaPosicionY = nuevoY;//Avanza
                else nuevaPosicionY = nuevoY - b.tamano + 1;//Retrocede
            }
        }

        return {
            id: b.id,
            orientacion: b.orientacion,
            tamano: b.tamano,
            tipo: b.tipo,
            vida: b.vida,
            posicion: { x: nuevaPosicionX, y: nuevaPosicionY } //Nueva posicion
        };
    }
    ));
  };

  return {
    barcos,
    barcoSeleccionado,
    setBarcoSeleccionado,
    rotarBarco,
    moverBarco
  };
};
