const { unique } = require('../src/utils')

const assert = require('assert')

describe('Unique operator', () => {
  it('should return the collection if there are no repetitions', () => {
    assert.deepStrictEqual(unique([1,2,3]), [1,2,3])
  })

  it('should remove repetition', () => {
    assert.deepStrictEqual(unique([1,2,3,3]), [1,2,3])
  })

  it('should return empty collection fvor empty input', () => {
    assert.deepStrictEqual(unique([]), [])
  })

  it('should remove repetition by attribute', () => {
    const input = [{
      id: 345,
      name: "Janek",
      nationality: "PL"
    }, {
      name: "Hans",
      nationality: "DE"
    }, {
      name: "Krysia",
      nationality: "PL"
    }]

    const result = [{
      id: 345,
      name: "Janek",
      nationality: "PL"
    }, {
      name: "Hans",
      nationality: "DE"
    }]

    assert.deepStrictEqual(unique(input, 'nationality'), result)
  })
})
