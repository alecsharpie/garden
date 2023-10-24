import React, { useState, useEffect, useRef } from "react";
import { useDrag } from "react-dnd";

const DraggableSprite = ({ species, iconImage }) => {

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "sprite",
    item: { species },
    canDrag: !!species,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <img src={iconImage} alt={species} />
    </div>
  );
};

export default DraggableSprite;
