import { env } from './apps/api/src/config/env';
import { KairosApifyClient } from '@kairos/apify-client';

const client = new KairosApifyClient(env.APIFY_API_TOKEN);

async function test() {
  console.log('Testing Youtube...');
  try {
    const yt = await client.searchYouTube('branding', 2);
    console.log('YT items:', yt?.length);
  } catch (e) {
    console.error('YT Error:', e);
  }

  console.log('Testing TikTok...');
  try {
    const tt = await client.searchTikTok('branding', 2);
    console.log('TT items:', tt?.length);
  } catch (e) {
    console.error('TT Error:', e);
  }
}

test();
