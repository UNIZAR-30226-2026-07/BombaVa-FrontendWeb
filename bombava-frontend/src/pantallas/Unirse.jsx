import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Unirse.css';

function Unirse() {
  const [codigo, setCodigo] = useState('');
  const navigate = useNavigate();

  // Función que se ejecuta al pulsar el botón "Unirse"
  // Por ahora solo redirige a combate, en un futuro validará el código y 
  // se unirá a la partida del código
  const handleUnirse = (e) => {
    e.preventDefault();
    if (codigo != '') {
      // COMPLETAR: Aquí iría la llamada a la API para validar el código y unirse a la sala
      console.log(`Intentando unirse a la sala con código: ${codigo}`);

      navigate('/combate');
    }
  };

  return (
    <div className="unirse-container">
      <div className="unirse-card">
        <h2>Unirse a Partida</h2>
        <p>Introduce el código de la sala para unirte a la partida.</p>

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
            <button type="button" className="btn-cancelar" onClick={() => navigate('/')}>
              {/* Al pulsar el botón vuelve al menu */}
              Cancelar
            </button>
            <button type="submit" className="btn-unirse">
              {/* Al pulsar el botón se ejecuta handleUnirse del formulario padre */}
              Unirse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Unirse;
