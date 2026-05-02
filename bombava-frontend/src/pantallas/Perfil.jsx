import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { obtenerPerfil, limpiarToken, obtenerRanking } from '../services/authApi.js';
import { notification } from '../services/notificationService.js';
import axios from 'axios';
import {SERVER_API} from '../utils/constantes';
import '../styles/Perfil.css';

// Importar componentes de la pantalla
import CartelPerfil from '../componentes/CartelPerfil';
import CartelRanking from '../componentes/CartelRanking';

function Perfil() {
  
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null); //Datos del usuario
  const [ranking, setRanking] = useState([]); //Datos del ranking
  const [editando, setEditando] = useState(false);//Te dice si está editando el nombre de usuario
  const [nuevoNombre, setNuevoNombre] = useState(""); //Nombre del usuario
  const [nuevoEmail, setNuevoEmail] = useState(""); //Email del usuario
  const [cargandoRanking, setCargandoRanking] = useState(true); //Estado de carga del ranking (true = está cargando, false = ya ha cargado los datos)

  const cerrarSesion = () => {
    limpiarToken();/*sale a antes de iniciar sesion y registrarse y borra el token de sesión actual*/
    navigate('/');
  };

  //La funcion useEffect sirve para pedir los datos del usuario solo cuando se entra a la página,
  //si no cada vez que se cambiase algo del componente se volvería a hace rla peticion

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Promise.all permite que se hagan varias peticiones a la vez y cuando 
        // ambas han terminado se ejecuta el código siguiente
        const [datosPerfil, datosRanking] = await Promise.all([
          obtenerPerfil(),
          obtenerRanking()
        ]);
        setUsuario(datosPerfil);
        setRanking(datosRanking);
        setNuevoNombre(datosPerfil.username);
        setNuevoEmail(datosPerfil.email);
      } catch (err) {
        notification.error(err.message);
      } finally {
        setCargandoRanking(false);
      }
    };

    cargarDatos();
  }, []);// [] dice al frontend que solo se ejecute una vez, al abrir la página

  // ESTO EVITA QUE LA WEB SE ROMPA MIENTRAS CARGA

  if (!usuario) {
    return (
      <div className="contenedor_perfil">
        <h1 className="cargando">Cargando perfil del capitán...</h1>
      </div>
    );
  }

  const guardarCambios = async () => {
    const token = localStorage.getItem('token');
    const datosActualizados = {
      username: nuevoNombre,
      email: nuevoEmail
    };
    try {
      await axios.patch(
        SERVER_API + '/api/auth/me',
        datosActualizados,
        { 
          headers: { 
            'Authorization': `Bearer ${token}` 
          } 
        }
      );
      
      // Actualizar estado local del usuario
      setUsuario({ ...usuario, ...datosActualizados });
      setEditando(false);
      notification.success("Perfil actualizado con éxito");

      // Recargar el ranking para reflejar los cambios (el nombre)
      const nuevosDatosRanking = await obtenerRanking();
      setRanking(nuevosDatosRanking);
      
    } catch (err) {
      notification.error(err.message);
    }
  };

  return (
    <div className="contenedor_perfil">
      
      {/* Botones de acción superior */}
      <div className="acciones_superiores">
        <button className="boton_cerrar" onClick={cerrarSesion}>
          CERRAR SESIÓN
        </button>
        {editando ? (
          <button className="boton_editar" onClick={guardarCambios}>
            GUARDAR CAMBIOS
          </button>
        ) : (
          <button className="boton_editar" onClick={() => setEditando(true)}>
            EDITAR PERFIL
          </button>
        )}
      </div>

      <div className="informacion_perfil">
        
        {/* Lado Izquierdo: Perfil del Jugador */}
        <div className="columna_izquierda">
          <CartelPerfil 
            usuario={usuario}
            editando={editando}
            nuevoNombre={nuevoNombre}
            setNuevoNombre={setNuevoNombre}
            nuevoEmail={nuevoEmail}
            setNuevoEmail={setNuevoEmail}
          />
        </div>

        {/* Lado Derecho: Ranking */}
        <div className="columna_derecha">
          <CartelRanking 
            ranking={ranking}
            cargandoRanking={cargandoRanking}
            nombreUsuarioActual={usuario.username}
          />
        </div>

      </div>

      <button className="boton_volver" onClick={() => navigate('/menuInicial')}>
        VOLVER A PUERTO
      </button>
      
    </div>
  );
}

export default Perfil;