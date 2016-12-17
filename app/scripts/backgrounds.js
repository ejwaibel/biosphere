$(() => {
	var $containerBackground = $('#biosphere .background'),
		backgrounds = [
			'images/biosphere1.png',
			'images/biosphere2.png',
			'images/biosphere3.jpg',
			'images/biosphere4.jpg',
			'images/biosphere5.jpg'
		],
		imgNumber = 0;

	/******************************************
	 * CYCLE THROUGH BACKGROUNDS
	 *******************************************/
	let nextImage = function(event) {
			imgNumber++;

			if (imgNumber === backgrounds.length) {
				imgNumber = 0;
			}

			$containerBackground.attr('src', backgrounds[imgNumber]);
		},
		previousImage = function() {
			imgNumber--;

			if (imgNumber < 0) {
				imgNumber = backgrounds.length - 1;
			}

			$containerBackground.attr('src', backgrounds[imgNumber]);
		};

	$('#next-background').on('click', nextImage);
	$('#prev-background').on('click', previousImage);
});
