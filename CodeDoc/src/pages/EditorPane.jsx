import Editor from "@monaco-editor/react"
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
            <p className="editor-heading">Editor</p>
            <div className="workspace">
                <Editor 
                    height="100%" 
                    defaultLanguage="javascript" 
                    theme="codoc-dark"
                    beforeMount={handleBeforeMount}
                    defaultValue={value}
                    onChange={saveChanges}
                />
            </div>
            <button className="convert-button">Convert</button>
        </div>
    )
}