import { EditorPane } from "./EditorPane"
import { RightPane } from "./RightPane"
export function MainLayout(){
    return(
        <div className= "process-container">
            <EditorPane />
            <RightPane />
        </div>
    )
}