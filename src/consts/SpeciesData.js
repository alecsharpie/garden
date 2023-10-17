import spriteTreeImage from "../images/tree_sprite_3x3_grid_clean_clear.png";
import spriteFlowersImage from "../images/flowers_sprite_3x3_grid.png";

export const speciesData = {
  A: {
    baseGrowthRate: 0.1,
    seedsNum: 1,
    seedsAge: 50,
    sproutChance: 0.1,
    dispersion: 5,
    lifeSpan: 100,
    img: spriteTreeImage,
  },
  B: {
    baseGrowthRate: 0.1,
    seedsNum: 1,
    seedsAge: 50,
    sproutChance: 0.1,
    dispersion: 5,
    lifeSpan: 100,
    img: spriteFlowersImage,
  },
  // Add more species as needed
};
