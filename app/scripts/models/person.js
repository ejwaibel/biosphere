import Model from './model.js';
import * as util from '../modules/utils.js';

const _age = Symbol('person.age');
const _alive = Symbol('person.alive');
const _clothing = Symbol('person.clothing');
const _dirtFactor = Symbol('person.dirtFactor');
const _maxAge = Symbol('person.maxAge');
const _mute = Symbol('person.mute');
const _sleepFactor = Symbol('person.sleepFactor');
const _weight = Symbol('person.weight');

export default class Person extends Model {
	/**
	 * The constructor function for Person class
	 * @param  {[type]} name   [description]
	 * @param  {[type]} gender [description]
	 */
	constructor(name, gender) {
		super();

		this[_alive] 		= true;
		this[_age]			= 0;
		this[_maxAge] 		= 70 + util.getRandomNumber(15) + util.getRandomNumber(15);

		// Set properties based on arguments to constructor
		this.gender 	= gender;
		this.name 		= name || (this.gender === 'male' ? 'John Doe' : 'Jane Doe');

		// Set default values for instance of Person
		this.age 			= 1;
		this.clothing		= 'nothing/naked';
		this.dirtFactor 	= 0;
		this.mute 			= util.getRandomNumber(2) < 2 ? false : true;
		this.sleepFactor 	= 10;
		this.thoughts 		= this.constructor.thoughts[this.gender];
		this.weight 		= util.getRandomNumber(this.constructor.maxWeight);
	}

	isAlive() {
		return this.age < this[_maxAge] && this[_alive];
	}

	_makeOlder(n = 1) {
		this.age += n;

		return this.isAlive();
	}

	/**
	 * ACTIONS
	 */

	eat() {
		if (this._makeOlder()) {
			this.dirtFactor++;
			this.sleepFactor++;
			this.weight += this.age * 0.7;
		}
	}

	exercise() {
		if (this._makeOlder()) {
			this.dirtFactor += 5;
			this.weight -= this.weight / 80;
		}
	}

	kill() {
		this.age = this[_maxAge];
		this[_alive] = false;
	}

	muchTimePasses(n) {
		if (n > 0 && this._makeOlder(n)) {
			this.dirtFactor = 10;
		}
	}

	mute() {
		this.mute = true;
	}

	shower() {
		if (this._makeOlder()) {
			this.dirtFactor = this.dirtFactor / 2;
			this.sleepFactor -= 2;
		}
	}

	silence() {
		this.mute = true;
	}

	sleep(n) {
		if (n > 0 && this._makeOlder()) {
			this.dirtFactor += n / 2;
			this.sleepFactor -= n;
		}
	}

	work(hours) {
		if (hours > 0 && this._makeOlder()) {
			this.dirtFactor += hours / 3;
			this.sleepFactor = hours * 1.5;
			this.weight += hours * 1.75;
		}
	}

	/**
	 * GETTERS / SETTERS
	 */

	get age() {
		return this[_age];
	}

	set age(val) {
		this[_age] = val;

		if (!this.isAlive()) {
			this.hesDeadJim();
		}

		this.notifyAll('age');
	}

	get clothing() {
		return this[_clothing];
	}

	set clothing(val) {
		this[_clothing] = val;
		this.notifyAll('clothing');
	}

	get dirtFactor() {
		return this[_dirtFactor];
	}

	set dirtFactor(val) {
		this[_dirtFactor] = Math.round(val);
		this.notifyAll('dirtFactor');
	}

	get mute() {
		return this[_mute];
	}

	set mute(val) {
		this[_mute] = val;
		this.notifyAll('mute');
	}

	get sleepFactor() {
		return this[_sleepFactor];
	}

	set sleepFactor(val) {
		this[_sleepFactor] = Math.round(val);

		if (this[_sleepFactor] < 0) {
			this[_sleepFactor] = 0;
		}

		this.notifyAll('sleepFactor');
	}

	get weight() {
		return this[_weight];
	}

	set weight(val) {
		this[_weight] = Math.round(val);

		if (this[_weight] >= this.constructor.maxWeight) {
			this.kill();
		}

		this.notifyAll('weight');
	}
}

// ************************************************************************
// PUBLIC METHODS -- ANYONE MAY READ/WRITE
// ************************************************************************
Person.prototype.hesDeadJim = function() {
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
