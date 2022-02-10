const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const postcssFlexbugs = require('postcss-flexbugs-fixes');
const ESLintPlugin = require('eslint-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const RemovePlugin = require('remove-files-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// An object with paths to project directories
const pathDir = {
  src: path.join(__dirname, './src'),
  dist: path.join(__dirname, './dist'),
  base: path.join(__dirname, './src/base'),
  pages: path.join(__dirname, './src/pages'),
};
const allPages = fs.readdirSync(pathDir.pages);
const isDev = process.env.NODE_ENV === 'development';
const isDevServer = process.env.SECOND_ENV === 'devserver';
const isProd = !isDev;

// Setting whether to put a hash of the file when uploading to production
const setHash = false;

// Configuring the type of incoming html or pug file
const inputTypeFile = 'pug';

// We form the file name depending on the build mode
const getFileName = (ext) => {
  if (isProd && setHash) return `[name].[fullhash].min.${ext}`;
  if (isProd) return `[name].min.${ext}`;

  return `[name].${ext}`;
};

// Loaders
const setLoaders = (add) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: '../',
      },
    },
    {
      loader: 'css-loader',
    },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            postcssFlexbugs,
            [
              'postcss-preset-env',
              {
                autoprefixer: {
                  grid: true,
                },
              },
            ],
          ],
        },
      },
    },
    {
      loader: 'resolve-url-loader',
    },
  ];

  if (add) loaders.push(add);

  return loaders;
};

// Settings for babel
const setBabelOptions = (presets) => {
  const options = {
    presets: [
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'usage',
          corejs: { version: '3.8', proposals: true },
        },
      ],
    ],
  };

  if (presets) options.presets.push(presets);

  return options;
};

// Plugins
const setPlugins = () => {
  const optionsForRemovePlugin = [
    {
      folder: './plugin',
      method: () => true,
      recursive: true,
    },
  ];
  const basePlugins = [
    ...allPages.map((page) => new HTMLWebpackPlugin({
      filename: `${page}.html`,
      template: `${pathDir.pages}/${page}/${page}.${inputTypeFile}`,
      chunks: [`${page}`],
      minify: {
        collapseWhitespace: isProd,
      },
      inject: 'body',
      scriptLoading: 'blocking',
    })),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, `${pathDir.base}/assets/`),
          to: path.resolve(__dirname, 'dist/assets/'),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: `css/${getFileName('css')}`,
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new RemovePlugin({
      before: {
        test: optionsForRemovePlugin,
      },
      watch: {
        test: optionsForRemovePlugin,
      },
    }),
  ];

  if (isDev && !isDevServer) {
    basePlugins.push(new ESLintPlugin({ extensions: ['js', 'jsx', 'ts', 'tsx'] }));
  } else if (isProd) {
    basePlugins.push(
      new ImageMinimizerPlugin({
        minimizerOptions: {
          plugins: [
            ['gifsicle', { interlaced: true }],
            ['jpegtran', { progressive: true }],
            ['optipng', { optimizationLevel: 5 }],
            [
              'svgo',
              {
                plugins: [
                  {
                    removeViewBox: false,
                  },
                ],
              },
            ],
          ],
        },
      }),
      new FileManagerPlugin({
        events: {
          onEnd: [{
            move: [
              {
                source: path.join(__dirname, './dist/js/metaSlider.min.js'),
                destination: path.join(__dirname, './plugin/metaSlider.min.js'),
              },
              {
                source: path.join(__dirname, './dist/css/metaSlider.min.css'),
                destination: path.join(__dirname, './plugin/metaSlider.min.css'),
              },
            ],
          }],
        },
      }),
    );
  }

  return basePlugins;
};

// Optimization Parameters
const setOptimization = () => {
  const config = {};

  if (isProd) {
    config.minimize = true;
    config.minimizer = [new CssMinimizerPlugin(), new TerserWebpackPlugin()];
  } else if (isDev) {
    config.minimize = true;
    config.minimizer = [
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardDuplicates: true,
              normalizeWhitespace: false,
              cssDeclarationSorter: false,
              calc: false,
              colormin: false,
              convertValues: false,
              discardComments: false,
              discardEmpty: false,
              discardOverridden: false,
              mergeLonghand: false,
              mergeRules: false,
              minifyFontValues: false,
              minifyGradients: false,
              minifyParams: false,
              minifySelectors: false,
              normalizeCharset: false,
              normalizeDisplayValues: false,
              normalizePositions: false,
              normalizeRepeatStyle: false,
              normalizeString: false,
              normalizeTimingFunctions: false,
              normalizeUnicode: false,
              normalizeUrl: false,
              orderedValues: false,
              reduceInitial: false,
              reduceTransforms: false,
              svgo: false,
              uniqueSelectors: false,
            },
          ],
        },
      }),
    ];
  }

  return config;
};

// Defining input points
const getEntryPoints = () => {
  const entry = {};

  allPages.forEach((page) => {
    entry[`${page}`] = `./pages/${page}/${page}`;
  });

  return entry;
};

// Module with settings
module.exports = {
  context: path.resolve(__dirname, 'src'),
  stats: { children: false },
  mode: 'development',
  entry: getEntryPoints(),
  output: {
    filename: `js/${getFileName('js')}`,
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.json', '.css', '.scss', '.html', '.pug'],
    alias: {
      '@base': path.resolve(__dirname, 'src/base'),
      '@scss': path.resolve(__dirname, 'src/base/scss'),
      '@fonts': path.resolve(__dirname, 'src/base/fonts'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@comp': path.resolve(__dirname, 'src/components'),
    },
  },
  optimization: setOptimization(),
  devServer: {
    port: 4200,
    open: true,
  },
  target: (isDev === true) ? 'web' : 'browserslist',
  devtool: (isDev === true) ? 'source-map' : false,
  externals: { jquery: 'jQuery' },
  plugins: setPlugins(),
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: setBabelOptions('airbnb'),
        },
      },
      {
        test: /\.ts$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: setBabelOptions('@babel/preset-typescript'),
        },
      },
      {
        test: /\.jsx$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: setBabelOptions('@babel/preset-react'),
        },
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.pug$/i,
        loader: 'pug-loader',
        options: {
          pretty: isDev,
        },
      },
      {
        test: /\.css$/i,
        use: setLoaders(),
      },
      {
        test: /\.(sass|scss)$/i,
        use: setLoaders({
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          },
        }),
      },
      {
        test: /\.(?:ico|png|jpg|jpeg|svg|gif|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name][ext]',
        },
      },
      {
        test: /\.(?:json)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'json/[name][ext]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
        type: 'asset/resource',
        include: [path.resolve(__dirname, 'src/base/fonts')],
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
    ],
  },
};
