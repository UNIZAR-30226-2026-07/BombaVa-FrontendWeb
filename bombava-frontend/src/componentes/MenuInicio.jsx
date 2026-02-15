import './MenuInicio.css';

function MenuInicio({ alClickJugar }) {
  return (
    <div className="menu-container">
      {/* Iconos superiores */}
      <div className="header-icons">
        <button className="icon-btn">🛠️</button>
        <button className="icon-btn">👤</button>
      </div>

      {/* Botones principales */}
      <div className="grupo-botones">
        <button className="menu-btn" onClick={() => alClickBoton('configurar')}>CONFIGURAR FLOTA</button>{/*Aqui le pasas el argumento (pantalla a la que va)*/} 
        <button className="menu-btn">COMPETITIVO</button>
        <button className="menu-btn" onClick={() => alClickBoton('juego')}>PRÁCTICA</button>
        <button className="menu-btn">UNIRSE</button>
      </div>
    </div>
  );
}

export default MenuInicio;