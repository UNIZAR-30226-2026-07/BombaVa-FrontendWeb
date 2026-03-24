import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SERVER_API } from '../utils/constantes.js'; 
import '../styles/Registrarse.css';

function Registro() {
  const [cuenta, setCuenta] = useState({ username: '', email: '', contrasena: '' });
  const navigate = useNavigate();

  const enviarDatos = async (e) => {
    e.preventDefault();//Sirve para que al enviar no se recargue la página, perdiendo el estado de toda la web (volvería a pantalla inicial)
    try {
      const res = await axios.post(SERVER_API + '/api/auth/register', cuenta);
      alert("Token recibido: " + res.data.token);
      navigate('/menuInicial');
    } catch (err) {
      alert("Error: " + err.response.data.errors[0].msg);
    }
    
  };

  return (
    <div className="contenedor-padre">
      <form className = "formulario-registro" onSubmit={enviarDatos}>
        <h2 className = "titulo">Registrar Usuario</h2>
        <input type="text" placeholder="Usuario" onChange={e => setCuenta({...cuenta, username: e.target.value})} />
        <input type="email" placeholder="Email" onChange={e => setCuenta({...cuenta, email: e.target.value})} />
        <input type="password" placeholder="Contraseña" onChange={e => setCuenta({...cuenta, contrasena: e.target.value})} />
        <button type="submit">Crear Usuario</button>
      </form>
    </div>
  );
}

export default Registro;