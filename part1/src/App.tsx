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

  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [translateZ, setTranslateZ] = useState(0);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [rotateZ, setRotateZ] = useState(0);
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);
  const [scaleZ, setScaleZ] = useState(1);
  const [camera, setCamera] = useState(new Camera());
  const [cameraDistance, setCameraDistance] = useState(2);
  const [renderFrame, setRenderFrame] = useState(0);




  useEffect(() => {
    setRenderObject('tri-plain');
    setRenderMode('solid');
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

    });
  }, [renderObject]);


  function updateTranslate(x: number, y: number, z: number) {
    if (!modelGL) {
      return;
    }
    setTranslateX(x);
    setTranslateY(y);
    setTranslateZ(z);
    console.log(`updateTranslate: ${x}, ${y}, ${z}`);
  }

  function updateRotate(x: number, y: number, z: number) {
    if (!modelGL) {
      return;
    }
    setRotateX(x);
    setRotateY(y);
    setRotateZ(z);

    console.log(`updateRotate: ${x}, ${y}, ${z}`);
  }

  function updateScale(x: number, y: number, z: number) {
    if (!modelGL) {
      return;
    }
    setScaleX(x);
    setScaleY(y);
    setScaleZ(z);

    console.log(`updateScale (APP)_: ${x}, ${y}, ${z}`);
  }

  function updateCamera(newCamera: Camera) {
    if (!modelGL) {
      return;
    }
    setCamera(newCamera);
    setRenderFrame(renderFrame + 1);
  }

  function updateCameraDistance(distance: number) {
    if (!modelGL) {
      return;
    }
    setCameraDistance(distance);
  }


  // force a re-render of CanvasGL when the demo changes
  // useEffect(() => {
  //   setRenderObject(renderObject);
  // }, [renderObject]);


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

      <CanvasGL key={renderObject}
        width={800} height={500}
        model={modelGL} renderMode={renderMode}
        projectionMode={projectionMode}
        rotateX={rotateX} rotateY={rotateY}
        rotateZ={rotateZ}
        translateX={translateX} translateY={translateY} translateZ={translateZ}
        scaleX={scaleX} scaleY={scaleY} scaleZ={scaleZ}
        cameraDistance={cameraDistance}
        camera={camera}
        renderFrame={renderFrame} />
      <ControlComponent
        renderObject={renderObject}
        renderMode={renderMode}
        projectionMode={projectionMode}
        updateRenderObject={updateRenderObject}
        updateRenderMode={updateRenderMode}
        updateProjectionMode={setProjectionMode}
        updateTranslate={updateTranslate}
        updateRotate={updateRotate}
        updateScale={updateScale}
        updateCameraDistance={updateCameraDistance}
      />
      <CameraControlComponent updateCamera={updateCamera} />

    </header>

  </div>
  );

}

export default App;
