/**
 * Public Google Maps Share > Embed format, observed working on 14 Nov 2026.
 * No API key, API project or billing setup. This format is not a versioned
 * developer API and Google can change it. Only a panorama ID is sent: do not
 * add the answer coordinates to the live round payload to construct an embed.
 */
export function buildStreetViewShareURL(location: {
  panoId: string;
  heading?: number;
  pitch?: number;
}): string {
  if (!/^[A-Za-z0-9_-]{1,512}$/.test(location.panoId)) return "";
  const heading = Number.isFinite(location.heading) ? ((location.heading ?? 0) % 360 + 360) % 360 : 0;
  const pitch = Number.isFinite(location.pitch) ? Math.max(-90, Math.min(90, location.pitch ?? 0)) : 0;
  const pb = `!4v1!6m5!1m4!1s${location.panoId}!3f${heading}!4f${pitch}!5f0.7820865974627469`;
  return `https://www.google.com/maps/embed?${new URLSearchParams({ pb }).toString()}`;
}
