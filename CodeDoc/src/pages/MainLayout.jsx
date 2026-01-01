import { EditorPane } from "./EditorPane"
import { RightPane } from "./RightPane"
import { useState } from "react"
export function MainLayout(){
    const [value, set_Value] = useState(
    `export default function Button({ label = "Click me", variant = "primary" }) {
  return <button>{label}</button>;
}
// Replace this example component
// with your React Component
`
    );

    return(
        <div className= "process-container" style={{padding:"60px 20px", minHeight:"100vh", backgroundColor:"rgb(14,16,15)"}}>
            <EditorPane value = {value} set_Value = {set_Value}/>
            <RightPane value = {value}/>
        </div>
    )
}