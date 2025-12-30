import { useState } from "react"
import { DocsPane } from "./DocsPane";
import { LivePane } from "./LivePane";
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
        <div className="right-pane">
            <p className="editor-heading">{`${doc}-Mode`}</p>
            {/* <div class = "demo-live"></div> */}
            <div className = "demo-live">{doc === "Doc"? <DocsPane />:<LivePane/>}</div>
            <button className= {`${doc}-button`} onClick={changeToOtherOption}>{doc}</button>
        </div>
    )
}