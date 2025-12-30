import { EditorPane } from "./EditorPane"
import { RightPane } from "./RightPane"
export function MainLayout(){
    return(
        <div class= "process-container">
            <EditorPane />
            <RightPane />
        </div>
    )
}