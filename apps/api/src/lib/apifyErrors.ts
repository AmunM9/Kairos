import { ApifyApiError } from '@kairos/apify-client';

export function handleApifyError(err: unknown, platform: string) {
  console.error(`Apify Error [${platform}]:`, err);
  if (err instanceof ApifyApiError) {
    if (err.statusCode === 402) {
      return { type: 'no-credits', message: 'Apify free tier exhausted' };
    }
    if (err.statusCode === 429) {
      return { type: 'rate-limited', message: 'Slow down' };
    }
    if (err.statusCode === 403) {
      return { type: 'plan-restriction', message: 'Upgrade Apify plan needed' };
    }
  }
  return { type: 'unknown', message: `Failed to fetch ${platform}`, details: err instanceof Error ? err.message : String(err) };
}
