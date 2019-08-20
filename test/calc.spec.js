const assert = require('assert')

const { Calculator } = require('../src/calc')

describe('Calculator', () => {

  it('should add numbers', () => {
    // assert.expectation(3)

    assert.equal(Calculator.add(2,2), 4)
    // assert.equal(Calculator.add(2,2), 5, "błędny wynik dodawania")
    // assert.equal(Calculator.add(2,2), 6, "błędny wynik dodawania")

    // if (2 !== 3) {
    //   throw new Error('2 not equal to 3')
    // }
  })

})
