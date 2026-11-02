const slugPattern = /^mona-[0-9a-zA-Z]{4}$/;

export function normalizeUrl(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError('Enter a URL to save.');
  }

  const trimmed = value.trim();
  const hasScheme = /^https?:\/\//i.test(trimmed);
  const url = new URL(hasScheme ? trimmed : `https://${trimmed}`);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new TypeError('Enter a URL that starts with http:// or https://.');
  }
  return url.href;
}

export function parseBookmarks(value) {
  if (typeof value !== 'string' || value.trim() === '') return [];

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return parsed.flatMap((item) => {
      if (
        item === null ||
        typeof item !== 'object' ||
        Array.isArray(item) ||
        typeof item.url !== 'string' ||
        typeof item.slug !== 'string' ||
        !slugPattern.test(item.slug)
      ) {
        return [];
      }

      try {
        return [{ url: normalizeUrl(item.url), slug: item.slug }];
      } catch {
        return [];
      }
    });
  } catch {
    return [];
  }
}

export function formatBookmark(bookmark) {
  return `${bookmark.url} :: ${bookmark.slug}`;
}
