import assert from 'node:assert/strict';
import test from 'node:test';
import { parseMermaidSvg } from '../src/scripts/render-mermaid.js';

function templateDocument({ rootName = 'svg', childElementCount = 1 } = {}) {
	const content = {
		firstElementChild: { nodeName: rootName },
		childElementCount,
	};
	const html = [];
	return { document: {
		createElement: (name) => {
			assert.equal(name, 'template');
			return { content, set innerHTML(value) { html.push(value); } };
		},
	}, html };
}

test('parseMermaidSvg accepts HTML-style br output from Mermaid', () => {
	const fixture = templateDocument();
	const svg = parseMermaidSvg('<svg><foreignObject><p>label<br></p></foreignObject></svg>', fixture.document);

	assert.equal(svg.nodeName, 'svg');
	assert.match(fixture.html[0], /<br>/);
});

test('parseMermaidSvg rejects output without exactly one SVG root', () => {
	assert.throws(
		() => parseMermaidSvg('<div>not a diagram</div>', templateDocument({ rootName: 'div' }).document),
		/Invalid SVG/,
	);
	assert.throws(
		() => parseMermaidSvg('<svg></svg><svg></svg>', templateDocument({ childElementCount: 2 }).document),
		/Invalid SVG/,
	);
});
