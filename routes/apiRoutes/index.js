//this file is a central hub for all routing functions we want in our application

const router = require('express').Router();
const animalRoutes = require('../apiRoutes/animalRoutes')

router.use(require('./zookeeperRoutes'));

router.use(animalRoutes)

module.exports = router