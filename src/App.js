import React from "react";
import GardenContainer from "./components/GardenContainer";
// import { DndProvider } from "react-dnd";
import { DndProvider } from 'react-dnd-multi-backend'
import { HTML5toTouch } from 'rdndmb-html5-to-touch' // or any other pipeline


function App() {
  return (
    <div className="App">
      <DndProvider options={HTML5toTouch}>
        <GardenContainer />
      </DndProvider>
    </div>
  );
}

export default App;
