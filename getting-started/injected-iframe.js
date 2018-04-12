const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const reset = { border:0, margin:0, padding:0, width:"100%", height:"100%", background:"transparent" };

const toBase64 = require("./to-base64");
const InlineScript = require("./inline-script");
const EmptyBase64 = toBase64("<!DOCTYPE HTML>");


module.exports = "<!DOCTYPE HTML>" + renderToStaticMarkup(
    <html style = { reset }>
        <body style = { reset } >
            <iframe
                id = { "iframe" }
                style = { reset }
                frameBorder = { 0 }
                allowtransparancy = "true"
                width = "100%"
                height = "100%" />
            <InlineScript
                from = { script }
                constants = { { } } />
        </body>
    </html>);

function script()
{
    const iframe = document.getElementById("iframe");
    const { origin, pathname } = window.location;
    const loop = { text: {}, needsFetching: false, fetching: false };

    iframe.addEventListener("load", function loaded()
    {
        iframe.removeEventListener("load", loaded);

        setInterval(function fetchLoop()
        {
            if (loop.fetching || !loop.needsFetching)
                return;

            loop.needsFetching = false;
            loop.fetching = true;
console.log("GONNA TRY TO FETCH " + loop.URL);
            fetch(loop.URL)
                .then(response => response.text())
                .then(function (text)
                {
                    loop.fetching = false;

                    if (text === loop.text)
                        return;

                    window.parent.postMessage("fetched", "*");

                    const remoteDocument = iframe.contentWindow.document;

                    remoteDocument.open();
                    remoteDocument.write(text);
                    remoteDocument.close();

                    loop.text = text;
                })
                .catch(() => loop.fetching = false);
        }, 200);
    });
    iframe.src = `${origin}/jefkasjdfkjasdklfjsldkf/iframe-empty`;

    window.addEventListener("message", function ({ source, data })
    {
        if (source !== window.parent)
            return;

        loop.URL = origin + data.path;
        loop.needsFetching = true;

        console.log("GOT MESSAGE " + loop.URL);
    });
}




