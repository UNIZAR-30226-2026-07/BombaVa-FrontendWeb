/*
    Fichero con las constantes generales del proyecto.
*/
export const SERVER_API = 'http://localhost:3000'

export const TAMANO_TABLERO = 15;
export const TAMANO_CELDA = 40;

export const TERRENO = {
  AGUA: 'agua',     // Agua profunda
  ISLA: 'isla',   // Isla 
  AGUA_NO_PROFUNDA: 'agua_no_profunda',
  NO_VISION: 'zona_sin_vision',
  NO_VISION_ENEMIGO: 'zona_sin_vision enemigo'
};

// Configuración visual temporal, mientras no haya imagenes para islas, ...
export const COLORES_TERRENO = {
  [TERRENO.AGUA]: '#1e88e5',
  [TERRENO.ISLA]: '#aed581',
  [TERRENO.AGUA_NO_PROFUNDA]: '#a6cff3',
  [TERRENO.NO_VISION]: '#748390',
  [TERRENO.NO_VISION_ENEMIGO]: '#f5b5a3'
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
  DANO: 50,
  RANGO: 8
};

// Configuración de los módulos según tamaño del barco
export const MODULOS_BARCO = {
  [BARCO1x1]: [
    { id: 0, nombre: "Núcleo", vidaMax: 100 }
  ],
  [BARCO1x3]: [
    { id: 0, nombre: "Sistema de Armas", vidaMax: 80 },
    { id: 1, nombre: "Puente de Mando", vidaMax: 100 },
    { id: 2, nombre: "Motor", vidaMax: 80 }
  ],
  [BARCO1x5]: [
    { id: 0, nombre: "Sistema de Armas", vidaMax: 80 },
    { id: 1, nombre: "Casco", vidaMax: 120 },
    { id: 2, nombre: "Puente de Mando", vidaMax: 150 },
    { id: 3, nombre: "Casco", vidaMax: 120 },
    { id: 4, nombre: "Motor", vidaMax: 80 }
  ]
};

export const NOMBRES_ARMAS = {
  [Metralleta]: "Cañón", 
  [Misiles]: "Mina",       
  [Torpedos]: "Torpedo"      
};