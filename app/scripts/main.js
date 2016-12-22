import Biosphere from './stores/biosphereStore.js';
import Person from './models/person.js';
import * as util from './modules/utils.js';

$(() => {
	let bio = new Biosphere(),
		$apocolypse = $('.apocolypse'),
		$quickActionsBar = $('#quick-actions'),
		$btnActions = {},
		$dialogTemplate = $('#add-person-dialog'),
		$container = $('#biosphere'),
		$btnAddNew = $('.btn-add-new'),
		$btnTerminateAll = $('.btn-terminate-all'),
		$btnSilenceAll = $('.btn-silence-all'),
		$btnCemeteryView = $('.btn-cemetery-view'),
		$sidebar = $('#sidebar'),
		$stats = $('#stats');

	var reloadStats = function(p) {
			$stats
				.find('.name').text(p.name).end()
				.find('.clothing p').text(p.clothing).end();

			p.change({ type: 'age', data: p.age });
			p.change({ type: 'dirtFactor', data: p.dirtFactor });
			p.change({ type: 'sleepFactor', data: p.sleepFactor });
			p.change({ type: 'weight', data: p.weight });
		},
		addPerson = function(p) {
			var top = (Math.random() * ($container.height() / 2)).toFixed(),
				left = (Math.random() * ($container.width() - 75)).toFixed();

			$btnTerminateAll.removeClass('ui-state-disabled');
			$btnSilenceAll.removeClass('ui-state-disabled');

			// Add Person to 'container' at random position
			$container.append(p.$el);

			p.$el
				.draggable({ containment: '#biosphere' })
				.css({ bottom: top + 'px', left: left + 'px' });

			reloadStats(p);

			// Update the population in the Biosphere
			bio.updatePopulation(p);

			if (bio.isSilenced) {
				p.mute = true;
			}
		},
		toggleQuickActions = function(display, person) {
			$quickActionsBar[display]('slide', { direction: 'down' }, 500);

			if (person) {

			}
		},
		toggleStats = function(display, p) {
			$stats[display]('slide', { direction: 'left' }, 500, function() {
				if (display === 'show') {
					reloadStats(p);
				}
			});
		};

	/******************************************
	 * BODY CLICK EVENT
	 ******************************************/
	$('body').on('click', ':not(.person), :not(#quick-actions)', function() {
		$('.person.selected').removeClass('selected');

		toggleStats('hide');
		toggleQuickActions('hide');
	});

	// Initialize progress bars in stats box
	$stats
		.find('.progress .progress-bar')
			.progressbar()
		.end()
		.find('.progress.weight .progress-bar')
			.progressbar('option', 'max', Person.maxWeight)
		.end()
		.find('.progress.dirtFactor .progress-bar')
			.progressbar('option', 'max', Person.maxDirt);

	// Setup tooltips on each button
	$sidebar.find('.button').tooltip({ placement: 'right' });
	$('.button').tooltip();

	/********************************************************
	 * EVENTS
	 * Use delegation for better event handling
	 ********************************************************/

	$dialogTemplate
		// DIALOG BUTTON CLICK EVENT
		.on('click', '.btn-submit', function() {
			var $name = $dialogTemplate.find('input[name=pname]'),
				gender = $dialogTemplate.find('input:radio[name=sex]:checked').val(),
				p = new Person($name.val(), gender);

			addPerson(p);

			// Clear the name field
			$name.val('').focus();
		})
		// DIALOG KEYUP EVENT
		.on('keyup', function(e) {
			var $this = $(this);

			switch (e.keyCode) {
				case $.ui.keyCode.ENTER:
					$this.find('.btn-submit').trigger('click');

					return false;
			}
		});

	$container
		// PERSON CLICK EVENT
		.on('click', '.person:not(.tombstone)', function(event) {
			var $this = $(this),
				p = bio.getPersonById($this.data('uuid')),
				isSelected = $this.hasClass('selected');

			// Stop the event from 'bubbling' down to the body.
			event.stopPropagation();

			$('.person.selected').removeClass('selected');
			toggleStats('hide');

			if (p.isAlive() && !isSelected) {
				toggleStats('show', p);
				$this.addClass('selected');
				toggleQuickActions('show', p);
			}
		});

	$sidebar
		// START APOCOLYPSE CLICK EVENT
		.on('click', '.btn-terminate-all:not(.ui-state-disabled)', function() {
			var timer;

			$container.effect('pulsate', 700);

			//$('.person:not(.tombstone)').effect('pulsate', 700);
			// if ($(this).hasClass('ui-state-disabled')) {
			// 	return false;
			// }

			// Disable all buttons when clicked
			$sidebar.find('button').addClass('ui-state-disabled');

			// $('.person:not(.tombstone)').each(function(index, obj) {
			// 	var p = getPersonById($(this).data('uuid'));

			// 	setTimeout(function() {
			// 		p.kill();
			// 	}, Math.random() * 2000);
			// });


			/***********************************************************
			 * Set a timer to check if all people have been killed
			 * Once the population is 0, then perform additional animations
			 * and change to cemetery view.
			 * FIXME: Change to use requestAnimationFrame()
			 *************************************************************/
			timer = setInterval(function() {
				if (bio.totalPopulation === 0) {
					$apocolypse.slideDown(2000, function() {
						$apocolypse.hide();
						$btnCemeteryView.click();
					});

					$btnAddNew.removeClass('ui-state-disabled');
					$btnCemeteryView.removeClass('ui-state-disabled');

					clearInterval(timer);
				}
			}, 500);
		})
		// SILENCE POPULATION CLICK EVENT
		.on('click', '.btn-silence-all:not(.ui-state-disabled)', function() {
			var $this = $(this),
				$silentText = $('.silence-text'),
				$icon = $this.find('.icon');

			$icon.toggleClass('glyphicon-volume-off glyphicon-volume-up');

			if ($icon.hasClass('glyphicon-volume-up')) {
				bio.isSilenced = true;
				$silentText.fadeIn();
				$('.speech-bubble:visible').effect('puff', 200);
			} else {
				bio.isSilenced = false;
				$silentText.fadeOut();
			}
		})
		// SWITCH BETWEEN CEMETARY AND LIVING PEOPLE
		.on('click', '.btn-cemetery-view:not(.ui-state-disabled)', function() {
			var $this = $(this),
				$icon = $this.find('.icon');

			$container.toggleClass('cemetery');
			$btnAddNew.toggleClass('ui-state-disabled');
			$icon.toggleClass('glyphicon-fire glyphicon-user');

			if ($icon.hasClass('glyphicon-user')) {
				// Show cemetery, hide people, show tombstones
				$this.attr('title', 'Leave Cemetery').tooltip();
				$btnTerminateAll.addClass('ui-state-disabled');
				$btnSilenceAll.addClass('ui-state-disabled');
			} else {
				// Set first background, hide tombstones, show people
				$this.attr('title', 'Visit Cemetery').tooltip();

				if (bio.totalPopulation > 0) {
					$btnTerminateAll.removeClass('ui-state-disabled');
					$btnSilenceAll.removeClass('ui-state-disabled');
				}
			}
		});

	/******************************************
	 * ANIMATIONS
	 *****************************************/

	// Heartbeat animation
	let heartbeat = function() {
	 	var change = 1,
	 		$heart = $('.js-heart'),
	 		size;

	 	if ($heart.length) {
	 		size = Number($heart.css('font-size').replace('px', ''));
	 		change = size >= 13 ? -1 : 1;

	 		$heart.css({ 'font-size': size += change }, 500);
	 	}

	 	// window.requestAnimationFrame(heartbeat);
	};

	let showSpeechBubble = function() {
		if (bio.totalPopulation === 0) {
			return false;
		}

		let p = bio.getRandomPerson();

		if (p.mute || bio.isSilenced) {
			return false;
		}

		// Show the Person's speech bubble
		let $sb = p.$el
			.find('.speech-bubble')
				.html(p.thoughts[util.getRandomNumber(p.thoughts.length - 1)])
				.show();

		setTimeout(() => $sb.fadeOut(), util.getRandomNumber(5000));
	};
	let sbTimer = setInterval(showSpeechBubble, 16 * (util.getRandomNumber(6000) + 1000));
	let hbTimer = setInterval(heartbeat, 480);

	$quickActionsBar
		.on('click', '.action:not(.ui-state-disabled)', function(event) {
			var $this = $(this),
				uuid = $('.person.selected').data('uuid'),
				action = $this.data('action'),
				person = bio.getPersonById(uuid),
				pr = null;

			// Stop the event from 'bubbling' down to the body.
			event.stopPropagation();

			switch (action) {
				case 'age':
					pr = Number(prompt('How much time? (years)'));

					while (isNaN(pr) || pr < 0) {
						pr = Number(prompt('Invalid! Enter amount of time passes'));
					}

					person.muchTimePasses(pr);

					break;

				case 'change':
					pr = prompt('What clothes?');

					if (pr !== null) {
						person.clothing = pr;
					}

					break;

				case 'kill':
					person.kill();

					break;

				case 'sleep':
					pr = Number(prompt('Sleep for how long? (hours)'));

					while (isNaN(pr) || pr < 0) {
						pr = Number(prompt('Invalid! Enter hours of sleep'));
					}

					person.sleep(pr);

					break;

				case 'silence':
					$this.addClass('ui-state-disabled');
					person.mute = true;

					break;

				case 'work':
					pr = Number(prompt('Work for how long? (hours)'));

					while (isNaN(pr) || pr < 0) {
						pr = Number(prompt('Invalid! Enter number of work hours'));
					}

					person.work(pr);

					break;

				default:
					if (person.hasOwnProperty(action) && typeof person[action] === 'function') {
						person[action]();
					}
			}
		});

	/******************************************
	 * Person prototype properties/methods
	 ******************************************/

	// Perform necessary steps whenever a Person dies
	Person.prototype.hesDeadJim = function() {
		toggleQuickActions('hide');
		toggleStats('hide');

		bio.updatePopulation(this);

		// Check population
		if (bio.totalPopulation === 0) {
			$btnTerminateAll.addClass('ui-state-disabled');
			$btnSilenceAll.addClass('ui-state-disabled');
		}

		// Dead people don't speak
		this.mute = true;

		this.$el
			.removeClass('selected')
			.find('.death-age span').text(this.age).end()
			.animate({
				opacity: 0.5
			}, 500, () =>
				this.$el
					.removeClass(this.gender).addClass('tombstone')
					.css({ opacity: 1 })
					.off()
			);
	};

	/**
	 * Update the specific progress bar when a Person is changed
	 *
	 * NOTE: This assumes jQuery UI progressbar
	 */
	Person.prototype.change = function(obj) {
		var $progressbar = $('#stats .progress.' + obj.type + ' .progress-bar'),
			width;

		if (obj.type === 'clothing') {
			$stats.find('.clothing p').text(obj.data);

			return;
		} else if (obj.type === 'mute' && this.$el) {
			this.$el.addClass('mute');
		}

		width = obj.data;

		if (obj.type === 'weight') {
			width = obj.data / Person.prototype.constructor.maxWeight * 100;
		}

		$progressbar
			.siblings('.value').text(obj.data).end()
			.css({ width: width + '%' });

		// $progressbar.progressbar('value', obj.data);
	};
});
