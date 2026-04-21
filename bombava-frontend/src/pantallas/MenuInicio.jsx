import { useNavigate } from 'react-router-dom';
import '../styles/MenuInicio.css';

import fondoMenu from '../assets/opciones/MenuFondo.png';
import iconoMartillo from '../assets/opciones/martillo.png';
import iconoCalavera from '../assets/opciones/calavera.png';
import iconoBarril from '../assets/opciones/barril.png';
import iconoBrujula from '../assets/opciones/brujula.png';
import imagenTablon from '../assets/inicio/tablon.png';

function MenuInicio({ }) {

  const navigate = useNavigate();

  return (
    <div className="menu-container-mapa">
      {/* Iconos superiores */}
      <div className="header-icons">
        <button className="icon-btn">🛠️</button>
        <button className="icon-btn" onClick={() => navigate('/profile')}>👤</button>
      </div>

      {/* Mapa de Navegación Opciones */}
      <div className="mapa-navegacion">
        
        {/* Configurar Flota */}
        <div className="opcion-mapa config" onClick={() => navigate('/configurar')}>
          <div className="tablon-opcion">CONFIGURAR FLOTA</div>
          <img src={iconoMartillo} alt="Martillo" className="icono-opcion" />
        </div>

        {/* Competitivo */}
        <div className="opcion-mapa competitivo" onClick={() => navigate('/combate')}>
          <div className="tablon-opcion">COMPETITIVO</div>
          <img src={iconoCalavera} alt="Calavera y dos espadas" className="icono-opcion" />
        </div>

        {/* Práctica */}
        <div className="opcion-mapa practica" onClick={() => navigate('/sala-espera')}>
          <div className="tablon-opcion">PRÁCTICA</div>
          <img src={iconoBarril} alt="Barril" className="icono-opcion" />
        </div>

        {/* Unirse */}
        <div className="opcion-mapa unirse" onClick={() => navigate('/unirse')}>
          <div className="tablon-opcion">UNIRSE</div>
          <img src={iconoBrujula} alt="Brujula" className="icono-opcion" />
        </div>

      </div>
    </div>
  );
}

export default MenuInicio;