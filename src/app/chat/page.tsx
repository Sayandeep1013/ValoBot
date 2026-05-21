import ChatInterface from "@/components/Chat/ChatInterface";
import PageNav from "@/components/Layout/PageNav";

export default function ChatPage() {
  return (
    <div style={{
      background: "#080808",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      backgroundImage: "radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1px)",
      backgroundSize: "48px 48px",
    }}>
      <PageNav />
      {/* Chat takes everything below nav */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", height: "calc(100vh - 96px)" }}>
        <ChatInterface />
      </div>
    </div>
  );
}
