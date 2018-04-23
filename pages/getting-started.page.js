const React = require("react");
const { css } = require("emotion");

const Page = require("../components/page");
const Navigation = require("../components/navigation");

const { readFileSync, readdirSync } = require("fs");
const toBase64 = require("./getting-started/to-base64");

const InjectedIFrameBase64 = toBase64(require("./getting-started/injected-iframe"));
const InlineScript = require("./getting-started/inline-script");

const Article = require("./getting-started/article");


module.exports = function ({ children, ...rest })
{
    const articleContents = getArticleContents();
    const articles = articleContents
        .map(({ markup }) => <Article>{ markup }</Article>);
    const style = css`
        padding: 0;
        margin: 0;
        background-image: linear-gradient(
            to right, rgba(6, 16, 65, 1.0) 235px,
            #fff 235px, #fff calc(117px + 50vw),
            #f5f5f5 calc(117px + 50vw));

        nav
        {
            width: 235px;
            position:fixed;
            height: 100vh;
            overflow: scroll;
        }

        & > main
        {
            margin-left:235px;
            width:calc(100vw - 235px);
        }`;

    return  <Page { ...rest }>
                <head>
                    <link rel = "stylesheet" href = "https://themes.runkitcdn.com/runkit-light.css" />
                    <link rel = "stylesheet" href = "/assets/css/photon.min.css" />
                </head>
                <body css = { style } >
                    <script src = "https://embed.runkit-demo.com" />
                    <nav>
                        <Navigation>
                            { [<div style = { { width:"1px", height:"20px" } } />].concat(articleContents.map(({ markup }) => markup[0].props.children)) }
                        </Navigation>
                    </nav>
                    <main css = "margin-left:235px; width:calc(100vw - 235px);" >
                        { articles }
                    </main>
                    <InlineScript
                        from = { RUN }
                        constants = { { InjectedIFrameBase64 } } />
                </body>
            </Page>;
}

function getArticleContents()
{
    const { readFileSync: read } = require("fs");
    const cm = require("@petrified/build/transform/common-mark")
    const components = { CodeBlock: Article.Code };
    const articlesPath = `${__dirname}/getting-started/articles/`;

    return readdirSync(articlesPath)
        .filter(source => source.charAt(0) !== ".")
        .map(source => `${articlesPath}/${source}`)
        .map(source => ({ source, markdown: read(source, "utf-8"), components }))
        .map(items => ({ ...items, markup: cm.render(items) }));
}

function RUN()
{
    window.onLoad = function (embed)
    {
        embed
            .getEndpointURL()
            .then(function (endpointURL)
            {
                var article = embed.element;

                while (article.tagName !== "ARTICLE")
                    article = article.parentNode;

                const path = article.dataset.path;
                const iframe = article.querySelector(".browser-iframe");
                const progressBar = article.querySelector(".browser-progress-bar");
                const { contentWindow } = iframe;
                const progress = { loaded: false, initialized: false };

                embed.onSave = function ()
                {
                    if (!progress.initialized)
                    {
                        progress.initialized = true;
                        iframe.src = endpointURL + "/jefkasjdfkjasdklfjsldkf/iframe-loader";
                        iframe.addEventListener("load", () =>
                        {
                            progress.loaded = true;
                            contentWindow.postMessage({ name: "refresh", path }, "*")
                        });
                    }

                    if (progress.loaded)
                        contentWindow.postMessage({ name: "refresh", path }, "*");
                }

                window.addEventListener("message", function ({ source, origin, data })
                {
                    if (source !== iframe.contentWindow)
                        return;

                    if (data === "fetched")
                    {
                        progressBar.classList.remove("animate-load");
                        setTimeout(() =>
                            progressBar.classList.add("animate-load"), 0);
                    }
                });
            });
    }
}

//https://untitled-i2i0dnt2fghj.runkit.sh
//"https://untitled-mgqqsut1u44l.tonic.sh?url=" + encodeURIComponent(shareableURL);
