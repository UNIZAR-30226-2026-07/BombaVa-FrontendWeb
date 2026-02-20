/*
    Fichero con las constantes generales del proyecto.
*/

export const TAMANO_TABLERO = 15;
export const TAMANO_CELDA = 40;

export const TERRENO = {
  AGUA: 'agua',     // Agua profunda
  ISLA: 'isla',   // Isla 
  AGUA_NO_PROFUNDA: 'agua_no_profunda' 
};

// Configuración visual temporal, mientras no haya imagenes para islas, ...
export const COLORES_TERRENO = {
  [TERRENO.AGUA]: '#1e88e5',    
  [TERRENO.ISLA]: '#aed581',
  [TERRENO.AGUA_NO_PROFUNDA]: '#a6cff3'
, 
};