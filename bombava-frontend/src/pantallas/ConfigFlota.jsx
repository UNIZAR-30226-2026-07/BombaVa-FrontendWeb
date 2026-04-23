import { useState,useEffect } from 'react';
import axios from 'axios';
import Tablero from '../componentes/tablero/Tablero';
import Barco from '../componentes/barco/Barco.jsx';
import { useMovimientosBarco} from '../componentes/barco/movimientosBarco.js';
import '../styles/ConfigFlota.css';
import { BARCO1x1, BARCO1x3, BARCO1x5,  TAMANO_TABLERO, TERRENO, SERVER_API, ESTADISTICAS_BARCOS } from '../utils/constantes.js'; 
import { useNavigate } from 'react-router-dom';
import { crearYActivarDeck } from '../services/decksApi.js';
import { notification } from '../services/notificationService.js';
import SelectorBarcos from '../componentes/configuracion_flota/SelectorBarcos.jsx';
import PanelArmas from '../componentes/configuracion_flota/PanelArmas.jsx';
import TableroConfiguracion from '../componentes/configuracion_flota/TableroConfiguracion.jsx';


const generarMapaConfiguracion = () => {
  const map = [];
  for (let y = 0; y < TAMANO_TABLERO; y++) {
    const fila = [];
    for (let x = 0; x < TAMANO_TABLERO; x++) {
      //Mapa con todo agua y una isla central
      let tipoterreno = TERRENO.AGUA;

      // Ejemplo de mapa con un isla -> Habría que cambiarlo para que sea mejor.
      if (y >= 10) {
        tipoterreno = TERRENO.AGUA;
      } else if (y >= 5) {
        tipoterreno = TERRENO.NO_VISION;
      } else {
        tipoterreno = TERRENO.NO_VISION_ENEMIGO;
      }

      fila.push({ x, y, tipoterreno });
    }
    map.push(fila);
  }
  return map;
};

/*El mapa es la clase que engloba a todo el tablero de juego, para ello 
incluye varias capas(de abajo a arriba sería):
    > Tablero(Tablero.jsx)
    > Barcos(Barco.jsx)
    > Torpedos
    > Proyectiles
*/
const ConfigFlota = () => {
    let mapaInicial;
    //generamos el mapa inicial
    mapaInicial = generarMapaConfiguracion();

    const [barcoAPoner, setBarcoAPoner] = useState(0); // 0 significa que no hay ninguno seleccionado
    const [barcosPuestos, setbarcosPuestos] = useState([0,0,0,0,0,0]) //Barcos puestos de cada tipo, realmente por ahora solo uso los indices 1, 3 y 5
    const [mapa, setMapa] = useState(mapaInicial);//El mapa
    const [inventarioBarcos, setInventarioBarcos] = useState([]);//Guarda todos los barcos que puedes poner sacados de la API al principio
    const [inventarioArmas, setInventarioArmas] = useState([]);//Guarda todas las armas que puedes poner sacados de la API al principio

    const navigate = useNavigate();
    const { 
        barcos, 
        barcoSeleccionado, 
        setBarcoSeleccionado, 
        rotarBarco, 
        anadirBarco, 
        borrarBarco,
        celdaEsValida,
        equiparArma,
        limpiarArma
    } = useMovimientosBarco([], { mapa }); // Empezamos con el tablero vacío
    // Cargar inventarios al inicio
    useEffect(() => {
        const cargarDatos = async () => {
            const token = localStorage.getItem('token');
            const headers = { headers: { Authorization: `Bearer ${token}` } };
            
            const [resWeapons, resShips] = await Promise.all([
                axios.get(`${SERVER_API}/api/inventory/weapons`, headers),
                axios.get(`${SERVER_API}/api/inventory/ships`, headers)
            ]);
            setInventarioArmas(resWeapons.data);
            setInventarioBarcos(resShips.data);
        };
        cargarDatos();
    }, []);

    const gestionarClickBarco = (id) => {
        // Si se hace click en el barco seleccionado, se deselecciona
        // Si se hace click en otro barco, se selecciona
        // Si se hace click en el mismo barco, se rota
        barcoSeleccionado === id ? rotarBarco(id, null) : setBarcoSeleccionado(id);
    };

    const gestionarClickMapa = (x, y) => {
        
        if(barcoAPoner != 0 ){
            //Se busca ese barco que quiere poner el usuario
            const barcoAPI = inventarioBarcos.find(ship => 
                ship.ShipTemplate.height === barcoAPoner && 
                !barcos.some(b => b.id === ship.id) // Que no esté ya en el tablero
            );
            
            let celdasFinales = [];
            let encaja = false;
            let intentoY = y; 

            for (let desplazamiento = 0; desplazamiento < barcoAPoner; desplazamiento++) {
                let celdasTemporales = [];
                let todasValidas = true;
                
                for (let i = 0; i < barcoAPoner; i++) {
                    let yActual = intentoY + i;
                    
                    //Miro si cabe o no, si el barco no cabe entero subo la fila de la celda que tiene la punta superior del barco
                    if (!celdaEsValida(x, yActual,barcos)) {
                        todasValidas = false;
                        break; 
                    }
                    
                    celdasTemporales.push({ x: x, y: yActual });
                }
                
                if (todasValidas) {
                    celdasFinales = celdasTemporales;
                    encaja = true;
                    break; 
                } else {
                    intentoY--; // Probamos a subir el punto de origen a ver si así cabe
                }
                
            }
            if(encaja){
                const nuevoBarco = {
                    id: barcoAPI.id,
                    posicion: { x: x, y: intentoY },
                    orientacion: 'N',
                    tamano: barcoAPoner,
                    tipo: barcoAPI.ShipTemplate.name,
                    vida: barcoAPI.ShipTemplate.baseMaxHp,
                    armas: barcoAPI.WeaponTemplates,
                    celdas: celdasFinales
                };
                anadirBarco(nuevoBarco);
                setBarcoAPoner(0)
            }
            
            
            
        }
    };

    const enviarFlota = async () => {
        try {
            await crearYActivarDeck(barcos);
            notification.success("¡Flota guardada y activada!");
            navigate('/menuInicial');
        } catch (error) {
            notification.error(error.message);
        }
    };

    //añade ese arma al barco seleccionado
    const anadirArma = async (barcoSeleccionado, arma) => {
        equiparArma(barcoSeleccionado, arma);
        
    };

    //Quita ese arma del barco seleccionado
    const borrarArmaBarco = async (barcoSeleccionado,arma) => {
        limpiarArma(barcoSeleccionado, arma);
        
    };  

    return (
        <div className='config-flota-main'>
            <div className="mapa_config" onClick={() => setBarcoSeleccionado(null)}>
                {/* Seleccion de barcos y panel de info de barcos*/}
                <SelectorBarcos 
                    barcoSeleccionado={barcoSeleccionado}
                    barcoAPoner={barcoAPoner}
                    setBarcoAPoner={setBarcoAPoner}
                    barcos={barcos}
                />

                {/* Tablero de juego */}
                <TableroConfiguracion 
                    mapa={mapa}
                    gestionarClickMapa={gestionarClickMapa}
                    barcos={barcos}
                    barcoSeleccionado={barcoSeleccionado}
                    gestionarClickBarco={gestionarClickBarco}
                    enviarFlota={enviarFlota}
                />

                {/*Panel de armas del barco seleccionado*/}
                <PanelArmas 
                    barcoSeleccionado={barcoSeleccionado}
                    barcos={barcos}
                    inventarioArmas={inventarioArmas}
                    anadirArma={anadirArma}
                    borrarArmaBarco={borrarArmaBarco}
                    borrarBarco={borrarBarco}
                />

            </div>
        </div>
    );
};

export default ConfigFlota;
