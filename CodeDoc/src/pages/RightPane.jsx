import { useState } from "react"
import { DocsPane } from "./DocsPane";
import { LivePane } from "./LivePane";
export function RightPane({value}){
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
            <div className = "demo-live">{doc === "Doc"? <DocsPane value = {value}/>:(
                <div className="livemode-container">
                    <LivePane value = {value}/>
                </div>
                )}</div>
            <button className= {`${doc}-button`} onClick={changeToOtherOption}>{doc}</button>
        </div>
    )
}