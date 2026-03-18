function Inicio(){
    return(
        <div>
            <button className="boton-inicio-sesion"
                    onClick={() => navigate('/inicioSesion')}
                >
                    Iniciar Sesion
            </button>
            <button className="boton-registrarse"
                    onClick={() => navigate('/registro')}
                >
                    Registrar Usuario
            </button>
        </div>
        
    );
}

export default Inicio;