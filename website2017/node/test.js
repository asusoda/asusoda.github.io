var babel = require("babel-core");
var fs = require("fs");

var options = {
    minified: true,
    comments: false,
    presets: ["es2015"],
    plugins: [
        "check-es2015-constants",
        "transform-es2015-block-scoping",
        "transform-react-jsx",
        "transform-object-rest-spread"
    ]
};

var result = babel.transformFileSync("react_js.js", options);

fs.writeFile("../files/file2.txt", result.code, function(err) {
    if(err) {
        console.log("i cri everi time");
        return console.log(err);
    }

    console.log("The file was saved!");
});