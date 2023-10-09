import React, { useState, useEffect } from 'react';

import './App.css';
import CanvasGL from './CanvasGL';
import ControlComponent from './ControlComponent';
import CameraControlComponent from './CameraControlComponent';
import Camera from './Camera';
import ObjFileLoader from './ObjFileLoader';
import MaterialFileLoader from './MaterialFileLoader';
import ModelGL from './ModelGL';
import { render } from '@testing-library/react';
import PPMFileLoader from './PPMFileLoader';
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

  // the renderMode is the name of the mode to render
  // it can be 'solid' or 'wireframe'
  const [renderMode, setRenderMode] = useState('solid');
  const [projectionMode, setProjectionMode] = useState('perspective');

  const [modelGL, setModelGL] = useState<ModelGL | null>(null);

  const [camera, setCamera] = useState(new Camera());
  const [cameraDistance, setCameraDistance] = useState(2);




  useEffect(() => {
    setRenderObject('tri-plain');
    setRenderMode('solid');
    setupCanvas();
    updateSceneData(modelGL, camera)
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
  }, [renderObject]);


  // this function is passed to the CameraControlComponent
  function updateCamera(newCamera: Camera) {
    if (!modelGL) {
      return;
    }
    setCamera(newCamera);

    updateSceneData(modelGL, newCamera);
  }

  function updateCameraDistance(distance: number) {
    if (!modelGL) {
      return;
    }
    setCameraDistance(distance);
  }



  // these two functions are passed to the ControlComponent
  // and are called when the user changes the render mode or
  // the render object
  function updateRenderMode(nemMode: string) {
    setRenderMode(nemMode);
  }

  function updateRenderObject(newObject: string) {
    if (newObject === renderObject) {
      return;
    }

    setRenderObject(newObject);
  }

  return (<div className="App">
    <header className="App-header">
      <canvas id="glCanvas" width="800" height="500"></canvas>

      <ControlComponent
        renderObject={renderObject}
        renderMode={renderMode}
        projectionMode={projectionMode}
        updateRenderObject={updateRenderObject}
        updateRenderMode={updateRenderMode}
        updateProjectionMode={setProjectionMode}
        updateCameraDistance={updateCameraDistance}
        modelGL={modelGL}
      />
      <CameraControlComponent updateCamera={updateCamera} />

    </header>
    <body>

    </body>

  </div>
  );

}

export default App;
