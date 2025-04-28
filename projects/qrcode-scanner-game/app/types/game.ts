export type GameItem = {
  id: string;
  title: string;
  imageUrl: string;
};

export const GAME_ITEMS: Record<string, GameItem> = {
  'elephant': {
    id: 'elephant',
    title: 'Elephant',
    imageUrl: '/images/elephant.png'
  },
  'giraffe': {
    id: 'giraffe',
    title: 'Giraffe',
    imageUrl: '/images/giraffe.png'
  },
  'horse': {
    id: 'horse',
    title: 'Horse',
    imageUrl: '/images/horse.png'
  },
  'dog': {
    id: 'dog',
    title: 'Dog',
    imageUrl: '/images/dog.png'
  },
  'cat': {
    id: 'cat',
    title: 'Cat',
    imageUrl: '/images/cat.png'
  },
  'grouse': {
    id: 'grouse',
    title: 'Grouse',
    imageUrl: '/images/grouse.png'
  },
  'hedgehog': {
    id: 'hedgehog',
    title: 'Hedgehog',
    imageUrl: '/images/hedgehog.png'
  },
  'mouse': {
    id: 'mouse',
    title: 'Mouse',
    imageUrl: '/images/mouse.png'
  },
  'ant': {
    id: 'ant',
    title: 'Ant',
    imageUrl: '/images/ant.png'
  }
};

export const CORRECT_ORDER = [
  'elephant',
  'giraffe',
  'horse',
  'dog',
  'grouse',
  'cat',
  'hedgehog',
  'mouse',
  'ant'
];

export const QR_CODE_MAPPINGS: Record<string, string> = {
  'elephant': 'elephant',
  'giraffe': 'giraffe',
  'horse': 'horse',
  'dog': 'dog',
  'cat': 'cat',
  'grouse': 'grouse',
  'hedgehog': 'hedgehog',
  'mouse': 'mouse',
  'ant': 'ant'
};

export const GAME_COMMANDS: Record<string, () => void> = {
  'restart': () => {},
  'down': () => {}
};