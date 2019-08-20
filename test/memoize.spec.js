const { memoize } = require('../src/utils')

const chai = require('chai')
chai.should()
const assert = chai.assert

const sinon = require('sinon')

const { Calculator } = require('../src/calc')

describe('Memoize decorator', () => {
  it('should return the same result as the wrapped function', () => {
    const square = (n) => n**2
    const memoizedSquare = memoize(square)

    const rawResult = square(5)
    const memoizedResult = memoizedSquare(5)
    rawResult.should.equal(memoizedResult)
  })

  it('should call the wrapped function after memoized function was called', () => {
    // anonymous SPY
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

  it('should only call wrapped function once if called with the same parameters multiple times', () => {
    const square = (n) => n**2
    // spying existing function
    const spy = sinon.spy(square)
    const memoizedSquare = memoize(spy)

    sinon.assert.notCalled(spy)

    const result1 = memoizedSquare(5)
    const result2 = memoizedSquare(5)
    const result3 = memoizedSquare(5)

    sinon.assert.calledOnce(spy)
    sinon.assert.alwaysCalledWithExactly(spy, 5)

    result1.should.equal(25)
    result2.should.equal(25)
    result3.should.equal(25)
  })

  it('should memoize functions which operate on various number of parameters', () => {
    // spying method object
    const spy = sinon.spy(Calculator, 'add')
    const memoizedAdd = memoize(Calculator.add)

    sinon.assert.notCalled(spy)

    const result1 = memoizedAdd(1, 2)
    const result2 = memoizedAdd(4, 5)

    sinon.assert.calledTwice(spy)

    const result3 = memoizedAdd(4, 5)
    const result4 = memoizedAdd(4, 5)
    const result5 = memoizedAdd(1, 2)

    sinon.assert.callCount(spy, 2)
    result1.should.equal(3)
    result2.should.equal(9)
    result3.should.equal(9)
    result4.should.equal(9)
    result5.should.equal(3)
    sinon.assert.calledWith(spy, 1, 2)
    sinon.assert.calledWith(spy, 4, 5)

    // const concat = (arr1, arr2) => arr1.concat(arr2)
    // const memoizedConcat = memoize(concat)
    // const result6 = memoizedConcat([], [1, 2]) // -> [1,2]
    // const result7 = memoizedConcat([], [1, 2])

    // sinon.assert.threw(spy)
    // sinon.assert.threw(spy())

  })
})