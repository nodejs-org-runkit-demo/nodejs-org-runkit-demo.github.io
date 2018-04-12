# Using Packages

Another huge benefit of developing with Node is that it has the
largest and most active package ecosystem, [npm](http://npmjs.com).
With over **700,000 packages**, chances are someone's already
implemented the peices you need for your project! Let's write a
small utility that searches animated gifs and you'll see how it
feels like assembling the right parts. Just as before, feel
free to experiment and require other packages -- all 700,000
are already preinstalled in this tutorial.


```js runkit title=image-search.js path=%3Fkeywords%3Dgreat%2Bscott
const cheerio = require("cheerio");
const imageRender = require("image-render");
const got = require("got");
const app = require("express")();

app.get("/", async (req, res) =>
{
    const keywords = encodeURIComponent(req.query.keywords);
    const URL = `http://images.google.com/search?tbm=isch&q=${keywords}`;
    const HTML = (await got(URL)).body;
    const $ = cheerio.load(HTML);
    const src = $("#ires td a img").attr("src");

    res.send(imageRender(src));
});

app.listen(3000);
```
