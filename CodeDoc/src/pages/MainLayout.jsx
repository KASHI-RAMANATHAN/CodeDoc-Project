import { EditorPane } from "./EditorPane"
import { RightPane } from "./RightPane"
import { useState } from "react"
export function MainLayout(){
    const [value, set_Value] = useState(
    `/**
 * A retro terminal command interface component.
 * Executes commands with a classic hacker aesthetic.
 */
export default function TerminalCommand({ 
  command = "npm run dev", 
  blinkSpeed = 500, 
  user = "root",
  flags = ["--verbose", "--force"],
  onExecute
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
        onClick={onExecute}
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
        onMouseOver={e => e.target.style.backgroundColor = 'rgba(167, 139, 250, 0.2)'}
        onMouseOut={e => e.target.style.backgroundColor = 'transparent'}
      >
        [ Execute ]
      </button>
    </div>
  );
}`
    );

    return(
        <div className= "process-container" style={{padding:"60px 20px", minHeight:"100vh", backgroundColor:"rgb(14,16,15)"}}>
            <EditorPane value = {value} set_Value = {set_Value}/>
            <RightPane value = {value}/>
        </div>
    )
}