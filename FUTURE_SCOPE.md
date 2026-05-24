# ValoBot Future Scope

## Near-term improvements

- Add a small cache layer for live esports lookups so repeated questions do not burn Groq, Tavily, and Jina quota.
- Add source-specific adapters for VLR, Liquipedia, THESPIKE, and official Valorant Esports pages instead of relying mostly on generic search snippets.
- Add intent tests for common prompt classes: qualified teams, latest matches, player profiles, agent meta, roster moves, and schedule questions.
- Add user-facing source cards in chat responses so citations are easier to inspect.
- Add graceful rate-limit messaging that names which provider is limited and when to retry.

## Reliability upgrades

- Store normalized tournament/event data in a database or KV store.
- Run scheduled refresh jobs for major events like VCT and EWC.
- Add request logging and provider latency/error monitoring.
- Add fallback providers for LLM responses if Groq quota is exhausted.
- Add stricter answer validation for scorelines, dates, team lists, and player stats before streaming the response.

## Product features

- Save chat history per user.
- Add pinned tournament pages for EWC, VCT Masters, Champions, and regional stages.
- Add comparison views for teams, players, maps, and agents.
- Add a source confidence badge for every factual answer.
- Add admin controls for manually correcting event mappings and source priorities.

## Deployment notes

- The MVP can run entirely on Vercel as a Next.js app.
- Required Vercel environment variables:
  - `GROQ_API_KEY`
  - `TAVILY_API_KEY`
  - `JINA_API_KEY`
- No separate backend service is required for MVP.
- A separate backend or scheduled worker becomes useful when adding persistent caches, user accounts, scheduled data refreshes, or high-traffic reliability features.
