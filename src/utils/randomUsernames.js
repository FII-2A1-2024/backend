const { faker } = require("@faker-js/faker");

class Animals {
	async generateUsername() {
		return Animals.generateRandomUsername();
	}

	static async generateRandomUsername() {
		const animalType = faker.animal.type();
		let animalName;
		switch (animalType) {
			case "dog":
				animalName = faker.animal.dog();
				break;
			case "bear":
				animalName = faker.animal.bear();
				break;
			case "bird":
				animalName = faker.animal.bird();
				break;
			case "cat":
				animalName = faker.animal.cat();
				break;
			case "cow":
				animalName = faker.animal.cow();
				break;
			case "horse":
				animalName = faker.animal.horse();
				break;
			case "lion":
				animalName = faker.animal.lion();
				break;
			case "rabbit":
				animalName = faker.animal.rabbit();
				break;
			case "snake":
				animalName = faker.animal.snake();
				break;
			default:
				animalName = faker.animal.dog();
				break;
		}
		return `Anonymus ${animalName}`;
	}
}

module.exports = new Animals();
