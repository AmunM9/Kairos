import NodeCache from 'node-cache';
import { env } from '../config/env';

export const searchCache = new NodeCache({ stdTTL: env.CACHE_TTL_SECONDS });
