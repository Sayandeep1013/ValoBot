import kb from "@/data/valorant-kb.json";

export function getKnowledgeBaseContext(): string {
  const teams = Object.values(kb.teams)
    .map((t) => {
      const mapPool = Object.entries(t.map_pool)
        .map(([k, v]) => `${k}: ${(v as string[]).join(", ")}`)
        .join(" | ");
      return `
TEAM: ${t.full_name} (${t.region})
  Playstyle: ${t.playstyle}
  Strengths: ${t.strengths.join(", ")}
  Weaknesses: ${t.weaknesses.join(", ")}
  Map pool: ${mapPool}
  Agent comps: ${t.agent_comps.default}
  Notable players: ${t.roster.join(", ")}`.trim();
    })
    .join("\n\n");

  const players = Object.entries(kb.players)
    .map(([name, p]) => {
      return `PLAYER: ${name} (${p.team}) — Role: ${p.role} | Agents: ${p.signature_agents.join(", ")} | ${p.playstyle}`;
    })
    .join("\n");

  const meta = `
CURRENT META (Patch ${kb.meta.current_patch}):
  Map pool: ${kb.meta.current_map_pool.join(", ")}
  Top duelists: ${kb.meta.top_agents_by_role.duelist.join(", ")}
  Top controllers: ${kb.meta.top_agents_by_role.controller.join(", ")}
  Top initiators: ${kb.meta.top_agents_by_role.initiator.join(", ")}
  Top sentinels: ${kb.meta.top_agents_by_role.sentinel.join(", ")}`.trim();

  return `TEAMS:\n${teams}\n\nPLAYERS:\n${players}\n\n${meta}`;
}
