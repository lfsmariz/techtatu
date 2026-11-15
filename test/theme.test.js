import assert from 'node:assert/strict';
import test from 'node:test';
import {
	applyTheme,
	getInitialTheme,
	storeTheme,
	toggleTheme,
} from '../src/scripts/theme.js';

function documentWithTheme() {
	return { documentElement: { dataset: {} } };
}

test('an explicit light choice wins over a dark system preference on a new page', () => {
	const storage = { getItem: () => 'light' };
	const page = documentWithTheme();

	applyTheme(page, getInitialTheme({ storage, prefersDark: true }));

	assert.equal(page.documentElement.dataset.theme, 'light');
});

test('an explicit dark choice is persisted and restored after reload', () => {
	const values = new Map();
	const storage = {
		getItem: (key) => values.get(key) ?? null,
		setItem: (key, value) => values.set(key, value),
	};
	const firstPage = documentWithTheme();

	applyTheme(firstPage, 'dark');
	assert.equal(toggleTheme(firstPage, storage), 'light');
	assert.equal(values.get('theme'), 'light');
	assert.equal(toggleTheme(firstPage, storage), 'dark');
	assert.equal(values.get('theme'), 'dark');

	const reloadedPage = documentWithTheme();
	applyTheme(reloadedPage, getInitialTheme({ storage, prefersDark: false }));

	assert.equal(reloadedPage.documentElement.dataset.theme, 'dark');
});

test('without a saved choice, the system preference is used', () => {
	assert.equal(getInitialTheme({ storage: { getItem: () => null }, prefersDark: true }), 'dark');
	assert.equal(getInitialTheme({ storage: { getItem: () => null }, prefersDark: false }), 'light');
});

test('storage failures do not prevent applying the theme or toggling persistence', () => {
	const unavailableStorage = {
		getItem: () => { throw new Error('blocked'); },
		setItem: () => { throw new Error('blocked'); },
	};
	const page = documentWithTheme();

	applyTheme(page, getInitialTheme({ storage: unavailableStorage, prefersDark: true }));
	assert.equal(page.documentElement.dataset.theme, 'dark');
	assert.equal(storeTheme('light', unavailableStorage), false);
});
