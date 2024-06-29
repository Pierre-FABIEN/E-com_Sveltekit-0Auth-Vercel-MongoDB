/**
 * Enveloppe chaque ligne de texte d'un élément dans des éléments HTML personnalisés.
 *
 * @param {string} targetSelector - Sélecteur CSS de l'élément cible.
 * @param {string} wrapEl - Le nom de la balise HTML à utiliser pour l'enveloppe externe de chaque ligne.
 * @param {string} wrapClass - La classe CSS à appliquer à chaque enveloppe de ligne.
 * @param {string} subwrapClass - La classe CSS à appliquer à chaque sous-enveloppe de ligne.
 */
export const wrapNewLines = (
	element: HTMLElement,
	wrapEl = 'span',
	wrapClass = 'line',
	subwrapClass = 'subline'
) => {
	let sectionWidth = element.getBoundingClientRect().width;
	let words = element.innerText.split(/( )/g);
	let newContent = ''; // Construire le nouveau contenu en mémoire

	words.forEach((word) => {
		newContent += `<span>${word}</span>`;
	});

	element.innerHTML = newContent; // Mise à jour une fois avec le nouveau contenu

	let lines = [];
	let line = [];
	let lineWidth = 0;
	let spans = element.querySelectorAll('span');

	spans.forEach((span) => {
		let spanWidth = span.getBoundingClientRect().width;
		if (lineWidth + spanWidth <= sectionWidth - 1) {
			line.push(span.outerHTML); // Utilise outerHTML pour conserver les balises span
			lineWidth += spanWidth;
		} else {
			lines.push(line);
			line = [span.outerHTML];
			lineWidth = spanWidth;
		}
	});

	if (line.length) lines.push(line);

	let newLines = lines
		.map(
			(line) =>
				`<${wrapEl} class="${wrapClass}"><${wrapEl} class="${subwrapClass}">${line.join(
					''
				)}</${wrapEl}></${wrapEl}>`
		)
		.join('');

	element.innerHTML = newLines; // Mise à jour finale avec les lignes enveloppées
};
