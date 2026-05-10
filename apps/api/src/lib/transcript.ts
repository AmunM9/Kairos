import { YoutubeTranscript } from 'youtube-transcript';

export async function fetchYouTubeTranscript(videoUrl: string): Promise<string | null> {
  try {
    const videoId = videoUrl.split('/shorts/')[1]?.split('?')[0];
    if (!videoId) return null;
    const segments = await YoutubeTranscript.fetchTranscript(videoId);
    return segments.map((s: any) => s.text).join(' ').slice(0, 3000);
  } catch {
    return null;
  }
}
