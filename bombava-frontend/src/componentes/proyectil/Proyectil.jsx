const Proyectil = ({ proyectil}) => {
    return(
        <div
            className={nombreClase}
            style={{
                x: `${proyectil.x}%`,
                y: `${proyectil.y}%`
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
    )
    
};

export default Proyectil;