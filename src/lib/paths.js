const configuredBase = import.meta.env.BASE_URL || '/';
const baseUrl = configuredBase.endsWith('/') ? configuredBase : `${configuredBase}/`;
const basePath = baseUrl === '/' ? '' : baseUrl.slice(0, -1);

export const withBase = (path) => {
	const normalizedPath = path || '/';
	if (basePath && (normalizedPath === basePath || normalizedPath.startsWith(`${basePath}/`))) {
		return normalizedPath;
	}
	return `${baseUrl}${normalizedPath.replace(/^\/+/, '')}`;
};

export const withoutBase = (path) => {
	if (basePath && (path === basePath || path.startsWith(`${basePath}/`))) {
		return path.slice(basePath.length) || '/';
	}
	return path || '/';
};
