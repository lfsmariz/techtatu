// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import remarkMermaid from './src/lib/remark-mermaid.js';

export default defineConfig({
	site: 'https://www.techtatu.com',
	base: '/',
	markdown: {
		remarkPlugins: [remarkMermaid],
	},
	integrations: [mdx(), sitemap()],
});
