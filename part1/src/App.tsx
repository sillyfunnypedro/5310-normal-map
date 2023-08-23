import React, { useState, useEffect } from 'react';

import './App.css';
import CanvasGL from './CanvasGL';
import ControlComponent from './ControlComponent';
import LocalServerStatus from './LocalServerStatus';
import ObjFileLoader from './ObjFileLoader';
import ModelGL from './ModelGL';

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


  const [modelString, setModelString] = useState('');
  const [modelGL, setModelGL] = useState<ModelGL | null>(null);
  // triangles will be passed to CanvasGL as a prop, it will range between 1 and 6
  // for the triangle/square demo the value 1 will indicate triangle, the value 2 will indicate square
  // for the hexagon the display should add the right number of triangles based on this value
  // it is controlled by a slider

  // get the value of the file input
  objLoader.loadIntoCache(fileName); // it is okay to call this repeatedly since in most cases it is a no-op



  if (modelString === '') {

    const newString = objLoader.getFile(fileName);
    if (newString !== modelString) {
      setModelString(newString);
      let newModelGL = new ModelGL();
      newModelGL.parseModel(newString);
      setModelGL(newModelGL);

    }
  }





  // force a re-render of CanvasGL when the demo changes
  useEffect(() => {
    setRenderObject(renderObject);

  }, [renderObject]);


  function updateRenderMode(nemMode: string) {
    setRenderMode(nemMode);
  }

  function updateRenderObject(newObject: string) {
    if (newObject === renderObject) {
      return;
    }

    if (newObject === 'triangle') {
      setFileName('triangle/triangle.obj');
    }
    else if (newObject === 'square') {
      setFileName('square/square.obj');
    }
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
