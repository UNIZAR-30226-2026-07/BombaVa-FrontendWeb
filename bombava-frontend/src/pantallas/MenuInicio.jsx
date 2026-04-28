import { useNavigate } from 'react-router-dom';
import '../styles/MenuInicio.css';

import fondoMenu from '../assets/imagenes_diseno/MenuFondo.png';
import iconoMartillo from '../assets/imagenes_diseno/martillo.png';
import iconoCalavera from '../assets/imagenes_diseno/calavera.png';
import iconoBarril from '../assets/imagenes_diseno/barril.png';
import iconoBrujula from '../assets/imagenes_diseno/brujula.png';
import imagenTablon from '../assets/pantallaInicio/tablon.png';

function MenuInicio({ }) {

  const navigate = useNavigate();
  
  return (
    <div className="menu-container">
      {/* Iconos superiores */}
      <div className="header-icons">
        <button className="icon-btn" >🛠️</button>
        <button className="icon-btn" onClick={() => navigate('/profile')}>👤</button>
      </div>

      {/* Mapa de Navegación Opciones */}
      <div className="mapa-navegacion">
        
        {/* Configurar Flota */}
        <div className="opcion-mapa config" onClick={() => navigate('/configurar')}>
          <div className="tablon-opcion">CONFIGURAR FLOTA</div>
          <img src={iconoMartillo} alt="Martillo" className="icono-opcion" />
          <div className="pergamino">
            Prepara tus barcos, elige tu armamento y diseña una formación para ganar la batalla.
          </div>
        </div>

        {/* Competitivo */}
        <div className="opcion-mapa competitivo" onClick={() => navigate('/sala-espera')}>
          <div className="tablon-opcion">COMPETITIVO</div>
          <img src={iconoCalavera} alt="Calavera y dos espadas" className="icono-opcion" />
          <div className="pergamino">
            Enfréntate a otros capitanes en batallas navales.
          </div>
        </div>

        {/* Práctica */}
        <div className="opcion-mapa practica" onClick={() => navigate('/un-jugador')}>
          <div className="tablon-opcion">UN JUGADOR</div>
          <img src={iconoBarril} alt="Barril" className="icono-opcion" />
          <div className="pergamino">
            Perfecciona tu puntería sin riesgo.
          </div>
        </div>

        {/* Unirse */}
        <div className="opcion-mapa unirse" onClick={() => navigate('/unirse')}>
          <div className="tablon-opcion">UNIRSE</div>
          <img src={iconoBrujula} alt="Brujula" className="icono-opcion" />
          <div className="pergamino">
            Entra en una batalla ya creada introduciendo el código de sala de tu rival.
          </div>
        </div>

      </div>
    </div>
  );
}

export default MenuInicio;