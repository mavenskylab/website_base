if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }
const express = require('express')
const https = require('https')
const fs = require('fs')
const path = require('path')

const http = express() // Used primarily for redicreting to https
const app = express()

// Get variables from dotenv, otherwise use defaults
const hostname = process.env.HOSTNAME || '127.0.0.1'
const port = process.env.PORT || 80

const https_options = {
    key: fs.readFileSync(`/etc/letsencrypt/live/${hostname}/privkey.pem`),
    cert: fs.readFileSync(`/etc/letsencrypt/live/${hostname}/fullchain.pem`)
}

const homeRouter = require('./routes')
const redirectRouter = require('./routes/redirect')

function logErrors(err, req, res, next) {
    console.error(err.stack)
    next(err)
}

function errorHandler(err, req, res, next) {
    res.status(500)
    fs.readFile('content/500/index.html', (err_, data) => {
        if (err_) {
            res.send('500 Internal Server Error')
        } else {
            res.render('index', { title: 'Error 500', navTitle: 'Error 500', content: data })
        }
    })
}

app.use(express.urlencoded({ extended: false }))
    .use('/', homeRouter)
    .use(express.static(path.join(__dirname, 'public'))) // Static pages/files
    .use('*', redirectRouter)
    .use(logErrors)
    .use(errorHandler)

app.set('view engine', 'ejs')
    .set('strict routing', true)


https.createServer(https_options, app).listen(port, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log(`Server running at https://${hostname}:${port}/`)
    }
})

// Redirect users to https
http.get('*', (req, res) => {
        res.redirect(301, 'https://' + req.headers.host + req.url)
    })
    .listen(80, (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log(`Redirecting http://${hostname}:80/ to https://${hostname}:${port}/`)
        }
    })