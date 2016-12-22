import personTpl from '../templates/personTpl.js';
import * as util from '../modules/utils.js';

const _age = Symbol('person.age');
const _alive = Symbol('person.alive');
const _clothing = Symbol('person.clothing');
const _dirtFactor = Symbol('person.dirtFactor');
const _maxAge = Symbol('person.maxAge');
const _mute = Symbol('person.mute');
const _sleepFactor = Symbol('person.sleepFactor');
const _weight = Symbol('person.weight');
const _uuid = Symbol('person.uuid');

export default class Person {
	/**
	 * The constructor function for Person class
	 * @param  {[type]} name   [description]
	 * @param  {[type]} gender [description]
	 */
	constructor(name, gender) {
		this[_alive] 	= true;
		this[_age]		= 0;
		this[_maxAge] 	= 70 + util.getRandomNumber(15) + util.getRandomNumber(15);

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
		this.id 			= util.getUuid();

		this.$el = $(personTpl(this));
	}

	_makeOlder(n) {
		this.age += n ? n : 1;

		this.change({ type: 'age', data: this.age });

		return this[_alive];
	}

	eat() {
		if (this._makeOlder()) {
			this.dirtFactor++;
			this.weight += parseInt(this.age * 0.7, 10);
		}
	}

	exercise() {
		if (this._makeOlder()) {
			this.dirtFactor += 5;
			this.weight -= Math.round(this.weight / 5);
		}
	}

	isAlive() {
		return this.age < this[_maxAge] && this[_alive];
	}

	kill() {
		this.age = this[_maxAge];
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
			this.dirtFactor += Math.round(n / 2);
			this.sleepFactor -= n;

			if (this.sleepFactor < 0) {
				this.sleepFactor = 0;
			}
		}
	}

	work(hours) {
		if (hours > 0 && this._makeOlder()) {
			this.dirtFactor += Math.round(hours / 3);
			this.sleepFactor = Math.round(hours * 1.5);
			this.weight += Math.round(hours * 1.75);
		}
	}

	/********
	 * GETTERS / SETTERS
	 ********/
	get age() {
		return this[_age];
	}

	set age(val) {
		this[_age] += val;

		if (!this.isAlive()) {
			this.hesDeadJim();
		}
	}

	get clothing() {
		return this[_clothing];
	}

	set clothing(val) {
		this[_clothing] = val;
		this.change({ type: 'clothing', data: val });
	}

	get dirtFactor() {
		return this[_dirtFactor];
	}

	set dirtFactor(val) {
		this[_dirtFactor] = val;
		this.change({ type: 'dirtFactor', data: val });
	}

	get id() {
		return this[_uuid];
	}

	set id(val) {
		this[_uuid] = val;
	}

	get mute() {
		return this[_mute];
	}

	set mute(val) {
		this[_mute] = val;
		this.change({ type: 'mute', data: val });
	}

	get sleepFactor() {
		return this[_sleepFactor];
	}

	set sleepFactor(val) {
		this[_sleepFactor]= val;
		this.change({ type: 'sleepFactor', data: val });
	}

	get weight() {
		return this[_weight];
	}

	set weight(val) {
		this[_weight] = val;
		this.change({ type: 'weight', data: val });
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
Person.maxDirt = 100;
Person.maxSleep = 100;
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
