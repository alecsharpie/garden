import seedImage from "../images/seed.png";
import seedlingImage from "../images/seedling.png";
import matureImage from "../images/mature.png";
import deadImage from "../images/dead.png";

export const speciesData = {
  A: {
    baseGrowthRate: 0.00001,
    numSeeds: 1,
    dispersion: 5,
    lifeSpan: {
      seed: { age: 1, img: seedImage },
      seedling: { age: 15, img: seedlingImage },
      mature: { age: 30, img: matureImage },
      dead: { age: 80, img: deadImage },
    },
  },
  // Add more species as needed
};
