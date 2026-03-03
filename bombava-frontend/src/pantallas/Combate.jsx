import BarraProgreso from "../componentes/barras_recursos/Barras.jsx";
import { useState } from 'react';
import Mapa from "../componentes/mapa/Mapa.jsx";
import BoatInfoCard from "../componentes/BoatInfoCard.jsx";
import '../styles/Combate.css'; 

/*ESTRUCTURA DE LA PANTALLA DE COMBATE:
    > COLUMNA IZQUIERDA: Recursos (arriba) y Mapa (abajo) 
    > COLUMNA CENTRAL: Hueco para los botones de movimiento/ataque
    > COLUMNA DERECHA: Información del barco seleccionado
*/

function Combate() {
    //Valores de prueba de las barras de recursos,  se actualizarán dinámicamente según el estado del juego
    const [barras, setBarras] = useState({
        municion: 10,
        maxMunicion: 100,
        combustible: 100,
        maxCombustible: 100
    });

   // Estado para seleccionar un barco (ID = 1 para pruebas)
    const [selectedBoatId, setSelectedBoatId] = useState(1);

    return (
        <div className="combate-contenedor">
            {
            /*ESTRUCTURA DE LA PANTALLA DE COMBATE:
                > COLUMNA IZQUIERDA: Recursos (arriba) y Mapa (abajo) 
                > COLUMNA CENTRAL: Hueco para los botones de movimiento/ataque
                > COLUMNA DERECHA: Información del barco seleccionado
            */
            }
            {/*COLUMNA IZQUIERDA: Recursos (arriba) y Mapa (abajo) */}
            <div className="combate-columna-izquierda">
                {/* Barras de recursos */}
                <div className="recursos-contendor">
                    <BarraProgreso 
                        etiqueta="Combustible"
                        tipo="combustible"
                        valorActual={barras.combustible}
                        maxValor={barras.maxCombustible}
                    />
                    <BarraProgreso 
                        etiqueta="Munición"
                        tipo="municion"
                        valorActual={barras.municion}
                        maxValor={barras.maxMunicion}
                    />
                </div>
                
                {/* Contenedor del Mapa (Incluye tablero y barcos) */}
                <div className="mapa-contendor">
                    <Mapa />
                </div>
            </div>

            {/*COLUMNA CENTRAL: Hueco para los botones de movimiento/ataque */}
            <div className="combate-columna-central">
                <h3 className="titulo-acciones">Panel de control</h3>
                <div className="acciones">
                    {/* Botones temporales-> HABRÁ QUE CAMBIARLO */}
                    <button className="boton-temporal">
                        Mover
                    </button>
                    <button className="boton-temporal">
                        Atacar
                    </button>
                </div>
            </div>

            {/* COLUMNA DERECHA: Información del barco seleccionado */}
            <div className="combate-columna-derecha">
                <BoatInfoCard boatId={selectedBoatId} />
            </div>
        </div>
    );
}

export default Combate;