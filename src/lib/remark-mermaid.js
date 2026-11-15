/**
 * Turn Mermaid fenced code blocks into a small, inert HTML container.
 *
 * The diagram source is escaped before it enters the HTML tree. The browser
 * script reads it back through textContent, so Markdown source never becomes
 * executable markup.
 */
const escapeHtml = (value) =>
	value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');

const walk = (node) => {
	if (!node || !Array.isArray(node.children)) return;

	for (let index = 0; index < node.children.length; index += 1) {
		const child = node.children[index];
		if (child.type === 'code' && child.lang?.toLowerCase() === 'mermaid') {
			const source = child.value ?? '';
			node.children[index] = {
				type: 'html',
				value: `<div class="mermaid-diagram" data-mermaid-diagram role="img" aria-label="Mermaid diagram"><pre class="mermaid-source">${escapeHtml(source)}</pre></div>`,
			};
		} else {
			walk(child);
		}
	}
};

export default function remarkMermaid() {
	return (tree) => walk(tree);
}

export { escapeHtml };
