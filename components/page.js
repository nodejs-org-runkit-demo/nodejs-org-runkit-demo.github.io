const React = require("react");
const { css } = require("emotion");

const Copyright = require("./page/copyright");
const Header = require("./page/header");
const hasOwnProperty = Object.prototype.hasOwnProperty;


module.exports = function ({ site, title, href, children })
{
    const { head, body } = find(["head", "body"], children);
    const appended = title === site.title ? title : `${title} | ${site.title}`;

    const contents = !head && !body ? children : body.props.children;

    return  <html>
                <head>
                    <meta charSet = "utf-8" />
                    <meta name = "viewport" content = "width=device-width, initial-scale=1, viewport-fit=cover" />

                    <title>{ appended }</title>

                    { head && head.props.children }

                    <link href = "/assets/css/bootstrap-reboot.min.css" rel = "stylesheet" />
                    <link href = "/assets/fontawesome/css/fontawesome-all.min.css" rel = "stylesheet" />
{/*
                    <link href = "/assets/typography.css" rel = "stylesheet" />
                    <script src = "/assets/fluid-typography.js"
                            data-classes = "fluid-content, fluid-title-35, fluid-title" />
*/}
                    <link rel = "canonical" href = { href } />
                </head>
                <body>
                    { body }
                </body>
            </html>;
}

function find(tags, children)
{
    const names = tags.reduce((names, tag) =>
        Object.assign(names, { [tag]: tag }),
        Object.create(null));

    return [].concat(children)
        .reduce((findings, child) =>
            child && typeof child.type === "string" &&
            hasOwnProperty.call(names, child.type) ?
                Object.assign(findings, { [child.type]: child }) :
                findings,
            Object.create(null));
}
