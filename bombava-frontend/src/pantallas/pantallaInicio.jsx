import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PantallaInicio.css';

function Inicio(){
    const navigate = useNavigate();

    return(
        <div className='contenedor-padre'>
            <div className="contenedor-titulo">
                <div className="cuerda cuerda-izq"></div>
                <div className="cuerda cuerda-der"></div>
                <h1 className="titulo-bombava">BombaVa</h1>
            </div>

            <div className="contenedor-botones-horizontales">
                <div className="contenedor-boton-colgante boton-izquierda">
                    <div className="cuerda cuerda-izq"></div>
                    <div className="cuerda cuerda-der"></div>
                    <button className="boton-inicio-sesion"
                            onClick={() => navigate('/inicioSesion')}>
                            Iniciar Sesión
                    </button>
                </div>

                <div className="contenedor-boton-colgante boton-derecha">
                    <div className="cuerda cuerda-izq"></div>
                    <div className="cuerda cuerda-der"></div>
                    <button className="boton-registrarse"
                            onClick={() => navigate('/registro')}>
                            Registrar Usuario
                    </button>
                </div>
            </div>
        </div>
        
    );
}

export default Inicio;