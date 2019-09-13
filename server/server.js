const express = require('express')
const pool = require('./modules/pool');
const http = require('http')
const socketIO = require('socket.io')
const bodyParser = require('body-parser');


const app = express()
//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// our localhost port
const port = 4001


// Post Route
app.post('/calculate', (req, res) => {
    console.log(req.body);
    const sqlText = `INSERT INTO history(num_one, num_two, operator)
        VALUES($1, $2, $3);`;
    const values = [req.body.numOne, req.body.numTwo, req.body.operator]
    pool.query(sqlText, values)
        .then(response => {
            res.sendStatus(200)
        })
        .catch(error => {
            console.log('error updating history', error);
        })
})
// our server instance
const server = http.createServer(app)

// This creates our socket using the instance of the server
const io = socketIO(server)

// This is what the socket.io syntax is like, we will work this later
io.on('connection', socket => {
  console.log('New client connected')
  
  // just like on the client side, we have a socket.on method that takes a callback function
  socket.on('get_history', () => {
      pool.query(`SELECT * FROM history
                    ORDER BY id DESC LIMIT 10;`)
        .then(response => {
            console.log(response.rows);
            io.sockets.emit('get_history', response.rows)
        })
      
    // once we get a 'change color' event from one of our clients, we will send it to the rest of the clients
    // we make use of the socket.emit method again with the argument given to use from the callback function above
  })
  
  // disconnect is fired when a client leaves the server
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

server.listen(process.env.PORT || port, () => console.log(`Listening on port ${port}`))