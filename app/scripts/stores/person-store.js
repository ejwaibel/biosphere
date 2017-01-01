import Store from './store.js';

export default class PersonStore extends Store {
	constructor() {
		super();
	}

	getRandomPerson() {
		return this.getRandomItem();
	}
}
