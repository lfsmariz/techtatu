import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { withBase } from '../lib/paths.js';

export async function GET(context) {
	const posts = await getCollection('blog');
	const filteredPosts = posts.filter((post) => post.data.draft == false);
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: new URL(withBase('/'), context.site),
		items: filteredPosts.map((post) => ({
			...post.data,
		link: withBase(post.data.locale === 'en'
			? `/en/blog/${post.id.replace(/^en\//, '')}/`
			: `/blog/${post.id}/`),
		})),
	});
}
