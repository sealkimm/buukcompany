const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const postcssScss = require('postcss-scss');
const SitemapPlugin = require('sitemap-webpack-plugin').default;

const sitemap = [
  { path: '/', lastmod: new Date().toISOString(), priority: 1.0 },
  { path: '/sub/about', lastmod: new Date().toISOString(), priority: 0.8 },
  { path: '/sub/brands', lastmod: new Date().toISOString(), priority: 0.8 },
  { path: '/sub/franchise', lastmod: new Date().toISOString(), priority: 0.8 },
  { path: '/sub/contact', lastmod: new Date().toISOString(), priority: 0.8 },
  { path: '/sub/buukgan', lastmod: new Date().toISOString(), priority: 0.7 },
  { path: '/sub/buukchinese', lastmod: new Date().toISOString(), priority: 0.7 },
  { path: '/sub/cafedebuuk', lastmod: new Date().toISOString(), priority: 0.7 },
];

const pages = [
  { template: './src/pages/main.html', filename: 'index.html' },
  { template: './src/pages/about.html', filename: 'sub/about/index.html' },
  { template: './src/pages/brands.html', filename: 'sub/brands/index.html' },
  { template: './src/pages/franchise.html', filename: 'sub/franchise/index.html' },
  { template: './src/pages/contact.html', filename: 'sub/contact/index.html' },
  { template: './src/pages/buukgan.html', filename: 'sub/buukgan/index.html' },
  { template: './src/pages/buukchinese.html', filename: 'sub/buukchinese/index.html' },
  { template: './src/pages/cafedebuuk.html', filename: 'sub/cafedebuuk/index.html' },
];

const htmlPlugins = pages.map(
  (page) =>
    new HtmlWebpackPlugin({
      template: page.template,
      filename: page.filename,
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
      },
    })
);

module.exports = {
  // mode: 'development', //개발용
  mode: 'production', //배포용
  entry: './src/index.js',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    // publicPath: '/bktest/',
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
          {
            loader: 'nunjucks-html-loader',
            options: {
              searchPaths: ['./src/@inc'],
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|webp)$/,
        type: 'asset/resource',
        generator: {
          filename: (pathData) => {
            const filePath = pathData.filename.replace(/^src\//, '');
            return filePath;
          },
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },

  plugins: [
    ...htmlPlugins,
    new StylelintPlugin({
      files: './src/scss/**/*.scss',
      fix: true,
      customSyntax: postcssScss,
    }),
    new MiniCssExtractPlugin({
      // filename: 'styles.css',
      filename: 'styles.[contenthash].css',
    }),
    new SitemapPlugin({
      base: 'http://buukcompany.com',
      paths: sitemap.map((page) => ({
        path: page.path,
        lastmod: page.lastmod,
        priority: page.priority,
      })),
    }),
  ],
  optimization: {
    minimizer: [new CssMinimizerPlugin()],
  },
  devServer: {
    open: true,
    static: {
      directory: path.join(__dirname, 'dist'),
    },
  },
  devtool: false,
};
