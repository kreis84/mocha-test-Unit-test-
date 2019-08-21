const baseURL = 'http://localhost:3000'

// DON'T DO THIS:
// var fetch
// if(global){
//   fetch = require('node-fetch')
// }

const fetchGeo = () =>
  fetch(`${baseURL}/geo`)
    .then(res => res.json())

const fetchOffices = () =>
  fetch(`${baseURL}/offices`)
    .then(res => res.json())

module.exports = {
  fetchGeo,
  fetchOffices,
}
