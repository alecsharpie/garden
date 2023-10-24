import React, { useState, useEffect, useRef, useCallback } from "react";
import { Stage, Layer, Image } from "react-konva";
import { Plant } from "./Plant";
import { speciesData } from "../consts/SpeciesData";
import { quadtree } from "d3-quadtree";
import useImage from "use-image";
import { useDrop } from "react-dnd";
import backgroundImagePng from "../images/background.png";
import DraggableSprite from "./DraggableSprite";
import "./GardenContainer.css";

const groundHeight = 0.39 * window.innerHeight; // where sky meets ground, height of sky

function gaussianRand() {
  var rand = 0;
  for (var i = 0; i < 6; i += 1) {
    rand += Math.random();
  }
  return rand / 6;
}

const generatePlant = (species) => {
  const data = speciesData[species];
  if (!data) {
    throw new Error(`Unknown species: ${species}`);
  }
  return {
    id: Math.random(),
    species: species,
    img: data.img,
    animationCoords: data.animationCoords,
    x: Math.random() * window.innerWidth,
    y: Math.random() * (window.innerHeight - groundHeight) + groundHeight, // Can't spawn in the sky
    growthStatus: 1,
    growthRate: data.baseGrowthRate + Math.random() * data.baseGrowthRate * 2,
    lifeCycle: "seed",
    seedsNum: data.seedsNum,
    seedsAge: data.seedsAge,
    sproutChance: data.sproutChance,
    dispersion: data.dispersion,
    lifeSpan: data.lifeSpan,
    flip: Math.random() < 0.5 ? -1 : 1, // flip the plant half the time
  };
};

const generatePlants = (plantsObject) => {
  let plants = [];
  for (let plant in plantsObject) {
    for (let i = 0; i < plantsObject[plant]; i++) {
      plants.push(generatePlant(plant));
    }
  }
  return plants;
};

const GardenContainer = () => {
  const [plants, setPlants] = useState(
    generatePlants({
      tree: 1,
      grass: 20,
      yellowFlower: 3,
      whiteFlower: 3,
      lightPinkFlower: 2,
      pinkFlower: 2,
      tulipFlower: 1,
    }),
  );
  const [isPlaying, setIsPlaying] = useState(true);
  const [shouldRefill, setShouldRefill] = useState(false);
  const [timePast, setTimePast] = useState(0);

  const [image] = useImage(backgroundImagePng);

  // Simulation loop
  const plantsRef = useRef(plants);

  const stageRef = useRef();

  const clearPlants = () => {
    setPlants([]);
  };

  const downloadScreenshot = () => {
    const dataUrl = stageRef.current.toDataURL();
    const link = document.createElement("a");
    link.download = "screenshot.png";
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Inside GardenContainer component
  const [, drop] = useDrop({
    accept: "sprite",
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const newPlant = generatePlant(item.species);
      newPlant.x = offset.x;
      newPlant.y = offset.y;
      setPlants((prevPlants) => [...prevPlants, newPlant]);
    },
  });

  useEffect(() => {
    plantsRef.current = plants;
  }, [plants]);

  const animate = useCallback(() => {
    setTimePast((timePast) => timePast + 0.2);

    let newPlants = [];

    // First filter out the plants that should die
    let livingPlants = plantsRef.current.filter((plant) => {
      if (plant.growthStatus < plant.lifeSpan) {
        return true;
      } else {
        // Here we add a random chance for the plant to survive even if its growthStatus is greater than its lifeSpan.
        // This will give a 50% chance for the plant to survive. Adjust the value to fit your needs.
        return Math.random() > 0.5;
      }
    });

    console.log("livingplants", livingPlants);

    const tree = quadtree()
      .x((d) => d.x)
      .y((d) => d.y)
      .addAll(livingPlants);

    // If all plants are dead or off screen, add a new one
    if (
      shouldRefill &&
      (livingPlants.length === 0 ||
        livingPlants.every(
          (plant) =>
            plant.x < 0 ||
            plant.x > window.innerWidth ||
            plant.y < 0 ||
            plant.y > window.innerHeight,
        ))
    ) {
      console.log("autorefill plants");

      const newPlants = [generatePlant("tree"), generatePlant("grass")];
      setPlants(newPlants);
      livingPlants = newPlants.slice();
    }

    // Calculate the number of new plants that can be added
    let availableSlots = 500 - plantsRef.current.length;

    // Then map over the remaining plants to update their properties
    let updatedPlants = livingPlants.map((plant) => {
      let updatedPlant = { ...plant }; // Create a new object to avoid mutation

      let sproutChance = updatedPlant.sproutChance;

      tree.remove(plant); // Remove the current plant from the tree
      const nearest = tree.find(plant.x, plant.y, 100); // Find the nearest plant within a radius of 50
      tree.add(plant);
      if (nearest) {
        // // Slow down growth if the nearest plant is bigger
        // const delta = nearest.growthStatus - plant.growthStatus;
        // if (delta > 0) {
        //   updatedPlant.growthRate =
        //     updatedPlant.growthRate * Math.min((1 / delta, 0.5));
        // }
      }
      updatedPlant.growthStatus += updatedPlant.growthRate;

      if (updatedPlant.growthStatus > updatedPlant.seedsAge) {
        for (let i = 0; i < updatedPlant.seedsNum && availableSlots > 0; i++) {
          const x_coord =
            updatedPlant.x +
            (gaussianRand() - 0.5) * updatedPlant.dispersion * 100;
          const y_coord =
            updatedPlant.y +
            (gaussianRand() - 0.5) * updatedPlant.dispersion * 100;
          const sprout_neighbor = tree.find(x_coord, y_coord, 100);
          if (sprout_neighbor) {
            const distance = Math.sqrt(
              (plant.x - sprout_neighbor.x) ** 2 +
                (plant.y - sprout_neighbor.y) ** 2,
            );
            if (distance < 10) {
              console.log("too close to sprout", distance);
              sproutChance = 0;
            } else {
              sproutChance =
                sproutChance * Math.max(0, 1 - distance / 100) + 0.1;
            }
          }
          if (Math.random() < sproutChance) {
            const newPlant = {
              id: Math.random(),
              species: updatedPlant.species,
              img: updatedPlant.img,
              animationCoords: updatedPlant.animationCoords,
              x: x_coord,
              y: y_coord,
              growthStatus: 1,
              lifeCycle: "seed",
              growthRate: updatedPlant.growthRate + gaussianRand() * 0.1,
              seedsNum: updatedPlant.seedsNum,
              sproutChance: updatedPlant.sproutChance,
              lifeSpan: updatedPlant.lifeSpan,
              dispersion: updatedPlant.dispersion + gaussianRand() * 0.1,
              flip:  Math.random() < 0.5 ? -1 : 1 // flip the plant half the time
            };
            newPlants.push(newPlant);
            availableSlots--;
          }
        }
      }
      return updatedPlant;
    });

    const allPlants = [...updatedPlants, ...newPlants];

    const displayPlants = allPlants.filter((plant) => {
      if (
        plant.x >= 0 &&
        plant.x <= window.innerWidth &&
        plant.y >= groundHeight &&
        plant.y <= window.innerHeight
      ) {
        return true;
      } else {
        return false;
      }
    });

    // Update plantsRef.current and plants state
    plantsRef.current = displayPlants;
    setPlants(displayPlants);
  }, [shouldRefill]);

  useEffect(() => {
    let intervalId;
    if (isPlaying) {
      intervalId = setInterval(animate, 1000 / 30); // 60 FPS
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, animate]);

  return (
    <div style={{ position: "relative" }}>
      <div className="container" style={{ position: "absolute", zIndex: 1 }}>
        <div className="row">
          <div>
            <h1>Do Nothing Forest</h1>
          </div>
        </div>
        <div className="row">
          <div>
            <p>
              Made by <a href="https://www.alecsharpie.me/">Alec Sharp</a>
            </p>
          </div>
        </div>
        <div className="row">
          <div className="time-counter">
            {timePast < 365 ? (
              <div>Days: {Math.floor(timePast)}</div>
            ) : (
              <>
                <div>Years: {Math.floor(timePast / 365)}</div>
                <div>Days: {Math.floor(timePast % 365)}</div>
              </>
            )}
          </div>
        </div>
        <div className="row">
          <div>
            <button
              className="fixed-width-button"
               onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? "Pause" : "Play"}
            </button>
          </div>
          <div>
            <button onClick={downloadScreenshot}>Download Screenshot</button>
          </div>
          <div>
            <button onClick={clearPlants}>Clear Plants</button>
          </div>
          <div>
            <button onClick={() => setPlants(generatePlants({ tree: 1 }))}>
              {"More trees!"}
            </button>
          </div>
          <div>
            <label>
              Auto add plants if none:
              <input
                type="checkbox"
                checked={shouldRefill}
                onChange={(e) => setShouldRefill(e.target.checked)}
              />
            </label>
          </div>
        </div>
        <div>
          <p>Drag and drop to add plants:</p>
        </div>
        <div className="flex-row">
          {Object.entries(speciesData).map(([species, data]) => (
            <DraggableSprite
              key={species}
              species={species}
              iconImage={data.icon}
            />
          ))}
        </div>
      </div>
      <div ref={drop}>
        <Stage
          ref={stageRef}
          width={window.innerWidth}
          height={window.innerHeight}
        >
          <Layer>
            <Image
              x={0}
              y={0}
              image={image}
              width={window.innerWidth}
              height={window.innerHeight}
            />
          </Layer>
          <Layer>
            {plants
              .sort((a, b) => a.y - b.y)
              .map((plant) => (
                <Plant
                  key={plant.id}
                  x={plant.x}
                  y={plant.y}
                  img={plant.img}
                  animationCoords={plant.animationCoords}
                  growthStatus={plant.growthStatus}
                  lifeSpan={plant.lifeSpan}
                  flip={plant.flip}
                />
              ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default GardenContainer;
