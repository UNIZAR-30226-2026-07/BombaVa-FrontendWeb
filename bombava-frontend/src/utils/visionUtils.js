import { TAMANO_TABLERO } from './constantes';

/**
 * Calcula las celdas que están en un rango de distancia Manhattan desde un punto.
 * 
 * @param {number} celdaX - Coordenada X de la celda
 * @param {number} celdaY - Coordenada Y de la celda
 * @param {number} rango - Radio de visión
 * @returns {Set<string>} - Conjunto de strings "x,y" con las celdas en rango
 */
export const calcularCeldasEnRangoManhattan = (celdaX, celdaY, rango) => {
  const celdas = new Set();
  
  for (let x = celdaX - rango; x <= celdaX + rango; x++) {
    for (let y = celdaY - rango; y <= celdaY + rango; y++) {
      // Comprobamos límites del tablero
      if (x >= 0 && x < TAMANO_TABLERO && y >= 0 && y < TAMANO_TABLERO) {
        const distancia = Math.abs(celdaX - x) + Math.abs(celdaY - y);
        if (distancia <= rango) {
          celdas.add(`${x},${y}`);
        }
      }
    }
  }
  
  return celdas;
};

/**
 * Calcula las celdas visibles para una flota de barcos.
 * La visión es desde todas las celdas de cada barco.
 * 
 * @param {Array} barcos - Lista de barcos
 * @returns {Set<string>} - Conjunto de todas las celdas visibles("x,y")
 */
export const calcularCeldasVisiblesFlota = (barcos) => {
  const todasCeldasVisibles = new Set();
  
  for (const barco of barcos) {
    // Solo calculamos la visión de los barcos aliados
    if (barco.esEnemigo) continue;

    // Obtenemos las celdas que ya vienen en el objeto del barco
    const celdasOcupadas = barco.celdas;
    const rangoActual = barco.rangoVision;
    
    // Para cada celda que ocupa el barco, calculamos su visión
    for (const celdaOcupada of celdasOcupadas) {
      const celdasVisiblesDesdeCelda = calcularCeldasEnRangoManhattan(celdaOcupada.x, celdaOcupada.y, rangoActual);
      
      // Añadimos las celdas visibles al conjunto
      for (const celda of celdasVisiblesDesdeCelda) {
        todasCeldasVisibles.add(celda);
      }
    }
  }
  
  return todasCeldasVisibles;
};

