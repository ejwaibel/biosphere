import Biosphere from './biosphere.js';
import BiosphereView from './views/biosphere-view.js';
import PersonStore from './stores/person-store.js';
import Template from './template.js';
import * as util from './modules/utils.js';

$(() => {
	let tpl = new Template(),
		pStore = new PersonStore(),
		bioView = new BiosphereView(tpl),
		bio = new Biosphere(pStore, bioView),
		$apocolypse = $('.apocolypse'),
		$container = $('#biosphere'),
		$btnAddNew = $('.btn-add-new'),
		$btnTerminateAll = $('.btn-terminate-all'),
		$btnSilenceAll = $('.btn-silence-all'),
		$btnCemeteryView = $('.btn-cemetery-view'),
		$sidebar = $('#sidebar');

	/********************************************************
	 * EVENTS
	 * Use delegation for better event handling
	 ********************************************************/

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
});
