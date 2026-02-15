// App.jsx
import { useState } from 'react';
import Menu from './componentes/MenuInicio';

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
      {contenido}
    </div>
  );
}

export default App