import React from 'react';
import '../../styles/configuracion_flota/SelectorBarcos.css';
import { BARCO1x1, BARCO1x3, BARCO1x5, ESTADISTICAS_BARCOS } from '../../utils/constantes';

/**
Panel de seleccion de barcos para colocar en el tablero
    @param {string} barcoSeleccionado - Id del barco seleccionado
    @param {string} barcoAPoner - Id del barco a colocar
    @param {function} setBarcoAPoner - Función para establecer el barco a colocar
    @param {Array} barcos - Array de barcos
**/
const SelectorBarcos = ({ barcoSeleccionado, barcoAPoner, setBarcoAPoner, barcos }) => {
    
    // Función para crear los botones de los barcos
    const crearBoton = (id) => {
        // Se obtiene la información del barco
        const info = ESTADISTICAS_BARCOS[id];
        // Se comprueba si el barco esta puesto
        const estaPuesto = barcos.some(b => b.tamano == id);
        // Se comprueba si el barco esta seleccionado
        const esActivo = barcoAPoner == id;
        
        // Se devuelve un botón con la información del barco
        return (
            <button 
                key={id}
                className={`btn-seleccionar-barco ${esActivo ? 'activo' : ''} ${estaPuesto ? 'puesto' : ''}`} 
                // Se deshabilita el botón si el barco ya esta puesto
                disabled={estaPuesto}
                onClick={(e) => { e.stopPropagation(); setBarcoAPoner(id); }}
            >
                <img src={info.imagen} alt={info.nombre} />
                <span>{info.nombre} ({info.tamano})</span>
            </button>
        );
    };

    // Se crea un array con los botones de todos los tipos de barcos que hay
    const botonesBarcos = [
        crearBoton(BARCO1x1),
        crearBoton(BARCO1x3),
        crearBoton(BARCO1x5)
    ];

    return (
        <div className="columna-izquierda-flota">
            {/* Cuadro de Estadísticas */}
            <div className="caja-estadisticas">
                <h1>ESTADÍSTICAS</h1>
                {/* Muestra la informacion del barco seleccionado o del barco a poner*/}
                {
                /* La diferencia entre el barco seleccionado y el barco a poner es que con el primero
                    no mostramos cuantas armas tiene equipado(aún no tiene ninguna, al no haberlo 
                    colocado en el mapa) pero con el segundo si que lo mostramos.  
                    
                    Además si el barco esta seleccionado indicamos como se puede colocar el barco en 
                    el mapa*/
                }
                {barcoSeleccionado || barcoAPoner ? (
                    <div className="estadisticas-contenido">
                        {barcoSeleccionado ? (
                            barcos.filter(b => b.id == barcoSeleccionado).map(b => (
                                <div key={b.id}>
                                    <p><strong>Tipo:</strong> {b.tipo}</p>
                                    <p><strong>Vida:</strong> {b.vida} HP</p>
                                    <p><strong>Tamaño:</strong> {b.tamano} celdas</p>
                                    <p><strong>Rango:</strong> {ESTADISTICAS_BARCOS[b.tamano].rangoVision}</p>
                                    <p><strong>Armas:</strong> {b.armas.filter(a => a.name).length} / {ESTADISTICAS_BARCOS[b.tamano].armasMax}</p>
                                </div>
                            ))
                        ) : (
                            <div>
                                <p><strong>Tipo:</strong> {ESTADISTICAS_BARCOS[barcoAPoner].nombre}</p>
                                <p><strong>Vida:</strong> {ESTADISTICAS_BARCOS[barcoAPoner].vidaMax} HP</p>
                                <p><strong>Tamaño:</strong> {barcoAPoner} celdas</p>
                                <p><strong>Rango:</strong> {ESTADISTICAS_BARCOS[barcoAPoner].rangoVision}</p>
                                <p><strong>Armas:</strong> {ESTADISTICAS_BARCOS[barcoAPoner].armasMax}</p>
                                <p className="consejo">Haz click en el mapa para colocarlo</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="no-selection">Selecciona un barco para ver sus datos</p>
                )}
            </div>

            {/* Colección de Barcos a seleccionar */}
            <div className="columna-selector-barcos">
                <h1>COLECCIÓN DE BARCOS</h1>
                <div className="barra-selector">
                    <div className="botones-barco-config">
                        {/* Por cada tipo de barco se crea un botón*/}
                        {botonesBarcos}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectorBarcos;
