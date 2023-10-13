import React from "react";
import { Circle } from "react-konva";
import { Image } from "react-konva";
import useImage from "use-image";

// export const Plant = ({ x, y, growthStatus }) => {
//   return <Circle x={x} y={y} radius={growthStatus} fill="green" />;
// };

export const Plant = ({ x, y, img, growthStatus, lifeCycle }) => {
  const [image] = useImage(img);

  if (lifeCycle === "dead") {
    return (
      <Image
        x={x - (32 / 2)}
        y={y}
        image={image}
        width={32}
        height={-32}
      />
    );
  } else {
    return (
      <Image
        x={x - growthStatus / 2}
        y={y}
        image={image}
        width={growthStatus}
        height={-growthStatus}
      />
    );
  }
};
