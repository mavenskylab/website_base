const express = require('express')
const fs = require('fs')

const router = express.Router({ strict: true })

router.get('*', (req, res, next) => {
    if (!req.url.endsWith('/')) {
        res.redirect(301, req.url + '/')
    } else {
        fs.readFile('content/404/index.html', (err, data) => {
            if (err) {
                next(err)
            } else {
                res.status(404)
                    .render('index', { title: '404 Page not found', navTitle: '404 Page not found', content: data })
                res.end()
            }
        })
    }
})

module.exports = router