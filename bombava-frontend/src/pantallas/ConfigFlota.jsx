import { useState,useEffect } from 'react';
import axios from 'axios';
import Tablero from '../componentes/tablero/Tablero';
import Barco from '../componentes/barco/Barco.jsx';
import { useMovimientosBarco} from '../componentes/barco/movimientosBarco.js';
import '../styles/ConfigFlota.css';
import { BARCO1x1, BARCO1x3, BARCO1x5, TAMANO_TABLERO, TERRENO, SERVER_API } from '../utils/constantes.js'; 
import { useNavigate } from 'react-router-dom';


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
    } = useMovimientosBarco([],mapa); // Empezamos con tablero vacío

    //Al abrir la pantalla se cargan todos los tipos de barcos y armas que hay guardados en el backend
    useEffect(() => {
        const cargarInventarioArmas = async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${SERVER_API}/api/inventory/weapons`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInventarioArmas(res.data); // Aquí están las armas con sus datos
        };
        
        const cargarInventarioBarcos = async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${SERVER_API}/api/inventory/ships`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInventarioBarcos(res.data); // Aquí están los barcos con sus datos
        };
        cargarInventarioBarcos();
        cargarInventarioArmas();
    }, []);

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

    //Función para enviar todos los datos del mazo a la API
    const enviarFlota = async () => {
        // Aquí construimos el mensaje
        const datosMazo = {
            deckName: "Mi Nueva Flota",
            shipIds: barcos.map(b => {
                // Saco la celda del centro porque en el backend las celdas se enumeran al reves (de abajo a arriba en vez de de arriba a abajo)
                const celdaCentral = b.celdas[Math.floor(b.tamano / 2)];

                return {
                    userShipId: b.id,
                    position: {
                        x: celdaCentral.x, 
                        y: (TAMANO_TABLERO - 1) - celdaCentral.y  // El - 1 porque empiezan por 0
                    },
                    orientation: b.orientacion
                };
            })
        }; 
    
        try {
            const token = localStorage.getItem('token');//Cojo el token del buscador

            const respuesta = await axios.post(SERVER_API + '/api/inventory/decks', datosMazo, {//Si va todo bien respuesta.data tendrá el mazo
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("¡Flota guardada!");
            //Activamos este nuevo mazo para que se use en partida
            console.log(respuesta.data.id);
            try{
                await axios.patch(SERVER_API + '/api/inventory/decks/' + respuesta.data.id + '/activate', datosMazo, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                navigate('/menuInicial');
            }catch(error){
                alert("Error al activar: " + (error.response?.data?.message || error.message));
            }
            
        } catch (err) {
            alert("Error al guardar: " + (err.response?.data?.message || err.message));
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
        <div className='main-content'>
            <div className="mapa_config" onClick={() => setBarcoSeleccionado()}>

                <div className="main-content">

                    {/* Zona del Tablero */}
                    <div className="tablero-contenedor">

                        <Tablero mapa= {mapa} onCellClick={gestionarClickMapa} configurar={true} celdasEnRango={new Set()} />
                        {barcos.map((barco) => (
                        <Barco 
                            key={barco.id} 
                            barco={barco} 
                            estaSeleccionado={barcoSeleccionado === barco.id}
                            onClick={(x, y) => { gestionarClickBarco(barco.id); }}
                        />
                        ))}

                    </div>

                    <div className="botones_barco_config">
                        <button className="ponerBarco-btn" onClick={() => setBarcoAPoner(BARCO1x1)}>PONER BARCO 1x1</button>
                        <button className="ponerBarco-btn" onClick={() => setBarcoAPoner(BARCO1x3)}>PONER BARCO 1x3</button>
                        <button className="ponerBarco-btn" onClick={() => setBarcoAPoner(BARCO1x5)}>PONER BARCO 1x5</button>
                    </div>

                </div>

                {/* Panel Lateral Derecho (Solo se ve si hay un barco seleccionado) */}
                {barcoSeleccionado && (
                    <div className="panel-lateral">

                        <h3>EQUIPAR ARMAS</h3>
                        {barcos.filter(b => b.id === barcoSeleccionado).map((barco) => (
                            <div key={barco.id}>{/*Usamos key para identificar qué elementos han cambiado y no tener que renderizar toda la lista*/}
                            {/* Imprimimos las armas actuales del barco */}
                            {barco.armas.map((arma, index) => (
                                <p key={index}>Ranura {index + 1}: {arma.name || "Vacío"}</p>
                            ))}
                            </div>
                        ))}
                        
                        {inventarioArmas.map((arma) => (
                            <div key={arma.slug} className="contenedor-armas">
                                {/* El arma que es*/}
                                <p><strong>{arma.name}</strong> (Daño: {arma.damage})</p>
                                
                                <div className="botones-arma-barco">
                                    <button 
                                        className="ponerBarco-btn"
                                        onClick={() => anadirArma(barcoSeleccionado, arma)}
                                    >
                                        Equipar {/*Para equipársela al barco */}
                                    </button>
                                    
                                    <button
                                        className="eliminarBarco-btn" 
                                        onClick={() => borrarArmaBarco(barcoSeleccionado, arma)}
                                    >
                                        Quitar {/*Para quitársela al barco */}
                                    </button>
                                </div>

                            </div>
))}
                        <button className="eliminarBarco-btn" onClick={() => borrarBarco(barcoSeleccionado, setbarcosPuestos, barcosPuestos)}>Eliminar Barco</button>
                        
                        
                    </div>
                )}
                
            </div>
            <button className="confirmar-btn" onClick={() => enviarFlota()}>CONFIRMAR FLOTA</button>
    </div>

    );
};

export default ConfigFlota;