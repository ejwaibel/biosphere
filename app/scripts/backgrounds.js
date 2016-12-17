$(() => {
	var $biosphereBackground = $('#biosphere .background'),
		backgrounds = [
			'winter',
			'spring',
			'summer',
			'fall'
		],
		imgNumber = 0;

	/******************************************
	 * CYCLE THROUGH BACKGROUNDS
	 *******************************************/
	let toggleBackground = function(e) {
		var type = e.type;

		e.preventDefault();

		imgNumber += type === 'next' ? 1 : -1;

		if (imgNumber === backgrounds.length) {
			imgNumber = 0;
		} else if (imgNumber < 0) {
			imgNumber = backgrounds.length - 1;
		}

		$biosphereBackground.removeClass(backgrounds.join(' '));
		$biosphereBackground.addClass(backgrounds[imgNumber]);
	};

	$('#next-background').on('click', { type: 'next' }, toggleBackground);
	$('#prev-background').on('click', { type: 'prev' }, toggleBackground);
});
