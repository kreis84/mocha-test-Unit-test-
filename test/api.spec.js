const chalk = require('chalk')
const fetchMock = require('fetch-mock')

// fetch is a javascript global (in the browser)
// axios is not
// fetch can be mocked using: global.fetch = MOCK
// axios cannot be
const axios = require('axios')
const MockAdapter = require('axios-mock-adapter')
const mock = new MockAdapter(axios)

const {
  fetchGeo, fetchOffices, fetchGeoWithOffices,
  axiosGeo, axiosOffices,
  baseURL,
} = require('../src/api')

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

  describe('fetch-mock HTTP calls', () => {
    before(() => {
      fetchMock.get(`${baseURL}/geo`, {
        PL: "Poland",
        CZ: "Czech",
        DE: "Germany",
      })

      fetchMock.get(`${baseURL}/offices`, {
        body: [
          { country: "Poland" },
          { country: "Czech" },
          { country: "Czech" },
          { country: "Poland" },
          { country: "Poland" },
          { country: "Germany" },
        ],
        // status: 200
        // throws: new TypeError('Dups.')
      })
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

  describe('axios-mock-adapter HTTP calls', () => {
    before(() => {
      mock.onGet(`${baseURL}/geo`).reply(200, {
        result: 123
      })
    })

    after(() => {
      mock.restore()
    })

    const httpCalledNTimes = (url, method, n, msg) => {
      const allCalls = mock.history[method]
      const calls = allCalls.filter(call => call.url.includes(url))
      const pass = calls.length === n
      if (!pass){
        if (!msg) {
          msg = `Expected ${n} calls to HTTP ${method.toUpperCase()} ${url}, got: ${calls.length}`
        }
        throw new Error(msg)
      }
    }

    it('should mock axios /geo call', async () => {
      const res = await axiosGeo()
      expect(res).to.deep.equal({ result: 123 })
      // called once:
      httpCalledNTimes(`${baseURL}/geo`, 'get', 1)
    })
  })
})
