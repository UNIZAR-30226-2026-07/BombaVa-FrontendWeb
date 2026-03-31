import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../utils/socket';
import '../styles/Unirse.css';

function Unirse() {
  const [codigo, setCodigo] = useState('');
  const [errorBusqueda, setErrorBusqueda] = useState('');
  const [estadoUnirse, setEstadoUnirse] = useState('');
  const navigate = useNavigate();

  // Configurar los listeners del socket al llegar a la pantalla
  useEffect(() => {

    // Si el join es exitoso y la partida está lista, esperamos a recibir la información de la partida
    const handleMatchReady = (payload) => {
      console.log('Partida lista', payload);
      setEstadoUnirse('Cargando partida...');
    };

    // Handler para ir a combate cuando llega la info de la partida
    const handleStartInfo = (payload) => {
       console.log('Información inicial recibida', payload);
       localStorage.setItem('bombaVa_matchState', JSON.stringify(payload));
       localStorage.setItem('bombaVa_esHost', 'false'); // Guardamos que nos hemos unido, no somos host
       navigate('/combate');
    };

    // Si hay un error, como por ejemplo "Lobby no encontrado"
    const handleLobbyError = (payload) => {
      console.log('Error del lobby:', payload);
      setErrorBusqueda(payload.message || 'Error al unirse a la sala.');
    };

    // Escuchamos los siguientes eventos:
    socket.on('match:ready', handleMatchReady);
    socket.on('match:startInfo', handleStartInfo);
    socket.on('lobby:error', handleLobbyError);

    // Cerramos los listeners al salir de la pantalla
    return () => {
      socket.off('match:ready', handleMatchReady);
      socket.off('match:startInfo', handleStartInfo);
      socket.off('lobby:error', handleLobbyError);
    };
  }, [navigate]);

  // Función que se ejecuta al pulsar el botón "Unirse"
  const handleUnirse = (e) => {
    e.preventDefault();
    if (codigo !== '') {
      setErrorBusqueda(''); // Quitar errores previos
      console.log(`Intentando unirse a la sala con código: ${codigo}`);

      // Emitimos el evento de unirse a la sala mediante WebSocket
      socket.emit('lobby:join', { codigo });
    }
  };

  return (
    <div className="unirse-container">
      <div className="unirse-card">
        <h2>Unirse a Partida</h2>
        <p>Introduce el código de la sala para unirte a la partida.</p>

        {errorBusqueda && (
          <div className="error-mensaje">
            {errorBusqueda}
          </div>
        )}

        <form onSubmit={handleUnirse} className="unirse-form">
          <input
            type="text"
            placeholder="Código de la sala"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)} // Cada vez que el usuario escribe algo, se actualiza el estado del código
            className="unirse-input"
            required // Hace que el campo sea obligatorio
            maxLength={20} // Limita la longitud del código a 20 caracteres
          />

          <div className="unirse-botones">
            {estadoUnirse ? 
            (
              <p className="esperando-texto">{estadoUnirse}</p>
            ) 
            : 
            (
              <>
                <button type="button" className="btn-cancelar" onClick={() => navigate('/menuInicial')}>
                  {/* Al pulsar el botón vuelve al menu */}
                  Cancelar
                </button>
                <button type="submit" className="btn-unirse">
                  {/* Al pulsar el botón se ejecuta handleUnirse del formulario padre */}
                  Unirse
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Unirse;
