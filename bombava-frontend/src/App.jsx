// App.jsx
import { Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import { useState } from 'react';
import Menu from './pantallas/MenuInicio';
import Perfil from './pantallas/Perfil';
import InfoCard from './componentes/BoatInfoCard';
import ConfigFlota from './pantallas/ConfigFlota';
import Combate from "./pantallas/Combate";
import Inicio from "./pantallas/pantallaInicio.jsx";
import Registro from "./pantallas/Registrarse.jsx";
import InicioSesion from "./pantallas/IncioSesion.jsx";
import ActionButtons from './componentes/ActionButtons.jsx';
import Unirse from './pantallas/Unirse';
import SalaEspera from './pantallas/SalaEspera';
import { NotificationContainer, ToastContainer } from './componentes/Notification.jsx';


function App() {
  return (
    <>
      <NotificationContainer />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/inicioSesion" element={<InicioSesion />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/menuInicial" element={<Menu alClickJugar={(destino) => setPantalla(destino)} />} />
        <Route path="/test" element={<Outlet />}>
          <Route path="botones" element={<ActionButtons boatId={1} />} />
          <Route path="info" element={<InfoCard boatId={1} />} />
          <Route path="info2" element={<InfoCard />} />
        </Route>
        <Route path="/profile" element={<Perfil />} />
        <Route path="/configurar" element={<ConfigFlota/>}/>
        <Route path="/combate" element={<Combate/>}/>
        <Route path="/unirse" element={<Unirse/>}/>
        <Route path="/sala-espera" element={<SalaEspera/>}/>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App