import { describe, it, expect } from 'vitest';
import { buildStreetViewShareURL } from './street-view-share';

describe('key-free Street View share embeds', () => {
  it('uses a public share iframe, without API credentials or an answer coordinate', () => {
    const url = new URL(buildStreetViewShareURL({panoId:'hK3mf26vqnqkcd4jk4bZEQ',heading:313}));
    expect(url.origin).toBe('https://www.google.com');
    expect(url.pathname).toBe('/maps/embed');
    expect([...url.searchParams.keys()]).toEqual(['pb']);
    expect(url.searchParams.has('key')).toBe(false);
    expect(url.searchParams.get('pb')).toBe('!4v1!6m5!1m4!1shK3mf26vqnqkcd4jk4bZEQ!3f313!4f0!5f0.7820865974627469');
    expect(url.searchParams.get('pb')).not.toContain('!2m2');
  });
  it('normalises camera settings and rejects malformed panorama tokens', () => {
    const url = new URL(buildStreetViewShareURL({panoId:'test_pano-123',heading:-47,pitch:100}));
    expect(url.searchParams.get('pb')).toContain('!3f313!4f90!');
    expect(buildStreetViewShareURL({panoId:''})).toBe('');
    expect(buildStreetViewShareURL({panoId:'id!3f999'})).toBe('');
    expect(buildStreetViewShareURL({panoId:'https://other.example'})).toBe('');
  });
});
