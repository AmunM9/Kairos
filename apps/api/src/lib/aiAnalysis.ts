import OpenAI from 'openai';
import { env } from '../config/env';

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export interface VideoAnalysis {
  hook: string;
  structure: string;
  why_works: string;
  replicate: string;
  keywords: string[];
  verdict: 'fire' | 'good' | 'average' | 'weak';
}

export async function analyzeVideo(video: any, transcript: string | null): Promise<VideoAnalysis> {
  const platformLabel: Record<string, string> = {
    youtube: 'YouTube Shorts',
    tiktok: 'TikTok',
    instagram: 'Instagram Reel',
  };

  const prompt = `Eres un experto en viral content marketing para video corto (Reels, TikToks, Shorts).

Video a analizar:
Plataforma: ${platformLabel[video.platform] || video.platform}
Título/Caption: ${video.title || 'Sin título'}
Duración: ${video.duration || 'Desconocida'}
Vistas: ${(video.views ?? 0).toLocaleString()} | Likes: ${(video.likes ?? 0).toLocaleString()} | Comentarios: ${(video.commentsCount ?? 0).toLocaleString()}
Engagement: ${video.engagementRate ? (video.engagementRate * 100).toFixed(2) : '0'}%
Viral Score: ${video.viralScore ?? 0}/100
Hashtags: ${(video.hashtags ?? []).slice(0, 10).join(' ')}
Creator: @${video.creator?.handle || video.creator?.name || 'desconocido'}${video.creator?.followers ? ` (${video.creator.followers.toLocaleString()} seguidores)` : ''}
${transcript ? `\nTranscripción:\n${transcript}` : '(Sin transcripción disponible — analiza solo con los metadatos)'}

Responde ÚNICAMENTE con este JSON sin ningún markdown ni texto adicional:
{
  "hook": "Qué gancho usa el video en los primeros 3 segundos para retener al espectador",
  "structure": "Cómo está estructurado: apertura, desarrollo y cierre del video",
  "why_works": "Análisis de por qué estas métricas son así y qué lo hace funcionar o fallar",
  "replicate": "Idea concreta y accionable para crear un video similar sobre este tema",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "verdict": "fire"
}

Reglas:
- Máximo 2 oraciones por campo de texto
- verdict debe ser exactamente uno de: "fire", "good", "average", "weak"
- Sin emojis en los textos
- Directo, sin relleno, orientado a acción`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 600,
    temperature: 0.6,
  });

  const raw = completion.choices[0]?.message?.content?.trim() || '{}';
  return JSON.parse(raw) as VideoAnalysis;
}
