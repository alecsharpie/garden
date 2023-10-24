import React, { useState, useEffect, useRef } from "react";
import { Sprite } from "react-konva";
// import spriteImage from "../images/tree_sprite_3x3_grid_clean_clear.png";

export const Plant = ({
  x,
  y,
  img,
  animationCoords,
  growthStatus,
  lifeSpan,
  flip
}) => {
  const [spriteSheet, setSpriteSheet] = useState({
    image: null,
  });

  const spriteRef = useRef();

  useEffect(() => {
    const sprite = spriteRef.current;
    if (sprite) {
      const base = 2; // log base, change this to adjust the rate of increase
      const linearWeight = 0.8; // linear component (growthStatus / lifeSpan)
      const logWeight = 0.2; // logarithmic component

      const stage = Math.min(
        Math.floor(
          (linearWeight * (growthStatus / lifeSpan) +
            logWeight * (Math.log(growthStatus + 1) / Math.log(lifeSpan + 1))) *
            base *
            Object.keys(animationCoords).length
        ),
        Object.keys(animationCoords).length - 1
      );
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
  const scale =
    minScale +
    ((y - minY) / (maxY - minY)) *
      (maxScale - minScale) *
      (growthStatus / lifeSpan);

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
      scale={{ x: scale * flip, y: scale }}
      offsetX={256 / 2} // half of frame width
      offsetY={256}
    />
  );
};
