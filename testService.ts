import { env } from './apps/api/src/config/env';
import { searchService } from './apps/api/src/services/searchService';

async function test() {
  console.log('Testing searchService...');
  try {
    const res = await searchService('branding', ['youtube', 'tiktok', 'instagram'], 'week', 'viral', 'all', 0);
    console.log(JSON.stringify(res, null, 2));
  } catch (e) {
    console.error('Service Error:', e);
  }
}

test();
