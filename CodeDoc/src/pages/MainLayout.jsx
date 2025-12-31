import { EditorPane } from "./EditorPane"
import { RightPane } from "./RightPane"
import { useState } from "react"
export function MainLayout(){
    const [value, set_Value] = useState(
    `export default function Button({ label = "Click me", variant = "primary" }) {
  return <button>{label}</button>;
}
`
    );

    return(
        <div className= "process-container">
            <EditorPane value = {value} set_Value = {set_Value}/>
            <RightPane value = {value}/>
        </div>
    )
}