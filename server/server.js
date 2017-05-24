import Express from 'express'
import compression from 'compression'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import path from 'path'

// Webpack Requirements
import webpack from 'webpack'
import config from '../webpack.config.dev'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

// Initialize the Express App
const app = new Express()

// Check env configuration
import serverConfig from './config'

// Run Webpack dev server in development mode
if (serverConfig.env === 'development') {
  const compiler = webpack(config)
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
  app.use(webpackHotMiddleware(compiler))
}

// React And Redux Setup
import { configureStore } from '../client/store'
import { Provider } from 'react-redux'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import Helmet from 'react-helmet'

// Import required modules
import routes from '../client/routes'
import { fetchComponentData } from './util/fetchData'
import posts from './routes/post.routes'
import dummyData from './dummyData'

// Set native promises as mongoose promise
mongoose.Promise = global.Promise

// MongoDB Connection
mongoose.connect(serverConfig.mongoURL, (error) => {
  if (error) {
    console.error('Please make sure Mongodb is installed and running!') // eslint-disable-line no-console
    throw error
  }

  // feed some dummy data in DB.
  dummyData()
})

// Apply body Parser and server public assets and routes
app.use(compression()
app.use(bodyParser.json({ limit: '20mb' }))
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }))
app.use(Express.static(path.resolve(__dirname, '../dist')))
///
app.use('/api', posts)

// Render Initial HTML
const renderFullPage = (html, initialState) => {
  const head = Helmet.rewind()

  // Import Manifests
  const assetsManifest = process.env.webpackAssets && JSON.parse(process.env.webpackAssets)
  const chunkManifest = process.env.webpackChunkAssets && JSON.parse(process.env.webpackChunkAssets)

  return `
    <!doctype html>
    <html>
      <head>
        ${head.base.toString()}
        ${head.title.toString()}
        ${head.meta.toString()}
        ${head.link.toString()}
        ${head.script.toString()}
        ${serverConfig.env === 'production' ? `<link rel='stylesheet' href='${assetsManifest['/app.css']}' />` : ''}
        ${serverConfig.env === 'production' ? `<link rel='shortcut icon' href='${assetsManifest['/favicon.ico']}' type="image/png" />` : '<link rel="shortcut icon" href="http://res.cloudinary.com/hashnode/image/upload/v1455629445/static_imgs/mern/mern-favicon-circle-fill.png" type="image/png" />'}

      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
          ${serverConfig.env === 'production'
          ? `//<![CDATA[
          window.webpackManifest = ${JSON.stringify(chunkManifest)};
          //]]>` : ''}
        </script>
        <script src='${serverConfig.env === 'production' ? assetsManifest['/vendor.js'] : '/vendor.js'}'></script>
        <script src='${serverConfig.env === 'production' ? assetsManifest['/app.js'] : '/app.js'}'></script>
      </body>
    </html>
  `
}

const renderError = err => {
  const softTab = '&#32;&#32;&#32;&#32;'
  const errTrace = serverConfig.env !== 'production'
  ? `:<br><br><pre style="color:red">${softTab}${err.stack.replace(/\n/g, `<br>${softTab}`)}</pre>` : ''
  return renderFullPage(`Server Error${errTrace}`, {})
}

// Server Side Rendering based on routes matched by React-router.
app.use((req, res, next) => {
  match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
    if (err) {
      return res.status(500).end(renderError(err))
    }

    if (redirectLocation) {
      return res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    }

    if (!renderProps) {
      return next()
    }

    const store = configureStore()

    return fetchComponentData(store, renderProps.components, renderProps.params)
      .then(() => {
        const initialView = renderToString(
          <Provider store={store}>
            <RouterContext {...renderProps} />
          </Provider>
        )
        const finalState = store.getState()

        res
          .set('Content-Type', 'text/html')
          .status(200)
          .end(renderFullPage(initialView, finalState))
      })
      .catch((error) => next(error))
  })
})

// start app
app.listen(serverConfig.port, (error) => {
  if (!error) {
    console.log('-'.repeat(60))
    console.log('\t== UW STF APP IS LIVE ==')
    console.log(`\tEnvironment: ${serverConfig.env}`)
    console.log(`\tMongoDB: ${serverConfig.mongoURL}`)
    console.log(`\tBack-End (API): ${serverConfig.api}`)
    console.log(`\tClient exposed on port ${serverConfig.port}`)
    console.log('-'.repeat(60))
  }
})

export default app
