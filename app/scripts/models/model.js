import * as util from '../modules/utils.js';

const _listeners = Symbol('model.listeners');
const _uuid = Symbol('model.uuid');

export default class Model {
	constructor() {
		this[_listeners] = new Set();

		this.id = util.getUuid();
	}

	addListener(listener) {
		this[_listeners].add(listener);
	}

	deleteListener(listener) {
		this[_listeners].delete(listener);
	}

	notifyAll(data) {
		for (let listener of this[_listeners]) {
			listener.notify(this, data);
		}
	}

	get id() {
		return this[_uuid];
	}

	set id(val) {
		this[_uuid] = val;
	}
}
