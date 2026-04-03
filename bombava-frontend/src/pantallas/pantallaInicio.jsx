import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PantallaInicio.css';

function Inicio(){
    const navigate = useNavigate();

    return(
        <div className='contenedor-padre'>
            <button className="boton-inicio-sesion"
                    onClick={() => navigate('/inicioSesion')}
                >
                    Iniciar Sesión
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