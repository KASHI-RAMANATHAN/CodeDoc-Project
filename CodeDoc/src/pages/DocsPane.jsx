import "./DocsPane.css";
import { useState, useEffect } from "react";
import { parseComponent } from "../utils/parseComponent";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  PDFDownloadLink,
} from "@react-pdf/renderer";

Font.register({
  family: "Blockblueprint",
  src: "/fonts/Blockblueprint-LV7z5.ttf",
});
// PDF Styles - Keep these as is for the renderer
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
    return <div className="parse_error">Error: {error}</div>;
  }

  // Empty state
  if (!info || info.name === "No component found") {
    return <div className="msg-if-empty">Paste a component to see docs</div>;
  }

  //markdown
  let markdown = `# ${info.name}\n\n`;

  if (info.description) {
    markdown += info.description + "\n\n";
  }

  markdown += "## Props\n\n";
  markdown += "| Name | Type | Default | Required |\n";
  markdown += "|------|------|---------|----------|\n";

  // Loop through props to build the table rows
  info.props.forEach((p) => {
    const propName = p.name;
    const propType = p.type || "any"; // Uses the new type we added to the parser
    const isRequired = p.default === null ? "Yes" : "No";
    const defaultValue = p.default !== null ? `\`${p.default}\`` : "-";

    markdown += `| ${propName} | ${propType} | ${defaultValue} | ${isRequired} |\n`;
  });

  // Build the usage example string
  let propExample = "";
  info.props.forEach((p) => {
    propExample += `${p.name}={...} `;
  });

  markdown += `\n## Usage\n\n\`\`\`jsx\n<${
    info.name
  } ${propExample.trim()} />\n\`\`\`\n`;

  // --- PDF COMPONENT ---
  const PDFDoc = ({ info }) => {
    // const tableBorder = { border: "1px solid #000", padding: 5 };

    return (
      <Document>
        <Page size="A4" style={{ padding: 40, fontFamily: "Blockblueprint", backgroundColor:"rgb(14,16,15)" }}>
          {/* Component Name */}
          <Text style={{ fontSize: "25px", marginBottom: 15, color: "rgb(97, 170, 101)" }}>
           <Text style={{color: "#FFDE59"}}>Component Name: </Text>
           {info.name}
          </Text>

          {/* Description - Simple conditional rendering */}
          <Text style={{ fontSize: 12, marginBottom: 20 , color:"rgb(255, 252, 225)"}}>
            {info.description
              ? info.description
              : "No description found for this component."}
          </Text>

          {/* Props Section */}
          <Text style={{ fontSize: 18, marginBottom: 10, fontFamily:"Blockblueprint",color:"rgba(243, 241, 224, 1)" }}>Props Table:</Text>

          <View style={{ 
            border: "1px solid rgb(34, 34, 34)",
            borderRadius: 5 
            }}>
            {/* Table Header */}
            <View style={{ flexDirection: "row", backgroundColor: "rgb(0, 0, 0)",borderTopLeftRadius:5,borderTopRightRadius:5,overflow:"hidden" }}>
              <View
                style={{
                  width: "50%",
                  borderRight: "1px solid rgb(34, 34, 34)",
                  padding: 5,
                }}
              >
                <Text style={{ fontFamily:"Blockblueprint", color:"rgb(255, 252, 225)", fontSize:"14px"}}>Prop Name</Text>
              </View>
              <View style={{ width: "50%", padding: 5 }}>
                <Text style={{ fontFamily:"Blockblueprint", color:"rgb(255, 252, 225)", fontSize:"14px" }}>Default Value</Text>
              </View>
            </View>

            {/* Table Rows - Plain mapping without extra style spreads */}
            {info.props.map((p) => (
              <View
                key={p.name}
                style={{ flexDirection: "row", borderTop: "1px solid rgb(34, 34, 34)", fontSize: "11px", backgroundColor: "rgba(20, 20, 20, 1)" }}
              >
                <View
                  style={{
                    width: "50%",
                    borderRight: "0.5px solid rgb(34, 34, 34)",
                    padding: 5,
                  }}
                >
                  <Text style={{color:"rgb(255, 252, 225)",fontFamily: "Helvetica"}}>{p.name}</Text>
                </View>
                <View style={{ width: "50%", padding: 5 }}>
                  <Text style={{color:"rgb(97, 170, 101)",fontSize: "11px",fontFamily:"Helvetica"}}>{p.default ? p.default : "—"}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Usage Example - Very manual string building */}
          <Text style={{ fontSize: 18, marginTop: 30, marginBottom: 10 ,color:"rgba(243, 241, 224, 1)",fontFamily:"Blockblueprint"}}>
            How to use it:
          </Text>
          <View style={{ 
            backgroundColor: "rgb(0, 0, 0)",
            padding: 10,
            borderRadius:"5px",
            borderStyle:"solid",
            borderColor:"rgb(34,34,34)",
            borderWidth:"0.5px",
            }}>
            <Text style={{ fontSize: "10px" , color:"rgb(255,252,225)",fontFamily:"Helvetica"}}>
              {"<" + info.name + " "}
              {info.props.map((p) => p.name + "={...} ").join("")}
              {" />"}
            </Text>
          </View>
        </Page>
      </Document>
    );
  };
  return (
    <div className="entire-doc-content">
      <div className="doc-content">
        <h2 className="component-heading">
          Component: <span className="component-name">{info.name}</span>
        </h2>

        {/* Description Box */}
        {info.description ? (
          <div className="description-div">
            <p style={{ margin: 0 }}>{info.description}</p>
          </div>
        ) : (
          <p className="no-description-text">
            // No description found. Use JSDoc to add one!
          </p>
        )}

        <h3 className="props-table-heading">Props Table</h3>
        {/* Simple Table structure */}
        <div className="table-background">
          {/* You can re-insert your actual <table> here, but the props are now ready */}
          {info.props.length > 0 ? (
            info.props.map((p) => (
              <div
                key={p.name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid #222",
                }}
              >
                <code>{p.name}</code>
                <span style={{ color: "#61aa65" }}>{p.default ?? "—"}</span>
              </div>
            ))
          ) : (
            <p>No props detected.</p>
          )}
        </div>

        <h3 className=".usage-example-text">Usage Example</h3>
        <pre className="usage-example-block">
          <code>
            &lt;{info.name} {propExample.trim()} /&gt;
          </code>
        </pre>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          onClick={() => {
            navigator.clipboard.writeText(markdown);
            alert("Markdown copied to clipboard!"); // Very 'student' way to handle feedback
          }}
          className="markdown-button"
        >
          Copy Markdown
        </button>

        <PDFDownloadLink
          document={<PDFDoc info={info} />}
          fileName={`${info.name}-docs.pdf`}
        >
          <button className="download-button">Download PDF</button>
        </PDFDownloadLink>
      </div>
    </div>
  );
}
