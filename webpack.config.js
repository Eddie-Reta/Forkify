

const path = require("path")

const HtmlWebpackPlugin = require("html-webpack-plugin")


module.exports = {
    
    entry: ["@babel/polyfill", "./src/js/index.js"],
    //where to save or bundle file
    output: {
     //path where it saving the bundle js file
        path: path.resolve(__dirname, "dist"),

        //the is creating a bundle js file
        filename: "js/bundle.js"
    },

    devServer: {
        //specify the folder weback should serve our files
        contentBase: "./dist"
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            //our starting html file 
            template: "./src/index.html"
        })
    ],
    module: {
        rules: [
          { 
              test: /\.js$/,
               exclude: /node_modules/, 
               loader: "babel-loader" }
        ]
      }
    // module: {
    //     rules: [
    //         {
    //             //test for all javascript files
    //             test: /\.js$/,
    //             // exclude thousand of files in node modules
    //             exclude: /node_modules/,
    //             //here it will apply babel to js scripts
    //             use:{ 
    //                 loader: "babel-loader"
    //             }
                
    //         }
    //     ]
    // }
    //development will make it as fast as it can without code compression 

}; 

