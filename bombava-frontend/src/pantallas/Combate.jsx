import BarraProgreso from "../componentes/barras/Barras.jsx";
import { useState } from 'react';

function InterfazJuego() {
    // Estos valores vendrían del estado de tu juego
    const [barras, setBarras] = useState({
        municion: 45,
        maxMunicion: 60,
        combustible: 80,
        maxCombustible: 100
    });

    return (
        <div style={{ padding: '20px' }}>
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
    );
}

export default InterfazJuego;