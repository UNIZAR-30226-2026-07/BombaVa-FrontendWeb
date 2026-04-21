const Proyectil = ({ proyectil}) => {
    // Calculamos la posición y dimensiones en porcentajes relativos al tablero
      // Ya que el tablero será responsive, el tamaño de la celda cambia, por lo que hay que calcularlo
      // en base al tamaño del tablero.
      const porcentajeCelda = 100 / TAMANO_TABLERO;
      const PosIzq = proyectil.x * porcentajeCelda;
      const PosArriba = proyectil.y * porcentajeCelda;
    
      //Nombre de la clase basado en el estado y tipo del barco
      let nombreClase = 'proyectil-entidad';
      if (estaSeleccionado) nombreClase += ' seleccionado';
      if (barco.esEnemigo) nombreClase += ' enemigo';
      else nombreClase += ' aliado';
    
    
      return (
        <div
          className={nombreClase}
          style={{
            left: `${PosIzq}%`,
            top: `${PosArriba}%`,
          }}
        >
          {/*Divido la parte visual y la de la entidad de barco*/}
          <div 
            className="barco-visual"
            onClick={handleBarcoClick}
          >
            
            <img 
              src={IMAGENES_BARCOS[barco.tamano]} 
              alt={`Barco tipo ${barco.tipo}`}
              className={`barco-imagen ${barco.orientacion} ${barco.esEnemigo ? 'enemigo' : 'aliado'}`}
              style={{
                  width: esHorizontal ? '100%' : `${barco.tamano * 100}%`,
                  height: esHorizontal ? `${barco.tamano * 120}%` : '100%'
              }}
            />
    
          </div>
        </div>
    );
    
};

export default Proyectil;