import personTpl from '../templates/personTpl.js';
import * as util from '../modules/utils.js';

const _curSeason = Symbol('biosphereView.seasons');
const _seasons = Symbol('biosphereView.seasons');
const _template = Symbol('template');

const _personId = ($el) => $el.data('uuid');

export default class BiosphereView {
	constructor(tpl) {
		this[_template] = tpl;
		this[_curSeason] = 0;
		this[_seasons] = [
			'winter',
			'spring',
			'summer',
			'fall'
		];

		this.$el = $('#biosphere');
		this.$actionsBar = $('#actions-bar');
		this.$modals = {
			addPerson: $('#add-person-modal')
		};
		this.$sidebar = $('#sidebar');
		this.$stats = $('#stats');

		this.$populationCount = this.$el.find('.population-count');

		this.$habitat = this.$el.find('.background');
		this.$nextHabitat = this.$el.find('.next-background');
		this.$prevHabitat = this.$el.find('.prev-background');

		this.$nextHabitat.on('click', { pos: 'next' }, $.proxy(this.toggleHabitat, this));
		this.$prevHabitat.on('click', { pos: 'prev' }, $.proxy(this.toggleHabitat, this));

		// Setup tooltips on each button
		$('.button').tooltip();
		this.$sidebar.find('.button').tooltip({ placement: 'right' });

		this.$selectedPerson = $();

		setInterval(this.heartbeat, 480);

		/******************************************
		 * BODY CLICK EVENT
		 ******************************************/
		$('body').on('click', ':not(.person), :not(#quick-actions)', () => {
			this.$selectedPerson.removeClass('selected');

			this.toggleStats('hide');
			this.toggleActions('hide');
		});
	}

	addPerson(p) {
		var top = (Math.random() * (this.$el.height() / 2)).toFixed(),
			left = (Math.random() * (this.$el.width() - 75)).toFixed(),
			$person = $(personTpl(p));

		// $btnTerminateAll.removeClass('ui-state-disabled');
		// $btnSilenceAll.removeClass('ui-state-disabled');

		// Add Person to 'container' at random position
		this.$el.append($person);

		$person
			.draggable({ containment: this.$el })
			.css({ bottom: top + 'px', left: left + 'px' });
	}

	bindActionsBar(handler) {
		this.$actionsBar
			.on('click', '.action:not(.ui-state-disabled)', (evt) => {
				var $this = $(evt.currentTarget),
					id = this.$selectedPerson.data('uuid'),
					action = $this.data('action');

				// Stop the event from 'bubbling' down to the body.
				event.stopPropagation();

				handler(id, action);
			});
	}

	bindNewPerson(handler) {
		this.$modals.addPerson
			// DIALOG BUTTON CLICK EVENT
			.on('click', '.btn-submit', () => {
				var $name = this.$modals.addPerson.find('input[name=pname]'),
					gender = this.$modals.addPerson.find('input:radio[name=sex]:checked').val();

				// Clear the name field
				$name.val('').focus();

				handler($name.val(), gender);
			})
			// DIALOG KEYUP EVENT
			.on('keyup', (e) => {
				switch (e.keyCode) {
					case $.ui.keyCode.ENTER:
						this.$modals.addPerson.find('.btn-submit').trigger('click');

						return false;
				}
			});
	}

	bindSelectPerson(handler) {
		this.$el.on('click', '.person:not(.tombstone)', (evt) => {
			let $this = $(evt.currentTarget);

			// Stop the event from 'bubbling' down to the body.
			evt.stopPropagation();

			this.$selectedPerson.removeClass('selected');

			this.$selectedPerson = $this.addClass('selected');

			handler(_personId($this));
		});
	}

	// Heartbeat animation
	heartbeat() {
	 	var change = 1,
	 		$heart = $('.js-heart'),
	 		size;

	 	if ($heart.length) {
	 		size = Number($heart.css('font-size').replace('px', ''));
	 		change = size >= 13 ? -1 : 1;

	 		$heart.css({ 'font-size': size += change }, 500);
	 	}

	 	// window.requestAnimationFrame(heartbeat);
	}

	initActionsBar(actions) {
		this.$actionsBar.html(this[_template].actionsBar(actions));
	}

	initStats(maxObj) {
		// Initialize progress bars in stats box
		this.$stats.html(this[_template].stats());
		this.$info = this.$stats.find('[data-stat]');

		this.$info.each(function() {
			let $this = $(this),
				$progressBar = $this.find('[data-progress-bar]'),
				stat = $this.data('stat'),
				max = 100;

			switch (stat) {
				case 'weight':
					max = maxObj.maxWeight;
					break;
			}

			$progressBar.progressbar({
				max: max
			});
		});
	}

	killPerson(p) {
		let $person = $(`[data-uuid="${p.id}"]`);

		$person
			.removeClass('selected')
			.find('.death-age span').text(p.age).end()
			.animate({
				opacity: 0.5
			}, 500, () =>
				$person
					.removeClass(p.gender).addClass('tombstone')
					.css({ opacity: 1 })
					.off()
			);
	}

	refreshActions(p) {

	}

	showSpeechBubble(p) {
		let rnd = util.getRandomNumber(p.thoughts.length),
			$sb = $(`[data-uuid="${p.id}"]`)
			.find('.speech-bubble')
				.html(p.thoughts[rnd])
				.show();

		setTimeout(() => $sb.fadeOut(), util.getRandomNumber(5000) + 1000);
	}

	toggleStats(display, handler = function() {}) {
		this.$stats[display]('slide', { direction: 'left' }, 500, handler);
	}

	setPopulation(store) {
		this.$populationCount.html(this[_template].population(store));
	}

	toggleActions(display, handler = function() {}) {
		this.$actionsBar[display]('slide', { direction: 'down' }, 500, handler);
	}

	toggleHabitat(e) {
		var pos = e.data.pos,
			inc = pos === 'next' ? 1 : -1;

		e.preventDefault();

		this[_curSeason] = (this[_curSeason] + inc) % this[_seasons].length;

		this.$habitat.removeClass(this[_seasons].join(' '));
		this.$habitat.addClass(this[_seasons][Math.abs(this[_curSeason])]);
	}

	updatePerson(p) {
		let $person = $(`[data-uuid="${p.id}"]`);

		this.$info.each(function() {
			let $this = $(this),
				$displayValue = $this.find('[data-value]'),
				$progressBar = $this.find('[data-progress-bar]'),
				stat = $this.data('stat'),
				value = p[stat],
				width = value;

			switch (stat) {
				case 'clothing':
					$this.text(p.clothing);
					break;

				case 'mute':
					$person.addClass('mute');
					break;

				case 'weight':
					width = p.weight / p.constructor.maxWeight * 100;

				default:
					$displayValue.text(value);
					$progressBar
						// .progressbar('value', value)
						.css({ width: width + '%' });
					break;
			}
		});
	}
}
