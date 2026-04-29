/*
    Fichero con las constantes generales del proyecto.
*/
//export const SERVER_API = 'https://bombava-backend-vbgv.onrender.com';
export const SERVER_API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export const TAMANO_TABLERO = 15;
export const TAMANO_CELDA = 40;

export const TERRENO = {
  AGUA: 'agua',
  ISLA: 'isla',
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
export const BARCO1x2 = 2;
export const BARCO1x3 = 3;
export const BARCO1x4 = 4;
export const BARCO1x5 = 5;

export const CANON = 1;
export const TORPEDO = 2;
export const MINA = 3;
export const METRALLETA = 4;

// Configuración de armas
export const ARMAS = {
  [CANON]: 
  { id: CANON, 
    nombre: 'Cañón', 
    rango: 4, 
    dano: 10, 
    coste: 2 
  },
  [TORPEDO]: 
  { id: TORPEDO, 
    nombre: 'Torpedo', 
    rango: 6, 
    dano: 20, 
    coste: 6 
  },
  [MINA]: 
  { id: MINA, 
    nombre: 'Mina', 
    rango: 1, 
    dano: 25, 
    coste: 2 
  },
  [METRALLETA]: 
  { id: METRALLETA, 
    nombre: 'Ametralladora', 
    rango: 1, 
    dano: 1, 
    coste: 1 
  },
};

// Configuración de recursos
export const COSTES = {
  MOVIMIENTO: 1,
  ROTACION: 2,
};

// Configuración de ataque base
export const ATAQUE_BASE = {
  COSTE: 2,
  DANO: 50,
  RANGO: 4
};

// Configuración de los módulos según tamaño del barco
export const MODULOS_BARCO = {
  [BARCO1x1]: [
    { id: 0, nombre: "Núcleo", vidaMax: 20 }
  ],
  [BARCO1x2]: [
    { id: 0, nombre: "-", vidaMax: 0 },
    { id: 1, nombre: "-", vidaMax: 0 },
  ],
  [BARCO1x3]: [
    { id: 0, nombre: "Sistema de Armas", vidaMax: 10 },
    { id: 1, nombre: "Puente de Mando", vidaMax: 10 },
    { id: 2, nombre: "Motor", vidaMax: 10 }
  ],
  [BARCO1x4]: [
    { id: 0, nombre: "-", vidaMax: 0 },
    { id: 1, nombre: "-", vidaMax: 0 },
    { id: 2, nombre: "-", vidaMax: 0 },
    { id: 3, nombre: "-", vidaMax: 0 },
  ],
  [BARCO1x5]: [
    { id: 0, nombre: "Sistema de Armas", vidaMax: 10 },
    { id: 1, nombre: "Casco", vidaMax: 10 },
    { id: 2, nombre: "Puente de Mando", vidaMax: 10 },
    { id: 3, nombre: "Casco", vidaMax: 10 },
    { id: 4, nombre: "Motor", vidaMax: 10 }
  ]
};

// Estadísticas de los barcos
export const ESTADISTICAS_BARCOS = {
  [BARCO1x1]: {
    vidaMax: 20,
    nombre: "Lancha"
  },
  [BARCO1x3]: {
    vidaMax: 30,
    nombre: "Fragata"
  },
  [BARCO1x5]: {
    vidaMax: 50,
    nombre: "Portaaviones"
  }
};

// Armas del servidor al frontend
export const TIPOS_ARMAS_API = {
    'CANNON': { id: CANON, nombre: "Cañón" },
    'MINE': { id: MINA, nombre: "Mina" },
    'TORPEDO': { id: TORPEDO, nombre: "Torpedo" },
    'MACHINEGUN': { id: METRALLETA, nombre: "Ametralladora" }
};