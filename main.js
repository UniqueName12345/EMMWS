const mmwsRuleRegex            = /^[^ \n][^\n]*(?:\n {4}[^\n]*)(?:\n {4}[^\n]*|\n *)*/gm;
const mmwsStatementRegex            = /^[^ \n][^\n]*$(?!\n {4})/gm;
const mmwsNameTokenRegex       = /(?::|#|\.|==?)[a-zA-Z\-_]+|(?:\+|>>?)|!\(|\)|"[^"]*"| +/gm;
const mmwsReplacements         = [
    [/(?<!"(?:\\"|[^"])+) +| +(?=[^"]*$)/g, ""], // whitespace
    [/:([a-zA-Z\-_]+)/g, "$1"], // colons
    [/#([a-zA-Z\-_]+)/g, "#$1"], // ids
    [/\.([a-zA-Z\-_]+)/g, ".$1"], // classes
    [/=([a-zA-Z\-_]+)("(?:\\"|[^"]+)*")/g, "[$1=$2]"], // eq
    [/==([a-zA-Z\-_]+)/g, "[$1]"], // eqeq
    [/!\((.*?)\)/g, ":not($1)"], // not
    [/(.*)\+(.*)/, "$1$2"], // plus
    [/(.*)>(.*)/, "$1>$2"], // single gt
    [/(.*)>>(.*)/, "$1 $2"], // double gt
];
const mmwsRuleComponent        = /(?<!"(?:\\"|[^"])+);|;(?=[^"]*$)/g;
const mmwsRuleSubComponent     = /(?<!"(?:\\"|[^"])+) +| +(?=[^"]*$)/g;
const mmwsVariableRegex        = /\$([a-zA-Z\-_]*) +(.*)/g;
const mmwsError                = console.warn;


function mmwsToCss(code) {
    let cssKey, cssObj, i, important,
        key, match, order, propName, rep,
        resultCSS, rule, rules, rulesObj,
        statements, subc, varbl, vars;

    if (typeof code !== "string") {return;}

    // Get important parts from the code
    rules = [...code.matchAll(mmwsRuleRegex)]
        .map(r => r.toString().trim().split("\n")
            .map(s => s.trim()));
    statements = [...code.matchAll(mmwsStatementRegex)]
        .map(r => r.toString());

    // Create basic results
    rulesObj = {};
    for (rule of rules) {
        rulesObj[rule[0]] = rule.splice(1);
    }

    // Convert to CSS syntax
    cssObj = {};
    order = [];
    for (key of Object.keys(rulesObj)) {
        cssKey = key;
        for (rep of mmwsReplacements) {
            cssKey = cssKey.replace(rep[0], rep[1]);
        }
        if (cssKey === "html") {
            cssKey = ":root";
        }
        order.push(cssKey);
        cssObj[cssKey] = [];
        for (rule of rulesObj[key]) {
            rule = rule.split(mmwsRuleComponent)
                .map(s => s.trim().split(mmwsRuleSubComponent).map(s => s.trim()));
            i = 0;
            important = false;
            for (subc of rule) {
                i++;
                if (i === 1) {
                    if (subc[0][0] === "!") {
                        important = true;
                        subc[0] = subc[0].slice(1);
                    }
                    propName = subc[0];
                    subc = subc.splice(1);
                    subc = subc.map(s => s.replace(/\$([a-zA-Z\-_]+)/, "var(--$1)"));

                    cssObj[cssKey].push(`${propName}:${subc.join(" ")}${important ? "!important" : ""};`);
                } else {
                    if (!order.includes(`${cssKey}:${subc[0]}`)) {
                        cssObj[`${cssKey}:${subc[0]}`] = [];
                        order.push(`${cssKey}:${subc[0]}`)
                    }
                    cssObj[`${cssKey}:${subc[0]}`].push(`${propName}:${subc.splice(1).join(" ")}${important ? "!important" : ""};`);
                }
            }
        }
    }

    // Add the statements to CSS
    if (statements.some(s => s.startsWith("$"))) {
        if (!order.includes(":root")) {
            order = [":root", ...order];
            cssObj[":root"] = [];
        }
        vars = statements.filter(s => s.match(mmwsVariableRegex));
        console.log(vars);
        vars = vars.map(v => v.replace(mmwsVariableRegex, "--$1: $2;"));
        cssObj[":root"].push(...vars);
    }
    

    // Convert to CSS
        resultCSS = "";
        for (key of order) {
            resultCSS += `${key}{${cssObj[key].join("")}}`;
        }

    console.log(resultCSS);

    return resultCSS
}


async function mmwsConvertTagsToCSS() {
    let element, fileName, response, css, styleEl;

    for (element of document.querySelectorAll("mmws")) {
        fileName = element.getAttribute("src")
        if (fileName === null) {
            mmwsError("No file name was given on <mmws> tag.");
        } else {
            response = await fetch(fileName);
            if (response.status === 404) {
                mmwsError(`${fileName} does not exist.`);
            } else {
                css = mmwsToCss(await response.text());
                if (css !== null) {
                    styleEl = document.createElement("style");
                    styleEl.classList.add("-mmws-converted");
                    styleEl.id = `--mmws-from-${fileName.replace(/[^A-Z0-9-]/ig, "-")}`;
                    styleEl.innerHTML = css;
                    document.head.appendChild(styleEl);
                }
            }
        }
        element.remove();
    }
}


mmwsConvertTagsToCSS();
