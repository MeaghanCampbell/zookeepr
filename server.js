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
// middleware to instruct server to access all front end code without having to create a specific endpoint for each resource
// shows css & images js etc, not just html 
app.use(express.static('public'))

function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
      // Save personalityTraits as a dedicated array.
      // If personalityTraits is a string, place it into a new array and save.
      if (typeof query.personalityTraits === 'string') {
        personalityTraitsArray = [query.personalityTraits];
      } else {
        personalityTraitsArray = query.personalityTraits;
      }
      // Loop through each trait in the personalityTraits array:
      personalityTraitsArray.forEach(trait => {
        // Check the trait against each animal in the filteredResults array.
        filteredResults = filteredResults.filter(
          animal => animal.personalityTraits.indexOf(trait) !== -1
        );
      });
    }
    if (query.diet) {
      filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
      filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
      filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    // return the filtered results:
    return filteredResults;
}

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

function createNewAnimal(body, animalsArray) {
  const animal = body;
  animalsArray.push(animal);
  fs.writeFileSync(
    path.join(__dirname, './data/animals.json'),
    // save js array as json and keep it formatted
    // null means not editing existing data
    // 2 means we want to create white space between our values to make it readable
    JSON.stringify({ animals: animalsArray }, null, 2)
  );
  return animal;
}

function validateAnimal(animal) {
  if (!animal.name || typeof animal.name !== 'string') {
    return false;
  }
  if (!animal.species || typeof animal.species !== 'string') {
    return false;
  }
  if (!animal.diet || typeof animal.diet !== 'string') {
    return false;
  }
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  return true;
}

// get data from server
app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
      results = filterByQuery(req.query, results);
    }
    res.json(results);
});

// new get route using param instead of querys
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
      res.json(result);
    } else {
      res.send(404);
    }
  });

// route that accepts data from user
app.post('/api/animals', (req, res) => {
  // set id based on what the next index of the array will be
  req.body.id = animals.length.toString();

  // if any data in req.body is incorrect, send 400 error back
  if (!validateAnimal(req.body)) {
    res.status(400).send('The animal is not properly formatted.');
  } else {
    const animal = createNewAnimal(req.body, animals);
    res.json(animal);
  }
});

// '/' brings us to the route of the server, and connects index.html, middle ware up top connects css, js and images
// you can see this HTML by visiting http://localhost:3001 in browser
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

// connects animals.html
// note this route doesn't have api in it because it deals serving an HTML page not JSON
// you can see this by visiting http://localhost:3001/animals because of the route we created
app.get('/animals', (req, res) => {
  res.sendFile(path.join(__dirname, './public/animals.html'))
})

// connects zookeepers.html
app.get('/zookeepers', (req, res) => {
  res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

// tell app to listen for requests - should always be last
// path ensures that we are finding correct location for HTML code we want displayed
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`)
})