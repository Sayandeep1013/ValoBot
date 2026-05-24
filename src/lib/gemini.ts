import Groq from "groq-sdk";
import { getKnowledgeBaseContext } from "./knowledge-base";

const MODEL = "llama-3.3-70b-versatile";
const FALLBACK_MODEL = "llama-3.1-8b-instant";
const FETCH_TIMEOUT = 9000;
const MAX_LIVE_SECTION_CHARS = 12000;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

type TavilyResult = {
  title?: string;
  url?: string;
  content?: string;
  score?: number;
  published_date?: string;
};

type VLRResultMatch = {
  team1?: string;
  team2?: string;
  score1?: string;
  score2?: string;
  time_completed?: string;
  round_info?: string;
  tournament_name?: string;
};

type VLRUpcomingMatch = {
  team1?: string;
  team2?: string;
  time_until_match?: string;
  match_series?: string;
  match_event?: string;
};

type VLRRanking = {
  rank?: string;
  team?: string;
  record?: string;
  last_played?: string;
  last_played_team?: string;
};

type Source = {
  title: string;
  url: string;
  snippet: string;
  publishedDate?: string;
};

type QualifiedTeam = {
  name: string;
  note: string;
};

type QualifierResult = {
  region: string;
  series: string;
  team1: string;
  team2: string;
  score1: string;
  score2: string;
  ageText: string;
  ageMinutes: number;
  url: string;
  sourceIndex: number;
};

const VLR_BASE = "https://vlrggapi.vercel.app";
const VLR_EWC_2026_URL = "https://www.vlr.gg/event/2952/esports-world-cup-2026";
const EWC_QUALIFIER_EVENTS = [
  { region: "Americas", url: "https://www.vlr.gg/event/2953/esports-world-cup-2026-americas-qualifier" },
  { region: "EMEA", url: "https://www.vlr.gg/event/2954/esports-world-cup-2026-emea-qualifier" },
  { region: "Pacific", url: "https://www.vlr.gg/event/2955/esports-world-cup-2026-pacific-qualifier" },
  { region: "China", url: "https://www.vlr.gg/event/2956/esports-world-cup-2026-china-qualifier" },
];

const STATS_DOMAINS = [
  "vlr.gg",
  "thespike.gg",
  "rib.gg",
  "tracker.gg",
  "valorantesports.com",
  "liquipedia.net",
];

const GENERAL_DOMAINS = [
  "vlr.gg",
  "thespike.gg",
  "valorantesports.com",
  "liquipedia.net",
  "rib.gg",
  "tracker.gg",
];

function todayStamp() {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date());
}

function buildSearchQuery(userMessage: string): string {
  const q = userMessage.toLowerCase();

  if (/(\bewc\b|esports world cup)/i.test(q)) {
    if (/match|matches|score|scores|result|results|latest|won|lost|beat|defeated|qualifier/i.test(q)) {
      return `site:vlr.gg/event Esports World Cup 2026 Valorant qualifier latest results scores ${userMessage}`;
    }
    return `site:vlr.gg/event/2952 Esports World Cup 2026 Valorant participating qualified teams ${userMessage}`;
  }

  if (/agent|pick.?rate|most.?play|most.?pick|win.?rate|tier.?list|meta|composition|comp/i.test(q)) {
    return `latest Valorant esports VCT agent meta pick rates ${userMessage}`;
  }

  if (/result|score|won|lost|beat|defeated|match|today|yesterday|schedule|upcoming|when/i.test(q)) {
    return `latest Valorant esports VCT matches results schedule ${userMessage}`;
  }

  if (/standing|rank|ranking|leaderboard|points|best teams|top teams/i.test(q)) {
    return `latest Valorant esports VCT team rankings standings ${userMessage}`;
  }

  if (/acs|kast|rating|kd|adr|player stat|performance|duelist|igl/i.test(q)) {
    return `latest Valorant esports VCT player statistics ${userMessage}`;
  }

  if (/roster|transfer|signed|released|benched|joined|left/i.test(q)) {
    return `latest Valorant esports roster transfer news ${userMessage}`;
  }

  return `latest Valorant esports VCT ${userMessage}`;
}

function chooseDomains(userMessage: string): string[] {
  return /agent|pick.?rate|win.?rate|tier|stat|meta|acs|kast|rating|kd|adr/i.test(userMessage)
    ? STATS_DOMAINS
    : GENERAL_DOMAINS;
}

function truncate(text: string | undefined, max = 700) {
  const cleaned = (text ?? "").replace(/\s+/g, " ").trim();
  return cleaned.length > max ? `${cleaned.slice(0, max - 1)}...` : cleaned;
}

async function safeJsonFetch(url: string): Promise<unknown | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT),
      headers: { "User-Agent": "ValoBot/1.0" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function safeTextFetch(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT),
      headers: { "User-Agent": "ValoBot/1.0" },
      cache: "no-store",
    });
    return res.ok ? await res.text() : "";
  } catch {
    return "";
  }
}

function decodeHtml(text: string) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&ndash;/g, "-")
    .replace(/&mdash;/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function stripTags(text: string) {
  return decodeHtml(text.replace(/<[^>]*>/g, " "));
}

function parseAgeMinutes(ageText: string) {
  const text = ageText.toLowerCase();
  const days = Number(text.match(/(\d+)\s*d/)?.[1] ?? 0);
  const hours = Number(text.match(/(\d+)\s*h/)?.[1] ?? 0);
  const minutes = Number(text.match(/(\d+)\s*m/)?.[1] ?? 0);
  const total = days * 1440 + hours * 60 + minutes;
  return total > 0 ? total : Number.MAX_SAFE_INTEGER;
}

function parseEwcQualifierResults(html: string, region: string, sourceIndex: number): QualifierResult[] {
  const latestIndex = html.indexOf("Latest Results");
  if (latestIndex === -1) return [];

  const section = html.slice(latestIndex, html.indexOf("Contact", latestIndex) === -1 ? undefined : html.indexOf("Contact", latestIndex));
  const anchors = [...section.matchAll(/<a class="wf-module-item[^"]*" href="([^"]+)">([\s\S]*?)<\/a>/g)];

  return anchors
    .map((match) => {
      const href = match[1];
      const block = match[2];
      const series = stripTags(block.match(/event-sidebar-matches-series[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? "");
      const names = [...block.matchAll(/<span style="margin-left: 3px;">\s*([^<\r\n]+)/g)].map((m) => decodeHtml(m[1]));
      const scores = [...block.matchAll(/<div class="score[^"]*">\s*([^<\r\n]+)/g)].map((m) => decodeHtml(m[1]));
      const ageText = stripTags(block.match(/<div class="eta[^"]*"[^>]*>\s*([^<\r\n]+)/)?.[1] ?? "");

      if (names.length < 2 || scores.length < 2 || scores[0] === "-" || scores[1] === "-") return null;

      return {
        region,
        series,
        team1: names[0],
        team2: names[1],
        score1: scores[0],
        score2: scores[1],
        ageText,
        ageMinutes: parseAgeMinutes(ageText),
        url: `https://www.vlr.gg${href}`,
        sourceIndex,
      } satisfies QualifierResult;
    })
    .filter((result): result is QualifierResult => Boolean(result));
}

async function fetchEwcQualifierResults() {
  const pages = await Promise.all(
    EWC_QUALIFIER_EVENTS.map(async (event, index) => ({
      ...event,
      html: await safeTextFetch(event.url),
      sourceIndex: index + 1,
    }))
  );

  const results = pages
    .flatMap((page) => parseEwcQualifierResults(page.html, page.region, page.sourceIndex))
    .sort((a, b) => a.ageMinutes - b.ageMinutes)
    .slice(0, 12);

  const lines = results.map((match, i) =>
    `${i + 1}. [${match.region}] ${match.series}: ${match.team1} ${match.score1}-${match.score2} ${match.team2}${match.ageText ? ` (${match.ageText} ago)` : ""} [${match.sourceIndex}]`
  );

  return {
    results,
    text: results.length
      ? `Latest VALORANT Esports World Cup 2026 qualifier results from VLR event pages:\n${lines.join("\n")}`
      : "",
    sources: EWC_QUALIFIER_EVENTS.map((event) => ({
      title: `VLR EWC 2026 ${event.region} Qualifier`,
      url: event.url,
      snippet: `Qualifier page used to extract latest ${event.region} match results and scores.`,
    } satisfies Source)),
  };
}

async function fetchEwcQualifiedTeams() {
  const html = await safeTextFetch(VLR_EWC_2026_URL);
  const teams: QualifiedTeam[] = [];

  if (html) {
    const cards = html.split('<div class="wf-card event-team">').slice(1);
    for (const raw of cards) {
      const name = raw.match(/event-team-name"[^>]*>\s*(?:<i[^>]*>)?\s*([^<\r\n]+)/)?.[1]?.trim();
      const noteHtml = raw.match(/event-team-note[\s\S]*?<a[^>]*>\s*([^<]+)/)?.[1];
      const note = stripTags(noteHtml ?? "");
      if (name && name !== "TBD") {
        teams.push({ name: decodeHtml(name), note });
      }
    }
  }

  const lines = teams.map((team, i) => `${i + 1}. ${team.name} - ${team.note}`);
  return {
    teams,
    text: teams.length
      ? `VALORANT at Esports World Cup 2026 qualified/named teams on VLR main-event page:\n${lines.join("\n")}\nNamed teams: ${teams.length}. Total event slots: 16. All unfilled slots are still listed as TBD on the VLR main-event page.`
      : "",
    sources: teams.length
      ? [{
          title: "VLR Esports World Cup 2026 main event",
          url: VLR_EWC_2026_URL,
          snippet: `${teams.length} named teams: ${teams.map((team) => team.name).join(", ")}`,
        } satisfies Source]
      : [],
  };
}

function isEwcQualificationQuestion(userMessage: string, messages: ChatMessage[]) {
  const current = userMessage.toLowerCase();
  const previousUserContext = messages
    .slice(-4)
    .filter((m) => m.role === "user")
    .map((m) => m.content.toLowerCase())
    .join(" ");
  const hasDirectEwcContext = /\bewc\b|esports world cup/.test(current);
  const hasFollowUpEwcContext =
    /\bewc\b|esports world cup/.test(previousUserContext) &&
    /^(list|name|names|which|who|how many|what teams|team names)\b/.test(current.trim());
  const hasEwcContext = hasDirectEwcContext || hasFollowUpEwcContext;
  const asksMatchScores = /match|matches|score|scores|result|results|latest|won|lost|beat|defeated/.test(current);
  const asksQualifiedTeams =
    /(qualified|qualification|confirmed|made it|participating)/.test(current) ||
    /team names|list.*teams|how many.*teams|teams.*so far/.test(current);
  return hasEwcContext && asksQualifiedTeams && !asksMatchScores;
}

function ewcQualifiedTeamsAnswer(teams: QualifiedTeam[]) {
  if (!teams.length) {
    return "I tried to fetch the VLR Esports World Cup 2026 main-event page, but could not extract the qualified team list right now. I will not guess the field.";
  }

  const lines = teams.map((team, i) => `${i + 1}. ${team.name} - ${team.note}`);
  return `As of ${todayStamp()}, VLR's VALORANT Esports World Cup 2026 main-event page has ${teams.length} named qualified teams out of 16 total slots. The remaining slots are still listed as TBD.\n\n${lines.join("\n")}\n\nSources:\n[1] VLR Esports World Cup 2026 main event - ${VLR_EWC_2026_URL}`;
}

function ewcQualifierResultsAnswer(results: QualifierResult[]) {
  if (!results.length) {
    return "I fetched the EWC qualifier event pages, but could not extract completed qualifier results right now. I will not guess scores.";
  }

  const lines = results.slice(0, 6).map((match) =>
    `- ${match.team1} ${match.score1}-${match.score2} ${match.team2} (${match.region}, ${match.series}) [${match.sourceIndex}]`
  );

  return `Latest EWC 2026 VALORANT qualifier results I could verify:\n${lines.join("\n")}\n\nSources:\n${EWC_QUALIFIER_EVENTS.map((event, i) => `[${i + 1}] VLR EWC 2026 ${event.region} Qualifier - ${event.url}`).join("\n")}`;
}

function formatVLRData(results: unknown, upcoming: unknown, rankings: unknown) {
  const parts: string[] = [];
  const sources: Source[] = [];

  const resultSegments = (results as { data?: { segments?: VLRResultMatch[] } })?.data?.segments;
  if (resultSegments?.length) {
    const lines = resultSegments.slice(0, 8).map((m) => {
      const score = m.score1 !== undefined ? ` ${m.score1}-${m.score2}` : "";
      const when = m.time_completed ? ` (${m.time_completed})` : "";
      const event = m.tournament_name ? ` - ${m.tournament_name}` : m.round_info ? ` - ${m.round_info}` : "";
      return `- ${m.team1}${score} vs ${m.team2}${when}${event}`;
    });
    parts.push(`Recent VLR results:\n${lines.join("\n")}`);
    sources.push({
      title: "VLR recent results",
      url: "https://www.vlr.gg/matches/results",
      snippet: lines.join(" "),
    });
  }

  const upcomingSegments = (upcoming as { data?: { segments?: VLRUpcomingMatch[] } })?.data?.segments;
  if (upcomingSegments?.length) {
    const lines = upcomingSegments.slice(0, 8).map((m) => {
      const when = m.time_until_match ? ` in ${m.time_until_match}` : "";
      const event = m.match_event ? ` - ${m.match_event}` : "";
      const series = m.match_series ? ` (${m.match_series})` : "";
      return `- ${m.team1} vs ${m.team2}${when}${series}${event}`;
    });
    parts.push(`Upcoming VLR matches:\n${lines.join("\n")}`);
    sources.push({
      title: "VLR upcoming matches",
      url: "https://www.vlr.gg/matches",
      snippet: lines.join(" "),
    });
  }

  const rankData = (rankings as { data?: VLRRanking[] })?.data;
  if (Array.isArray(rankData) && rankData.length) {
    const lines = rankData.slice(0, 12).map((r) => {
      const record = r.record ? ` (${r.record})` : "";
      const last = r.last_played_team ? ` | last: ${r.last_played_team}` : "";
      return `- #${r.rank} ${r.team}${record}${last}`;
    });
    parts.push(`VLR rankings snapshot:\n${lines.join("\n")}`);
    sources.push({
      title: "VLR rankings",
      url: "https://www.vlr.gg/rankings",
      snippet: lines.join(" "),
    });
  }

  return { text: parts.join("\n\n"), sources };
}

async function fetchVLRData() {
  const [results, upcoming, rankings] = await Promise.all([
    safeJsonFetch(`${VLR_BASE}/match?q=results`),
    safeJsonFetch(`${VLR_BASE}/match?q=upcoming`),
    safeJsonFetch(`${VLR_BASE}/rankings?region=all`),
  ]);

  return formatVLRData(results, upcoming, rankings);
}

async function tavilySearch(userMessage: string) {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return { text: "", sources: [] as Source[] };

  const query = buildSearchQuery(userMessage);

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
        max_results: 5,
        include_answer: true,
        search_depth: "advanced",
        include_domains: chooseDomains(userMessage),
      }),
      cache: "no-store",
    });

    if (!res.ok) return { text: "", sources: [] as Source[] };
    const data = await res.json();
    const results = ((data.results ?? []) as TavilyResult[])
      .filter((r) => r.title && r.url && r.content)
      .slice(0, 7);

    const sources = results.map((r) => ({
      title: r.title!,
      url: r.url!,
      snippet: truncate(r.content, 750),
      publishedDate: r.published_date,
    }));

    const sourceText = sources
      .map((s, i) => {
        const date = s.publishedDate ? ` | published: ${s.publishedDate}` : "";
        return `[${i + 1}] ${s.title}${date}\nURL: ${s.url}\nSnippet: ${s.snippet}`;
      })
      .join("\n\n");

    const answer = data.answer ? `Search summary: ${truncate(data.answer, 900)}\n\n` : "";
    return {
      text: `Search query used: "${query}"\n\n${answer}${sourceText}`,
      sources,
    };
  } catch {
    return { text: "", sources: [] as Source[] };
  }
}

async function jinaSearch(userMessage: string) {
  const apiKey = process.env.JINA_API_KEY;
  if (!apiKey) return { text: "", sources: [] as Source[] };

  const query = buildSearchQuery(userMessage);

  try {
    const res = await fetch(`https://s.jina.ai/${encodeURIComponent(query)}`, {
      signal: AbortSignal.timeout(25000),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "text/plain",
      },
      cache: "no-store",
    });

    if (!res.ok) return { text: "", sources: [] as Source[] };
    const text = await res.text();
    const entries = [...text.matchAll(/\[(\d+)\]\s+Title:\s*([^\n]+)\n\[\1\]\s+URL Source:\s*([^\n]+)\n(?:\[\1\]\s+Description:\s*([\s\S]*?)(?=\n\[\d+\]\s+Title:|$))?/g)];
    const sources = entries.slice(0, 6).map((entry) => ({
      title: decodeHtml(entry[2]),
      url: entry[3].trim(),
      snippet: truncate(entry[4] ?? "", 700),
    }));

    return {
      text: `Jina search query used: "${query}"\n\n${truncate(text, 2500)}`,
      sources,
    };
  } catch {
    return { text: "", sources: [] as Source[] };
  }
}

function toGroqMessages(messages: ChatMessage[]): Groq.Chat.ChatCompletionMessageParam[] {
  return messages
    .filter((m) => m.content.trim())
    .slice(-8)
    .map((m) => ({ role: m.role, content: m.content }));
}

function citationList(sources: Source[]) {
  const seen = new Set<string>();
  return sources
    .filter((s) => {
      if (seen.has(s.url)) return false;
      seen.add(s.url);
      return true;
    })
    .slice(0, 10)
    .map((s, i) => `[${i + 1}] ${s.title} - ${s.url}`)
    .join("\n");
}

function makeSystemPrompt(liveSources: Source[]) {
  return `You are CYPHER, a Valorant esports intelligence analyst.

Current timestamp: ${todayStamp()}.

Core rules:
- Always prioritize LIVE DATA over the curated knowledge base.
- Every answer should assume the user wants current Valorant esports context unless they ask for history.
- Use the live sources supplied in this request. Cite them inline as [1], [2], etc. when stating recent results, schedules, rankings, roster moves, patch/meta claims, or statistics.
- If the VLR snapshot contains team names and a score, treat that score as verified by the VLR snapshot and cite it. Do not immediately say the same score could not be verified.
- For VALORANT Esports World Cup 2026 qualification questions, the EWC 2026 main-event snapshot is the authority. Count only named teams in that snapshot as qualified; do not count TBD slots, qualifier participants, or generic match-list teams as qualified.
- For VALORANT Esports World Cup 2026 qualifier match/result/score questions, use the EWC qualifier results snapshot. Do not answer with the qualified-team list unless the user specifically asks which teams have qualified. Cite the source number at the end of each result line, like [2].
- Do not write "cited from the snapshot" as a citation. Use only numbered source markers from the citation map.
- If the user only asks for matches, results, or scores, answer with the latest result lines and a Sources section. Do not add strategy/meta analysis unless they ask for analysis.
- Never invent exact scores, dates, percentages, pick rates, ratings, rosters, or standings. If live sources do not verify a number, say that you could not verify the exact number and then give qualitative analysis.
- Do not add player names, roster context, causes, or "why they won" explanations to a recent result unless that detail appears in the live data for this turn. If you use the curated knowledge base for background, label it as background, not a verified current fact.
- If live sources conflict, name the conflict briefly and lean on official or specialist sources in this order: valorantesports.com, vlr.gg, thespike.gg, Liquipedia, tracker/rib/blitz-style stat sites.
- Keep the tone sharp and analytical: explain what the fact means strategically, not just what happened.
- Avoid filler. Start with the direct answer, then add evidence, implications, and caveats.
- If the question is broad, structure the answer with short headings.
- When live sources are used, end with a compact "Sources" section that lists the cited source numbers, titles, and URLs.

Citation map for this turn:
${citationList(liveSources) || "No live source URLs were retrieved. Be explicit about this limitation."}

Curated knowledge base, for background only:
${truncate(getKnowledgeBaseContext(), 3500)}`;
}

function makeCompactSystemPrompt(liveSources: Source[]) {
  return `You are CYPHER, a Valorant esports analyst. Use live data first and cite source numbers from the citation map. Do not invent exact facts, scores, dates, stats, rosters, or standings. If data is missing, say so briefly.

Citation map:
${citationList(liveSources) || "No live source URLs were retrieved."}`;
}

function fallbackStream(message: string): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(message));
      controller.close();
    },
  });
}

export async function streamChatResponse(
  messages: ChatMessage[],
  newMessage: string
): Promise<ReadableStream<Uint8Array>> {
  const shouldAnswerEwcQualified = isEwcQualificationQuestion(newMessage, messages);
  const isEwcQuestion = /(\bewc\b|esports world cup)/i.test(newMessage) || shouldAnswerEwcQualified;
  const isEwcScoreQuestion = isEwcQuestion && /match|matches|score|scores|result|results|latest|won|lost|beat|defeated|qualifier/.test(newMessage.toLowerCase());

  const [vlrData, tavilyData, jinaData, ewcData, ewcQualifierData] = await Promise.all([
    isEwcQuestion
      ? Promise.resolve({ text: "", sources: [] as Source[] })
      : fetchVLRData(),
    tavilySearch(newMessage),
    jinaSearch(newMessage),
    isEwcQuestion
      ? fetchEwcQualifiedTeams()
      : Promise.resolve({ text: "", teams: [] as QualifiedTeam[], sources: [] as Source[] }),
    isEwcScoreQuestion
      ? fetchEwcQualifierResults()
      : Promise.resolve({ text: "", results: [] as QualifierResult[], sources: [] as Source[] }),
  ]);

  const liveBlocks = [
    ewcQualifierData.text ? `EWC 2026 QUALIFIER RESULTS SNAPSHOT\n${ewcQualifierData.text}` : "",
    ewcData.text ? `EWC 2026 MAIN EVENT SNAPSHOT\n${ewcData.text}` : "",
    vlrData.text ? `VLR SNAPSHOT\n${vlrData.text}` : "",
    jinaData.text ? `JINA WEB SEARCH RESULTS\n${jinaData.text}` : "",
    tavilyData.text ? `WEB SEARCH RESULTS\n${tavilyData.text}` : "",
  ].filter(Boolean);

  const liveSources = [
    ...ewcQualifierData.sources,
    ...ewcData.sources,
    ...vlrData.sources,
    ...jinaData.sources,
    ...tavilyData.sources,
  ];
  const liveSection = liveBlocks.length
    ? truncate(liveBlocks.join("\n\n---\n\n"), isEwcQuestion ? MAX_LIVE_SECTION_CHARS : 7000)
    : "No live web/VLR data was retrieved for this request.";

  const groqMessages: Groq.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: makeSystemPrompt(liveSources) },
    ...toGroqMessages(messages),
    {
      role: "user",
      content: `User question: ${newMessage}\n\nLive data fetched for this exact question:\n${liveSection}\n\nAnswer using the live data first. Cite sources from the citation map when using live facts. If exact current data is missing, say so clearly and then give the best qualitative analysis from the verified context.`,
    },
  ];

  const createStream = (messagesForModel: Groq.Chat.ChatCompletionMessageParam[], model = MODEL, maxTokens = 1000) =>
    new Groq({ apiKey: process.env.GROQ_API_KEY }).chat.completions.create({
      model,
      messages: messagesForModel,
      temperature: 0.25,
      max_tokens: maxTokens,
      stream: true,
    });

  let stream: Awaited<ReturnType<typeof createStream>>;
  try {
    stream = await createStream(groqMessages);
  } catch (err) {
    console.error("[chat/groq] primary request failed", err);
    const compactMessages: Groq.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: makeCompactSystemPrompt(liveSources) },
      {
        role: "user",
        content: `User question: ${newMessage}\n\nCompact live data:\n${truncate(liveSection, 3500)}\n\nAnswer concisely with citations. Do not invent missing facts.`,
      },
    ];
    try {
      stream = await createStream(compactMessages, FALLBACK_MODEL, 700);
    } catch (retryErr) {
      console.error("[chat/groq] compact retry failed", retryErr);
      if (shouldAnswerEwcQualified && ewcData.teams.length) {
        return fallbackStream(ewcQualifiedTeamsAnswer(ewcData.teams));
      }
      if (isEwcScoreQuestion && ewcQualifierData.results.length) {
        return fallbackStream(ewcQualifierResultsAnswer(ewcQualifierData.results));
      }
      return fallbackStream(
        "I fetched live context, but the analysis engine did not respond. Try again in a moment. I will not fabricate an answer without the model pass."
      );
    }
  }

  if (!stream) {
    if (shouldAnswerEwcQualified && ewcData.teams.length) {
      return fallbackStream(ewcQualifiedTeamsAnswer(ewcData.teams));
    }
    if (isEwcScoreQuestion && ewcQualifierData.results.length) {
      return fallbackStream(ewcQualifierResultsAnswer(ewcQualifierData.results));
    }
  }

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
