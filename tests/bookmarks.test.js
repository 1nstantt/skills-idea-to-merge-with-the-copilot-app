import assert from 'node:assert/strict';
import test from 'node:test';
import { formatBookmark, normalizeUrl, parseBookmarks } from '../src/lib/bookmarks.js';

test('normalizes URLs with or without https:// to the same value', () => {
  assert.equal(normalizeUrl('https://www.example.com'), 'https://www.example.com/');
  assert.equal(normalizeUrl('www.example.com'), 'https://www.example.com/');
});

test('preserves an explicitly entered http scheme', () => {
  assert.equal(normalizeUrl('http://www.example.com'), 'http://www.example.com/');
});

test('recovers gracefully from empty, corrupted, legacy, and non-array storage values', () => {
  for (const value of [null, undefined, '', '   ', '{broken json', '{"url":"https://legacy.example"}', '"legacy"', 'null', '42']) {
    assert.deepEqual(parseBookmarks(value), [], `expected recovery for ${JSON.stringify(value)}`);
  }
});

test('drops malformed records and validates recovered bookmarks', () => {
  assert.deepEqual(
    parseBookmarks(
      JSON.stringify([
        { url: 'www.example.com', slug: 'mona-7fk2' },
        { url: 'javascript:alert(1)', slug: 'mona-unsafe' },
        { url: 42, slug: 'mona-abcd' },
        { url: 'https://malformed.example', slug: 'legacy' },
      ]),
    ),
    [{ url: 'https://www.example.com/', slug: 'mona-7fk2' }],
  );
});

test('formats a bookmark with the exact visible separator', () => {
  assert.equal(
    formatBookmark({ url: 'https://www.example.com', slug: 'mona-7fk2' }),
    'https://www.example.com :: mona-7fk2',
  );
});
