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
            <div className = "demo-live">{doc === "Doc"? (
                <div className="docmode-container">
                    <DocsPane value = {value}/>
                </div>
            ):(
                <div className="livemode-container">
                    <LivePane value = {value}/>
                </div>
                )}</div>
            <button className= {`${doc}-button`} onClick={changeToOtherOption}>{doc}</button>
        </div>
    )
}