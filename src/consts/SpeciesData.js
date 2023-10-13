import seedImage from "../images/seed.png";
import seedlingImage from "../images/seedling.png";
import matureImage from "../images/mature.png";
import deadImage from "../images/dead.png";

export const speciesData = {
  A: {
    baseGrowthRate: 0.5,
    numSeeds: 10,
    dropChance: 0.5,
    lifeSpan: {
      seed: { age: 1, img: seedImage },
      seedling: { age: 10, img: seedlingImage },
      mature: { age: 50, img: matureImage },
      dead: { age: 100, img: deadImage },
    },
  },
  // Add more species as needed
};
