import React, { useState, useEffect } from 'react';

import './App.css';
import CanvasGL from './CanvasGL';
import ControlComponent from './ControlComponent';
import LocalServerStatus from './LocalServerStatus';
import ObjFileLoader from './ObjFileLoader';
import ModelGL from './ModelGL';
import { render } from '@testing-library/react';

const objLoader = ObjFileLoader.getInstance();


function App() {

  // the file name of the obj file to load.
  // this is passed to the ObjFileLoader and is the relative
  // path to the file from the public directory that is served
  // by the local server
  // 
  const [fileName, setFileName] = useState('square/square.obj');

  // the renderObject is the name of the object to render
  const [renderObject, setRenderObject] = useState('square');

  // the renderMode is the name of the mode to render
  // it can be 'solid' or 'wireframe'
  const [renderMode, setRenderMode] = useState('solid');

  const [modelGL, setModelGL] = useState<ModelGL | null>(null);



  /**
   *  This function is called when the obj file is loaded into the cache.
   */
  function loadComplete() {
    console.log('load complete');
    const model = objLoader.getModel(renderObject)!;
    setModelGL(model);
  }

  // load the model the cache
  useEffect(() => {
    objLoader.loadIntoCache(renderObject, loadComplete);
  }, [renderObject]);





  // force a re-render of CanvasGL when the demo changes
  useEffect(() => {
    setRenderObject(renderObject);

  }, [renderObject]);


  function updateRenderMode(nemMode: string) {
    setRenderMode(nemMode);
  }

  function updateRenderObject(newObject: string, newFile: string) {
    if (newObject === renderObject) {
      return;
    }

    setFileName(newFile);

    setRenderObject(newObject);
  }

  return (<div className="App">
    <header className="App-header">
      <div>
        <LocalServerStatus />
      </div>
      <CanvasGL width={800} height={500} model={modelGL} renderMode={renderMode} />
      <ControlComponent
        renderObject={renderObject}
        renderMode={renderMode}
        updateRenderObject={updateRenderObject}
        updateRenderMode={updateRenderMode} />
    </header>

  </div>
  );

}

export default App;
