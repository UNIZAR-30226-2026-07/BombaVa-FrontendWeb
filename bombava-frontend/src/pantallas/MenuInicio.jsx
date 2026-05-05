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
        <button className="icon-btn" onClick={() => navigate('/profile')}>
          {/*Icono Sacado de Heroicons.com*/}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
            <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
          </svg>
        </button>
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
          <div className="tablon-opcion">CREAR PARTIDA</div>
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