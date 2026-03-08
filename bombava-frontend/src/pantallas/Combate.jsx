import BarraProgreso from "../componentes/barras_recursos/Barras.jsx";
import { useState } from 'react';
import Mapa from "../componentes/mapa/Mapa.jsx";
import BoatInfoCard from "../componentes/BoatInfoCard.jsx";
import MenuPausa from "../componentes/menuPausa/MenuPausa.jsx";
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

    // Función para actualizar la munición, restando el coste de munición al valor actual
    const actualizarMunicion = (coste) => {
        setBarras(prev => ({
            ...prev,
            // Evitamos que pueda ser negativo el valor de la munición
            municion: Math.max(0, prev.municion - coste)
        }));
    };

    // Función para actualizar el combustible, restando el coste de combustible al valor actual.
    const actualizarCombustible= (coste) => {
        setBarras(prev => ({
            ...prev,
             // Evitamos que pueda ser negativo el valor del combustible
            combustible: Math.max(0, prev.combustible - coste)
        }));
    };

   // Estado para seleccionar un barco (ID = 1 para pruebas)
    const [selectedBoatId, setSelectedBoatId] = useState(1);

    // Estado para saber si estamos en modo ataque
    const [modoAtaque, setModoAtaque] = useState(false);

    return (
        <div className="combate-contenedor">
            {
            /*ESTRUCTURA DE LA PANTALLA DE COMBATE:
                > COLUMNA IZQUIERDA: Recursos (arriba) y Mapa (abajo) 
                > COLUMNA CENTRAL: Hueco para los botones de movimiento/ataque
                > COLUMNA DERECHA: Información del barco seleccionado
            */
            }
            
            {/*Botón para pausar la partida. Esta en el esquina superior derecha */}
            <MenuPausa /> 
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