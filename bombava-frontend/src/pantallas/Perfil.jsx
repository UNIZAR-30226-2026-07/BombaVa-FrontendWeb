import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { obtenerPerfil, limpiarToken } from '../services/authApi.js';
import '../styles/Perfil.css';

function Perfil() {

  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);

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
          alert("Error: " + err.message);
        }
      };

      obtenerDatosDelServidor();
  }, []);// [] dice al frontend que solo se ejecute una vez, al abrir la página

  // ESTO EVITA QUE LA WEB SE ROMPA MIENTRAS CARGA
  if (!usuario) return <h1 style={{color: 'white'}}>Cargando perfil...</h1>;

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
          <h2>{usuario.username}</h2>
          <p className="rango">Rango</p>
          
          <div className="estats">
            <p><strong>Gmail: </strong>{usuario.email} </p>
            <p><strong>Partidas: </strong> Partidas</p>
            <p><strong>Victorias: </strong> Victorias</p>
            <p><strong>Precisión: </strong> Precision</p>
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