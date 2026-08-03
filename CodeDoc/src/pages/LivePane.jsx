import { useState } from 'react';
import React from 'react'; 
import './LivePane.css'
import { LiveProvider, LiveError, LivePreview } from "react-live";
import { getComponentName } from "../utils/parseComponent";

const scope = { useState, React };

export function LivePane({ value }) {
    if (!value || !value.trim()) {
        return (
            <div style={{ padding: "32px", color: "#A1A1AA", textAlign: "center" }}>
                <p>Paste a component and switch to Live mode to see it rendered!</p>
            </div>
        );
    }


    const componentName = getComponentName(value) || 'Component';


    const cleanedCodeBody = value
    .replace(/import\s+.*?;/g, '')
    .replace(/export\s+default\s+function\s+;?/g, 'function ')
    .replace(/export\s+default\s+([A-Z][A-Za-z0-9_]*)\s*;?/g, '') // removing the export default line
    .trim();

    // Wrap everything into a component so react-live evaluates one thing
    //to check why cleanedcodebody is put in there ++
    const cleanedCode = `
    ${cleanedCodeBody}

    function Wrapper() {
        return <${componentName} />;
    }

    render(<Wrapper />);
    `;

    
    return (
        <LiveProvider code={cleanedCode} scope={scope} noInline={true}>
            <div className='liveBox'>
                <div className='liveBoxPreviewContent'>
                    <LivePreview
                        style={{
                            padding: "1rem",
                            width: "100%",
                            // height: "100%",
                            minHeight: "100%",
                            // display: "flex",
                            display: "block",
                            // alignItems: "center",
                            // justifyContent: "center",
                            color: "#FFFCE1",
                        }}
                    />
                </div>

                {/* This only shows if there is a real error in the logic */}
                <LiveError style={{ 
                    color: "#ff6b6b", 
                    background: "#300", 
                    padding: "1rem", 
                    borderRadius: "8px", 
                    fontSize: "14px",
                    marginTop: "10px" 
                }} />
            </div>
        </LiveProvider>
    );
}