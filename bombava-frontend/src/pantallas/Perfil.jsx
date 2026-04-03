import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { obtenerPerfil, limpiarToken } from '../services/authApi.js';
import { notification } from '../services/notificationService.js';
import axios from 'axios';
import {SERVER_API} from '../utils/constantes';
import '../styles/Perfil.css';

function Perfil() {

  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);//Te dice si está editando el nombre de usuario
  const [nuevoNombre, setNuevoNombre] = useState("");
  const cerrarSesion = () => {
    limpiarToken()/*sale a antes de iniciar sesion y registrarse y borra el token de sesión actual*/
    navigate('/')
  }

  //La funcion useEffect sirve para pedir los datos del usuario solo cuando se entra a la página, si no cada vez que se cambiase algo del componente se volvería a hace rla peticion
  useEffect(() => {
      const obtenerDatosDelServidor = async () => {
        try {
          const datos = await obtenerPerfil();
          setUsuario(datos);
        } catch (err) {
          notification.error(err.message);
        }
      };

      obtenerDatosDelServidor();
  }, []);// [] dice al frontend que solo se ejecute una vez, al abrir la página

  // ESTO EVITA QUE LA WEB SE ROMPA MIENTRAS CARGA
  if (!usuario) return <h1 style={{color: 'white'}}>Cargando perfil...</h1>;

  const cambiarUsuario = async (nuevoNombre) =>{
    const token = localStorage.getItem('token');
    const datosActualizados = {
      username: nuevoNombre,
      email: usuario.email
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
    } catch (err) {
      notification.error(err.message);
    }
  }
  
  return ( 
    <div className="contenedor_perfil">

      <button className="boton_cerrar" onClick={() => cerrarSesion()}>
        CERRAR SESIÓN
      </button>

      <div className="main-content">

        <header className="titulo_perfil"> 
          <h1>PERFIL DEL CAPITÁN</h1>
        </header>

        <div className="circulo_perfil">
          ☠️
        </div>
        
        <div className="info_capitan">
          <p className="rango">Rango</p>
          
          <div className="estats">
            <p><strong>Usuario: </strong> 
              {editando ? (
                <>
                  <input 
                    type="text" 
                    value={nuevoNombre} 
                    onChange={(e) => setNuevoNombre(e.target.value)}
                  />
                  <button className="guardarNombre" onClick={() => {
                    setUsuario({...usuario, username: nuevoNombre}); //Cambia el nombre de usuario en la web
                    cambiarUsuario(nuevoNombre);
                    setEditando(false); // Cierra el modo edición
                  }}>GUARDAR</button>
                </>
              ) : (
                <>
                  {usuario.username} 
                  <button className="editarNombre" onClick={() => {
                    setEditando(true);
                  }}>EDITAR</button>
                </>
              )}
            </p>
            
            <p><strong>Gmail: </strong>{usuario.email} </p>
          </div>
        </div>

        <button className="boton_volver" onClick={() => navigate('/menuInicial')}>
          VOLVER AL PUERTO
        </button>

      </div>
      
    </div>
  );
}

export default Perfil;