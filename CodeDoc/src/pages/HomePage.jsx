import { useEffect, useState } from "react"
import "./HomePage.css"

export function HomePage(){
    const [blink,set_blink] = useState(false)
    // const blinker = ()=>{
    //     if(blink){
    //         set_blink(false)
    //     }
    //     else{
    //         set_blink(true)
    //     }
    // }
    useEffect(()=>{
        const interval = setInterval(()=>{
            // blinker();
            set_blink((prev) => !prev)
        },630);
        return () => clearInterval(interval);
    },[]);

    return(
        <div style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            boxSizing: "border-box",
        }}>
            <div className="Header">
                <p className="CodeDoc">&gt;CodeDoc_</p>
            </div>
            <div className="console">
                <div className="heading">&gt;booting up...</div>
                <div className="MyName">Hello World ! My name is <span className="name">Kashi Ramanathan Valliappa</span></div>
                <div className="content">
                    <div className="cont">
                        <div>
                            I'm an <span style={{color:'#22D3EE', fontWeight:'600'}}>engineering student</span> who is
                            <span style={{color:'#A78BFA', fontWeight:'600'}}> passionate to build things that are engineered </span>
                             and not generated — but with a bit of help from
                            <span style={{color:'#FACC15'}}> LLMs ;)</span>.
                        </div>

                        <div>
                            I <span style={{color:'#34D399'}}>juggle a lot of things</span>, but I make sure I juggle them
                            <span style={{color:'#60A5FA'}}> properly</span>.
                        </div>

                        <div>
                            I'm <span style={{color:'#FB7185', fontWeight:'600'}}>determined to complete a quest</span> I have started.
                        </div>

                        <div>
                            I created another site which is a
                            <span style={{color:'#F97316', fontWeight:'600'}}> payment portal</span>, and working with the
                            <span style={{color:'#38BDF8'}}> current tech stack</span> has made me much stronger in
                            <span style={{color:'#4ADE80', fontWeight:'600'}}> frontend development</span>,
                            while I continue sharpening my
                            <span style={{color:'#C084FC'}}> backend skills</span>.
                        </div>

                        <div>
                            I hope you enjoy
                            <span style={{color:'#E879F9', fontWeight:'700'}}> CodeDoc</span>.
                        </div>

                        <div className="cursor" style={{opacity: blink ? 1:0}}></div>
                    </div>
                </div>
            </div>
            <div className="what-is-it">
                <div className="heading1">What is CodeDoc ?</div>
                <div className="answer">
                    CodeDoc is a <span style={{color: '#5DCBFE'}}>Code</span> to <span style={{color:' #C5869C'}}>Documentation</span> converter why is purely done
                    by <span style={{color: '#A4CEA8'}}>engineered parsing</span> using <span style={{color: '#F22C3D'}}>JavaScript</span> and <span style={{color: '#F22C3D'}}>not AI</span>, the React Components pasted
                    are converted into <span style={{color:  '#61aa65'}}>Documentation</span> with a <span style={{color: '#5DCBFE'}}>Downloadable link</span>.
                </div>
            </div>
            <div style={{
                marginTop: "60px",
                fontSize: "20px",
                color: "#61aa65",
                animation: "bounce 2s infinite"
            }}>
                ↓ Scroll to explore Code-Doc ↓
            </div>
        </div>
    )
}