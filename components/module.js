const React = require("react");
const { css } = require("emotion");

const Page = require("./page");
const markdownStyles = require("./markdown-styles");
const CodeBlock = require("./markdown/code-block");
const Navigation = require("./navigation");


module.exports = function ({ children, ...rest })
{
    if (!children)
        return <div/>;

    const sections = toSections(children);

    return  <Page { ...rest }>
                <head>
                    <link rel = "stylesheet" href = "https://themes.runkitcdn.com/runkit-light.css" />
                </head>
                <body css = "font-size:16px; padding: 0; margin: 0" >
                    <script src = "https://embed.runkit-demo.com" />
                    <div css = "width: 235px; position:fixed; height: 100vh; overflow: scroll">
                        <Navigation>
                            { NavLinks }
                        </Navigation>
                    </div>
                    <main css = "margin-left:235px; width:calc(100vw - 235px)" >
                        <div className = { markdownStyles + " margins fluid-content" } >
                    {
                        sections.map(section =>
                            <section css = "display: flex;">
                                <div css = "flex:1 0 0; max-width: 50%" >
                                    <div css = "padding:0px 50px 50px 50px; display: block; position: sticky; top: 40px">
                                        { section.header }
                                        <Stability stability = { section.stability } />
                                        { section.children }
                                    </div>
                                </div>
                                <div css = "flex:1 0 0; max-width: 50%; border-left:1px solid rgb(221, 221, 221); background: #f5f5f5;" >
                                    <div css = "padding:40px 50px 50px 50px; display:block; position: sticky; top: 40px">
                                        { section.example }
                                    </div>
                                </div>
                            </section>)
                    }
                        </div>
                    </main>
                </body>
            </Page>;
}

function Stability({ stability })
{
    if (typeof stability === "undefined")
        return <span/>;
    ///*"255, 206, 65"*/
    const tint = ["221, 79, 68", "221, 79, 68", "49, 178, 118"][stability];

    const css = `
        position: absolute;
        top:0px;
        right:50px;
        border: 1px solid rgba(${tint}, 1.0);
        background: rgba(${tint}, 0.2);
        color: rgba(${tint}, 1.0);
        border-radius: 4pt;
        padding: 0.33em .55em;
        text-transform: uppercase;
        font-size: 80%;
        font-weight: bold;`;

    const names = ["Deprecated", "Experimental", "Stable"];

    return <span css = { css }>{ names[stability] }</span>;

}

function toSections(children)
{
    const sections = [];

    for (const child of children)
    {
        if (child.props.level === 1 || child.props.level === 2 || child.props.level === 3)
        {
            sections.push({ header:[child], children:[] });

            continue;
        }

        if (child.type.name === "HtmlRenderer")
            continue;

        const section = sections[sections.length - 1];
        const children = section.children;

        if (child.type === "blockquote" && children.length === 0)
        {
            const text = child.props.children[0].props.children[0];
            const matches = text.match(/Stability: (\d+) - .*/);

            section.stability = matches[1];
        }

        else if (child.type === CodeBlock)
            section.example = child;
        else
            section.children.push(child);
    }

    return sections;
}

const NavLinks =
[
    <div style = { { width:"1px", height:"20px" } } />,
    "Assertion Testing",
    "Async Hooks",
    "Buffer",
    "C++ Addons",
    "C/C++ Addons - N-API",
    "Child Processes",
    "Cluster",
    "Command Line Options",
    "Console",
    "Crypto",
    "Debugger",
    "Deprecated APIs",
    "DNS",
    "Domain",
    "ECMAScript Modules",
    "Errors",
    "Events",
    "File System",
    "Globals",
    "HTTP",
    "HTTP/2",
    "HTTPS",
    "Inspector",
    "Internationalization",
    "Modules",
    "Net",
    "OS",
    "Path",
    "Performance Hooks",
    "Process",
    "Punycode",
    "Query Strings",
    "Readline",
    "REPL",
    "Stream",
    "String Decoder",
    "Timers",
    "TLS/SSL",
    "Tracing",
    "TTY",
    "UDP/Datagram",
    "URL",
    "Utilities",
    "V8",
    "VM",
    "ZLIB"
]

