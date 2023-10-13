import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer } from "react-konva";
import { Plant } from "./Plant";
import { speciesData } from "../consts/SpeciesData";

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
    growthRate: data.baseGrowthRate,
    lifeCycle: "seed",
    numSeeds: data.numSeeds,
    dropChance: data.dropChance,
    lifeSpan: data.lifeSpan,
  };
};

const GardenContainer = () => {
  // const [plants, setPlants] = useState([]);
console.log(generatePlant("A"));
  const [plants, setPlants] = useState([
    generatePlant("A"),
    // generatePlant("B")
  ]);

  useEffect(() => {
    console.log('plants', plants);
  }, [plants]);

  // Simulation loop
const plantsRef = useRef(plants);

useEffect(() => {
  plantsRef.current = plants;
}, [plants]);

useEffect(() => {
  if (plants.length === 0) {
    return;
  }
  const animate = () => {
    console.log("animate");
    let newPlants = []; // Array to hold new plants

    console.log("plantsRef.current", plantsRef.current);

    console.log("plant.lifeSpan", plantsRef.current.lifeSpan);

    // First filter out the plants that should die
    const livingPlants = plantsRef.current.filter(
      (plant) =>
        plant.lifeSpan &&
        plant.lifeSpan.dead &&
        plant.growthStatus < plant.lifeSpan.dead.age + 20
    );

    console.log("livingplants", livingPlants);

    // Then map over the remaining plants to update their properties
    const updatedPlants = livingPlants.map((plant) => {
      let updatedPlant = { ...plant }; // Create a new object to avoid mutation
      updatedPlant.growthStatus += 1;
      const lifeSpan = speciesData[updatedPlant.species].lifeSpan;
      console.log(updatedPlant.growthStatus);
      if (updatedPlant.growthStatus <= lifeSpan.seedling.age) {
        updatedPlant.lifeCycle = "seed";
        updatedPlant.img = lifeSpan.seed.img;
      } else if (updatedPlant.growthStatus < lifeSpan.mature.age) {
        updatedPlant.lifeCycle = "seedling";
        updatedPlant.img = lifeSpan.seedling.img;
      } else if (updatedPlant.growthStatus < lifeSpan.dead.age) {
        updatedPlant.lifeCycle = "mature";
        updatedPlant.img = lifeSpan.mature.img;
        for (let i = 0; i < updatedPlant.numSeeds; i++) {
          if (Math.random() < updatedPlant.dropChance) {
            if (plantsRef.current.length < 10) {
              const newPlant = {
                id: Math.random(),
                x: updatedPlant.x + (Math.random() - 0.5) * 100,
                y: updatedPlant.y + (Math.random() - 0.5) * 100,
                growthStatus: 10,
                growthRate: 0.1,
                lifeCycle: "seed",
                numSeeds: 4,
                dropChance: 0.5,
              };
              newPlants.push(newPlant);
            }
          }
        }
      } else {
        console.log("dead");
        updatedPlant.lifeCycle = "dead";
        updatedPlant.img = lifeSpan.dead.img;
      }
      return updatedPlant;
    });

    // Update plantsRef.current and plants state
    plantsRef.current = [...updatedPlants, ...newPlants];
    setPlants([...updatedPlants, ...newPlants]);
  };
  const intervalId = setInterval(animate, 1000 / 60); // 60 FPS
  return () => clearInterval(intervalId); // Clean up on unmount
  }, []);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        {plants.map((plant) => (
          <Plant
            key={plant.id}
            x={plant.x}
            y={plant.y}
            img={plant.img}
            growthStatus={plant.growthStatus}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default GardenContainer;
