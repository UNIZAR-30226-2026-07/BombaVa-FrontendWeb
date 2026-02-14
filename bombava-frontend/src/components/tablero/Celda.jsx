import './tablero.css'; 

const Celda = ({ x, y, tipo_terreno, barco, onClick }) => {
  
  const tipoCelda = `celda celda-${tipo_terreno}`;

  return (
    <div 
      className={tipoCelda} 
      onClick={() => onClick(x, y)}
    >
      {barco && (
        <div className="barco-fragmento">
        </div>
      )}
    </div>
  );
};

export default Celda;