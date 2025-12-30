import { useState } from "react"

export function RightPane(){
    const [doc, set_Doc] = useState("Doc");
    const changeToOtherOption = ()=>{
        if(doc === "Doc"){
            set_Doc("Live");
        }
        else{
            set_Doc("Doc")
        }
    }
    return(
        <div class="right-pane">
            <p class="editor-heading">Doc/Live</p>
            <div class = "demo-live"></div>
            <button className= {`${doc}-button`} onClick={changeToOtherOption}>{doc}</button>
        </div>
    )
}