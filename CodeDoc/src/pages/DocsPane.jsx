import "./DocsPane.css"
export function DocsPane() {
  return (
    <div className="docs-table-wrapper">
      <table className="docs-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Alfreds Futterkiste</td>
            <td>Maria Anders</td>
            <td>Germany</td>
            <td></td>
          </tr>
          <tr>
            <td>Centro comercial Moctezuma</td>
            <td>Francisco Chang</td>
            <td>Mexico</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
