// App.jsx
import { useState } from 'react';
import Menu from './componentes/MenuInicio';
import Perfil from './componentes/Perfil';


function App() {
  const [pantalla, setPantalla] = useState('inicio');

  const [usuario, setUsuario] = useState({
    nombre: "Capitán Pruebas",
    rango: "Grumete de Agua Dulce",
    partidas: 42,
    victorias: 15,
    precision: "68%"
  });

  // Variable para guardar lo que se genera
  let contenido;
  // Aquí guardamos los datos del usuario (el "Estado")

  // Depende de la pantalla en la que estés cambias el estado a otra
  if (pantalla === 'inicio') {
    contenido = <Menu alClickJugar={(destino) => setPantalla(destino)} />;//Le paso al componente hijo (MenuInicio) una funcion que espera recibir un argumento destino
  }
  else if (pantalla == 'perfil'){
    // Tengo que pasar 2 cosas: los datos del perfil y para volver
    contenido = (
      <Perfil datos={usuario} 
        alVolver={() => setPantalla('inicio')} 
      />
    );
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