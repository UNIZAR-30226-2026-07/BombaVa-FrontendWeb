// App.jsx
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState } from 'react';
import Menu from './pantallas/MenuInicio';
import Perfil from './pantallas/Perfil';
import InfoCard from './componentes/BoatInfoCard'


function App() {
  const [pantalla, setPantalla] = useState('inicio');

  return (
    <>
      <Routes>
        <Route path="/" element={<Menu alClickJugar={(destino) => setPantalla(destino)} />} />
        <Route path="/info" element={<InfoCard boatId={1} />} />
        <Route path="/profile" element={<Perfil />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App