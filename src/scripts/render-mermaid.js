const diagramId = (index) => `mermaid-diagram-${index}`;

const parseMermaidSvg = (svg, doc = document) => {
	const template = doc.createElement('template');
	template.innerHTML = svg.trim();
	const svgElement = template.content.firstElementChild;
	if (!svgElement || svgElement.nodeName.toLowerCase() !== 'svg' || template.content.childElementCount !== 1) {
		throw new Error('Invalid SVG');
	}
	return svgElement;
};

const renderMermaid = async (root = document) => {
	const diagrams = [...root.querySelectorAll('[data-mermaid-diagram]')];
	if (!diagrams.length) return;
	try {
		const { default: mermaid } = await import('mermaid');
		mermaid.initialize({ startOnLoad: false, securityLevel: 'strict' });
		await Promise.all(diagrams.map(async (container, index) => {
			const source = container.querySelector('.mermaid-source')?.textContent ?? '';
			try {
				const { svg } = await mermaid.render(diagramId(index), source);
				const svgElement = parseMermaidSvg(svg);
				svgElement.setAttribute('role', 'img');
				svgElement.setAttribute('aria-label', 'Mermaid diagram');
				container.replaceChildren(svgElement);
			} catch {
				container.classList.add('mermaid-diagram--error');
				const status = document.createElement('p');
				status.className = 'mermaid-error';
				status.setAttribute('role', 'status');
				status.textContent = 'Diagram unavailable; source is shown below.';
				container.prepend(status);
			}
		}));
	} catch {
		for (const container of diagrams) {
			container.classList.add('mermaid-diagram--error');
			const status = document.createElement('p');
			status.className = 'mermaid-error';
			status.setAttribute('role', 'status');
			status.textContent = 'Diagram unavailable; source is shown below.';
			container.prepend(status);
		}
	}
};

if (typeof document !== 'undefined') renderMermaid();
export { parseMermaidSvg, renderMermaid };
