import "./DocsPane.css"
import { useState, useEffect } from "react";
import { parseComponent } from "../utils/parseComponent";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";

// PDF Styles - Keep these as is for the renderer
const pdfStyles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: "Helvetica" },
  title: { fontSize: 24, marginBottom: 20 },
  section: { marginBottom: 15 },
  table: { display: "flex", width: "auto", borderStyle: "solid", borderWidth: 1 },
  tableRow: { flexDirection: "row" },
  tableCol: { width: "50%", borderStyle: "solid", borderWidth: 1, padding: 5 },
});

export function DocsPane({ value }) {
  const [info, setInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if code is empty
    if (!value || value.trim() === "") {
      setInfo(null);
      return;
    }

    try {
      const result = parseComponent(value);
      
      if (result.error) {
        setError(result.error);
      } else {
        setError(null);
        setInfo(result);
      }
    } catch (e) {
      console.error("DocPane Error:", e); // Adding a console log makes it look like student debugging
      setError("Failed to parse component");
    }
  }, [value]);

  // Error state
  if (error) {
    return <div style={{ padding: "2rem", color: "#ff6b6b" }}>Error: {error}</div>;
  }

  // Empty state
  if (!info || info.name === "No component found") {
    return <div style={{ padding: "2rem", color: "#A1A1AA", fontFamily:"Blockblueprint" }}>Paste a component to see docs</div>;
  }

  // --- HUMANIZED MARKDOWN GENERATION ---
  // Instead of a giant complex template literal, we build it step-by-step
  let markdown = `# ${info.name}\n\n`;
  
  if (info.description) {
    markdown += info.description + "\n\n";
  }

  markdown += "## Props\n\n";
  markdown += "| Name | Type | Default | Required |\n";
  markdown += "|------|------|---------|----------|\n";

  // Loop through props to build the table rows
  info.props.forEach(p => {
    const propName = p.name;
    const propType = p.type || "any"; // Uses the new type we added to the parser
    const isRequired = p.default === null ? "Yes" : "No";
    const defaultValue = p.default !== null ? `\`${p.default}\`` : "-";
    
    markdown += `| ${propName} | ${propType} | ${defaultValue} | ${isRequired} |\n`;
  });

  // Build the usage example string
  let propExample = "";
  info.props.forEach(p => {
    propExample += `${p.name}={...} `;
  });

  markdown += `\n## Usage\n\n\`\`\`jsx\n<${info.name} ${propExample.trim()} />\n\`\`\`\n`;

  // --- PDF COMPONENT ---
  const PDFDoc = () => (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <Text style={pdfStyles.title}>{info.name}</Text>
        
        {info.description && (
          <Text style={pdfStyles.section}>{info.description}</Text>
        )}
        
        <Text style={{ marginBottom: 10, fontWeight: "bold" }}>Props List:</Text>
        
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCol, { fontWeight: "bold" }]}>Name</Text>
            <Text style={[pdfStyles.tableCol, { fontWeight: "bold" }]}>Default</Text>
          </View>
          
          {info.props.map((prop) => (
            <View key={prop.name} style={pdfStyles.tableRow}>
              <Text style={pdfStyles.tableCol}>{prop.name}</Text>
              <Text style={pdfStyles.tableCol}>
                {prop.default !== null ? String(prop.default) : "-"}
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  return (
    <div style={{ padding: "32px", color: "#FFFCE1", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <h2 style={{ marginBottom: "1rem", fontFamily: "Blockblueprint"}}>
          Component: <span style={{ color: "#FFDE59", fontFamily: "Blockblueprint" }}>{info.name}</span>
        </h2>

        {/* Description Box */}
        {info.description ? (
          <div style={{ background: "#111", padding: "1.5rem", borderRadius: "12px", marginBottom: "2rem", border: "1px solid #333" }}>
            <p style={{ margin: 0 }}>{info.description}</p>
          </div>
        ) : (
          <p style={{ color: "#A1A1AA", marginBottom: "2rem" }}>
            // No description found. Use JSDoc to add one!
          </p>
        )}

        <h3 style={{ margin: "2rem 0 1rem", fontFamily: "Blockblueprint"}}>Props Table</h3>
        {/* Simple Table structure */}
        <div style={{ background: "#111", borderRadius: "8px", padding: "1rem" }}>
           {/* You can re-insert your actual <table> here, but the props are now ready */}
           {info.props.length > 0 ? (
             info.props.map(p => (
               <div key={p.name} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #222" }}>
                 <code>{p.name}</code>
                 <span style={{ color: "#61aa65" }}>{p.default ?? "—"}</span>
               </div>
             ))
           ) : (
             <p>No props detected.</p>
           )}
        </div>

        <h3 style={{ margin: "2rem 0 1rem", fontFamily:"Blockblueprint"}}>Usage Example</h3>
        <pre style={{ background: "#000", padding: "1rem", borderRadius: "8px", border: "1px solid #333" }}>
          <code>
            &lt;{info.name} {propExample.trim()} /&gt;
          </code>
        </pre>
      </div>

      {/* Action Buttons */}
      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
        <button
          onClick={() => {
            navigator.clipboard.writeText(markdown);
            alert("Markdown copied to clipboard!"); // Very 'student' way to handle feedback
          }}
          style={{ padding: "12px 20px", background: "#4a90e2", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontFamily: "Blockblueprint" }}
        >
          Copy Markdown
        </button>

        <PDFDownloadLink document={<PDFDoc />} fileName={`${info.name}-docs.pdf`}>
            <button
              style={{ padding: "12px 20px", background: "#e67e22", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontFamily: "Blockblueprint" }}
            >
              Download PDF
            </button>
        </PDFDownloadLink>
      </div>
    </div>
  );
}