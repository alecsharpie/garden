import React, { useState, useEffect, useRef, useCallback } from "react";
import { Stage, Layer } from "react-konva";
import { Plant } from "./Plant";
import { speciesData } from "../consts/SpeciesData";
import { quadtree } from "d3-quadtree";

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
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    growthStatus: 1,
    growthRate: data.baseGrowthRate + Math.random() * data.baseGrowthRate * 2,
    lifeCycle: "seed",
    seedsNum: data.seedsNum,
    seedsAge: data.seedsAge,
    sproutChance: data.sproutChance,
    dispersion: data.dispersion,
    lifeSpan: data.lifeSpan,
  };
};

const GardenContainer = () => {
  const [plants, setPlants] = useState([
    generatePlant("A"),
    generatePlant("A"),
    generatePlant("B"),
    generatePlant("B"),
  ]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [shouldRefill, setShouldRefill] = useState(true);

  // Simulation loop
  const plantsRef = useRef(plants);

  useEffect(() => {
    plantsRef.current = plants;
  }, [plants]);

  const animate = useCallback(() => {
    console.log("animate");
    let newPlants = []; // Array to hold new plants

    // First filter out the plants that should die
    const livingPlants = plantsRef.current.filter((plant) => {
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
            plant.y > window.innerHeight
        ))
    ) {
      console.log("adding new plant");

      setPlants([generatePlant("A"), generatePlant("B")]);
      livingPlants = [generatePlant("A"), generatePlant("B")];
    }

    // Calculate the number of new plants that can be added
    let availableSlots = 1000 - plantsRef.current.length;

    // Then map over the remaining plants to update their properties
    const updatedPlants = livingPlants.map((plant) => {
      let updatedPlant = { ...plant }; // Create a new object to avoid mutation

      let sproutChance = updatedPlant.sproutChance;

      tree.remove(plant); // Remove the current plant from the tree
      const nearest = tree.find(plant.x, plant.y, 100); // Find the nearest plant within a radius of 50
      tree.add(plant);
      if (nearest) {
        console.log("plant x", plant.x);
        console.log("plant y", plant.y);
        console.log("nearest x", nearest.x);
        console.log("nearest y", nearest.y);

        // Slow down growth if the nearest plant is bigger
        const delta = nearest.growthStatus - plant.growthStatus;
        if (delta > 0) {
          updatedPlant.growthRate =
            updatedPlant.growthRate * Math.min((1 / delta, 0.5));
        }
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
                (plant.y - sprout_neighbor.y) ** 2
            );
            if (distance < 10) {
              console.log("too close to sprout", distance);
              sproutChance = 0;
            } else {
              sproutChance = sproutChance * Math.max(0, 1 - distance / 100);
            }
          }
          if (Math.random() < sproutChance) {
            const newPlant = {
              id: Math.random(),
              species: updatedPlant.species,
              img: updatedPlant.img,
              x: x_coord,
              y: y_coord,
              growthStatus: 1,
              lifeCycle: "seed",
              growthRate: updatedPlant.growthRate + gaussianRand() * 0.1,
              seedsNum: updatedPlant.seedsNum,
              sproutChance: updatedPlant.sproutChance,
              lifeSpan: updatedPlant.lifeSpan,
              dispersion: updatedPlant.dispersion + gaussianRand() * 0.1,
            };
            newPlants.push(newPlant);
            availableSlots--;
          }
        }
      }
      return updatedPlant;
    });

    // Update plantsRef.current and plants state
    plantsRef.current = [...updatedPlants, ...newPlants];
    setPlants([...updatedPlants, ...newPlants]);
  }, [plants]);

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
    <div>
      <div>
        <button onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? "Pause" : "Play"}
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
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          {plants
            .sort((a, b) => a.y - b.y)
            .map((plant) => (
              <Plant
                key={plant.id}
                x={plant.x}
                y={plant.y}
                img={plant.img}
                growthStatus={plant.growthStatus}
                lifeSpan={plant.lifeSpan}
              />
            ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default GardenContainer;
