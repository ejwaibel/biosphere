import { tpl } from '../templates/tpl.js';
import { getUuid } from './utils.js';

const _alive = Symbol('person.alive');
const _maxAge = Symbol('person.maxAge');
const _uuid = Symbol('person.uuid');

export default class Person {
	/**
	 * The constructor function for Person class
	 * @param  {[type]} name   [description]
	 * @param  {[type]} gender [description]
	 */
	constructor(name, gender) {
		this[_alive] = true;
		this[_maxAge] = 70 + Math.round(Math.random() * 15) + Math.round(Math.random() * 15);

		// Set properties based on arguments to constructor
		this.gender = gender;
		this.name = name || (this.gender === 'male' ? 'John Doe' : 'Jane Doe');

		this.thoughts = this.constructor.thoughts[this.gender];

		// Set default values for instance of Person
		this.age = 1;
		this.clothing	= 'nothing/naked';
		this.dirtFactor = 0;
		this.mute = Math.ceil(Math.random() * 2) < 2 ? false : true;
		this.sleepFactor = 10;
		this.weight = Math.round(Math.random() * this.constructor.maxWeight);
		this[_uuid] = getUuid();

		this.$el = $(tpl.person(this));
	}

	_makeOlder(n) {
		this.age += n ? n : 1;

		this.change({ type: 'age', data: this.age });

		if (!this.isAlive()) {
			this.age = this[_maxAge];

			// updatePopulation(-1);

			this.hesDeadJim();
		}

		return this[_alive];
	}

	addDirt(n) {
		if (n > 0 && this._makeOlder()) {
			this.dirtFactor += n;
		}
	}

	changeClothes(c) {
		this.clothing = c;
	}

	eat() {
		if (this._makeOlder()) {
			this.dirtFactor++;
			this.weight += parseInt(this.age * 0.7, 10);
			this.change({ type: 'weight', data: weight });

			return this.weight;
		}
	}

	exercise() {
		if (this._makeOlder()) {
			this.dirtFactor++;
			this.weight -= parseInt(this.weight / 5, 10);
			this.change({ type: 'weight', data: this.weight });

			return this.weight;
		}
	}

	isAlive() {
		return this.age < this[_maxAge] && this[_alive];
	}

	kill() {
		// this._makeOlder(this[_maxAge]);
		this[_alive] = false;
		this.hesDeadJim();
	}

	muchTimePasses(n) {
		if (n > 0 && this._makeOlder(n)) {
			this.dirtFactor = 10;
		}
	}

	shower() {
		if (this._makeOlder()) {
			this.dirtFactor = 0;
			this.sleep(2);
		}
	}

	silence() {
		this.mute = true;
	}

	sleep(n) {
		if (n > 0 && this._makeOlder()) {
			this.sleepFactor -= n;

			if (this.sleepFactor < 0) {
				this.sleepFactor = 0;
			}
		}
	}

	work(hours) {
		if (hours > 0 && this._makeOlder()) {
			this.dirtFactor++;
			this.sleepFactor = parseInt(hours * 1.5, 10);

			this.weight += parseInt(hours * 1.75, 10);

			this.change({ type: 'weight', data: this.weight });
		}
	}

	/********
	 * GETTERS / SETTERS
	 ********/
	get clothing() {
		return this._clothing;
	}

	set clothing(val) {
		this._clothing = val;
		this.change({ type: 'clothing', data: val });
	}

	get id() {
		return this[_uuid];
	}

	set id(val) {
		this[_uuid] = val;
	}
}

// ************************************************************************
// PUBLIC METHODS -- ANYONE MAY READ/WRITE
// ************************************************************************
Person.prototype.hesDeadJim = function() {
	// Placeholder
};

Person.prototype.change = function() {
	// Placeholder
};

// ************************************************************************
// STATIC PROPERTIES -- ANYONE MAY READ/WRITE
// ************************************************************************
Person.maxWeight = 500;

Person.thoughts = {
	male: [
		'If it\'s not broke,<br>you need more software.',
		'Out of my mind.<br>Back in 5.',
		'Errors have been made.<br>Others will be blamed.'
	],
	female: [
		'Next mood swing...<br>6 minutes.',
		'I don\'t hold grudges,<br>I remember facts.',
		'Sarcasm is just one more service.'
	]
};
