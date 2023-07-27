const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const postcssNormalize = require("postcss-normalize");
const TerserPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const PnpWebpackPlugin = require("pnp-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const PARAMS = require("./params");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');
const posthtml = require("posthtml");
const url = require("postcss-url")
const processHtmlLoader = require("./webpack_modules/processNestedHtml");


function generateHtmlPlugins(templateDir) {
  const templateFiles = glob.sync(templateDir);
  return templateFiles.map(file => {
    const filename = path.basename(file);
    const localChunk = filename.split('.');
    return new HtmlWebpackPlugin({
      filename: filename,
      template: file,
      chunks: ['vendors', localChunk[0], `${localChunk[0]}css`, `${localChunk[0]}js`],
      inject: 'body',
    })
  })
}

function generateJsEntries(templateDir, postfix = '') {
  const templateFiles = glob.sync(templateDir);
  if (templateFiles.length) {
    const mapEntry = templateFiles.map(file => {
      const filename = path.basename(file);
      const localChunk = filename.split('.');
      return [localChunk[0] + postfix, file]
    })
    return Object.fromEntries(mapEntry)
  }
  return {}
}

//
// function generateScssEntries(templateDir) {
//   const templateFiles = glob.sync(templateDir);
//   if (templateFiles) {
//     const mapEntry = templateFiles.map(file => {
//       const filename = path.basename(file);
//       const localChunk = filename.split('.');
//       return [`${localChunk[0]}Css`, file]
//     })
//     console.log('mapEntry', mapEntry)
//     return Object.fromEntries(mapEntry)
//   }
//   return {}
// }


const htmlPlugins = generateHtmlPlugins(`${PARAMS.htmlPath}*.html`)
const jsEntries = generateJsEntries(`${PARAMS.jsEntries}*.js`, 'js')
const htmlEntries = generateJsEntries(`${PARAMS.htmlPath}*.html`)
const scssEntries = generateJsEntries(`${PARAMS.cssEntries}*.scss`, 'css')
// const scssEntries = generateScssEntries(`${PARAMS.cssEntries}*.scss`)

console.log('htmlEntries', htmlEntries)
module.exports = function (webpackEnv, argv) {
  const isEnvDevelopment = argv && argv.mode && argv.mode === 'development';
  const isEnvProduction = argv && argv.mode && argv.mode === 'production';
  const isEnvProductionProfile = argv && Array.isArray(argv) && argv.includes('--profile')
  return {
    entry: {...jsEntries, ...htmlEntries, ...scssEntries},
    devtool: 'source-map',
    stats: {
      colors: true,
    },
    output: {
      path: path.resolve(__dirname, PARAMS.outputPath),
      publicPath: PARAMS.publicPath,
      filename: isEnvDevelopment ? "js/[name].js" : "js/[name].[contenthash:8].js",
      assetModuleFilename: '[name][ext]'
    },
    mode: isEnvDevelopment ? 'development' : 'production',
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          loader: "babel-loader",
          options: {presets: ["@babel/env"]},
        },
        {
          test: /\.(gif|png|jpe?g|bmp)$/i,
          type: 'asset',
          generator: {
            filename: isEnvDevelopment ? 'img/[name][ext]' : 'img/[name].[contenthash:8][ext]'
          },

        },
        {
          test: /\.(svg)$/i,
          type: 'asset',
          generator: {
            filename: isEnvDevelopment ? 'img/[name][ext]' : 'img/[name].[contenthash:8][ext]'
          },
          use: [
             'svgo-loader'
          ]
        },
        {
          test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          type: 'asset/resource',
          generator: {
            filename: isEnvDevelopment ? 'fonts/[name][ext]' : 'fonts/[name].[contenthash:8][ext]'
          }
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [

            isEnvDevelopment ?
              {
                loader: require.resolve('style-loader'),
                // options: {injectType: "singletonStyleTag"},
              }
              :
              {
                loader: MiniCssExtractPlugin.loader,
                // css is located in `static/css`, use '../../' to locate index.html folder
                // options: !isEnvDevelopment ? {publicPath: '../'} : {},
              },

            {
              loader: require.resolve('css-loader'),
              options: {
                url: true,
                import: true,
              },
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                // Necessary for external CSS imports to work
                // https://github.com/facebook/create-react-app/issues/2677

                postcssOptions: {
                  ident: 'postcss',
                  plugins: () => [

                    require('postcss-flexbugs-fixes'),
                    require('autoprefixer'),
                    require('postcss-preset-env')({
                      autoprefixer: {
                        flexbox: 'no-2009',
                      },
                      stage: 3,
                    }),
                    // Adds PostCSS Normalize as the reset css with default options,
                    // so that it honors browserslist config in package.json
                    // which in turn let's users customize the target behavior as per their needs.
                    postcssNormalize(),
                  ],
                },

              },
            },
            {
              loader: 'resolve-url-loader',
              options: {removeCR: true, sourceMap: true}
            },

            // according to the docs, sass-loader should be at the bottom, which
            // loads it first to avoid prefixes in your sourcemaps and other issues.
            {
              loader: require.resolve('sass-loader'),
              options: {
                sourceMap: true, // <-- !!IMPORTANT!!
              }
            }

          ],
        },
        // {
        //   test: /\.html$/,
        //   type: "asset/resource",
        //   generator: {
        //     filename: "[name][ext]",
        //   },
        // },
        // {
        //   test: /\.html$/,
        //   use: [
        //     // 'file-loader',
        //     // {
        //     //   loader: "extract-loader",
        //     //   options: {
        //     //     // dynamically return a relative publicPath based on how deep in directory structure the loaded file is in /src/ directory
        //     //     publicPath: (context) => {
        //     //       // console.log('context', context)
        //     //       return  '../'.repeat(path.relative(path.resolve('src'), context.context).split('/').length)
        //     //     },
        //     //   }
        //     // },
        //     // 'html-loader',
        //     // 'extract-loader',
        //     // {
        //     //   loader: "html-loader",
        //     //   options: {
        //     //     preprocessor: (content, loaderContext) => {
        //     //       let result;
        //     //
        //     //       try {
        //     //         result = posthtml().use(require('posthtml-include')()).process(content, { sync: true });
        //     //       } catch (error) {
        //     //         loaderContext.emitError(error);
        //     //
        //     //         return content;
        //     //       }
        //     //
        //     //       console.log('result', result);
        //     //       return result.html.toString();
        //     //     },
        //     //
        //     //     esModule: false,
        //     //     // sources: {
        //     //     //   list: [
        //     //     //     '...',
        //     //     //     {
        //     //     //       // Attribute name
        //     //     //       attribute: "src",
        //     //     //       // Type of processing, can be `src` or `scrset`
        //     //     //       type: "src",
        //     //     //       // Allow to filter some attributes (optional)
        //     //     //       filter: (tag, attribute, attributes, resourcePath) => {
        //     //     //         // The `tag` argument contains a name of the HTML tag.
        //     //     //         // The `attribute` argument contains a name of the HTML attribute.
        //     //     //         // The `attributes` argument contains all attributes of the tag.
        //     //     //         // The `resourcePath` argument contains a path to the loaded HTML file.
        //     //     //
        //     //     //         // choose all HTML tags except img tag
        //     //     //         return false;
        //     //     //       },
        //     //     //     },
        //     //     //   ],
        //     //     // },
        //     //   },
        //     // },
        //     {
        //       loader: 'posthtml-loader',
        //       options: {
        //         ident: 'posthtml',
        //         // parser: 'posthtml-parser',
        //         plugins: [
        //           require('posthtml-include')({
        //             root: './src/html',
        //             posthtmlExpressionsOptions: {locals: true}
        //           }),
        //           require('posthtml-extend')({
        //             encoding: 'utf8', // Parent template encoding (default: 'utf8')
        //             root: './src/html' // Path to parent template directory (default: './')
        //           })
        //         ]
        //       }
        //     },
        //   ]
        // },

        {
          test: /\.html$/i,
          use: [
            {
              loader: 'html-loader',
              options: {
                // esModule: false,
                // interpolate: true,
                // sources: false,
                // minimize: false,
                // esModule: false,
                preprocessor: processHtmlLoader,
                sources: {
                  list: [
                    // All default supported tags and attributes
                    "...",
                    {
                      tag: "img",
                      attribute: "data-src",
                      type: "src",
                    },
                    {
                      tag: "img",
                      attribute: "data-srcset",
                      type: "srcset",
                    },
                    {
                      // Tag name
                      tag: "link",
                      // Attribute name
                      attribute: "href",
                      // Type of processing, can be `src` or `scrset`
                      type: "src",
                      // Allow to filter some attributes
                      filter: (tag, attribute, attributes, resourcePath) => {
                        // The `tag` argument contains a name of the HTML tag.
                        // The `attribute` argument contains a name of the HTML attribute.
                        // The `attributes` argument contains all attributes of the tag.
                        // The `resourcePath` argument contains a path to the loaded HTML file.

                        if (/my-html\.html$/.test(resourcePath)) {
                          return false;
                        }

                        if (!/stylesheet/i.test(attributes.rel)) {
                          return false;
                        }

                        if (
                          attributes.type &&
                          attributes.type.trim().toLowerCase() !== "text/css"
                        ) {
                          return false;
                        }

                        return true;
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      ]
    },
    optimization: {
      minimize: isEnvProduction,
      minimizer: [
        //   // This is only used in production mode
        new TerserPlugin({
          terserOptions: {
            parse: {
              // We want terser to parse ecma 8 code. However, we don't want it
              // to apply any minification steps that turns valid ecma 5 code
              // into invalid ecma 5 code. This is why the 'compress' and 'output'
              // sections only apply transformations that are ecma 5 safe
              // https://github.com/facebook/create-react-app/pull/4234
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              // Disabled because of an issue with Uglify breaking seemingly valid code:
              // https://github.com/facebook/create-react-app/issues/2376
              // Pending further investigation:
              // https://github.com/mishoo/UglifyJS2/issues/2011
              comparisons: false,
              // Disabled because of an issue with Terser breaking valid code:
              // https://github.com/facebook/create-react-app/issues/5250
              // Pending further investigation:
              // https://github.com/terser-js/terser/issues/120
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            // Added for profiling in devtools
            keep_classnames: isEnvProductionProfile,
            keep_fnames: isEnvProductionProfile,
            output: {
              ecma: 5,
              comments: false,
              // Turned on because emoji and regex is not minified properly using default
              // https://github.com/facebook/create-react-app/issues/2488
              ascii_only: true,
            },
          },
        }),

        new ImageMinimizerPlugin({
          minimizer: {
            implementation: ImageMinimizerPlugin.imageminMinify,
            options: {
              plugins: [
                "imagemin-gifsicle",
                "imagemin-mozjpeg",
                "imagemin-pngquant",
                "imagemin-svgo",
              ],
            },
          },
          // Disable `loader`
          // loader: false,
        }),
        // This is only used in production mode
        new CssMinimizerPlugin({
          parallel: true,
          minimizerOptions: {
            preset: [
              "default",
              {
                discardComments: {removeAll: true},
              },
            ],
          },
          minify: [
            CssMinimizerPlugin.cssoMinify,
            CssMinimizerPlugin.cssnanoMinify,
            CssMinimizerPlugin.cleanCssMinify,
          ],
        }),
      ],
      // Automatically split vendor and commons
      // https://twitter.com/wSokra/status/969633336732905474
      // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
      splitChunks: {
        cacheGroups: {
          vendor: {
            name: 'vendors',
            test: /node_modules/,
            chunks: 'all',
            enforce: true
          }
        },
      },
      // // Keep the runtime chunk separated to enable long term caching
      // // https://twitter.com/wSokra/status/969679223278505985
      // // https://github.com/facebook/create-react-app/issues/5358
      runtimeChunk: {
        name: entrypoint => `runtime-${entrypoint.name}`,
      },
    },
    resolve: {
      plugins: [
        // Adds support for installing with Plug'n'Play, leading to faster installs and adding
        // guards against forgotten dependencies and such.
        PnpWebpackPlugin,
      ],
    },
    resolveLoader: {
      plugins: [
        // Also related to Plug'n'Play, but this time it tells webpack to load its loaders
        // from the current package.
        PnpWebpackPlugin.moduleLoader(module),
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/[name].[contenthash:8].css',
      }),
      new RemoveEmptyScriptsPlugin(),
      new CopyPlugin({
        patterns: [
          {
            from: "src/public/",
            to: 'public/'
          }
        ],
      }),
      new PreloadWebpackPlugin({
        rel: 'preload',
        include: 'all', // or 'initial'
        fileBlacklist: [/\.map/, /\.ttf/, /\.png/, /\.jpg/, /\.jpeg/]
      })
    ]
      .concat(htmlPlugins),
    devServer: {
      open: true,
      hot: true,
      compress: true,
      devMiddleware: {
        index: true, // specify to enable root proxying
        // writeToDisk: true,
      },
      client: {
        overlay: true,
        logging: 'warn',
      },
      static: {
        directory: path.join(__dirname, `${PARAMS.htmlPath}**/*.html`),
        // publicPath: PARAMS.publicPath,
        watch: true
      },
      magicHtml: true,
      historyApiFallback: true,

    },
  }
}
