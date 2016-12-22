import * as util from '../modules/utils.js';

export default class BiosphereStore {
	/**
	 * The constructor function for Biosphere class
	 * @return {[type]} [description]
	 */
	constructor() {
		this.isSilenced = false;
		// Yay for Map!
		this.personMap = new Map();
		this.persons = [];
		this.totalPopulation = 0;
		this.totalMale = 0;
		this.totalFemale = 0;

		this.$populationTotal = $('#population-total');
		this.$populationMale = $('#population-male');
		this.$populationFemale = $('#population-female');
	}

	getPersonById(id) {
		return this.personMap.get(id);
	}

	getPersonByName(name) {
		return this.persons.find(obj => obj.name === name);
	}

	getRandomPerson() {
		return this.persons[util.getRandomNumber(this.persons.length - 1)];
	}

	/**
	 * Update the population total
	 */
	updatePopulation(p) {
		let gender = p.gender,
			popDiff = 1;

		if (!p.isAlive()) {
			popDiff = -1;
			this.personMap.delete(p.id);
		} else {
			this.personMap.set(p.id, p);
		}

		this.totalPopulation += popDiff;
		this.$populationTotal.text(this.totalPopulation);

		if (gender === 'male') {
			this.totalMale += popDiff;
			this.$populationMale.text(this.totalMale);
		} else {
			this.totalFemale += popDiff;
			this.$populationFemale.text(this.totalFemale);
		}

		// Convert Map values into an array
		this.persons = Array.from(this.personMap.values());

		return this.persons;
	}
}

// ************************************************************************
// STATIC PROPERTIES -- ANYONE MAY READ/WRITE
// ************************************************************************

