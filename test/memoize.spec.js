const { memoize } = require('../src/utils')

const chai = require('chai')
chai.should()
const assert = chai.assert

const sinon = require('sinon')

describe('Memoize decorator', () => {
  it('should return the same result as the wrapped function', () => {
    const square = (n) => n**2
    const memoizedSquare = memoize(square)

    const rawResult = square(5)
    const memoizedResult = memoizedSquare(5)
    rawResult.should.equal(memoizedResult)
  })

  it('should call the wrapped function after memoized function was called', () => {
    const spy = sinon.spy()
    const memoizedSquare = memoize(spy)

    // one of following:
    spy.notCalled.should.be.true
    assert.equal(spy.notCalled, true)
    sinon.assert.notCalled(spy)

    const memoizedResult = memoizedSquare(5)

    // one of following:
    spy.called.should.be.true
    assert.equal(spy.called, true)
    sinon.assert.calledOnce(spy)
  })

})