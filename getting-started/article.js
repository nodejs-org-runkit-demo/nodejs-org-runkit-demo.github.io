const React = require("react");
const { css } = require("emotion");

const Window = require("../../components/photon/window");
const BrowserWindow = require("../../components/photon/browser-window");
const RunKit = require("@petrified/runkit");

const { readFileSync } = require("fs");
const injectedIFrame = JSON.stringify(encodeURIComponent(require("./injected-iframe")));
const IFrameInjectionPreamble = readFileSync(
    require.resolve("./iframe-injection-preamble"), "utf-8")
    .replace(/InjectedIFrame/g, injectedIFrame);

module.exports = function Article({ children })
{
    const styles = css`
        min-height: 100vh;
        display: block;
        width: 100%;
        user-select: initial;

        & > main
        {
            border-top:1px solid transparent;
            width: 50%;
            max-width: 50%;
            padding: 0px 50px 0px 50px;
        }
        
        & > figure
        {
            margin-top: 40px;
            padding: 0px 50px;
            width: 100%;
        }
        
        .window-container
        {
            display: inline-block;
            width: calc(50% - 50px);
            
            &:first-child { margin-right: 50px }
            &:last-child { margin-left: 50px }
        }

        .window-container:first-child { margin-right: 50px }
        .window-container:last-child { margin-left: 50px }
        
        .window
        {
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
            position: relative;
            overflow: hidden;
            height: 400px;
        }
                
        main > code.inline
        {
            color: rgba(164,115,221,1.0);
            background: rgba(246,247,252,1.0);
            font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
            border-radius: 5pt;
            font-size: 0.77em;
            padding: 0.33em .55em;
        }
    
        main > p
        {
            font-size:16px;
            line-height:27.2px;
            margin-bottom: 1.2em;
            padding: 10px 0px 1px 0px;
        }
    
        main > h1
        {
            font-size: 2.2em;
            margin-top: 0.8em;
        }
    
        main > h2
        {
            margin-top: 1em;
            font-size: 1.2em;
            font-weight: bolder;
            text-transform: uppercase;
            margin: 30px 0 15px 0;
        }
        
        @keyframes motion {
            from { transform: rotate(0deg) translate(-7px) rotate(0deg); }
            to { transform: rotate(360deg) translate(-7px) rotate(-360deg); }
        }
/*
        .pointer
        {
            background: url(./images/pointer.svg);
            background-size: 100% 100%;
            position: absolute;
            color: white;
            text-transform: uppercase;
            font-weight: bold;
            font-size: 0.9em;
            top: 68px;
            left: 250px;
            width: 170px;
            height: 61px;
            padding: 18px 0 0 2.2em;
            text-align: center;
            animation: motion 2s linear infinite;
        }*/`;

    const fence = require("@petrified/runkit/fence");
    const isCode = child => child.type === Article.Code;
    const lastExampleIndex = children.findIndex(isCode);
    const prose = children.slice(0, lastExampleIndex);
    const examples = children.slice(lastExampleIndex)
        .map(({ props: { literal, codeinfo } }) =>
            ({ literal, fence: fence(codeinfo) }));
    const tabs = examples.map(({ fence: { title } }, index) =>
        ({ title, active: index === 0 }));
    const path = examples[0].fence.path || "";

    return  <article css = { styles } data-path = { path } >
                <main>
                    { prose }
                </main>
                <figure>
                    <div className = "window-container">
                        <Window title = { examples[0].fence.title } >
                            { tabs.length > 1 && <Window.Tabs items = { tabs } /> }
                            <main>
                                {/* <div className = "pointer">
                                    Try changing this
                                </div> */ }
                                <RunKit
                                    autoGrow = { false }
                                    style = { { margin:"-1px" } }
                                    gutterStyle = "inside"
                                    hideEndpointLogs = { true }
                                    preamble = { IFrameInjectionPreamble }
                                    mode = "endpoint"
                                    onLoad = "onLoad"
                                    hideActionButton = { true }
                                    children = { [examples[0].literal] } />
                            </main>
                        </Window>
                    </div>
                    <div className = "window-container">
                        <BrowserWindow displayURL = { `http://localhost:3000${path}` } />
                    </div>
                </figure>
            </article>;
}

module.exports.Code = function ({ codeinfo, literal })
{
    return <code { ...{ codeinfo, literal } } />;
}
