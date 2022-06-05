const express = require('express')
const fs = require('fs')
const { nextTick } = require('process')

const router = express.Router({ strict: true })

router.get('/', (req, res, next) => {
    fs.readFile('content/index.html', (err, data) => {
        if (err) {
            next(err)
        } else {
            res.render('index', { title: 'Title', navTitle: 'Home', content: data })
            res.end()
        }
    })
})

module.exports = router