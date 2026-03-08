/*
    Fichero con las constantes generales del proyecto.
*/

export const TAMANO_TABLERO = 15;
export const TAMANO_CELDA = 40;

export const TERRENO = {
  AGUA: 'agua',     // Agua profunda
  ISLA: 'isla',   // Isla 
  AGUA_NO_PROFUNDA: 'agua_no_profunda',
  NO_VISION: 'zona_sin_vision' 
};

// Configuración visual temporal, mientras no haya imagenes para islas, ...
export const COLORES_TERRENO = {
  [TERRENO.AGUA]: '#1e88e5',    
  [TERRENO.ISLA]: '#aed581',
  [TERRENO.AGUA_NO_PROFUNDA]: '#a6cff3',
  [TERRENO.NO_VISION]: '#6c8092'
, 
};

export const BARCO1x1 = 1;
export const BARCO1x3 = 3;
export const BARCO1x5 = 5;

export const Metralleta = 1;
export const Misiles = 2;
export const Torpedos = 3;

// Configuración de ataque base
export const ATAQUE_BASE = {
  COSTE: 2,
  DANO: 10,
  RANGO: 4
};