import { Animal, FilterType } from './types';

// A curated list of animals to simulate a "pre-cached" alphabetical index.
// In a real production app with "all animals", this would be paginated from a backend.
export const PRE_CACHED_ANIMALS: Record<string, string[]> = {
  A: ['Aardvark', 'African Elephant', 'Albatross', 'Alligator', 'Alpaca', 'American Bison', 'Anteater', 'Antelope', 'Armadillo', 'Axolotl'],
  B: ['Baboon', 'Badger', 'Bald Eagle', 'Barn Owl', 'Barracuda', 'Bat', 'Beaver', 'Bengal Tiger', 'Black Bear', 'Blue Whale', 'Bobcat', 'Buffalo', 'Butterfly'],
  C: ['Camel', 'Capybara', 'Caribou', 'Cassowary', 'Cat', 'Caterpillar', 'Catfish', 'Chameleon', 'Cheetah', 'Chicken', 'Chimpanzee', 'Chinchilla', 'Cobra', 'Cockatoo', 'Cougar', 'Coyote', 'Crab', 'Crocodile'],
  D: ['Deer', 'Dingo', 'Dog', 'Dolphin', 'Donkey', 'Dormouse', 'Dragonfly', 'Duck', 'Dugong'],
  E: ['Eagle', 'Echidna', 'Eel', 'Elephant', 'Elk', 'Emu'],
  F: ['Falcon', 'Ferret', 'Finch', 'Flamingo', 'Flounder', 'Fly', 'Fox', 'Frog'],
  G: ['Galapagos Tortoise', 'Gazelle', 'Gecko', 'Gerbil', 'Giant Panda', 'Giraffe', 'Goat', 'Goldfish', 'Goose', 'Gorilla', 'Grasshopper', 'Great White Shark', 'Grizzly Bear', 'Guinea Pig'],
  H: ['Hamster', 'Hare', 'Hawk', 'Hedgehog', 'Heron', 'Hippo', 'Honey Bee', 'Hornet', 'Horse', 'Hummingbird', 'Hyena'],
  I: ['Ibex', 'Ibis', 'Iguana', 'Impala'],
  J: ['Jaguar', 'Jellyfish', 'Jerboa'],
  K: ['Kangaroo', 'King Cobra', 'Kingfisher', 'Koala', 'Komodo Dragon', 'Krill'],
  L: ['Ladybug', 'Lemur', 'Leopard', 'Lion', 'Llama', 'Lobster', 'Lynx'],
  M: ['Macaw', 'Magpie', 'Manatee', 'Mandrill', 'Manta Ray', 'Meerkat', 'Mongoose', 'Monitor Lizard', 'Monkey', 'Moose', 'Mosquito', 'Moth', 'Mouse', 'Mule'],
  N: ['Narwhal', 'Newt', 'Nightingale'],
  O: ['Ocelot', 'Octopus', 'Okapi', 'Opossum', 'Orangutan', 'Orca', 'Ostrich', 'Otter', 'Owl', 'Ox', 'Oyster'],
  P: ['Panda', 'Panther', 'Parrot', 'Partridge', 'Peacock', 'Pelican', 'Penguin', 'Pheasant', 'Pig', 'Pigeon', 'Piranha', 'Platypus', 'Polar Bear', 'Porcupine', 'Porpoise', 'Praying Mantis', 'Puffin', 'Python'],
  Q: ['Quail', 'Quokka', 'Quoll'],
  R: ['Rabbit', 'Raccoon', 'Rat', 'Rattlesnake', 'Raven', 'Red Panda', 'Reindeer', 'Rhinoceros', 'Robin'],
  S: ['Salamander', 'Salmon', 'Sand Dollar', 'Scorpion', 'Sea Lion', 'Sea Turtle', 'Seahorse', 'Seal', 'Shark', 'Sheep', 'Shrew', 'Shrimp', 'Skunk', 'Sloth', 'Snail', 'Snake', 'Snow Leopard', 'Sparrow', 'Spider', 'Squid', 'Squirrel', 'Starfish', 'Stingray', 'Stork', 'Swan'],
  T: ['Tapir', 'Tarantula', 'Tasmanian Devil', 'Termite', 'Tiger', 'Toad', 'Tortoise', 'Toucan', 'Turkey', 'Turtle'],
  U: ['Umbrellabird', 'Urial'],
  V: ['Vampire Bat', 'Vulture'],
  W: ['Wallaby', 'Walrus', 'Wasp', 'Weasel', 'Whale', 'Wolf', 'Wolverine', 'Wombat', 'Woodpecker', 'Worm'],
  X: ['X-Ray Tetra'],
  Y: ['Yak', 'Yellowjacket'],
  Z: ['Zebra']
};

export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const PLACEHOLDER_IMAGE = "https://picsum.photos/400/300?grayscale";