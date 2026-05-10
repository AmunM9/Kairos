export type Network = "tiktok" | "youtube" | "instagram";

export interface ViralCard {
  id: string;
  network: Network;
  thumbnail: string; // gradient seed
  creator: string;
  handle: string;
  title: string;
  views: string;
  engagement: string;
  format: string;
  category: string;
  duration?: string;
}

const grad = (a: string, b: string) =>
  `linear-gradient(135deg, ${a}, ${b})`;

export const MOCK_RESULTS: Record<Network, ViralCard[]> = {
  tiktok: [
    {
      id: "tt1",
      network: "tiktok",
      thumbnail: grad("#FF0050", "#FF6B9D"),
      creator: "Alex Hormozi",
      handle: "@hormozi",
      title: "El hook que me consiguió 47M de views",
      views: "12.4M",
      engagement: "8.9%",
      format: "Founder hook",
      category: "GTM",
      duration: "0:47",
    },
    {
      id: "tt2",
      network: "tiktok",
      thumbnail: grad("#7928CA", "#FF0080"),
      creator: "Marina AI",
      handle: "@marina.ai",
      title: "Cómo construí un SaaS de IA en 30 días",
      views: "3.2M",
      engagement: "11.2%",
      format: "Build in public",
      category: "AI Startup",
      duration: "1:12",
    },
    {
      id: "tt3",
      network: "tiktok",
      thumbnail: grad("#0070F3", "#00DFD8"),
      creator: "Greg Isenberg",
      handle: "@gregisenberg",
      title: "5 ideas de startup que valen $10M",
      views: "8.7M",
      engagement: "6.4%",
      format: "Listicle",
      category: "Storytelling",
      duration: "0:58",
    },
    {
      id: "tt4",
      network: "tiktok",
      thumbnail: grad("#F5A623", "#FF6B9D"),
      creator: "Sara Founder",
      handle: "@sara.builds",
      title: "Mi día como founder de un AI tool",
      views: "1.9M",
      engagement: "13.8%",
      format: "Day in the life",
      category: "Founder content",
      duration: "1:34",
    },
    {
      id: "tt5",
      network: "tiktok",
      thumbnail: grad("#00DFD8", "#7928CA"),
      creator: "Dan Koe",
      handle: "@thedankoe",
      title: "El framework de contenido viral",
      views: "5.1M",
      engagement: "9.7%",
      format: "Educational",
      category: "Strategy",
      duration: "0:52",
    },
  ],
  youtube: [
    {
      id: "yt1",
      network: "youtube",
      thumbnail: grad("#FF0000", "#7928CA"),
      creator: "Y Combinator",
      handle: "@ycombinator",
      title: "How a $0 AI startup hit $10M ARR",
      views: "2.8M",
      engagement: "12.1%",
      format: "Documentary",
      category: "Case study",
      duration: "18:42",
    },
    {
      id: "yt2",
      network: "youtube",
      thumbnail: grad("#0070F3", "#FF0080"),
      creator: "Lenny Rachitsky",
      handle: "@lennyrachitsky",
      title: "The growth playbook nobody talks about",
      views: "1.4M",
      engagement: "9.3%",
      format: "Long-form",
      category: "Growth",
      duration: "42:11",
    },
    {
      id: "yt3",
      network: "youtube",
      thumbnail: grad("#F59E0B", "#EF4444"),
      creator: "Ali Abdaal",
      handle: "@aliabdaal",
      title: "I built an AI app in 7 days",
      views: "3.7M",
      engagement: "10.8%",
      format: "Build vlog",
      category: "AI Business",
      duration: "22:05",
    },
    {
      id: "yt4",
      network: "youtube",
      thumbnail: grad("#10B981", "#0070F3"),
      creator: "Marques Brownlee",
      handle: "@mkbhd",
      title: "Why this AI tool changes everything",
      views: "6.2M",
      engagement: "7.4%",
      format: "Explainer",
      category: "Tech",
      duration: "14:33",
    },
    {
      id: "yt5",
      network: "youtube",
      thumbnail: grad("#7928CA", "#00DFD8"),
      creator: "Pat Walls",
      handle: "@patwalls",
      title: "From idea to $1M solo founder",
      views: "892K",
      engagement: "14.2%",
      format: "Story",
      category: "Founder journey",
      duration: "9:48",
    },
  ],
  instagram: [
    {
      id: "li1",
      network: "instagram",
      thumbnail: grad("#0A66C2", "#0070F3"),
      creator: "Justin Welsh",
      handle: "@justinwelsh",
      title: "Cómo construí $5M solo, sin equipo",
      views: "1.2M",
      engagement: "16.4%",
      format: "Founder post",
      category: "Solopreneur",
    },
    {
      id: "li2",
      network: "instagram",
      thumbnail: grad("#0070F3", "#7928CA"),
      creator: "Sahil Bloom",
      handle: "@sahilbloom",
      title: "Las 7 lecciones que cambiaron mi startup",
      views: "847K",
      engagement: "13.2%",
      format: "Carousel",
      category: "Thought leadership",
    },
    {
      id: "li3",
      network: "instagram",
      thumbnail: grad("#10B981", "#0A66C2"),
      creator: "April Dunford",
      handle: "@aprildunford",
      title: "Por qué el positioning vende más que el producto",
      views: "412K",
      engagement: "18.7%",
      format: "Long-form post",
      category: "Positioning",
    },
    {
      id: "li4",
      network: "instagram",
      thumbnail: grad("#F59E0B", "#0070F3"),
      creator: "Jasmin Alić",
      handle: "@jasminalic",
      title: "Hooks que generaron 10M de impressions",
      views: "2.1M",
      engagement: "11.9%",
      format: "Carousel",
      category: "Content strategy",
    },
    {
      id: "li5",
      network: "instagram",
      thumbnail: grad("#EF4444", "#7928CA"),
      creator: "Dickie Bush",
      handle: "@dickiebush",
      title: "El sistema de contenido que escala startups",
      views: "638K",
      engagement: "14.8%",
      format: "Insight",
      category: "Startup insights",
    },
  ],
};

export const NETWORK_META: Record<
  Network,
  { name: string; subtitle: string; accent: string }
> = {
  tiktok: {
    name: "TikTok",
    subtitle: "Top viral hooks",
    accent: "#FF0050",
  },
  youtube: {
    name: "YouTube",
    subtitle: "Best storytelling formats",
    accent: "#FF0000",
  },
  instagram: {
    name: "Instagram",
    subtitle: "Founder-led content",
    accent: "#E1306C",
  },
};

export function findCardById(id: string): ViralCard | undefined {
  for (const list of Object.values(MOCK_RESULTS)) {
    const found = list.find((c) => c.id === id);
    if (found) return found;
  }
  return undefined;
}