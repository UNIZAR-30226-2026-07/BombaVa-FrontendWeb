import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../styles/Perfil.css';

function Perfil() {

  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({
    nombre: "Capitán Pruebas",
    rango: "Grumete de Agua Dulce",
    partidas: 42,
    victorias: 15,
    precision: "68%"
  });

  return ( 
    <div className="contenedor_perfil">

      <button className="boton_cerrar" onClick={() => navigate('/')}>{/*Faltaría poner la función para quitar la cuenta*/}
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
          <h2>{usuario.nombre}</h2>
          <p className="rango">{usuario.rango}</p>
          
          <div className="estats">
            <p><strong>Partidas:</strong> {usuario.partidas}</p>
            <p><strong>Victorias:</strong> {usuario.victorias}</p>
            <p><strong>Precisión:</strong> {usuario.precision}</p>
          </div>
        </div>

        <button className="boton_volver" onClick={() => navigate('/')}>
          VOLVER AL PUERTO
        </button>

      </div>
      
    </div>
  );
}

export default Perfil;