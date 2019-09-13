const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const http = require('http').createServer(router);
const io = require('socket.io')(http);

/**
 * GET route template
 */
io.on('connection', socket => {
    console.log('a user connected')
})



/**
 * POST route template
 */
router.post('/', (req, res) => {

});

module.exports = router;