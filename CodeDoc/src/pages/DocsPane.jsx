import "./DocsPane.css"
import { parseComponent } from "../utils/parseComponent"
import { useState,useEffect } from "react"
export function DocsPane({ value }) {
  const [c_Info, set_C_Info] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!value || !value.trim()) {
      set_C_Info(null);
      return;
    }

    try {
      const info = parseComponent(value);
      if (info.error) {
        setError(info.error);
        set_C_Info(null);
      } else {
        setError(null);
        set_C_Info(info);
      }
    } catch (err) {
      setError(`Something went wrong while reading the code,${err}`);
      set_C_Info(null);
    }
  }, [value]);

  // If there's an error
  if (error) {
    return (
      <div style={{ padding: "2rem", color: "#ff6b6b" }}>
        <h3>Oops!</h3>
        <p>{error}</p>
        <p style={{ fontSize: "14px", marginTop: "1rem" }}>
          Tip: Make sure you have a valid React component with "export default"
        </p>
      </div>
    );
  }

  // If no component found yet
  if (!c_Info) {
    return (
      <div style={{ padding: "2rem", color: "#A1A1AA" }}>
        <p>Paste a React component in the editor to see its docs here</p>
      </div>
    );
  }

  // Main docs view
  return (
    <div style={{ padding: "2rem", color: "#FFFCE1" }}>
      <h2 style={{ marginBottom: "1.5rem" , fontFamily: "Blockblueprint"}}>
        Component: <strong>{c_Info.name}</strong>
      </h2>

      <h3 style={{ margin: "1.5rem 0 1rem", fontFamily: "Blockblueprint" }}>Props</h3>

      {c_Info.props.length === 0 ? (
        <p style={{ color: "#A1A1AA", fontStyle: "italic" }}>
          This component doesn't take any props
        </p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "#111",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#1e1e1e" }}>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #333", fontFamily: "Blockblueprint" }}>
                Prop Name
              </th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #333", fontFamily: "Blockblueprint" }}>
                Default Value
              </th>
            </tr>
          </thead>
          <tbody>
            {c_Info.props.map((prop) => (
              <tr key={prop.name} style={{ borderBottom: "1px solid #222" }}>
                <td style={{ padding: "12px" }}>
                  <code style={{ background: "#222", padding: "4px 8px", borderRadius: "6px" }}>
                    {prop.name}
                  </code>
                </td>
                <td style={{ padding: "12px", color: prop.default ? "#61aa65" : "#A1A1AA" }}>
                  {prop.default !== null ? prop.default : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}