const sinon = require('sinon')
const fetchMock = require('fetch-mock')

const chai = require('chai')
const assert = chai.assert
const { fetchGeo, baseURL } = require('../src/api')

const { cachePromise } = require('../src/utils')

describe('Cache Promise', () => {

  before(() => {
    fetchMock.get(`${baseURL}/geo`, {
      result: 123
    })
    // global.fetch = require('node-fetch')
  })

  after(() => {
    fetchMock.restore()
    // delete global.fetch
  })

  it('should return the same http promise when called more than once sequentially', async function(){
    // this.timeout(10000)
    const spy = sinon.spy(fetchGeo)
    const cachedFetchGeo = cachePromise(spy)

    const res1 = await cachedFetchGeo() // -> p1
    const res2 = await cachedFetchGeo() // -> p1
    const res3 = await cachedFetchGeo() // -> p1

    sinon.assert.calledOnce(spy)
    assert.deepStrictEqual(res1, res2)
    assert.deepStrictEqual(res1, res3)
  })

  it('should return the same http promise when called more than once concurrently', async function(){
    const spy = sinon.spy(fetchGeo)
    const cachedFetchGeo = cachePromise(spy)

    const [res1, res2, res3] = await Promise.all([
      cachedFetchGeo(),
      cachedFetchGeo(),
      cachedFetchGeo(),
    ])

    sinon.assert.calledOnce(spy)
    assert.deepStrictEqual(res1, res2)
    assert.deepStrictEqual(res1, res3)
  })
})
