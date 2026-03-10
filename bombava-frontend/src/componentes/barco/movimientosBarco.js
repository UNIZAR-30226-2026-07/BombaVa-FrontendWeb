import { useState } from 'react';
import { MODULOS_BARCO } from '../../utils/constantes';

export const useMovimientosBarco = (barcosIniciales) => {

    // Función para inicializar un barco con módulos
    const inicializarBarcoConModulos = (barcoBase) => {
        let modulos = [];
        let configuracionModulos = MODULOS_BARCO[barcoBase.tamano];
        // Recorremos la configuracion de modulos y creamos los modulos,
        // colocamos la vida de cada modulo en base a la configuracion, al
        // igual que su nombre y su id.
        modulos = configuracionModulos.map(conf => ({
            id: conf.id,
            nombre: conf.nombre,
            vidaMax: conf.vidaMax,
            vida: conf.vidaMax,
            destruido: false
        }));

        // Calculamos la vida total del barco sumando la vida de todos sus módulos
        let vidaTotal = 0;
        for (let i = 0; i < modulos.length; i++) {
            vidaTotal += modulos[i].vida;
        }
        return {
            ...barcoBase,
            vida: vidaTotal,
            vidaMax: vidaTotal,
            modulos,
        };
    };

    const barcosNormalizados = barcosIniciales.map(inicializarBarcoConModulos);
    const [barcos, setBarcos] = useState(barcosNormalizados);
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
            if (sentido == null) {
                // Secuencia de rotación: N -> E -> S -> O
                const orden = ['N', 'E', 'S', 'O'];
                const idxActual = orden.indexOf(b.orientacion);
                nuevaOrientacion = orden[(idxActual + 1) % 4];
            } else {
                nuevaOrientacion = sentido;
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
        const barcoConModulos = inicializarBarcoConModulos(nuevoBarco);
        // Como no puedo modificar la lista de barcos creo otra con todos los que hay más el nuevo
        setBarcos([...barcos, barcoConModulos]);
    }

    const setArmas = (barcoSeleccionado, arma) => { /*Dentro de la funcion principal para poder editar la lista de barcos para añadirla*/
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
        const esHorizontal = barco.orientacion == 'E' || barco.orientacion == 'O';

        if (esHorizontal) {
            // El barco se extiende en el eje X
            if (objetivoY == barco.posicion.y && objetivoX >= barco.posicion.x && objetivoX < barco.posicion.x + barco.tamano) {
                return { ocupada: true, indiceModulo: Math.abs(objetivoX - barco.posicion.x) };
            }
        } else {
            // El barco se extiende en el eje Y
            if (objetivoX == barco.posicion.x && objetivoY >= barco.posicion.y && objetivoY < barco.posicion.y + barco.tamano) {
                return { ocupada: true, indiceModulo: Math.abs(objetivoY - barco.posicion.y) };
            }
        }
        return { ocupada: false, indiceModulo: -1 };
    };

    // Función para atacar una celda con un barco atacante
    // a una coordenada (targetX, targetY) con un daño específico y 
    // un rango máximo.
    const atacarCelda = (atacanteId, targetX, targetY, dano, rangoMaximo) => {
        const atacante = barcos.find(b => b.id == atacanteId);
        if (!atacante) return false;

        // Calculamos el centro del barco atacante para medir la distancia desde ahí
        const esHorizontal = atacante.orientacion == 'E' || atacante.orientacion == 'O';
        const medioTamano = Math.floor(atacante.tamano / 2);

        const centroX = esHorizontal ? atacante.posicion.x + medioTamano : atacante.posicion.x;
        const centroY = esHorizontal ? atacante.posicion.y : atacante.posicion.y + medioTamano;

        // Comprobamos el rango usando la distancia Manhattan (distancia en línea recta).
        const distancia = Math.abs(centroX - targetX) + Math.abs(centroY - targetY);

        if (distancia > rangoMaximo) {
            // Indicamos que ese ataque esta fuera del rango de ataque.
            alert("Fuera de rango");
            return false;
        }

        let impacto = false;

        //Buscamos si algún barco enemigo ocupa esa casilla y le restamos la vida
        const nuevosBarcos = barcos.map(b => {
            if (b.id != atacanteId) {
                const infoCasilla = ocupaCasilla(b, targetX, targetY);
                if (infoCasilla.ocupada) {
                    impacto = true;

                    // Modificamos el módulo específico impactado
                    const nuevosModulos = [...b.modulos];
                    const moduloImpactado = nuevosModulos[infoCasilla.indiceModulo];

                    if (moduloImpactado.destruido) {
                        alert(`El módulo del Barco ${b.id} ya estaba destruido.`);
                    } else {
                        const nuevaVidaModulo = Math.max(0, moduloImpactado.vida - dano);
                        moduloImpactado.vida = nuevaVidaModulo;
                        if (nuevaVidaModulo == 0) {
                            moduloImpactado.destruido = true;
                            alert(`Un módulo del Barco ${b.id} ha sido destruido`);
                        } else {
                            alert(`Módulo del barco ${b.id} ha sido impactado, vida restante: ${nuevaVidaModulo}`);
                        }
                    }

                    // Calculamos la vida total sumando la vida de cada módulo con un bucle for
                    let vidaTotal = 0;
                    for (let i = 0; i < nuevosModulos.length; i++) {
                        vidaTotal += nuevosModulos[i].vida;
                    }

                    if (vidaTotal == 0) {
                        // Si ya no tiene vida, lo marcamos como destruido
                        b.destruido = true;
                        alert(`Barco ${b.id} hundido`);
                    }

                    return { ...b, modulos: nuevosModulos, vida: vidaTotal };
                }
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
