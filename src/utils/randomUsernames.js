const animals = [
	"Axolotl",
	"Bear",
	"Beetle",
	"Bison",
	"Cat",
	"Cheetah",
	"Chicken",
	"Clam",
	"Crow",
	"Deer",
	"Dingo",
	"Eagle",
	"Elephant",
	"Emu",
	"Falcon",
	"Fox",
	"Goat",
	"Goose",
	"Hamster",
	"Hermit Crab",
	"Hornet",
	"Hummingbird",
	"Kangaroo",
	"Kiwi",
	"Koala",
	"Ladybug",
	"Lizard",
	"Lobster",
	"Moose",
	"Octopus",
	"Orca",
	"Ostrich",
	"Penguin",
	"Platypus",
	"Rockfish",
	"Salmon",
	"Scorpion",
	"Seagull",
	"Seahorse",
	"Seal",
	"Shark",
	"Snake",
	"Spider",
	"Sponge",
	"Squid",
	"Starfish",
	"Walrus",
	"Whale",
	"Wolf",
	"Zebra",
];
const colors = [
	"Red",
	"Green",
	"Blue",
	"Yellow",
	"Cyan",
	"Magenta",
	"Orange",
	"Purple",
	"Pink",
	"Brown",
	"Lime",
	"Indigo",
	"Violet",
	"Turquoise",
	"Teal",
	"Maroon",
	"Olive",
	"Navy",
	"Coral",
	"Gold",
	"Silver",
	"Gray",
	"Black",
	"White",
	"Crimson",
	"Salmon",
	"Beige",
	"Lavender",
	"Mint",
	"Peach",
	"Plum",
	"Chocolate",
	"Azure",
	"Khaki",
	"Ivory",
	"Orchid",
	"Tan",
	"Chartreuse",
	"Aquamarine",
	"Sienna",
	"Honeydew",
	"Fuchsia",
	"Periwinkle",
	"SlateBlue",
	"SeaGreen",
	"Moccasin",
	"RosyBrown",
	"Thistle",
	"Tomato",
	"SandyBrown",
];
let animalId = 0;
let colorId = 1;
let notUID = 0;

class PairSet {
	constructor() {
		this.set = new Set();
	}
	encode(animal, color) {
		return `${animal},${color}`;
	}
	add(animal, color) {
		const encoded = this.encode(animal, color);
		this.set.add(encoded);
	}
	has(animal, color) {
		const encoded = this.encode(animal, color);
		this.set.has(encoded);
	}
	delete(animal, color) {
		const encoded = this.encode(animal, color);
		this.set.delete(encoded);
	}
	size() {
		return this.set.size;
	}
}
// TO DO on logout delete from this DataStructure the username of the user that logs out
const existingPairs = new PairSet();
class AnimalNameGenerator {
	async generate() {
		return AnimalNameGenerator.generateRandomUsername();
	}

	static async generateRandomUsername() {
		let animalName;
		let colorName;
		console.log(existingPairs.size());
		if (existingPairs.size() === animals.length * colors.length * 999999)
			return "Something... All usernames are in use";
		do {
			animalId += 1;
			if (animalId > animals.length) {
				animalId = 1;
				colorId += 1;
			}
			if (colorId > colors.length) {
				colorId = 1;
				notUID += 1;
			}
			animalName = animals[animalId - 1];
			colorName = colors[colorId - 1];
		} while (existingPairs.has(animalName, colorName));
		existingPairs.add(animalName, colorName);
		const newId = notUID.toString().padStart(6, "0").substring(0, 6);
		return `${colorName} ${animalName} #${newId}`;
	}
}

module.exports = {
	AnimalNameGenerator: new AnimalNameGenerator(),
	existingUsernames: existingPairs,
};
