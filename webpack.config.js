var path = require("path");
module.exports = {
    entry: {
        app: ["./public/client.js"]
    },
    output: {
        path: path.resolve(__dirname, "public"),
        publicPath: "/public/",
        filename: "bundle.js"
    }
};