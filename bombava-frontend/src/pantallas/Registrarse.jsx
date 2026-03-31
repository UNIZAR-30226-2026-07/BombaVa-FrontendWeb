import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../utils/socket.js';
import { registrar, guardarToken } from '../services/authApi.js';
import { notification } from '../services/notificationService.js';
import '../styles/Registrarse.css';

function Registro() {
  const [cuenta, setCuenta] = useState({ username: '', email: '', contrasena: '' });
  const navigate = useNavigate();

  const enviarDatos = async (e) => {
    e.preventDefault();//Sirve para que al enviar no se recargue la página, perdiendo el estado de toda la web (volvería a pantalla inicial)
    try {
      const res = await registrar(cuenta);
      notification.success("¡Registro exitoso! Bienvenido al juego.");
      
      // Guarda el token y reconecta el socket con el nuevo token
      guardarToken(res.token, socket);

      navigate('/menuInicial');
    } catch (err) {
      notification.error(err.message);
    }
  };

  return (
    <div className="contenedor-padre">
      <form className = "formulario-registro" onSubmit={enviarDatos}>
        <h2 className = "titulo">Registrar Usuario</h2>
        <input type="text" placeholder="Usuario" onChange={e => setCuenta({...cuenta, username: e.target.value})} />
        <input type="email" placeholder="Email" onChange={e => setCuenta({...cuenta, email: e.target.value})} />
        <input type="password" placeholder="Contraseña" onChange={e => setCuenta({...cuenta, contrasena: e.target.value})} />
        <button type="submit">Crear Usuario</button>
      </form>
    </div>
  );
}

export default Registro;