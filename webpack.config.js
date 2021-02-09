const fs = require('fs');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PAGES_DIR = './src/';
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'));

module.exports = (env, argv) => ({
  mode: argv.mode,
  devtool: argv.mode === 'development' ? 'source-map' : false,
  entry: [
    './src/js/bundle.js',
    './src/sass/style.sass',
  ],
  output: {
    path: path.resolve(__dirname, './build/'),
    filename: 'js/bundle.js',
  },
  optimization: {
    minimizer: [
      new TerserPlugin(),
      new OptimizeCSSAssetsPlugin(),
      new CopyWebpackPlugin({
        patterns: [{
          from: 'src/img/*',
          to: 'img/[name].[ext]',
        }, {
          from: 'src/fonts/*',
          to: 'fonts/[name].[ext]',
        }, {
          from: 'src/favicon.ico',
          to: '[name].[ext]',
        }],
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      }, {
        test: /\.pug$/,
        loader: 'pug-loader',
        query: { pretty: true },
      }, {
        test: /\.s(a|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          }, {
            loader: 'css-loader',
            options: {
              url: false,
              sourceMap: argv.mode === 'development' ? true : false,
            },
          }, {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  ['autoprefixer'],
                  ['css-mqpacker'],
                ],
              },
            },
          }, {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
            },
          },
        ],
      }, {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              extract: true,
              spriteFilename: './img/sprite.svg',
            },
          },
          {
            loader: 'svgo-loader',
            options: {
              plugins: [
                { cleanupAttrs: true },
                { removeEmptyAttrs: true },
                { removeTitle: true },
                { removeDesc: true },
                { removeUselessDefs: true },
                { removeEmptyContainers: true },
                { collapseGroups: true },
                { removeEditorsNSData: true },
                { removeOffCanvasPaths: true },
                { removeDimensions: true },
                { reusePaths: true },
              ],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/style.css',
    }),
    new SpriteLoaderPlugin({
      plainSprite: true,
    }),
    ...PAGES.map(page => new HtmlWebpackPlugin({
      template: './src/' + page,
      filename: page.replace(/\.pug/, '.html'),
      inject: false,
      minify: false,
    })),
  ],
  devServer: {
    contentBase: [
      path.join(__dirname, '/src'),
    ],
    watchContentBase: true,
    compress: true,
    port: 9000,
    open: true,
    clientLogLevel: 'silent',
  },
});