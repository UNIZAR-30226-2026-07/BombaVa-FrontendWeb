import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../utils/socket.js';
import { login, guardarToken } from '../services/authApi.js';
import { notification } from '../services/notificationService.js';
import '../styles/InicioSesion.css';

function InicioSesion() {
  const [cuenta, setCuenta] = useState({ email: '', contrasena: '' });
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
      const res = await login(cuenta);
      notification.success("¡Sesión iniciada! Bienvenido, capitán.");
      
      // Guarda el token y reconecta el socket con el nuevo token
      guardarToken(res.token, socket);

      //Ahora que tiene valor token el socket va bien así que emito la señal
      socket.emit('game:check_active');

      
    } catch (err) {
      notification.error(err.message);
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