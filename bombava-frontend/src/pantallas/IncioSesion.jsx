import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../utils/socket.js';
import { login, guardarToken } from '../services/authApi.js';
import { notification } from '../services/notificationService.js';
import '../styles/InicioSesion.css';

function InicioSesion() {
  const [cuenta, setCuenta] = useState({ email: '', contrasena: '' });
  const navigate = useNavigate();

  const enviarDatos = async (e) => {
    e.preventDefault();//Sirve para que al enviar no se recargue la página, perdiendo el estado de toda la web (volvería a pantalla inicial)
    try {
      const res = await login(cuenta);
      notification.top("¡Sesión iniciada! Bienvenido, capitán.", 'success');
      
      // Guarda el token y reconecta el socket con el nuevo token
      guardarToken(res.token, socket);

      navigate('/menuInicial');
    } catch (err) {
      notification.top(err.message, 'error');
    }
  };

  return (
    <div className="contenedor-padre">
      <form className= "formulario-incio-sesion" onSubmit={enviarDatos}>
        <h2 className = "titulo">Iniciar Sesión</h2>
        <input type="email" className= "formulario-incio-sesion-email" placeholder="Email" onChange={e => setCuenta({...cuenta, email: e.target.value})} />
        <input type="password" className= "formulario-incio-sesion-password" placeholder="Password" onChange={e => setCuenta({...cuenta, contrasena: e.target.value})} />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default InicioSesion;