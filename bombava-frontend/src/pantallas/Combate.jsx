import BarraProgreso from "../componentes/barras_recursos/Barras.jsx";
import { useState } from 'react';

function Combate() {
    //Valores de prueba
    const [barras, setBarras] = useState({
        municion: 10,
        maxMunicion: 100,
        combustible: 100,
        maxCombustible: 100
    });

    return (
        <div style={{ padding: '20px' }}>
            {/*Barra de combustible*/}
            <BarraProgreso 
                etiqueta="Combustible"
                tipo="combustible"
                valorActual={barras.combustible}
                maxValor={barras.maxCombustible}
            />
            {/*Barra de munición*/}
            <BarraProgreso 
                etiqueta="Munición"
                tipo="municion"
                valorActual={barras.municion}
                maxValor={barras.maxMunicion}
            />
        </div>
    );
}

export default Combate;