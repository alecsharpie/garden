import spriteTreeImage from "../images/tree_sprite_3x3_grid.png";
import spriteGrassImage from "../images/grass_sprite_3x1_grid.png";
import spriteYellowFlowerImage from "../images/yellow_flower_sprite_3x1_grid.png";
import spriteLightPinkFlowerImage from "../images/light_pink_flower_sprite_3x1_grid.png";
import spritePinkFlowerImage from "../images/pink_flower_sprite_3x1_grid.png";
import spriteTulipFlowerImage from "../images/tulip_flower_sprite_3x1_grid.png";
import spriteWhiteFlowerImage from "../images/white_flower_sprite_3x1_grid.png";

export const speciesData = {
  tree: {
    baseGrowthRate: 0.1,
    seedsNum: 1,
    seedsAge: 50,
    sproutChance: 0.1,
    dispersion: 5,
    lifeSpan: 200,
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
  grass: {
    baseGrowthRate: 0.1,
    seedsNum: 10,
    seedsAge: 5,
    sproutChance: 0.5,
    dispersion: 10,
    lifeSpan: 30,
    img: spriteGrassImage,
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
  yellowFlower: {
    baseGrowthRate: 0.1,
    seedsNum: 1,
    seedsAge: 50,
    sproutChance: 0.1,
    dispersion: 5,
    lifeSpan: 100,
    img: spriteYellowFlowerImage,
    animationCoords: {
      0: [0, 0, 256, 256],
      1: [256, 0, 256, 256],
      2: [512, 0, 256, 256],
    },
  },
  whiteFlower: {
    baseGrowthRate: 0.1,
    seedsNum: 1,
    seedsAge: 50,
    sproutChance: 0.1,
    dispersion: 5,
    lifeSpan: 100,
    img: spriteWhiteFlowerImage,
    animationCoords: {
      0: [0, 0, 256, 256],
      1: [256, 0, 256, 256],
      2: [512, 0, 256, 256],
    },
  },
  tulipFlower: {
    baseGrowthRate: 0.1,
    seedsNum: 1,
    seedsAge: 50,
    sproutChance: 0.1,
    dispersion: 5,
    lifeSpan: 100,
    img: spriteTulipFlowerImage,
    animationCoords: {
      0: [0, 0, 256, 256],
      1: [256, 0, 256, 256],
      2: [512, 0, 256, 256],
    },
  },
  pinkFlower: {
    baseGrowthRate: 0.1,
    seedsNum: 1,
    seedsAge: 50,
    sproutChance: 0.1,
    dispersion: 5,
    lifeSpan: 100,
    img: spritePinkFlowerImage,
    animationCoords: {
      0: [0, 0, 256, 256],
      1: [256, 0, 256, 256],
      2: [512, 0, 256, 256],
    },
  },
  lightPinkFlower: {
    baseGrowthRate: 0.1,
    seedsNum: 1,
    seedsAge: 50,
    sproutChance: 0.1,
    dispersion: 5,
    lifeSpan: 100,
    img: spriteLightPinkFlowerImage,
    animationCoords: {
      0: [0, 0, 256, 256],
      1: [256, 0, 256, 256],
      2: [512, 0, 256, 256],
    },
  },
  // Add more species as needed
};
