export let tpl = {
	// Use the new ES6 Template Literal syntax
	// See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
	person: p => `
		<div class="person ${p.gender}" data-uuid="${p.id}">
			<span class="person-name">${p.name}</span>
			<div class="death-age">
				<label>Age:<span></span></label>
			</div>
			<span class="icon glyphicon glyphicon-heart heart js-heart"></span>
			<blockquote class="speech-bubble">
				<p>This is a test</p>
			</blockquote>
		</div>
	`
};
