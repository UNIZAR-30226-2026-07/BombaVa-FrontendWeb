import React from 'react';
import '../../styles/configuracion_flota/PanelArmas.css';
import { ESTADISTICAS_BARCOS } from '../../utils/constantes';

/** 
Panel de armas para equipar armas a los barcos
    @param {string} barcoSeleccionado - Id del barco seleccionado
    @param {Array} barcos - Array de barcos
    @param {Array} inventarioArmas - Array de armas disponibles
    @param {function} anadirArma - Función para añadir un arma a un barco
    @param {function} borrarArmaBarco - Función para borrar un arma de un barco
    @param {function} borrarBarco - Función para borrar un barco
**/
const PanelArmas = ({ barcoSeleccionado, barcos, inventarioArmas, anadirArma, borrarArmaBarco, borrarBarco }) => {
    
    // Si no hay barco seleccionado, no se muestra nada
    if (!barcoSeleccionado) return <div className="columna-derecha"></div>;

    // Se obtiene el barco seleccionado
    const barco = barcos.find(b => b.id === barcoSeleccionado);
    
    // Se obtiene el numero de ranuras de armas del barco
    const numRanuras = ESTADISTICAS_BARCOS[barco?.tamano]?.armasMax;

    const ranurasArmas = [];
    if (barco) {
        // Se recorren las ranuras de armas y se muestra si tienen un arma equipada o no y cuál
        for (let i = 0; i < numRanuras; i++) {
            const arma = barco.armas[i];
            ranurasArmas.push(
                // Se muestra el numero de ranura y el arma equipada si tiene una
                <p key={i} className="ranura-arma">
                    Ranura {i + 1}: <span className={arma?.name ? "arma-nombre" : "arma-vacia"}>{arma?.name || "Vacía"}</span>
                </p>
            );
        }
    }

    return (
        <div className="columna-derecha">
            <div className="panel-lateral" onClick={(e) => e.stopPropagation()}>
                <h3>EQUIPAR ARMAS</h3>
                {/*Información de las ranuras de armas del barco seleccionado*/}
                {barco && (
                    <div className="info-barco-seleccionado">
                        <p><strong>{barco.tipo}</strong></p>
                        {ranurasArmas}
                    </div>
                )}

                <div className="lista-armas-disponibles">
                    {/*Por cada arma del inventario de armas, se crea un contenedor de armas*/}
                    {inventarioArmas.map((arma) => {

                        // Se comprueba si el arma esta equipada
                        const equipada = barco?.armas.some(a => a.name === arma.name);

                        // Si el arma esta seleccionada aparece ek botón de "Quitar", si no se aparece el botón de "Equipar"
                        return (
                            <div key={arma.slug} className="contenedor-armas">
                                <p>
                                    {/*Se muestra cada arma en un bloque con el nombre del arma y el daño*/}
                                    <strong>{arma.name}</strong>
                                    <br></br>
                                    (Daño: {arma.damage})
                                </p>
                                {/*Se muestra el botón de "Quitar" o "Equipar" dependiendo de si el arma esta equipada o no*/}
                                <button
                                    className={`btn-opcion-arma ${equipada ? 'eliminarBarco-btn' : 'ponerBarco-btn'}`}
                                    onClick={() => equipada ? borrarArmaBarco(barcoSeleccionado, arma) : anadirArma(barcoSeleccionado, arma)}
                                >
                                    {equipada ? 'Quitar' : 'Equipar'}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/*Botón para eliminar el barco seleccionado*/}
                <button
                    className="eliminarBarco-btn"
                    onClick={() => borrarBarco(barcoSeleccionado)}
                >
                    Eliminar Barco
                </button>
            </div>
        </div>
    );
};

export default PanelArmas;
