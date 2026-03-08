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
            ...b, // Copia el resto de propiedades del barco sin cambios
            orientacion: nuevaOrientacion, // Nueva orientación
            posicion: { x: nuevoX, y: nuevoY }, //Nueva posicion
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
            ...b,// Copia el resto de propiedades del barco sin cambios
            posicion: { x: nuevaPosicionX, y: nuevaPosicionY }, //Nueva posicion
        };
    }
    ));
  };

  const anadirBarco = (nuevoBarco) => { /*Dentro de la funcion principal para poder editar la lista de barcos para añadirla*/ 
        // Como no puedo modificar la lista de barcos creo otra con todos los que hay más el nuevo
        setBarcos([...barcos, nuevoBarco]);
  }

  const setArmas = (barcoSeleccionado,arma) => { /*Dentro de la funcion principal para poder editar la lista de barcos para añadirla*/ 
    const encontrado = barcos.find(b => b.id === barcoSeleccionado);/*Barco seleccionado ya contiene la id del que está seleccionado*/ 
    if (encontrado) {
        //Hay que revisar que se pueda meter el arma en este barco
        let numArmas; //Pone en esta variable el max de armas de este arbol
    
        setBarcos(barcos.map(b => {

            // Buscamos el primer hueco libre (donde haya un 0)
            const indiceLibre = b.armas.indexOf(0);

            // Si hay hueco (el índice no es -1), añadimos el arma
            if (indiceLibre !== -1) {
                const nuevasArmas = [...b.armas]; 
                nuevasArmas[indiceLibre] = arma;  // Insertamos el arma
                
                return { ...b, armas: nuevasArmas };
            }

            return b; // Si está lleno, devolvemos el barco sin cambios
        }));
    } 
        
  }

  const borrarBarco = (barcoSeleccionado, setbarcosPuestos, barcosPuestos) => { /*Dentro de la funcion principal para poder editar la lista de barcos para añadirla*/ 
    // Creamos un nuevo array con todos los barcos CUYO id NO SEA el de barcoSeleccionado
    const nuevosBarcos = barcos.filter(b => b.id !== barcoSeleccionado);
    
    setBarcos(nuevosBarcos);

    // Si ya no está no lo estamos seleccionando
    setBarcoSeleccionado(null);
    const encontrado = barcos.find(b => b.id === barcoSeleccionado);
    const nuevosBarcosPuestos = [...barcosPuestos]; // Copia
    nuevosBarcosPuestos[encontrado.tamano] = 0; // Modifica la copia para que sepa que se puede poner otro de este tipo
    setbarcosPuestos(nuevosBarcosPuestos); // Actualiza el estado
    
    
  }

  // Comprueba si un barco ocupa una coordenada (x, y), 
  // teniendo en cuenta su posición, orientación y tamaño
    const ocupaCasilla = (barco, objetivoX, objetivoY) => {
        const esHorizontal = barco.orientacion === 'E' || barco.orientacion === 'O';
        
        if (esHorizontal) {
            // El barco se extiende en el eje X
            return objetivoY == barco.posicion.y && 
                   objetivoX >= barco.posicion.x && 
                   objetivoX < barco.posicion.x + barco.tamano;
        } else {
            // El barco se extiende en el eje Y
            return objetivoX == barco.posicion.x && 
                   objetivoY >= barco.posicion.y && 
                   objetivoY < barco.posicion.y + barco.tamano;
        }
    };

    // Función para atacar una celda con un barco atacante (identificado por su ID) 
    // a una coordenada (targetX, targetY) con un daño específico y un rango máximo.
    const atacarCelda = (atacanteId, targetX, targetY, dano, rangoMaximo) => {
        const atacante = barcos.find(b => b.id == atacanteId);
        if (!atacante) return { exito: false, mensaje: "Atacante no encontrado" };

        // Comprobamos el rango usando Distancia Manhattan (distancia en línea recta).
        const distancia = Math.abs(atacante.posicion.x - targetX) + Math.abs(atacante.posicion.y - targetY);
        if (distancia > rangoMaximo) {
            alert("Fuera de rango");
            return false;
        }

        let impacto = false;

        //Buscamos si algún barco enemigo ocupa esa casilla y le restamos la vida
        const nuevosBarcos = barcos.map(b => {
            if (b.id != atacanteId && ocupaCasilla(b, targetX, targetY)) {
                impacto = true;
                // Reducimos la vida del barco atacado, asegurándonos de que no sea negativa
                const nuevaVida = Math.max(0, b.vida - dano);
                
                if (nuevaVida === 0) {
                    alert(`Barco ${b.id} hundido`);
                } else {
                    alert(`Barco ${b.id} impactado, vida restante: ${nuevaVida}`);
                }

                return { ...b, vida: nuevaVida };
            }
            return b;
        });

        if (impacto) {
            setBarcos(nuevosBarcos);
        } else {
            alert("Ataque fallido, no hay barcos en esa posición");
        }

        return true; // El ataque se realizó, aunque haya impactado o no.
    };

  return {
    barcos,
    barcoSeleccionado,
    setBarcoSeleccionado,
    rotarBarco,
    moverBarco,
    anadirBarco,
    setArmas,
    borrarBarco,
    atacarCelda
  };
};
