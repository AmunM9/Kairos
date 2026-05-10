import { VideoCard } from '@kairos/types';

export function roundRobin(platformData: Record<string, VideoCard[]>, platforms: string[]): VideoCard[] {
  const finalResults: VideoCard[] = [];
  let index = 0;
  let added = true;
  while (added) {
    added = false;
    for (const p of platforms) {
      if (platformData[p] && platformData[p][index]) {
        finalResults.push(platformData[p][index]);
        added = true;
      }
    }
    index++;
  }
  return finalResults;
}
