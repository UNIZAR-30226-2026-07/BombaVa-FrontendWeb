import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../utils/socket.js';
import { registrar, guardarToken } from '../services/authApi.js';
import { notification } from '../services/notificationService.js';
import '../styles/Registrarse.css';

function Registro() {
  const [cuenta, setCuenta] = useState({ username: '', email: '', contrasena: '' });
  const navigate = useNavigate();

  // Configurar los listeners del socket al llegar a la pantalla
  useEffect(() => {

    // Handler por si había un juego del que se salió el usuario
    const handleHayJuegoInterrumpido = (payload) => {
        console.log('Se ha encontrado una partida activa');
        navigate('/unirse');
        socket.emit('game:join', payload.matchId); //se hace para que llegue el match:tartInfo
    };

    // Handler para cuando no hay juego al que unirse 
    const handleNoHayJuegoInterrumpido = () => {
      console.log('No se ha encontrado ningún juego activo');
      navigate('/menuInicial');
    };

    // Escuchamos los siguientes eventos:
    socket.on('game:active_found', handleHayJuegoInterrumpido);
    socket.on('game:no_active', handleNoHayJuegoInterrumpido);

    // Cerramos los listeners al salir de la pantalla
    return () => {
      socket.off('game:active_found', handleHayJuegoInterrumpido);
      socket.off('game:no_active', handleNoHayJuegoInterrumpido);
    };
  }, [navigate]);
  
  const enviarDatos = async (e) => {
    e.preventDefault();//Sirve para que al enviar no se recargue la página, perdiendo el estado de toda la web (volvería a pantalla inicial)
    try {
      const res = await registrar(cuenta);
      notification.top("¡Registro exitoso! Bienvenido al juego.", 'success');
      
      // Guarda el token y reconecta el socket con el nuevo token
      guardarToken(res.token, socket);

      //Ahora que tiene valor token el socket va bien así que emito la señal
      socket.emit('game:check_active');
      
      
    } catch (err) {
      notification.top(err.message, 'error');
    }
  };

  return (
    <div className="contenedor-padre">
      <form className = "formulario-registro" onSubmit={enviarDatos}>
        <h2 className = "titulo">Registrar Usuario</h2>
        <input type="text" placeholder="Usuario" onChange={e => setCuenta({...cuenta, username: e.target.value})} />
        <input type="email" placeholder="Email" onChange={e => setCuenta({...cuenta, email: e.target.value})} />
        <input type="password" placeholder="Contraseña" onChange={e => setCuenta({...cuenta, contrasena: e.target.value})} />
        <button type="submit">CREAR USUARIO</button>
      </form>
    </div>
  );
}

export default Registro;