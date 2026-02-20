import './Perfil.css';

function Perfil({ datos, alVolver }) {
  return ( 
    <div className="contenedor_perfil">
      <button className="boton_cerrar" onClick={alVolver}>{/*Faltaría poner la función para quitar la cuenta*/}
        CERRAR SESIÓN
      </button>
      <header className="titulo_perfil"> 
        <h1>PERFIL DEL CAPITÁN</h1>
      </header>
      <div className="circulo_perfil">
        ☠️
      </div>
    {/* AQUÍ SACAMOS LOS DATOS */}
      <div className="info_capitan">
        <h2>{datos.nombre}</h2>
        <p className="rango">{datos.rango}</p>
        
        <div className="estats">
          <p><strong>Partidas:</strong> {datos.partidas}</p>
          <p><strong>Victorias:</strong> {datos.victorias}</p>
          <p><strong>Precisión:</strong> {datos.precision}</p>
        </div>
      </div>

      <button className="boton_volver" onClick={alVolver}>
        VOLVER AL PUERTO
      </button>
    </div>
  );
}

export default Perfil;