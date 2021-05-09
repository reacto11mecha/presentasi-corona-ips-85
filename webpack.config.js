const path = require("path");
const glob = require("glob");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

const isProduction =
  process.argv[process.argv.indexOf("--mode") + 1] === "production";
const cssInjector = isProduction ? MiniCSSExtractPlugin.loader : "style-loader";

module.exports = {
  entry: {
    main: path.resolve(__dirname, "./src/js/script.js"),
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].bundle.js",
  },
  optimization: {
    minimize: isProduction,
    minimizer: isProduction && [new CssMinimizerPlugin(), new TerserPlugin()],
    splitChunks: {
      cacheGroups: {
        styles: {
          name: "styles",
          test: /\.css$/,
          chunks: "all",
          enforce: true,
        },
      },
      chunks: "all",
    },
  },
  module: {
    rules: [
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: "asset/resource",
        generator: {
          filename: "[name][ext]",
        },
        use: [
          isProduction && {
            loader: ImageMinimizerPlugin.loader,
            options: {
              minimizerOptions: {
                plugins: ["mozjpeg", "pngquant", "svgo"],
              },
            },
          },
        ],
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: "asset/inline",
      },
      {
        test: /\.css$/,
        use: [cssInjector, "css-loader"],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./src/index.html"),
      filename: "index.html",
    }),
    isProduction &&
      new MiniCSSExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css",
      }),
    isProduction &&
      new PurgecssPlugin({
        paths: glob.sync(`${path.resolve(__dirname, "./src")}/**/*`, {
          nodir: true,
        }),
        safelist: () => ({
          standard: [
            "webslides-zoomed",
            "text-slide-number",
            /^text-slide-/,
            "navigation",
            "zoom-layer",
            "wrap-zoom",
            "previous",
            "ws-ready",
            "disabled",
            "current",
            "counter",
            "next",
            "in",
          ],
        }),
      }),
  ],
};
