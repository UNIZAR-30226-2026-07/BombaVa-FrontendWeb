import { useState } from 'react';
import { COLORES_TERRENO, MODULOS_BARCO, TAMANO_TABLERO, TERRENO, BARCO1x1, BARCO1x3, BARCO1x5, SERVER_API, ESTADISTICAS_BARCOS } from '../../utils/constantes';
import axios from 'axios';
import { peticionAtacarCanon, traducirCoordY } from '../../utils/socket';
import { notification } from '../../services/notificationService';

// Función que calcula cual es la celda centrál del barco
/*Parametros:
* barco: barco del que se calculará la celda central
* Devuelve: un objeto con las coordenadas x e y de la celda central
*/
export const calcularCentroBarco = (barco) => {
    const esHorizontal = barco.orientacion == 'E' || barco.orientacion == 'W';
    const medioTamano = Math.floor(barco.tamano / 2);

    // Sabiendo hacia en qué sentido está el barco(horizontal o vertical) calculamos 
    // la celda central, si es horizontal la celda central será la que tenga el 
    // valor medio del tamaño del barco en el eje X, si es vertical la celda central 
    // será la que tenga el valor medio del tamaño del barco en el eje Y.
    const centroX = esHorizontal ? barco.posicion.x + medioTamano : barco.posicion.x;
    const centroY = esHorizontal ? barco.posicion.y : barco.posicion.y + medioTamano;

    return { centroX, centroY };
};

// Función que calcula las celdas que ocupa un barco
/*Parametros:
* barco: barco del que se calcularán las celdas
* Devuelve: un array de objetos con las coordenadas x e y de cada celda
*/
export const calcularCeldasBarco = (barco) => {
    const celdas = [];
    const esHorizontal = barco.orientacion == 'E' || barco.orientacion == 'W';
    for (let i = 0; i < barco.tamano; i++) {
        const ejeX = esHorizontal ? barco.posicion.x + i : barco.posicion.x;
        const ejeY = esHorizontal ? barco.posicion.y : barco.posicion.y + i;
        celdas.push({ x: ejeX, y: ejeY });
    }
    return celdas;
};

/*Parametros:
 * barcosIniciales: array con los barcos que se cargarán al principio
 * setModoAtaque: función para cambiar el estado de modo ataque
 */
export const useMovimientosBarco = (barcosIniciales, setModoAtaque) => {

    // Función para inicializar un barco con módulos
    const inicializarBarcoConModulos = (barcoBase) => {
        let modulos = [];
        let configuracionModulos = MODULOS_BARCO[barcoBase.tamano];
        // Recorremos la configuracion de modulos y creamos los modulos,
        // colocamos la vida de cada modulo en base a la configuracion, al
        // igual que su nombre y su id.

        // APAÑO DE LA VIDA POR MODULOS
        // Repartimos la vida del barco entre sus modulos
        let vidaPorModulo = Math.floor(barcoBase.vida / barcoBase.tamano);
        modulos = configuracionModulos.map(conf => ({
            id: conf.id,
            nombre: conf.nombre,
            vidaMax: conf.vidaMax,
            vida: vidaPorModulo,
            destruido: false
        }));

        const barco = {
            ...barcoBase,
            vida: barcoBase.vida,
            vidaMax: ESTADISTICAS_BARCOS[barcoBase.tamano].vidaMax,
            modulos,
        };
        barco.celdas = calcularCeldasBarco(barco);
        return barco;
    };

    // Función para actualizar la vida de un barco tras un ataque
    const actualizarVidaBarco = (id, nuevaVida) => {
        setBarcos(prevBarcos => prevBarcos.map(b => {
            if (b.id !== id) return b;
            return {
                ...b,
                vida: nuevaVida
            };
        }));
    };

    const barcosNormalizados = barcosIniciales.map(inicializarBarcoConModulos);
    const [barcos, setBarcos] = useState(barcosNormalizados);
    const [barcoSeleccionado, setBarcoSeleccionado] = useState(null);

    // Función para rotar el barco "id" al sentido "sentido", pudiendo ser uno
    // uno de estos valores: ['N', 'E', 'S', 'W']. En caso de no indicar un 
    // sentido iterara al siguiete sentido de orientación de la lista.
    // Para rotar seleccióna el pivote de rotación mediante la siguiente norma: 
    // Nº de casilla impar => casilla del centro como pivote
    // Nº de casilla par => la casilla de atrás de los dos del medio será el pivote.
    const rotarBarco = (id, sentido) => {
        setBarcos(prevBarcos => prevBarcos.map(b => {
            if (b.id !== id) return b;

            let nuevaOrientacion;
            if (sentido == null) {
                // Secuencia de rotación: N -> E -> S -> W
                const orden = ['N', 'E', 'S', 'W'];
                const idxActual = orden.indexOf(b.orientacion);
                nuevaOrientacion = orden[(idxActual + 1) % 4];
            } else {
                nuevaOrientacion = sentido;
            }

            // Pivote de la rotación: Impar => centro o Par => el de atrás de los dos del medio.
            const pivoteIdx = Math.floor(b.tamano / 2);

            const esHorizontal = b.orientacion === 'E' || b.orientacion === 'W';

            // Calculamos la celda que será el pivote de la rotación
            const pivoteX = esHorizontal ? b.posicion.x + pivoteIdx : b.posicion.x;
            const pivoteY = esHorizontal ? b.posicion.y : b.posicion.y + pivoteIdx;

            const nuevoEsHorizontal = !esHorizontal;//Es horizontal al rotarlo
            // Calculamos la nueva posición (x,y) para que el pivote se mantenga en su sitio
            const nuevoX = nuevoEsHorizontal ? pivoteX - pivoteIdx : pivoteX;
            const nuevoY = nuevoEsHorizontal ? pivoteY : pivoteY - pivoteIdx;
            console.log(`Rotación en sentido: ${nuevaOrientacion}`);

            // Comprobación de que no se sale del tablero
            if(nuevaOrientacion == 'N' || nuevaOrientacion == 'S'){
                if(nuevoY < 0 || nuevoY > TAMANO_TABLERO - b.tamano) return b;
            }else if(nuevaOrientacion == 'E' || nuevaOrientacion == 'W'){
                if(nuevoX < 0 || nuevoX > TAMANO_TABLERO - b.tamano) return b;
            }

            const nuevoBarco = {
                ...b, // Copia el resto de propiedades del barco sin cambios
                orientacion: nuevaOrientacion, // Nueva orientación
                posicion: { x: nuevoX, y: nuevoY }, //Nueva posicion
            };
            nuevoBarco.celdas = calcularCeldasBarco(nuevoBarco);
            return nuevoBarco;
        }));
    };

    // Función para avanzar 1 casilla
    /*Parametros:
    * id: id del barco a mover
    * Devuelve: el barco movido 1 casilla hacia adelante
    */
    const moverBarcoAdelante = (id) => {
        setBarcos(prevBarcos => prevBarcos.map(b => {
            if (b.id !== id) return b;
            
            let nuevaPosicionX = b.posicion.x;
            let nuevaPosicionY = b.posicion.y;
            if (b.orientacion === 'N') nuevaPosicionY -= 1;
            else if (b.orientacion === 'S') nuevaPosicionY += 1;
            else if (b.orientacion === 'E') nuevaPosicionX += 1;
            else if (b.orientacion === 'W') nuevaPosicionX -= 1;

            const nuevoBarco = { ...b, posicion: { x: nuevaPosicionX, y: nuevaPosicionY } };
            nuevoBarco.celdas = calcularCeldasBarco(nuevoBarco);
            return nuevoBarco;
        }));
    };

    // Función para transformar el centro que da la API a la coordenada origen que usa nuestro frontend
    // Coordenda API: centro del barco
    // Coordenda Frontend: proa del barco(extremo superior izquierdo)
    const adaptarCentroApi = (xCentro, yCentro, orientacion, tamano) => {
        const offset = Math.floor(tamano / 2);
        let x = xCentro;
        let y = yCentro;
        
        if (orientacion === 'N') y -= offset;
        else if (orientacion === 'S') y -= offset;
        else if (orientacion === 'E') x -= offset;
        else if (orientacion === 'W') x -= offset;

        return { x, y };
    };

    // Función para cargar los barcos desde la API
    // Recibe dos arrays, uno con los barcos del jugador y otro con los barcos enemigos
    // y los convierte a un formato que se pueda usar en el juego.
    const cargarBarcosDesdeApi = (playerFleet = [], enemyFleet = []) => {
        const barcosMapeados = [
            ...playerFleet.map(ship => {
                const tamano = ship.size || 3; // La API no envía size
                return {
                    id: ship.id,
                    posicion: adaptarCentroApi(ship.x, traducirCoordY(ship.y), ship.orientation, tamano),
                    orientacion: ship.orientation,
                    tamano: tamano, 
                    tipo: ship.type || 'destructor', // La API no envía type
                    vida: ship.currentHp, 
                    esEnemigo: false
                };
            }),
            ...enemyFleet.map(ship => {
                const tamano = ship.size || 3; // La API no envía size
                return {
                    id: ship.id,
                    posicion: adaptarCentroApi(ship.x, traducirCoordY(ship.y), ship.orientation, tamano),
                    orientacion: ship.orientation,
                    tamano: tamano, 
                    tipo: ship.type || 'destructor', // La API no envía type
                    vida: ship.currentHp,
                    esEnemigo: true
                };
            })
        ];
        
        const barcosJuego = barcosMapeados.map(inicializarBarcoConModulos);
        setBarcos(barcosJuego);
    };

    const anadirBarco = (nuevoBarco) => { /*Dentro de la funcion principal para poder editar la lista de barcos para añadirla*/
        const barcoConModulos = inicializarBarcoConModulos(nuevoBarco);
        // Como no puedo modificar la lista de barcos creo otra con todos los que hay más el nuevo
        setBarcos([...barcos, barcoConModulos]);
    }

    const borrarBarco = (barcoSeleccionado) => { /*Dentro de la funcion principal para poder editar la lista de barcos para añadirla*/
        // Creamos un nuevo array con todos los barcos CUYO id NO SEA el de barcoSeleccionado
        const nuevosBarcos = barcos.filter(b => b.id !== barcoSeleccionado);

        setBarcos(nuevosBarcos);
    }

    // Comprueba si un barco ocupa una coordenada (x, y), 
    // teniendo en cuenta su posición, orientación y tamaño
    const ocupaCasilla = (barco, objetivoX, objetivoY) => {
        const esHorizontal = barco.orientacion == 'E' || barco.orientacion == 'W';

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
    /*Parametros:
    * atacanteId: id del barco atacante
    * targetX: coordenada X de la celda objetivo
    * targetY: coordenada Y de la celda objetivo
    * dano: daño que se aplica al módulo impactado
    * rangoMaximo: rango máximo de ataque del barco atacante
    * Devuelve: true si el ataque es válido, false en caso contrario
    */
    const atacarCelda = (atacanteId, targetX, targetY, dano, rangoMaximo) => {
        const atacante = barcos.find(b => b.id == atacanteId);
        if (!atacante) return false;

        // Calculamos el centro del barco atacante para medir la distancia desde ahí
        const { centroX, centroY } = calcularCentroBarco(atacante);

        // Comprobamos el rango usando la distancia Manhattan (distancia en línea recta).
        const distancia = Math.abs(centroX - targetX) + Math.abs(centroY - targetY);

        if (distancia > rangoMaximo) {
            // Indicamos que ese ataque esta fuera del rango de ataque.
            notification.warning("Fuera de rango");
            // Salir de modo ataque:
            setModoAtaque(false);
            return false;
        }

        // Petición al backend para realizar el ataque
        const estadoPartida = localStorage.getItem('bombaVa_matchState');
        if (estadoPartida) {
            const matchId = JSON.parse(estadoPartida).matchInfo.matchId;
            peticionAtacarCanon(matchId, atacanteId, targetX, targetY);
        }

        return true; // El ataque se mandó al servidor.
    };

    //Funcion utilizada para saber si se puede colocar el barco en esta celda, se obtiene el tipo
    //de celda de mapa 
    const celdaEsValida = (x, y,barcos) =>{
        let tipoCelda; 
        let celdaValida = true;
        if(x >= 0 && x < TAMANO_TABLERO && y >= 0 && y < TAMANO_TABLERO){
            tipoCelda = mapa[y][x].tipoterreno;
            if(tipoCelda == TERRENO.AGUA){
                if(barcos.length > 0){
                    for (let barco of barcos) {
                        for(let i = 0; i< barco.tamano ; i++){
                            if(barco.celdas[i].x == x && barco.celdas[i].y == y){
                                celdaValida = false;
                            }
                        }
                    }
                }
                
            }else{
                celdaValida = false;
            }
        }else{
            celdaValida = false;
        }

        return celdaValida;
        
    }

    const equiparArma = async (barcoSeleccionado,arma) => {
        const barco = barcos.find(b => b.id === barcoSeleccionado);
        let numArmas = 0; //Para saber cuántas armas puede tener según el tamaño del barco
        switch (barco.tamano){
            case BARCO1x1: 
                numArmas = 1;
                break;
            case BARCO1x3: 
                numArmas = 2;
                break;
            case BARCO1x5: 
                numArmas = 3; 
                break;
        }
        if (barco.armas.length >= numArmas) {
            alert("Este barco ya no tiene más ranuras disponibles.");
            return;
        }
        const yaTieneEsaArma = barco.armas.some(a => a.slug === arma.slug);
        if (yaTieneEsaArma) {
            alert("Este barco ya tiene equipado un " + arma.name);
            return;
        }
        //hay que actualizar las armas del barco por si se utiliza en otro mazo
        const token = localStorage.getItem('token');//Cojo el token del buscador

        try {
            // Envío la nueva arma al barco en el backend
            await axios.patch(SERVER_API + '/api/inventory/ships/' + barcoSeleccionado + '/equip', { weaponSlug: arma.slug },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Actualizo mi vector de armas
            setBarcos(barcos.map(b => {
                if (b.id === barcoSeleccionado) {
                    return { 
                        ...b, 
                        armas: [...b.armas, arma] 
                    };
                }
                return b;
            }));

            alert(`${arma.name} equipado correctamente.`);

        } catch (err) {
            console.error(err);
            alert("Error de la API: " + (err.response?.data?.message || "No se pudo equipar"));
        }
    }
    //Quita las armas del barco que está seleccionado
    const limpiarArma = async (barcoSeleccionado,arma) => {
        const barco = barcos.find(b => b.id === barcoSeleccionado);
        const yaTieneEsaArma = barco.armas.some(a => a.slug === arma.slug);
        if (!yaTieneEsaArma) {
            alert("Este barco no tiene equipado un " + arma.name);
            return;
        }
        //hay que actualizar las armas del barco por si se utiliza en otro mazo
        const token = localStorage.getItem('token');//Cojo el token del buscador

        try {
            // Quito la nueva arma del barco en el backend
            await axios.delete(SERVER_API + '/api/inventory/ships/' + barcoSeleccionado + '/weapons/' + arma.slug,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Actualizo mi vector de armas
            setBarcos(barcos.map(b => {
                // Solo actuamos sobre el barco seleccionado
                if (b.id === barcoSeleccionado) {
                    // Quito con filter el arma que sobra del barco
                    const nuevasArmas = b.armas.filter(a => a.slug !== arma.slug);
                    return { ...b, armas: nuevasArmas };
                }
                // Los demás barcos se quedan igual
                return b;
            }));

            alert(`${arma.name} quitada correctamente.`);

        } catch (err) {
            console.error(err);
            alert("Error de la API: " + (err.response?.data?.message || "No se pudo quitar"));
        }
    }

    return {
        barcos,
        barcoSeleccionado,
        setBarcoSeleccionado,
        rotarBarco,
        anadirBarco,
        borrarBarco,
        atacarCelda,
        celdaEsValida,
        cargarBarcosDesdeApi,
        moverBarcoAdelante,
        equiparArma,
        limpiarArma,
        actualizarVidaBarco
    };
};
