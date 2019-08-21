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

const fetchGeoWithOffices = async () => {
  // SEQ - ok, but unnecessarily slow
  // const geo = await fetchGeo()
  // const offices = await fetchOffices()

  // ok, but requires to know promise API
  // const [ geo, offices ] = await Promise.all([ fetchGeo(), fetchOffices() ])
  
  // a/a
  const geoReq = fetchGeo()
  const officesReq = fetchOffices()
  // 2 pending promises
  const geo = await geoReq
  const offices = await officesReq

  const grouped = offices.reduce((acc, o) => {
    if (!acc[o.country]) {
      acc[o.country] = []
    }
    acc[o.country].push(o)
    return acc
  }, {})

  const result = Object.entries(geo)
    .reduce((acc, [code, country]) => {
      acc[code] = {
        country,
        offices: grouped[country]
      }
      return acc
    }, {})
  
  return result
}

module.exports = {
  baseURL,
  fetchGeo,
  fetchOffices,
  fetchGeoWithOffices,
}
