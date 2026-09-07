export interface ResourceArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: "Clinical Insights" | "The VelocityFit Formula" | "Habit Engineering";
  readTimeMinutes: number;
  publishedDate: string;
  author: string;
  paragraphs: string[];
}

export const resourcesData: ResourceArticle[] = [
  {
    id: "res-water-therapy",
    slug: "cellular-hydration-fat-loss",
    title: "Cellular Hydration: The Missing Key to Sustainable Fat Oxidation",
    excerpt:
      "Why dehydration masquerades as chronic hunger and how Dr. Lubna Fatima's strategic water protocols unlock metabolic speed.",
    category: "The VelocityFit Formula",
    readTimeMinutes: 5,
    publishedDate: "2026-08-15",
    author: "Dr. Lubna Fatima",
    paragraphs: [
      "In our clinical practice at Velocity Fit, the single most common metabolic inhibitor we discover during the V6 Audit™ is chronic cellular dehydration.",
      "Most people believe drinking water simply flushes toxins. In reality, fat oxidation (lipolysis) is a water-dependent biochemical reaction. If cellular hydration is compromised, the liver and kidneys operate at reduced efficiency, slowing metabolic breakdown and signaling artificial hunger pangs.",
      "By strategically structuring fluid timing—prioritizing room-temperature morning hydration before meals and tapering in the evening—clients frequently report an immediate reduction in brain fog, reduced bloating, and effortless suppression of sugar cravings.",
    ],
  },
  {
    id: "res-v6-audit",
    slug: "understanding-the-v6-audit",
    title: "Beyond Calorie Counting: Understanding the V6 Audit™ Framework",
    excerpt:
      "A clinical look at why calories in versus calories out fails long-term when endocrine and digestive systems are ignored.",
    category: "Clinical Insights",
    readTimeMinutes: 6,
    publishedDate: "2026-07-28",
    author: "Dr. Lubna Fatima",
    paragraphs: [
      "The conventional fitness industry treats the human body like a simple combustion engine: eat fewer calories, move more, and you will lose weight. While thermodynamic laws remain true, human biology is primarily an endocrine, hormonal system.",
      "When calorie restriction is imposed upon an exhausted, sleep-deprived body with sluggish gut motility and high cortisol, the body defends its fat stores. It down-regulates thyroid conversion, reduces spontaneous movement, and surges appetite hormones.",
      "The V6 Audit™ was created to look deeper: we examine sleep architecture, bowel regularity, hormonal rhythm, and emotional eating cues to repair the metabolic engine before asking it to run.",
    ],
  },
  {
    id: "res-night-eating",
    slug: "curbing-night-eating-syndrome",
    title: "Overcoming Evening Cravings: A Physiological & Psychological Guide",
    excerpt:
      "Why willpower fails at 9 PM and how proper daytime meal composition prevents late-night binge episodes.",
    category: "Habit Engineering",
    readTimeMinutes: 4,
    publishedDate: "2026-06-12",
    author: "Dr. Lubna Fatima",
    paragraphs: [
      "Almost every client who comes to Velocity Fit expresses frustration over late-night snacking. 'I am disciplined all morning and afternoon, but after dinner I lose control,' is a familiar refrain.",
      "Willpower is not the culprit. Evening cravings are nearly always a biochemical debt incurred during the morning and afternoon. Undereating protein, skipping balanced meals, or running on excessive caffeine results in a sharp evening glucose and dopamine crash.",
      "When we re-engineer daytime meal composition to include adequate healthy fats and fiber, evening cravings vanish without heroic willpower.",
    ],
  },
];

export function getResourceBySlug(slug: string): ResourceArticle | undefined {
  return resourcesData.find((r) => r.slug === slug);
}
