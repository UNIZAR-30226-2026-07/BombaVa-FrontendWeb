import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../utils/socket';
import '../styles/SalaEspera.css';

function SalaEspera() {
  const [codigo, setCodigo] = useState('');
  const [errorBusqueda, setErrorBusqueda] = useState('');
  const [estadoEspera, setEstadoEspera] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Al llegar a la pantalla, pedimos al backend que nos cree una sala
    socket.emit('lobby:create');

    // Handler cuando la sala es creada exitosamente
    const handleLobbyCreated = (payload) => {
      console.log('Sala creada con código:', payload.codigo);
      setCodigo(payload.codigo);
    };

    // Handler cuando el otro jugador se une
    const handleMatchReady = (payload) => {
      console.log('Oponente encontrado. Partida lista.', payload);
      setEstadoEspera('Cargando partida...');
    };

    // Handler para ir a Combate.jsx cuando llega la info de la partida
    const handleStartInfo = (payload) => {
       console.log('Información inicial recibida', payload);
       localStorage.setItem('bombaVa_matchState', JSON.stringify(payload));
       navigate('/combate');
    };

    // Handler por si hay algún error al crear la sala
    const handleLobbyError = (payload) => {
      console.log('Error del lobby:', payload);
      setErrorBusqueda(payload.message || 'Error al crear la sala.');
    };

    // Al llegar a la pantalla escuchamos los eventos:
    socket.on('lobby:created', handleLobbyCreated);
    socket.on('match:ready', handleMatchReady);
    socket.on('match:startInfo', handleStartInfo);
    socket.on('lobby:error', handleLobbyError);

    return () => {
      // Al salir de la pantalla, dejamos de escuchar los eventos
      socket.off('lobby:created', handleLobbyCreated);
      socket.off('match:ready', handleMatchReady);
      socket.off('match:startInfo', handleStartInfo);
      socket.off('lobby:error', handleLobbyError);
    };
  }, [navigate]);

  return (
    <div className="sala-espera-container">
      <div className="sala-espera-tarjeta">
        <h2>SALA DE ESPERA</h2>
        {/* Si hay un error mostramos el mensaje de error, si no, mostramos el código de la sala */}
        {errorBusqueda ? (
          <div className="error-mensaje">
            {errorBusqueda}
          </div>
        ) : (
          <div>
            <p>Comparte este código con tu oponente para que se una a la partida:</p>
            <div className="codigo-texto">
              {/* Si hay un código, lo mostramos, si no, mostramos 'Generando...' */}
              {codigo ? codigo : 'Generando...'}
            </div>
            {/* Si hay un código, mostramos el mensaje de espera */}
            {codigo && (
              <div>
                <p className="esperando-texto">{estadoEspera || 'Esperando a que se una el oponente...'}</p>
              </div>
            )}
          </div>
        )}

        <div className="sala-espera-botones">
          <button type="button" className="btn-cancelar" onClick={() => navigate('/menuInicial')}>
            VOLVER AL MENÚ
          </button>
        </div>
      </div>
    </div>
  );
}

export default SalaEspera;
