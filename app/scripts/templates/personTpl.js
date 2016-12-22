export default function personTpl(p) {
	// Use the new ES6 Template Literal syntax
	// See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
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
