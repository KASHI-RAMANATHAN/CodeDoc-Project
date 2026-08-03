export const testComponents = {
  TerminalCommand: `/**
 * A retro terminal command interface component.
 * Executes commands with a classic hacker aesthetic.
 */
export default function TerminalCommand({ 
  command = "npm run dev", 
  blinkSpeed = 500, 
  user = "root",
  flags = ["--verbose", "--force"]
}) {
  const [blink, setBlink] = useState(true);

  React.useEffect(() => {
    const timer = setInterval(() => setBlink(b => !b), blinkSpeed);
    return () => clearInterval(timer);
  }, [blinkSpeed]);

  return (
    <div style={{
      backgroundColor: "#0d0d0d",
      color: "#4ADE80",
      fontFamily: "monospace",
      padding: "1.5rem",
      borderRadius: "8px",
      border: "1px solid #333",
      boxShadow: "0 4px 20px rgba(0, 255, 0, 0.1)",
      maxWidth: "400px"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", color: "#666" }}>
        <span>bash</span>
        <span>{user}@codedoc</span>
      </div>
      <div style={{ fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ color: "#FACC15" }}>~</span>
        <span style={{ color: "#22D3EE" }}>$</span>
        <span style={{ color: "#fff" }}>{command} {flags.join(" ")}</span>
        <span style={{ 
          opacity: blink ? 1 : 0, 
          width: "8px", 
          height: "20px", 
          backgroundColor: "#4ADE80",
          display: "inline-block"
        }} />
      </div>
      <button 
        style={{
          marginTop: "1.5rem",
          backgroundColor: "transparent",
          color: "#A78BFA",
          border: "1px solid #A78BFA",
          padding: "8px 16px",
          fontFamily: "monospace",
          cursor: "pointer",
          borderRadius: "4px",
          transition: "all 0.2s"
        }}
      >
        [ Execute ]
      </button>
    </div>
  );
}`,
  CyberButton: `/**
 * An interactive cyber-themed button that tracks clicks.
 * Features a neon glow effect when active.
 */
export default function CyberButton({ text = "INITIATE HACK", color = "#22D3EE" }) {
  const [clicks, setClicks] = useState(0);

  return (
    <div style={{ textAlign: "center", fontFamily: "monospace", padding: "40px" }}>
      <button 
        onClick={() => setClicks(c => c + 1)}
        style={{
          backgroundColor: clicks > 0 ? "rgba(34, 211, 238, 0.2)" : "transparent",
          color: color,
          border: "2px solid " + color,
          padding: "16px 32px",
          fontSize: "18px",
          fontFamily: "monospace",
          cursor: "pointer",
          borderRadius: "4px",
          boxShadow: clicks > 0 ? "0 0 15px " + color : "none",
          textShadow: clicks > 0 ? "0 0 5px " + color : "none",
          transition: "all 0.3s ease"
        }}
      >
        {text} [{clicks}]
      </button>
      
      {clicks > 5 && (
        <p style={{ color: "#FB7185", marginTop: "20px", fontWeight: "bold" }}>
          > SYSTEM BREACHED_
        </p>
      )}
    </div>
  );
}`,
  GlassCard: `/**
 * A modern glassmorphism card component.
 */
export default function GlassCard({ 
  title = "Glassmorphism", 
  subtitle = "Modern UI Design" 
}) {
  return (
    <div style={{
      background: "rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      borderRadius: "15px",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      padding: "2rem",
      color: "#FFFCE1",
      maxWidth: "300px",
      boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)"
    }}>
      <h2 style={{ margin: "0 0 10px 0", fontFamily: "sans-serif" }}>{title}</h2>
      <p style={{ color: "#A1A1AA", margin: 0, fontFamily: "sans-serif" }}>{subtitle}</p>
      
      <div style={{ 
        height: "2px", 
        background: "linear-gradient(90deg, #FACC15, #4ADE80)", 
        marginTop: "20px" 
      }} />
    </div>
  );
}`
};
