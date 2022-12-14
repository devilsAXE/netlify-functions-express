/* Express App */
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import compression from 'compression'
import customLogger from '../utils/logger'

/* My express App */
export default function expressApp(functionName) {
  const app = express()
  const router = express.Router()

  // gzip responses
  router.use(compression())

  // Set router base path for local dev
  const routerBasePath = process.env.NODE_ENV === 'dev' ? `/${functionName}` : `/.netlify/functions/${functionName}/`

  /* define routes */
  router.get('/', (req, res) => {
    const html = `
    <html>
      <head>
        <style>
          body {
            padding: 30px;
          }
        </style>
      </head>
      <body>
        <h1>Express via '${functionName}' ⊂◉‿◉つ</h1>
        <p>I'm using Express running via a <a href='https://www.netlify.com/docs/functions/' target='_blank'>Netlify Function</a>.</p>
        <p>Choose a route:</p>
        <div>
          <a href='/.netlify/functions/${functionName}/paymentGateway'>payment gateway /paymentGateway route</a>
        </div>
        <div>
          <a href='/.netlify/functions/${functionName}/hello'>View /hello route</a>
        </div>
        <br/>
        <br/>
        <div>
          <a href='/'>
            Go back to demo homepage
          </a>
        </div>
        <br/>
        <br/>
        <div>
          <a href='https://github.com/DavidWells/netlify-functions-express' target='_blank'>
            See the source code on github
          </a>
        </div>
      </body>
    </html>
  `
    res.send(html)
  })

  router.post('/paymentGateway', (req, res) => {
    console.log(req.body);
    res.status(200).json({ status: "STATUS_SUCCESS"});
  })
  //var request = require('request');
  //router.post('/message', function(req, res) {
  //  res.status(200);
  //})
  //var req = require('request');
  //endpoint for tracking
  var request = require('request');
  router.post('/message', (req, res) => {
    request.post({url: 'https://ef37-148-87-23-4.ngrok.io/listeners/apple/message', headers: req.headers, body: req.body}, 
                function(error, response, body){
                      console.log(body);
                      res.status(200).send(response);
     });
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send('Req OK');
});
  // Attach logger
  app.use(morgan(customLogger))

  // Setup routes
  app.use(routerBasePath, router)

  // Apply express middlewares
  router.use(cors())
  router.use(bodyParser.json())
  router.use(bodyParser.urlencoded({ extended: true }))

  return app
}
