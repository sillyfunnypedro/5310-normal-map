import React, { useState, useEffect } from 'react';

import './App.css';
import CanvasGL from './CanvasGL';
import ControlComponent from './ControlComponent';
import LocalServerStatus from './LocalServerStatus';
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

  const [modelGL, setModelGL] = useState<ModelGL | null>(null);




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


  function updateTranslate(x: number, y: number) {
    if (!modelGL) {
      return;
    }
    console.log(`updateTranslate: ${x}, ${y}`);
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
      <div>
        <LocalServerStatus />
      </div>
      <CanvasGL key={renderObject} width={800} height={500} model={modelGL} renderMode={renderMode} />
      <ControlComponent
        renderObject={renderObject}
        renderMode={renderMode}
        updateRenderObject={updateRenderObject}
        updateRenderMode={updateRenderMode}
        updateTranslate={updateTranslate} />
    </header>

  </div>
  );

}

export default App;
