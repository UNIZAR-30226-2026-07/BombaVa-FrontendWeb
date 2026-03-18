import { useState } from 'react';
import axios from 'axios';
import { SERVER_API } from '../utils/constantes.js'; 

function InicioSesion() {
  const [cuenta, setCuenta] = useState({ email: '', contrasena: '' });

  const enviarDatos = async (e) => {
    e.preventDefault();//Sirve para que al enviar no se recargue la página, perdiendo el estado de toda la web (volvería a pantalla inicial)
    try {
      const res = await axios.post(SERVER_API + '/api/auth/login', form);
      alert("Token recibido: " + res.data.token);
    } catch (err) {
      alert("Error: " + err.response.data.errors[0].msg);
    }
  };

  return (
    <form className= "formulario-incio-sesion" onSubmit={enviarDatos}>
      <input type="email" placeholder="Email" onChange={e => setCuenta({...cuenta, email: e.target.value})} />
      <input type="password" placeholder="Password" onChange={e => setCuenta({...cuenta, contrasena: e.target.value})} />
      <button type="submit">Crear Usuario</button>
    </form>
  );
}

export default InicioSesion;