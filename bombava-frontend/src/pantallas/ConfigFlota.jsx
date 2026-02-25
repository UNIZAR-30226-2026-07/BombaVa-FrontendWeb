import { useState } from 'react';
import Tablero from '../tablero/Tablero';
import Barco from '../barco/Barco.jsx';
import { useMovimientosBarco, anadirBarco} from '../barco/movimientosBarco.js';
import './ConfigFlota.css';
import { BARCO1x1, BARCO1x3, BARCO1x5 } from '../utils/constantes.js'; 

/*El mapa es la clase que engloba a todo el tablero de juego, para ello 
incluye varias capas(de abajo a arriba sería):
    > Tablero(Tablero.jsx)
    > Barcos(Barco.jsx)
    > Torpedos
    > Proyectiles
*/
const ConfigFlota = () => {
    const [barcoAPoner, setBarcoAPoner] = useState(0); // 0 significa que no hay ninguno seleccionado

    const { 
        barcos, 
        barcoSeleccionado, 
        setBarcoSeleccionado, 
        rotarBarco, 
        moverBarco,
        agregarBarco 
    } = useMovimientosBarco([]); // Empezamos con tablero vacío

    // Si pulsamos un barco podremos cambiar sus armas y sale un panel con sus datos 
    const gestionarClickBarco = (id) => {
    if (barcoSeleccionado == id) {
        // Si clicamos el barco que ya estaba seleccionado, se rota
        rotarBarco(id, null);
    } else {
        setBarcoSeleccionado(id);
    }
    };

    // Función para poner un barco, la celda en la que haces click te devuelve su x e y
    const gestionarClickMapa = (x, y) => {
        if(barcoAPoner != 0){
            switch (barcoAPoner){
                case BARCO1x1:
                    nombre = "Barco1x1"
                case BARCO1x3:
                    nombre = "Barco1x3"
                case BARCO1x5:
                    nombre = "Barco1x5"
            }

            const nuevoBarco = {
                id: nombre,
                posicion: { x, y },
                orientacion: 'N',
                tamano: barcoAPoner,
                tipo: `Barco 1x-${barcoAPoner}`,
                vida: 100
            };
            anadirBarco(nuevoBarco);
            setBarcoAPoner(0)
        }
    };

    return (
    <div className="mapa_config">
        <Tablero onCellClick={gestionarClickMapa} />
        
        {barcos.map((barco) => (/*Transforma la lista de barcos en elementos visuales*/
        <Barco 
            key={barco.id} 
            barco={barco} 
            estaSeleccionado={barcoSeleccionado === barco.id}
            onClick={() => gestionarClickBarco(barco.id)}
        />
        ))}
        <button className="ponerBarco-btn" onClick={() => setBarcoAPoner(BARCO1x1)}>PONER BARCO 1x1</button>
        <button className="ponerBarco-btn" onClick={() => setBarcoAPoner(BARCO1x3)}>PONER BARCO 1x3</button>
        <button className="ponerBarco-btn" onClick={() => setBarcoAPoner(BARCO1x5)}>PONER BARCO 1x5</button>
    </div>

    );
};

export default ConfigFlota;