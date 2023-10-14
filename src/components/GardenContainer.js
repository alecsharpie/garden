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
    x: Math.random() * 600,
    y: Math.random() * 600,
    growthStatus: 1,
    growthRate: data.baseGrowthRate + Math.random() * data.baseGrowthRate * 2,
    lifeCycle: "seed",
    numSeeds: data.numSeeds,
    sproutChance: data.sproutChance,
    dispersion: data.dispersion,
    lifeSpan: data.lifeSpan,
  };
};

const GardenContainer = () => {
  const [plants, setPlants] = useState([
    generatePlant("A"),
    generatePlant("A"),
    // generatePlant("B")
  ]);
  const [isPlaying, setIsPlaying] = useState(true);

  // Simulation loop
  const plantsRef = useRef(plants);

  useEffect(() => {
    plantsRef.current = plants;
  }, [plants]);

  const animate = useCallback(() => {
    console.log("animate");
    let newPlants = []; // Array to hold new plants

    // First filter out the plants that should die
    const livingPlants = plantsRef.current.filter(
      (plant) =>
        !plant.lifeSpan ||
        !plant.lifeSpan.dead ||
        plant.growthStatus < plant.lifeSpan.dead.age + 20
    );

    console.log("livingplants", livingPlants);

    const tree = quadtree()
      .x((d) => d.x)
      .y((d) => d.y)
      .addAll(livingPlants);

    // If all plants are dead, add a new one
    // if all plants are off screen, add a new one
    if (
      livingPlants.length === 0 ||
      livingPlants.every(
        (plant) => plant.x < 0 || plant.x > 600 || plant.y < 0 || plant.y > 600
      )
    ) {
      console.log("adding new plant");
      setPlants([...livingPlants, generatePlant("A")]);
    }

    // Calculate the number of new plants that can be added
    let availableSlots = 1000 - plantsRef.current.length;

    // Then map over the remaining plants to update their properties
    const updatedPlants = livingPlants.map((plant) => {
      let updatedPlant = { ...plant }; // Create a new object to avoid mutation

      const nearest = tree.find(plant.x, plant.y, 50); // Find the nearest plant within a radius of 50
      if (nearest) {
        const distance = Math.sqrt(
          (plant.x - nearest.x) ** 2 + (plant.y - nearest.y) ** 2
        );
        if (distance < 10) {
          let delta = nearest.growthStatus - plant.growthStatus;
          if (delta > 0){
          updatedPlant.growthRate =
            updatedPlant.growthRate * Math.min((1 / delta, 0.5)); // Slow down growth if the nearest plant is bigger
        }
      }
      }

      updatedPlant.growthStatus += updatedPlant.growthRate;
      // console.log("updatedPlant.lifeSpan", updatedPlant.lifeSpan);
      const lifeSpan = updatedPlant.lifeSpan;
      if (updatedPlant.growthStatus <= lifeSpan.seedling.age) {
        updatedPlant.lifeCycle = "seed";
        updatedPlant.img = lifeSpan.seed.img;
      } else if (updatedPlant.growthStatus < lifeSpan.mature.age) {
        updatedPlant.lifeCycle = "seedling";
        updatedPlant.img = lifeSpan.seedling.img;
      } else if (updatedPlant.growthStatus < lifeSpan.dead.age) {
        updatedPlant.lifeCycle = "mature";
        updatedPlant.img = lifeSpan.mature.img;
        for (let i = 0; i < updatedPlant.numSeeds && availableSlots > 0; i++) {
          if (Math.random() < updatedPlant.sproutChance) {
            const newPlant = {
              id: Math.random(),
              species: updatedPlant.species,
              x:
                updatedPlant.x +
                (gaussianRand() - 0.5) * updatedPlant.dispersion * 100,
              y:
                updatedPlant.y +
                (gaussianRand() - 0.5) * updatedPlant.dispersion * 100,
              growthStatus: 1,
              lifeCycle: "seed",
              growthRate: updatedPlant.growthRate + gaussianRand() * 0.1,
              numSeeds: updatedPlant.numSeeds,
              sproutChance: updatedPlant.sproutChance,
              lifeSpan: updatedPlant.lifeSpan,
              dispersion: updatedPlant.dispersion + gaussianRand() * 0.1,
            };
            newPlants.push(newPlant);
            availableSlots--;
          }
        }
      } else {
        updatedPlant.lifeCycle = "dead";
        updatedPlant.img = lifeSpan.dead.img;
      }
      return updatedPlant;
    });

    // Update plantsRef.current and plants state
    plantsRef.current = [...updatedPlants, ...newPlants];
    setPlants([...updatedPlants, ...newPlants]);
  }, [plants]);

  // useEffect(() => {
  //   if (plants.length === 0) {
  //     return;
  //   }

  //   const intervalId = setInterval(animate, 1000 / 60); // 60 FPS
  //   return () => clearInterval(intervalId); // Clean up on unmount
  //   }, []);

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
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? "Pause" : "Play"}
      </button>
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
                lifeCycle={plant.lifeCycle}
              />
            ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default GardenContainer;
