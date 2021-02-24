const path = require('path');
const router = require('express').Router();

// '/' brings us to the route of the server, and connects index.html, middle ware up top connects css, js and images
// you can see this HTML by visiting http://localhost:3001 in browser
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  });
  
  // connects animals.html
  // note this route doesn't have api in it because it deals serving an HTML page not JSON
  // you can see this by visiting http://localhost:3001/animals because of the route we created
  router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/animals.html'))
  })
  
  // connects zookeepers.html
  router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
  });
  
  module.exports = router;