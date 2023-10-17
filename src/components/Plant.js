import React, { useState, useEffect, useRef } from "react";
import { Sprite } from "react-konva";
// import spriteImage from "../images/tree_sprite_3x3_grid_clean_clear.png";

export const Plant = ({ x, y, img, growthStatus, lifeSpan }) => {
  const [spriteSheet, setSpriteSheet] = useState({
    image: null,
  });

  const spriteRef = useRef();

  useEffect(() => {
    const sprite = spriteRef.current;
    if (sprite) {
      const stage = Math.min(Math.floor((growthStatus / lifeSpan) * 9), 8);
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

  return (
    <Sprite
      ref={spriteRef}
      x={x}
      y={y}
      image={spriteSheet.image}
      animation={0}
      animations={{
        0: [0, 0, 256, 256],
        1: [256, 0, 256, 256],
        2: [512, 0, 256, 256],
        3: [0, 256, 256, 256],
        4: [256, 256, 256, 256],
        5: [512, 256, 256, 256],
        6: [0, 512, 256, 256],
        7: [256, 512, 256, 256],
        8: [512, 512, 256, 256],
      }}
      frameRate={10}
      frameIndex={0}
    />
  );
};
