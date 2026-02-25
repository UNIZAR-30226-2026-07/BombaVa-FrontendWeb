import { useNavigate } from 'react-router-dom';
import '../styles/MenuInicio.css';

function MenuInicio({ alClickJugar }) {//Cojo de los props del padre la funcion que me pasa llamada alClickJugar
  
  const navigate = useNavigate();

  return (
    <div className="menu-container">
      {/* Iconos superiores */}
      <div className="header-icons">
        <button className="icon-btn" >🛠️</button>
        <button className="icon-btn" onClick={() => navigate('/profile')}>👤</button>
      </div>

      {/* Botones principales */}
      <div className="grupo-botones">
        <button className="menu-btn" onClick={() => alClickJugar('configurar')}>CONFIGURAR FLOTA</button>{/*Aqui le pasas el argumento (pantalla a la que va)*/} 
        <button className="menu-btn">COMPETITIVO</button>
        <button className="menu-btn" onClick={() => alClickJugar('juego')}>PRÁCTICA</button>
        <button className="menu-btn">UNIRSE</button>
      </div>
    </div>
  );
}

export default MenuInicio;