import React, { useState, useEffect } from 'react';

import './App.css';
import ControlComponent from './ControlComponent';
import CameraControlComponent from './CameraControlComponent';
import Camera from './Camera';
import ObjFileLoader from './ObjFileLoader';
import ModelGL from './ModelGL'
import { updateSceneData, setupCanvas } from './glCanvas';

const objLoader = ObjFileLoader.getInstance();


function App() {

  // the file name of the obj file to load.
  // this is passed to the ObjFileLoader and is the relative
  // path to the file from the public directory that is served
  // by the local server
  // 


  // the renderObject is the name of the object to render
  const [renderObject, setRenderObject] = useState('tri-plain');

  const [modelGL, setModelGL] = useState<ModelGL | null>(null);

  const [camera, setCamera] = useState(new Camera());





  useEffect(() => {
    setRenderObject('tri-plain');
    setupCanvas();
    updateSceneData(modelGL, camera);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // load the obj file and then use the model in the promise to set the modelGL
  useEffect(() => {
    let objPromise = objLoader.getModel(renderObject)
    objPromise.then((model) => {
      if (!model) {
        console.log('no model');
        return;
      }
      setModelGL(model);
      updateSceneData(model, camera);

    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderObject]);


  // this function is passed to the CameraControlComponent
  function updateCamera(newCamera: Camera) {
    if (!modelGL) {
      return;
    }
    setCamera(newCamera);

    updateSceneData(modelGL, newCamera);
  }


  function updateRenderObject(newObject: string) {
    if (newObject === renderObject) {
      return;
    }

    setRenderObject(newObject);
  }

  return (<div className="App">
    <header className="App-header">
      <table>
        <thead>
          <tr>
            <th>
              <canvas id="glCanvas" width="800" height="500"></canvas>
            </th>
            <th>
              <CameraControlComponent camera={camera!} updateCamera={updateCamera} />
            </th>
          </tr>
        </thead>
      </table>


      <ControlComponent
        renderObject={renderObject}
        updateRenderObject={updateRenderObject}
        modelGL={modelGL}
      />


    </header>


  </div>
  );

}

export default App;
