//Este archivo de configuración es literalmente un archivo de node, por lo que tenemos acceso a funciones como require

/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */

//Nombre de variable siempre debe ser nombre de plugin en CamelCase
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExctractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

/* Establecemos los loaders. Los loaders esencialmente "cargaran" los archivos especificados con el tipo de loader 
indicado en la regla. En este caso parece que el HtmlWebpackPlugin se ancla al html-loader, de tal forma que al leer 
los archivos html durante el bundling seran pasados al plugin, que simplemente los creara en el directorio dist */

const path = require('path');

/* -------------------------------------------------------------------------- */
/*                                  FUNCTIONS                                 */
/* -------------------------------------------------------------------------- */

function abpath(p) {
   return path.resolve(__dirname, p);
}

/* -------------------------------------------------------------------------- */
/*                          CONFIGURACION DE WEBPACK                          */
/* -------------------------------------------------------------------------- */

module.exports = {
   entry: './src/index.js', //el archivo de entrada. Relativo al proyecto 
   output: { //la salida del bundle
      filename: "app.js",
      path: abpath("dist") // la direccion ABSOLUTA de la carpeta de distribución
   },
   mode: "development",
   devtool: "none",
   watch: true,
   module: {
      rules: [ // Una lista de objetos. Las reglas en donde estableceremos en que casos se utilizará qué loader.
         {
            test: /\.html$/, // Una expresión regular que procesará nombres de archivos para aplicar plugin
            use: {
               loader: 'html-loader', // más loaders en https://webpack.js.org/loaders/
               options: { minimize: true }
            }
         },
         {
            test: /\.(jpg|png|gif|svg)$/, // Una expresión regular que procesará nombres de archivos para aplicar plugin
            use: {
               loader: 'file-loader', // más loaders en https://webpack.js.org/loaders/
            }
         },
         {
            test: /\.scss$/, // Una expresión regular que procesará nombres de archivos para aplicar plugin
            use: [
               'style-loader',
               'css-loader',
               'sass-loader'
            ]
         },
         {
            test: /\.css$/, // Una expresión regular que procesará nombres de archivos para aplicar plugin
            use: [
               'style-loader',
               'css-loader',
            ]
         },
      ],
   },
   plugins: []
};