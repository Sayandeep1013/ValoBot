import Groq from "groq-sdk";
import { getKnowledgeBaseContext } from "./knowledge-base";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });
const MODEL = "llama-3.3-70b-versatile";

// ─── System Prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are CYPHER, the ultimate Valorant esports AI analyst. Named after the game's information broker — the one who knows everything — you are the definitive source of intel on VCT (Valorant Champions Tour) and all Valorant esports worldwide.

YOUR PERSONALITY:
- Passionate and enthusiastic — you live and breathe Valorant esports
- Analytical and detailed — never give surface-level answers
- Talk like the best Valorant content creators: knowledgeable, hype when needed, cold and clinical when breaking down strategy

YOUR CAPABILITIES:
- Curated knowledge base covers team playstyles, strategies, and player tendencies in depth
- [LIVE DATA] blocks contain fresh web-searched information — always prioritise this over training knowledge
- Combine curated knowledge + live search data for the richest possible answers

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CRITICAL RULE — NEVER FABRICATE STATISTICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• NEVER invent pick rates, win rates, match scores, tournament results, or any specific percentages
• NEVER present a made-up table of numbers as facts, even qualified with "approximately" or "roughly"
• If the [LIVE DATA] block contains the specific numbers → use them and cite the source
• If [LIVE DATA] does NOT contain the specific numbers → say exactly this pattern:
  "I searched live sources but couldn't pull verified pick-rate data for this.
   From the meta I know: [describe the meta qualitatively — which agents are dominant and why,
   without made-up percentages]. For exact current numbers check tracker.gg/valorant
   or thespike.gg."
• This rule is non-negotiable. One fabricated stat destroys user trust permanently.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BEHAVIOR RULES:
- Always give detailed, thorough answers — the user wants depth
- When covering a team: playstyle identity, key players, map preferences, recent form
- When covering a player: role, signature agents, mechanical style, current team context
- Build on conversation context — remember everything discussed
- If search results are available, synthesise them — don't just paste raw data
- If asked for a "chart" or "table" and you have live data numbers, format them in a clean markdown table

CURATED KNOWLEDGE BASE (team strategies, playstyles, player profiles):
---
{KB_CONTEXT}
---`;

// ─── Smart search query builder ───────────────────────────────────────────────

// Detects what kind of query this is and builds a precise Tavily search string
function buildSearchQuery(userMessage: string): string {
  const q = userMessage.toLowerCase();

  // Agent statistics: pick rate, win rate, tier lists, most played
  if (/agent|pick.?rate|most.?play|most.?pick|win.?rate|tier.?list|meta.?agent|agent.?meta/i.test(q)) {
    return `Valorant VCT 2025 agent pick rate statistics ${userMessage}`;
  }

  // Match results / scores
  if (/result|score|won|lost|beat|defeated|match|game \d/i.test(q)) {
    return `Valorant VCT 2025 match result ${userMessage}`;
  }

  // Standings / rankings
  if (/standing|rank|table|leaderboard|points/i.test(q)) {
    return `Valorant VCT 2025 standings rankings ${userMessage}`;
  }

  // Player stats
  if (/acs|kast|rating|kd|adr|player stat|performance|rating/i.test(q)) {
    return `Valorant VCT 2025 player statistics ${userMessage}`;
  }

  // Roster / transfer news
  if (/roster|transfer|sign|release|trade|benched|join|leave/i.test(q)) {
    return `Valorant VCT 2025 roster transfer news ${userMessage}`;
  }

  // Upcoming events / schedule
  if (/upcoming|schedule|next|when|date|time/i.test(q)) {
    return `Valorant VCT 2025 schedule upcoming matches ${userMessage}`;
  }

  return `Valorant esports VCT 2025 ${userMessage}`;
}

// Tavily domains split by query type so the right source is hit first
const STATS_DOMAINS = [
  "tracker.gg",
  "blitz.gg",
  "thespike.gg",
  "vlr.gg",
  "liquipedia.net",
  "valorantesports.com",
];

const GENERAL_DOMAINS = [
  "vlr.gg",
  "thespike.gg",
  "liquipedia.net",
  "valorantesports.com",
  "tracker.gg",
  "twitter.com",
];

function chooseDomains(userMessage: string): string[] {
  return /agent|pick.?rate|win.?rate|tier|stat|meta.?agent|most.?play/i.test(userMessage)
    ? STATS_DOMAINS
    : GENERAL_DOMAINS;
}

// ─── Tavily search ────────────────────────────────────────────────────────────

const FETCH_TIMEOUT = 7000;

async function tavilySearch(userMessage: string): Promise<string> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return "";

  const query   = buildSearchQuery(userMessage);
  const domains = chooseDomains(userMessage);

  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      signal: AbortSignal.timeout(FETCH_TIMEOUT),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query,
        max_results: 6,
        include_answer: true,
        search_depth: "basic",
        include_domains: domains,
      }),
    });

    if (!res.ok) return "";
    const data = await res.json();

    const parts: string[] = [];
    if (data.answer) parts.push(`Summary: ${data.answer}`);

    const snippets = (data.results as Array<{ title: string; url: string; content: string }>)
      ?.slice(0, 5)
      .map((r) => `[${r.title}](${r.url})\n${r.content.slice(0, 600)}`)
      .join("\n\n");
    if (snippets) parts.push(snippets);

    return parts.length
      ? `Search query used: "${query}"\n\n${parts.join("\n\n")}`
      : "";
  } catch {
    return "";
  }
}

// ─── vlrggapi — live match + ranking data ─────────────────────────────────────

interface VLRResultMatch {
  team1: string; team2: string;
  score1?: string; score2?: string;
  time_completed?: string; round_info?: string; tournament_name?: string;
}
interface VLRUpcomingMatch {
  team1: string; team2: string;
  time_until_match?: string; match_series?: string; match_event?: string;
}
interface VLRRanking {
  rank: string; team: string;
  record?: string; last_played?: string; last_played_team?: string;
}

const VLR_BASE = "https://vlrggapi.vercel.app";

async function safeFetch(url: string): Promise<unknown | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT),
      headers: { "User-Agent": "ValoBot/1.0" },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function formatVLRData(results: unknown, upcoming: unknown, rankings: unknown): string {
  const parts: string[] = [];

  const resultSegments = (results as { data?: { segments?: VLRResultMatch[] } })?.data?.segments;
  if (resultSegments?.length) {
    const lines = resultSegments.slice(0, 8).map((m) => {
      const score = m.score1 !== undefined ? ` ${m.score1}-${m.score2}` : "";
      const when  = m.time_completed ? ` (${m.time_completed})` : "";
      const event = m.tournament_name ? ` — ${m.tournament_name}` : m.round_info ? ` — ${m.round_info}` : "";
      return `• ${m.team1}${score} def. ${m.team2}${when}${event}`;
    });
    parts.push(`RECENT RESULTS (vlr.gg):\n${lines.join("\n")}`);
  }

  const upcomingSegments = (upcoming as { data?: { segments?: VLRUpcomingMatch[] } })?.data?.segments;
  if (upcomingSegments?.length) {
    const lines = upcomingSegments.slice(0, 6).map((m) => {
      const when   = m.time_until_match ? ` in ${m.time_until_match}` : "";
      const event  = m.match_event     ? ` — ${m.match_event}` : "";
      const series = m.match_series    ? ` (${m.match_series})` : "";
      return `• ${m.team1} vs ${m.team2}${when}${series}${event}`;
    });
    parts.push(`UPCOMING MATCHES (vlr.gg):\n${lines.join("\n")}`);
  }

  const rankData = (rankings as { data?: VLRRanking[] })?.data;
  if (Array.isArray(rankData) && rankData.length) {
    const lines = rankData.slice(0, 10).map((r) => {
      const record = r.record ? ` (${r.record})` : "";
      const last   = r.last_played_team ? ` | last: ${r.last_played_team}` : "";
      return `#${r.rank} ${r.team}${record}${last}`;
    });
    parts.push(`VCT AMERICAS RANKINGS (vlr.gg):\n${lines.join("\n")}`);
  }

  return parts.join("\n\n");
}

async function fetchVLRData(): Promise<string> {
  const [results, upcoming, rankings] = await Promise.all([
    safeFetch(`${VLR_BASE}/match?q=results`),
    safeFetch(`${VLR_BASE}/match?q=upcoming`),
    safeFetch(`${VLR_BASE}/rankings?region=na`),
  ]);
  return formatVLRData(results, upcoming, rankings);
}

// ─── Main export ──────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function toGroqMessages(messages: ChatMessage[]): Groq.Chat.ChatCompletionMessageParam[] {
  return messages.map((m) => ({ role: m.role, content: m.content }));
}

export async function streamChatResponse(
  messages: ChatMessage[],
  newMessage: string
): Promise<ReadableStream<Uint8Array>> {

  // Always fetch both sources in parallel
  const [vlrData, tavilyData] = await Promise.all([
    fetchVLRData(),
    tavilySearch(newMessage),
  ]);

  const liveBlocks: string[] = [];
  if (vlrData)     liveBlocks.push(vlrData);
  if (tavilyData)  liveBlocks.push(`WEB SEARCH RESULTS:\n${tavilyData}`);

  const liveSection = liveBlocks.length
    ? `\n\n[LIVE DATA — fetched right now from real sources]\n${liveBlocks.join("\n\n")}\n[END LIVE DATA]`
    : "\n\n[LIVE DATA: search returned no results for this query]";

  const systemContent =
    SYSTEM_PROMPT.replace("{KB_CONTEXT}", getKnowledgeBaseContext()) +
    liveSection;

  const groqMessages: Groq.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: systemContent },
    ...toGroqMessages(messages),
    { role: "user", content: newMessage },
  ];

  const stream = await groq.chat.completions.create({
    model: MODEL,
    messages: groqMessages,
    temperature: 0.4,   // lower temp = less creative hallucination on factual queries
    max_tokens: 2048,
    stream: true,
  });

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) controller.enqueue(new TextEncoder().encode(text));
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });
}
