import React, { useState, useEffect, useRef } from "react";
import { Sprite } from "react-konva";
import Konva from "konva";
import spriteImage from "../images/tree_sprite_3x3_grid_clean_clear.png";

import useImage from "use-image";

export const Plant = ({ x, y, growthStatus, lifeSpan }) => {
  const [imgOptions, setImgOptions] = useState({
    image: null,
  });

  const spriteRef = useRef();
  // const [image] = useImage(spriteImage);

  useEffect(() => {
    const sprite = spriteRef.current;
    if (sprite) {
      const stage = Math.floor((growthStatus / lifeSpan) * 9);
      sprite.animation(stage);
    }
  }, [growthStatus, lifeSpan]);

  useEffect(() => {
    const sprite = spriteRef.current;

    const image = new window.Image();
    image.src = spriteImage;
    // image.src = "../images/tree_sprite_3x3_grid_clean_clear.png";
    // image.src = "https://konvajs.github.io/assets/blob-sprite.png";
    image.onload = () => {
      // set image only when it is loaded
      setImgOptions({
        image: image,
      });
      // spriteRef.current.start();
    };


    if (sprite) {
      console.log("growthStatus", growthStatus);
      console.log("lifeSpan", lifeSpan);
      const stage = Math.min(Math.floor((growthStatus / lifeSpan) * 9), 8);
      console.log("stage", stage);
      console.log("stage string", stage.toString());
      console.log("sprite", sprite);
      // console.log("spriteImage", imgOptions.image);
      sprite.animation(stage);
    }
  }, [growthStatus, lifeSpan]);

  // console.log("img", spriteImage);
  return (
      <Sprite
        ref={spriteRef}
        x={x}
        y={y}
        image={imgOptions.image}
        animation={8}
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
