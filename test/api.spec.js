const chalk = require('chalk')
const fetchMock = require('fetch-mock')

const { fetchGeo, fetchOffices, fetchGeoWithOffices, baseURL } = require('../src/api')

const chai = require('chai')
const expect = chai.expect
const assert = chai.assert

describe('API HTTP Requests', () => {
  before(() => {
    global.fetch = require('node-fetch')
  })

  after(() => {
    // global.fetch = undefined <- pozostawia atrybut
    delete global.fetch
  })

  it('should rerceive geo data from REST API @integration', async () => {
    const response = await fetchGeo()
    expect(typeof response).to.equal("object")
    const keys = Object.keys(response)
    const keysAreCountryCodes = keys
      .every(k => typeof k === 'string' && k.length === 2)
    expect(keysAreCountryCodes).to.be.true
  })

  it('should receive offices data from REST API @integration', async () => {
    const response = await fetchOffices()
    expect(response instanceof Array).to.be.true 
  })

  /**
  {
    US: {
      country: "United States of America",
      offices: [{off1}, { off2}]
    },
    ...
  }
   */

  describe('mocked HTTP calls', () => {
    before(() => {
      fetchMock.get(`${baseURL}/geo`, {
        PL: "Poland",
        CZ: "Czech",
        DE: "Germany",
      })

      fetchMock.get(`${baseURL}/offices`, [
        { country: "Poland" },
        { country: "Czech" },
        { country: "Czech" },
        { country: "Poland" },
        { country: "Poland" },
        { country: "Germany" },
      ])
    })

    after(() => {
      fetchMock.restore()
    })
     
    it('should merge geo and office data', async () => {
      const response = await fetchGeoWithOffices()
      expect(response).to.deep.equal({
        PL: {
          country: "Poland", offices: [
            { country: "Poland" },
            { country: "Poland" },
            { country: "Poland" }
          ]
        },
        CZ: {
          country: "Czech", offices: [
            { country: "Czech" },
            { country: "Czech" },
          ]
        },
        DE: {
          country: "Germany", offices: [
            { country: "Germany" },
          ]
        },
      })
      // expect(typeof response).to.equal("object")
      // expect(typeof response.PL).to.equal("object") 
      // expect(response.PL.country).to.equal("Poland")
      // expect(response.PL.offices.length).to.equal(3)
    })
     
   })
})
