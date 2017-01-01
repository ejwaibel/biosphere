export default class Template {
	constructor() {

	}

	actionsBar(actions) {
		return `
			${actions.map(action => `
				<a href="#" class="action" data-action="${action.type}" title="${action.title}">
					<i class="icon glyphicon glyphicon-${action.icon}"></i>
				</a>
			`).join('')}
		`;
	}

	person(p) {
		return `
			<div class="person ${p.gender} ${p.mute ? 'mute' : ''}" data-uuid="${p.id}">
				<i class="icon glyphicon glyphicon-heart heart js-heart"></i>
				<i class="icon glyphicon glyphicon-remove silence"></i>
				<span class="person-name">${p.name}</span>
				<div class="death-age">
					<label>Age:<span></span></label>
				</div>
				<blockquote class="speech-bubble">
					<p>This is a test</p>
				</blockquote>
			</div>
		`;
	}

	population(s) {
		let count = s.count(),
			male = s.getByProp('gender', 'male').size,
			female = s.getByProp('gender', 'female').size;

		return `
			<h2>Total Population:&nbsp; <span id="population-total">${count}</span></h2>
			<h4 class="male">Male: &nbsp; <span id="population-male">${male}</span></h4>
			<h4 class="female">Female: &nbsp; <span id="population-female">${female}</span></h4>
		`;
	}

	stats() {
		return `
			<h4 class="name" data-name></h4>
			<label>Age:</label>
			<div class="progress" data-stat="age">
				<span class="value" data-value></span>
				<span class="progress-bar" data-progress-bar></span>
			</div>
			<label>Dirt Factor:</label>
			<div class="progress" data-stat="dirtFactor">
				<span class="value" data-value></span>
				<span class="progress-bar" data-progress-bar></span>
			</div>
			<label>Sleep Factor:</label>
			<div class="progress" data-stat="sleepFactor">
				<span class="value" data-value></span>
				<span class="progress-bar" data-progress-bar></span>
			</div>
			<label>Weight:</label>
			<div class="progress" data-stat="weight">
				<span class="value" data-value></span>
				<span class="progress-bar" data-progress-bar></span>
			</div>
			<label>Clothing:</label>
			<div class="clothing" data-stat="clothing">
				<p data-clothing></p>
			</div>
		`;
	}
}
