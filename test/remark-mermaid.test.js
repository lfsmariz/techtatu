import assert from 'node:assert/strict';
import test from 'node:test';
import remarkMermaid from '../src/lib/remark-mermaid.js';

test('remarkMermaid turns Mermaid fences into escaped diagram containers', () => {
	const tree = {
		type: 'root',
		children: [
			{ type: 'code', lang: 'mermaid', value: 'graph TD\nA[<unsafe>] --> B' },
			{ type: 'code', lang: 'js', value: 'const answer = 42;' },
		],
	};

	remarkMermaid()(tree);
	assert.equal(tree.children[1].type, 'code');
	assert.equal(tree.children[0].type, 'html');
	assert.match(tree.children[0].value, /data-mermaid-diagram/);
	assert.match(tree.children[0].value, /&lt;unsafe&gt;/);
	assert.doesNotMatch(tree.children[0].value, /A\[<unsafe>\]/);
});
