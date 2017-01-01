import Person from './models/person.js';
import * as util from './modules/utils.js';

const _sbTimer = Symbol('biosphere.speechBubble');

export default class Biosphere {
	/**
	 * The constructor function for Biosphere class
	 * @return {[type]} [description]
	 */
	constructor(store, view) {
		let bio = this;

		const _actions = [{
				icon: 'cutlery',
				type: 'eat',
				title: 'Eat'
			}, {
				icon: 'user',
				type: 'clothing',
				title: 'Change Clothing'
			}, {
				icon: 'road',
				type: 'exercise',
				title: 'Exercise'
			}, {
				icon: 'fast-forward',
				type: 'age',
				title: 'Increase Age'
			}, {
				icon: 'tint',
				type: 'shower',
				title: 'Shower'
			}, {
				icon: 'eye-close',
				type: 'sleep',
				title: 'Sleep'
			}, {
				icon: 'usd',
				type: 'work',
				title: 'Work'
			}, {
				icon: 'volume-off',
				type: 'mute',
				title: 'Silence'
			}, {
				icon: 'remove',
				type: 'kill',
				title: 'Kill'
			}];

		this._store = store;
		this._view = view;

		this._view.initActionsBar(_actions);
		this._view.initStats({
			maxWeight: Person.maxWeight
		});

		this._view.bindActionsBar($.proxy(this.doAction, this));
		this._view.bindNewPerson($.proxy(this.newPerson, this));
		this._view.bindSelectPerson($.proxy(this.selectPerson, this));
		this._view.setPopulation(this._store);

		this.sbRate = 4;
		this.isSilenced = false;

		this[_sbTimer] = setInterval($.proxy(this.showSpeechBubble, this), this.sbRate * (util.getRandomNumber(6000) + 1000));

		// Perform necessary steps whenever a Person dies
		Person.prototype.hesDeadJim = function() {
			bio._view.toggleActions('hide');
			bio._view.toggleStats('hide');

			this.deleteListener(bio);
			bio.updatePopulation(this);

			// Check population
			if (bio._store.count === 0) {
				// $btnTerminateAll.addClass('ui-state-disabled');
				// $btnSilenceAll.addClass('ui-state-disabled');
			}

			// Dead people don't speak
			this.mute = true;

			bio._view.killPerson(this);
		};
	}

	doAction(id, action) {
		let person = this._store.getById(id),
			val = null;

		switch (action) {
			case 'age':
				val = Number(util.prompt('How much time? (years)'));

				while (isNaN(val) || val < 0) {
					val = Number(util.prompt('Invalid! Enter amount of time passes'));
				}

				person.muchTimePasses(val);

				break;

			case 'clothing':
				val = util.prompt('What clothes?');

				if (val !== null) {
					person.clothing = val;
				}

				break;

			case 'sleep':
				val = Number(util.prompt('Sleep for how long? (hours)'));

				while (isNaN(val) || val < 0) {
					val = Number(util.prompt('Invalid! Enter hours of sleep'));
				}

				person.sleep(val);

				break;

			case 'work':
				val = Number(util.prompt('Work for how long? (hours)'));

				while (isNaN(val) || val < 0) {
					val = Number(util.prompt('Invalid! Enter number of work hours'));
				}

				person.work(val);

				break;

			default:
				if (util.isFunction(person[action])) {
					person[action]();
				} else {
					person[action] = !person[action];
				}
				break;
		}
	}

	newPerson(name, gender) {
		let p = new Person(name, gender);

		p.addListener(this);

		if (this.isSilenced) {
			p.mute = true;
		}

		this._view.addPerson(p);

		// Update the population in the Biosphere
		this.updatePopulation(p);
	}

	/**
	 * Update the specific progress bar when a Person is changed
	 *
	 * NOTE: This assumes jQuery UI progressbar
	 */
	notify(p, stat) {
		this._view.updatePerson(p, stat);
	}

	selectPerson(id) {
		let p = this._store.getById(id);

		if (p.isAlive()) {
			this._view.toggleStats('show', this._view.updatePerson(p));
			this._view.toggleActions('show', this._view.refreshActions(p));
		}
	}

	showSpeechBubble() {
			if (this._store.count() === 0) {
				return false;
			}

			let p = this._store.getRandomPerson();

			if (p.mute || this.isSilenced) {
				return false;
			}

			this._view.showSpeechBubble(p);
		}

	/**
	 * Update the population total
	 */
	updatePopulation(p) {
		if (!p.isAlive()) {
			this._store.remove(p.id);
		} else {
			this._store.insert(p);
		}

		this._view.setPopulation(this._store);
	}
}

// ************************************************************************
// STATIC PROPERTIES -- ANYONE MAY READ/WRITE
// ************************************************************************

