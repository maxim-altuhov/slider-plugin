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
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// объект с путями к директориям проекта
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

// настройка ставить ли хеш файлу при выгрузки в продакшен
const setHash = false;

// настройка типа входящего файла html или pug
const inputTypeFile = 'pug';

// формируем имя файла в зависимости от режима сборки
const filename = (ext) => ((isProd && setHash) ? `[name].[fullhash].${ext}` : `[name].${ext}`);

// лоадеры
const cssLoaders = (add) => {
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

  if (add) {
    loaders.push(add);
  }

  return loaders;
};

// настройки для babel
const babelOptions = (presets) => {
  const option = {
    presets: [
      ['@babel/preset-env', {
        useBuiltIns: 'usage',
        corejs: 3,
      }],
    ],
  };

  if (presets) {
    option.presets.push(presets);
  }

  return option;
};

// плагины
const plugins = () => {
  const base = [
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
      patterns: [{
        from: path.resolve(__dirname, `${pathDir.base}/assets/`),
        to: path.resolve(__dirname, 'dist/assets/'),
      }],
    }),
    new MiniCssExtractPlugin({
      filename: `css/${filename('css')}`,
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
  ];

  if (isDev && !isDevServer) {
    base.push(new ESLintPlugin());
  } else if (isProd) {
    base.push(new ImageMinimizerPlugin({
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
    }));
  }

  return base;
};

// параметры оптимизации
const optimization = () => {
  const config = {
    splitChunks: {
      // chunks: 'all',
    },
  };

  if (isProd) {
    config.minimize = true;
    config.minimizer = [new CssMinimizerPlugin(), new TerserWebpackPlugin()];
  } else if (isDev) {
    config.minimize = true;
    config.minimizer = [new CssMinimizerPlugin({
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
    })];
  }

  return config;
};

// определение входных точек
const entryPoint = () => {
  const obj = {};

  allPages.forEach((page) => {
    obj[`${page}`] = `./pages/${page}/${page}`;
  });

  return obj;
};

// модуль с настройками
module.exports = {
  context: path.resolve(__dirname, 'src'),
  stats: {
    children: false,
  },
  mode: 'development',
  entry: entryPoint(),
  output: {
    filename: `js/${filename('js')}`,
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.json', '.css', '.scss', '.html', '.pug'],
    alias: {
      '@base': path.resolve(__dirname, 'src/base'),
      '@scss': path.resolve(__dirname, 'src/base/scss'),
      '@fonts': path.resolve(__dirname, 'src/base/fonts'),
      '@pages': path.resolve(__dirname, 'src/pages'),
    },
  },
  optimization: optimization(),
  devServer: {
    port: 4200,
    open: true,
  },
  target: isDev === true ? 'web' : 'browserslist',
  devtool: isDev === true ? 'source-map' : false,
  plugins: plugins(),
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelOptions(),
        },
      },
      {
        test: /\.ts$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-typescript'),
        },
      },
      {
        test: /\.jsx$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-react'),
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
        use: cssLoaders(),
      },
      {
        test: /\.(sass|scss)$/i,
        use: cssLoaders({
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
        include: [
          path.resolve(__dirname, 'src/base/fonts'),
        ],
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
    ],
  },
};
