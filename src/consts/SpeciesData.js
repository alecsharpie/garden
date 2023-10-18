import spriteTreeImage from "../images/tree_sprite_3x3_grid_clean_clear.png";
import spriteFlowersImage from "../images/yellow_flowers_sprite_3x3_grid.png";

export const speciesData = {
  A: {
    baseGrowthRate: 0.1,
    seedsNum: 1,
    seedsAge: 50,
    sproutChance: 0.1,
    dispersion: 5,
    lifeSpan: 100,
    img: spriteTreeImage,
    animationCoords: {
      0: [0, 0, 256, 256],
      1: [256, 0, 256, 256],
      2: [512, 0, 256, 256],
      3: [0, 256, 256, 256],
      4: [256, 256, 256, 256],
      5: [512, 256, 256, 256],
      6: [0, 512, 256, 256],
      7: [256, 512, 256, 256],
      8: [512, 512, 256, 256],
    },
  },
  B: {
    baseGrowthRate: 0.1,
    seedsNum: 1,
    seedsAge: 50,
    sproutChance: 0.1,
    dispersion: 5,
    lifeSpan: 100,
    img: spriteFlowersImage,
    animationCoords: {
      0: [0, 0, 256, 256],
      1: [256, 0, 256, 256],
      2: [512, 0, 256, 256],
    },
  },
  // Add more species as needed
};
