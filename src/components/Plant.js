import React, { useState, useEffect, useRef } from "react";
import { Sprite } from "react-konva";
// import spriteImage from "../images/tree_sprite_3x3_grid_clean_clear.png";

export const Plant = ({ x, y, img, animationCoords, growthStatus, lifeSpan }) => {
  const [spriteSheet, setSpriteSheet] = useState({
    image: null,
  });

  const spriteRef = useRef();

  useEffect(() => {
    const sprite = spriteRef.current;
    if (sprite) {
      const stage = Math.min(Math.floor(
        (growthStatus / lifeSpan) * Object.keys(animationCoords).length
      ), Object.keys(animationCoords).length - 1);
      sprite.animation(stage);
    }

    const image = new window.Image();
    image.src = img;
    image.onload = () => {
      setSpriteSheet({
        image: image,
      });
    };
  }, [growthStatus, lifeSpan]);

  const minScale = 0.2;
  const maxScale = 2;
  const minY = 200;
  const maxY = window.innerHeight;

  // Map y value from [minY, maxY] to [minScale, maxScale]
  const scale = minScale + ((y - minY) / (maxY - minY)) * (maxScale - minScale) * (growthStatus / lifeSpan);

  return (
    <Sprite
      ref={spriteRef}
      x={x}
      y={y}
      image={spriteSheet.image}
      animation={0}
      animations={animationCoords}
      frameRate={10}
      frameIndex={0}
      scale={{ x: scale, y: scale }}
      offsetX={256 / 2} // half of frame width
      offsetY={256}
    />
  );
};
