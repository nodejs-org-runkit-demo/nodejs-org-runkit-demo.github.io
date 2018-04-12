(function ()
{
    const http = require("http");
    const originalCreateServer = http.createServer;
    const { parse } = require("url");

    http.createServer = function (handler)
    {
        return originalCreateServer.call(this, function (request, response)
        {
            const { pathname, query } = parse(request.url || request.originalUrl, true);

            if (pathname === "/jefkasjdfkjasdklfjsldkf/iframe-empty")
            {
                const empty = "<!DOCTYPE HTML>";

                response.setHeader("content-type", "text/html; charset=utf-8");
                response.setHeader("content-length", empty.length);

                return response.end(empty);
            }

            if (pathname === "/jefkasjdfkjasdklfjsldkf/iframe-loader")
            {
                const injectedIFrame = decodeURIComponent(InjectedIFrame);

                response.setHeader("content-type", "text/html; charset=utf-8");
                response.setHeader("content-length", injectedIFrame.length);

                return response.end(injectedIFrame);
            }

            return handler.apply(this, arguments);
        });
    };
})();