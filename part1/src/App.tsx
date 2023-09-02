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
  const [fileName, setFileName] = useState('square/square.obj');

  // the renderObject is the name of the object to render
  const [renderObject, setRenderObject] = useState('tri-plain');

  // the renderMode is the name of the mode to render
  // it can be 'solid' or 'wireframe'
  const [renderMode, setRenderMode] = useState('solid');

  const [modelGL, setModelGL] = useState<ModelGL | null>(null);


  /**
   * 
   * Load the material that is specified in the mtl file that is specified in the model
   * return a promise to the same model that was passed in
   */
  async function loadTexture(model: ModelGL, texture: string): Promise<ModelGL> {
    const ppmFileLoader = PPMFileLoader.getInstance();
    const modelPath = model.modelPath;
    if (model.material === undefined) {
      console.log('no material');
      return model;
    }

    if (model.material.map_Kd === undefined) {
      console.log('no diffuse texture');
      return model;
    }

    const diffuseTextureName = model.material.map_Kd;
    if (diffuseTextureName === '') {
      console.log('no diffuse texture name');
      return model;
    }

    console.log(`diffuse texture name: ${diffuseTextureName}`);

    // get the path to the directory that contains the model
    const modelDirectory = modelPath.substring(0, modelPath.lastIndexOf('/'));
    const texturePath = `${modelDirectory}/${diffuseTextureName}`;

    await ppmFileLoader.loadIntoCache(texturePath).then((ppmFile) => {
      if (model.material === undefined) {
        console.log('no material');
        return model;
      }
      model.material.map_Kd = texturePath; ////JUANCHO here 
    });
    return model;

  }






  // load the obj file and then use the model in the promise to set the modelGL
  useEffect(() => {
    objLoader.getModel(renderObject)
      .then((model) => {
        if (!model) {
          console.log('no model');
          return;
        }

        loadTexture(model, "").then((model) => {
          setModelGL(model);
        });

      });
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
