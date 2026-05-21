import { redirect } from "next/navigation";

// Analytics = CYPHER chat interface — redirect directly
export default function AnalyticsPage() {
  redirect("/chat");
}
