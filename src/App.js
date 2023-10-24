import React from "react";
import GardenContainer from "./components/GardenContainer";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}>
        <GardenContainer />
      </DndProvider>
    </div>
  );
}

export default App;
