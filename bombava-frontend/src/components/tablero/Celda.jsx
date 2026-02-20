import './Celda.css'; 
import { TAMANO_CELDA,COLORES_TERRENO } from '../../utils/constantes.js';

const Celda = ({ x, y, tipo_terreno, onClick }) => {
  
  const tipoCelda = `celda celda-${tipo_terreno}`;

  return (
    <div 
      className={tipoCelda} 
      onClick={() => onClick(x, y)}
      style={{
          width: `${TAMANO_CELDA}px`,
          height: `${TAMANO_CELDA}px`,
          backgroundColor: COLORES_TERRENO[tipo_terreno]
      }}
    >
    </div>
  );
};

export default Celda;