export const THEME_STORAGE_KEY = 'theme';

export function isTheme(value) {
	return value === 'light' || value === 'dark';
}

export function readStoredTheme(storage) {
	try {
		const value = (storage === undefined ? globalThis.localStorage : storage)?.getItem(THEME_STORAGE_KEY);
		return isTheme(value) ? value : null;
	} catch {
		return null;
	}
}

export function getSystemTheme(matchMedia = globalThis.matchMedia) {
	try {
		return matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	} catch {
		return 'light';
	}
}

export function getInitialTheme({ storage, prefersDark } = {}) {
	return readStoredTheme(storage) ?? (prefersDark === undefined
		? getSystemTheme()
		: prefersDark ? 'dark' : 'light');
}

export function applyTheme(documentRef, theme) {
	if (!documentRef?.documentElement || !isTheme(theme)) return;
	documentRef.documentElement.dataset.theme = theme;
}

export function storeTheme(theme, storage) {
	if (!isTheme(theme)) return false;

	try {
		const target = storage === undefined ? globalThis.localStorage : storage;
		if (!target || typeof target.setItem !== 'function') return false;
		target.setItem(THEME_STORAGE_KEY, theme);
		return true;
	} catch {
		return false;
	}
}

export function toggleTheme(documentRef, storage) {
	const nextTheme = documentRef?.documentElement?.dataset?.theme === 'dark' ? 'light' : 'dark';
	applyTheme(documentRef, nextTheme);
	storeTheme(nextTheme, storage);
	return nextTheme;
}
