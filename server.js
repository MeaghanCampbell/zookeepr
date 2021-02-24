// these require statments read the index.js file in each of the directories
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

const fs = require('fs')
const path = require('path')
// create a route that the front end can request data from
const { animals } = require('./data/animals.json')
const express = require('express')
const PORT = process.env.PORT || 3001
//instantiate server so we can later chain methods to the express server
const app = express()

// parse incoming string or array data
app.use(express.urlencoded({ extended: true}))
// parse incoming JSON data
app.use(express.json())

//these tell the server that any time a client navigaves to <ourhost>/api, the app will use the router we set up in apiRoutes
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

// middleware to instruct server to access all front end code without having to create a specific endpoint for each resource
// shows css & images js etc, not just html 
app.use(express.static('public'))

// tell app to listen for requests - should always be last
// path ensures that we are finding correct location for HTML code we want displayed
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`)
})