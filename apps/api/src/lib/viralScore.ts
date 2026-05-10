interface ViralInputs {
  views: number;
  likes: number;
  comments: number;
  shares?: number;       // TikTok lo da
  publishedAt: Date;
  followers?: number;    // del creador, si está disponible
}

export function calculateViralScore(v: ViralInputs): number {
  const ageHours = Math.max(1, (Date.now() - v.publishedAt.getTime()) / 3_600_000);

  // 1. Velocidad: views por hora desde publicación
  const viewsPerHour = v.views / ageHours;

  // 2. Engagement rate: (likes + comments + shares) / views
  const engagement = (v.likes + v.comments + (v.shares ?? 0)) / Math.max(1, v.views);

  // 3. Score normalizado por dos componentes:
  //    - velocidad (escala log porque views/h va de 10 a 100K+)
  //    - engagement (típicamente 0.01-0.20)
  const speedScore = Math.min(100, (Math.log10(viewsPerHour + 1) / 5) * 100);   // 0-100
  const engagementScore = Math.min(100, engagement * 500);                       // 0-100 (10% engagement = 50 pts)

  // Mezcla 60/40: la velocidad pesa más en "lo que está rompiendo ahora"
  return Math.round(speedScore * 0.6 + engagementScore * 0.4);
}

export function viralTier(score: number): 'low' | 'mid' | 'high' | 'fire' {
  if (score >= 80) return 'fire';     // 🔥 reventando
  if (score >= 60) return 'high';     // muy viral
  if (score >= 35) return 'mid';      // funcionando bien
  return 'low';
}
