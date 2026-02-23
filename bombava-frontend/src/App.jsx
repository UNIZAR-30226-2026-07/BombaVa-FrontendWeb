// App.jsx
import { useState } from 'react';
import Menu from './componentes/MenuInicio';
import InfoCard from './componentes/BoatInfoCard';
import { HealthBar, ModuleInfo } from './componentes/BoatInfoCard';

function App() {
  const [pantalla, setPantalla] = useState('inicio');

  // Variable para guardar lo que se genera
  let contenido;

  // Depende de la pantalla en la que estés cambias el estado a otra
  if (pantalla === 'inicio') {
    contenido = <Menu alClickJugar={(destino) => setPantalla(destino)} />;//Le paso al componente hijo (MenuInicio) una funcion que espera recibir un argumento y cambia la pantalla
  } 

  return (
    <div className="main-container">
      <InfoCard boatId={1} id='app-infoCard' />
      <HealthBar maxHealth={100} currentHealth={75} />
      <ModuleInfo 
        moduleName="Motor"
        moduleImg="https://www.pngmart.com/files/23/Navy-Boat-PNG.png"
        moduleAlt="Imagen del motor"
        moduleMaxHealth={100}
        moduleHealth={50}
      />
    </div>
  );
}

export default App