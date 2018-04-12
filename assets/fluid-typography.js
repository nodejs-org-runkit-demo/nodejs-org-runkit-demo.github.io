var dataset = (document.currentScript || (function (scripts)
{
    return scripts[scripts.length - 1];
})(document.getElementsByTagName("script"))).dataset;

var classes = (dataset.classes || "").split(/\s*,\s*/);
var html = document.documentElement;
var fontStyleRatios = { };

var ArrayMap = Array.prototype.map;
var ArrayReduce = Array.prototype.reduce;
var ArraySlice = Array.prototype.slice;
var hasOwnProperty = Object.prototype.hasOwnProperty;

document.write("<style>" + classes.map(getClassRules).join("\n") + "</style>");

function getClassRules(aClass)
{
    var fontSizeStopRegExp = new RegExp("^." + aClass + "-font-size-stop-(\\d+)(px|cpl)-(\\d+)px$");

    return ArraySlice.call(document.styleSheets)
        .map(function (sheet)
        {
            try { return sheet.rules || sheet.cssRules; }
            catch (anException) { return []; }
        })
        .reduce(function (fontSizeStops, rules)
        {
            return ArraySlice.call(rules)
                .reduce (function (fontSizeStops, rule)
                {
                    if (!rule.selectorText)
                        return fontSizeStops;
    
                    var match = rule.selectorText.match(fontSizeStopRegExp);

                    if (match)
                        fontSizeStops.push([
                            parseInt(match[1], 10),
                            match[2],
                            parseInt(match[3], 10)]);

                    return fontSizeStops;
                }, fontSizeStops);
        }, [])
        .sort(function (lhs, rhs) { return lhs[2] - rhs[2] })
        .map(function (fontSizeStop)
        {
            var width = fontSizeStop[2];
            var fontSize = fontSizeStop[0];
            var units = fontSizeStop[1];
    
            if (units === "px")
                return { width: width, fontSize: fontSize };
    
            var averageWordLength = 5.1;
            var calculatedFontSize = (width / (fontSize - (fontSize / averageWordLength))) * getFontStyleRatio(aClass);
    
            return { width: width, fontSize: calculatedFontSize };
        })
        .reduce(function (accum, fontSizeStop)
        {
            var appended = accum[0] + (accum[1] ?
                "\n" + fontSizeStyle(aClass, accum[1], fontSizeStop) :
                mediaQuery(aClass, fontSizeStop));
            
            return [appended, fontSizeStop];
        }, ["", null])[0];
}

function getFontStyleRatio(aClass)
{
    if (fontStyleRatios[aClass])
        return fontStyleRatios[aClass];

    var sizer = document.createElement("span");

    sizer.setAttribute("class", aClass);
    sizer.style.display = "inline-block";
    sizer.style.padding = "0";
    sizer.style.margin = "0";
    sizer.style.height = "1em";

    sizer.innerText = "eeeeeeeeee";

    html.appendChild(sizer);

    var width = sizer.clientWidth / 10;
    var height = sizer.clientHeight;

    html.removeChild(sizer);

    return fontStyleRatios[aClass] = height / width;
}

function fontSizeStyle(name, from, to)
{
    var xrange = to.width - from.width;
    var yrange = to.fontSize - from.fontSize;

    var sizes = [ { width: from.width, fontSize: from.fontSize }];

    for (var width = from.width; width <= to.width; ++width)
    {
        var scale = (width - from.width) / xrange;
        var value = from.fontSize + yrange * scale;
        var count = sizes.length;

        if (Math.abs(sizes[count - 1].fontSize - value) < 0.2)
            continue;

        sizes.push({ width: width, fontSize: value });
    }

    return sizes.map(function (size) { return mediaQuery(name, size) }).join("\n");
}

function mediaQuery(name, fontSizeQuery)
{
    return  "@media (min-width: " + fontSizeQuery.width + "px) { " +
            "." + name + " { font-size: " + fontSizeQuery.fontSize + "px; } }";
}

