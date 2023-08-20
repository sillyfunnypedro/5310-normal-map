import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import CanvasGL from './CanvasGL';
import ControlComponent from './ControlComponent';
import LocalServerStatus from './LocalServerStatus';

function App() {

  const [demo, setDemo] = useState('triangle');
  const [triangles, setTriangles] = useState(3);
  // triangles will be passed to CanvasGL as a prop, it will range between 1 and 6
  // for the triangle/square demo the value 1 will indicate triangle, the value 2 will indicate square
  // for the hexagon the display should add the right number of triangles based on this value
  // it is controlled by a slider



  function updateTriangles(event: React.ChangeEvent<HTMLInputElement>) {
    setTriangles(parseInt(event.target.value));
  }

  // fetch('http://localhost:8080/objects/husky/husky.obj')
  //   .then((response) => {
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  //     return response;
  //   })
  //   .then((response => response.text()))
  //   .then((data) => {
  //     console.log(data);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });

  // force a re-render of CanvasGL when the demo changes
  useEffect(() => {
    setDemo(demo);
  }, [demo, triangles]);


  function updateDemoState(demo: string) {
    setDemo(demo);
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <LocalServerStatus />
          <label>{`render ${triangles} triangles`}</label>
          <input type="range" min="1" max="6" step="1" value={triangles} onChange={updateTriangles} />
        </div>
        <CanvasGL key={triangles} width={800} height={500} demo={demo} triangles={triangles} />
        <ControlComponent demo={demo} setDemo={updateDemoState} />
      </header>

    </div>
  );
}

export default App;
