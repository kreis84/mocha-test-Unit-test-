const chalk = require('chalk')
const sinon = require('sinon')
const fetchMock = require('fetch-mock')
const flushPromises = require('flush-promises')

const chai = require('chai')
const assert = chai.assert
const expect = chai.expect
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

describe('Cache Promise', () => {
  // before(() => {
  // })

  after(() => {
    fetchMock.restore()
  })

  const expectToReject = (promiseFn) => {
    promiseFn()
      .then(() => { assert.fail("Promise should not resolve") })
      .catch(() => { assert.ok("Promise should fail and failed indeed") })
  }

  it('should make a new http call if previous call has already failed', async() => {
    const spy = sinon.spy(fetchGeo)
    const cachedFetchGeo = cachePromise(spy)

    // pierwszy http się kładzie
    fetchMock.get(`${baseURL}/geo`, {
      throws: new TypeError('Kontrolowana wyjebka')
    })

    // ACT:
    // const res1 = cachedFetchGeo()
    // expect(cachedFetchGeo).to.throw()

    // ASSERT:
    expectToReject(cachedFetchGeo)
    await flushPromises()
    sinon.assert.calledOnce(spy)

    fetchMock.restore()
    // // drugi http przechodzi
    fetchMock.get(`${baseURL}/geo`, {
      result: 123
    })

    // ACT:
    const res2 = await cachedFetchGeo()
    // ASSERT:
    sinon.assert.calledTwice(spy)
    assert.deepStrictEqual(res2, {
      result: 123
    })

    fetchMock.restore()
  })
})
