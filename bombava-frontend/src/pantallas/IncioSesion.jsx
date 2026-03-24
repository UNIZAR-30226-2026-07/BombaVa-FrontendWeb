import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SERVER_API } from '../utils/constantes.js'; 
import '../styles/InicioSesion.css';

function InicioSesion() {
  const [cuenta, setCuenta] = useState({ email: '', contrasena: '' });
  const navigate = useNavigate();

  const enviarDatos = async (e) => {
    e.preventDefault();//Sirve para que al enviar no se recargue la página, perdiendo el estado de toda la web (volvería a pantalla inicial)
    try {
      const res = await axios.post(SERVER_API + '/api/auth/login', cuenta);
      alert("Token recibido: " + res.data.token);
      localStorage.setItem('token', res.data.token);//Se guarda en el buscador el token para luego poder sacar los datos
      navigate('/menuInicial');
    } catch (err) {
      alert("Error: " + err.response.data.errors[0].msg);
    }
    
  };

  return (
    <div className="contenedor-padre">
      <form className= "formulario-incio-sesion" onSubmit={enviarDatos}>
        <h2 className = "titulo">Iniciar Sesión</h2>
        <input type="email" placeholder="Email" onChange={e => setCuenta({...cuenta, email: e.target.value})} />
        <input type="password" placeholder="Password" onChange={e => setCuenta({...cuenta, contrasena: e.target.value})} />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default InicioSesion;