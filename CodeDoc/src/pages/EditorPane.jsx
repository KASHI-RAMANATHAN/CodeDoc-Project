import Editor from "@monaco-editor/react"
import { testComponents } from "../utils/testComponents"

export function EditorPane({value, set_Value}){
    const saveChanges = (newValue)=>{
        console.log(newValue)
        set_Value(newValue)
    }
    const handleBeforeMount = (monaco) => {
        monaco.editor.defineTheme("codoc-dark", {
            base: "vs-dark",      // keep dark tokens & fonts
            inherit: true,
            colors: {
            "editor.background": "#0E100F",
            "editor.foreground": "#FFFCE1",
            "editorLineNumber.foreground": "#A1A1AA",
            "editorCursor.foreground": "#FFFCE1",
            "editor.selectionBackground": "#FFFCE120",
            "editor.lineHighlightBackground": "#1F293380",
            "scrollbar.shadow": "#00000080"
            },
            rules: [] 
        });
    };
    return(
        <div className = "editor-pane">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p className="editor-heading">Editor</p>
                <select 
                  onChange={(e) => {
                      if (e.target.value) set_Value(testComponents[e.target.value]);
                  }}
                  style={{
                      marginRight: "10px",
                      padding: "5px 10px",
                      backgroundColor: "#1F2933",
                      color: "#FFFCE1",
                      border: "1px solid #333",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontFamily: "monospace"
                  }}
                >
                    <option value="">Load a Test Component...</option>
                    <option value="TerminalCommand">Terminal Command</option>
                    <option value="CyberButton">Cyber Button</option>
                    <option value="GlassCard">Glass Card</option>
                </select>
            </div>
            <div className="workspace">
                <Editor 
                    height="100%" 
                    defaultLanguage="javascript" 
                    theme="codoc-dark"
                    beforeMount={handleBeforeMount}
                    value={value}
                    onChange={saveChanges}
                />
            </div>
            <button className="convert-button">Convert</button>
        </div>
    )
}