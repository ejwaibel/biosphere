import * as util from '../modules/utils.js';

export default class Store {
	constructor() {
		// Yay for Map!
		this.itemsMap = new Map();
		this.itemsArr = [];
	}

	count() {
		return this.itemsMap.size;
	}

	getAll() {
		return this.itemsMap;
	}

	getById(id) {
		return this.itemsMap.get(id);
	}

	getByProp(prop, value) {
		let filtered = this.itemsArr.filter(obj => obj[prop] === value) || [],
			items = new Map();

		filtered.forEach(model => items.set(model.id, model));

		return items;
	}

	getRandomItem() {
		if (this.itemsArr.length) {
			return this.itemsArr[util.getRandomNumber(this.itemsArr.length - 1)];
		}

		return null;
	}

	insert(model, callback) {
		this.itemsMap.set(model.id, model);

		// Convert Map values into an array
		this.itemsArr = Array.from(this.itemsMap.values());
		console.debug('itemsArr', this.itemsArr);

		if (util.isFunction(callback)) {
			callback();
		}
	}

	remove(id, callback = function() {}) {
		this.itemsMap.delete(id);

		// Convert Map values into an array
		this.itemsArr = Array.from(this.itemsMap.values());

		if (util.isFunction(callback)) {
			callback();
		}
	}

	update(id, prop, value) {
		let model = this.itemsMap.get(id);

		model.prop = value;
	}
}
