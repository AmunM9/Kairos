import OpenAI from 'openai';
import { env } from '../config/env';

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export interface VideoAnalysis {
  hookAnalysis: string;
  retentionDrivers: string;
  coreValueProp: string;
  replicationStrategy: {
    stepByStep: string[];
    titleFormula: string;
    scriptFramework: string;
  };
  differentiationOpportunities: string[];
}

export async function analyzeVideo(video: any, transcript: string | null): Promise<VideoAnalysis> {
  const prompt = `Eres un estratega experto en contenido viral para YouTube Shorts.
Tu objetivo es analizar cualitativamente este video basándote ÚNICAMENTE en su título y transcripción (si existe), para darle a un creador instrucciones claras de cómo replicar su éxito.

Video a analizar:
Título: ${video.title || 'Sin título'}
${transcript ? `Transcripción:\n${transcript}` : '(Sin transcripción disponible. Basa tu análisis en el título e infiere la estructura posible).'}

Responde ÚNICAMENTE con este JSON válido:
{
  "hookAnalysis": "Análisis profundo del gancho: ¿qué elemento verbal o psicológico usa al inicio para captar la atención?",
  "retentionDrivers": "Por qué la gente sigue viendo: ¿hay un gap de curiosidad, ritmo rápido, o promesa de valor clara?",
  "coreValueProp": "La idea central del video resumida en una frase contundente",
  "replicationStrategy": {
    "stepByStep": ["Paso 1 para adaptar la idea a otro nicho", "Paso 2...", "Paso 3..."],
    "titleFormula": "Fórmula rellenable del título (ej: Cómo [X] sin [Y])",
    "scriptFramework": "Esquema del guion (ej: Hook (0-3s) -> Problema -> Solución rápida -> CTA)"
  },
  "differentiationOpportunities": ["Oportunidad 1 para hacerlo mejor o distinto", "Oportunidad 2"]
}

Reglas:
- No inventes métricas ni números.
- Enfócate 100% en la psicología del contenido y la estructura.
- Sé sumamente directo y accionable.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 800,
    temperature: 0.6,
  });

  const raw = completion.choices[0]?.message?.content?.trim() || '{}';
  const cleanRaw = raw.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleanRaw) as VideoAnalysis;
}
