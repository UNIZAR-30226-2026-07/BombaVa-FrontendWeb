import { useState } from 'react';
import axios from 'axios';

function Registro() {
  const [cuenta, setCuenta] = useState({ username: '', email: '', contrasena: '' });

  const enviarDatos = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/v1/auth/register', form);
      alert("Token recibido: " + res.data.token);
    } catch (err) {
      alert("Error: " + err.response.data.errors[0].msg);
    }
  };

  return (
    <form onSubmit={enviarDatos}>
      <input type="text" placeholder="Username" onChange={e => setCuenta({...cuenta, username: e.target.value})} />
      <input type="email" placeholder="Email" onChange={e => setCuenta({...cuenta, email: e.target.value})} />
      <input type="password" placeholder="Password" onChange={e => setCuenta({...cuenta, contrasena: e.target.value})} />
      <button type="submit">Crear Usuario</button>
    </form>
  );
}