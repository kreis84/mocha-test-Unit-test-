const chai = require('chai')
const expect = chai.expect

describe('SINON', () => {
  it('sinon stub', () => {
    const sinon = require('sinon')
    const stub = sinon.stub()
    stub
      .onFirstCall().returns(42)
      .onSecondCall().returns(52)
      .returns(62)

      stub.resetHistory()

    expect(stub()).to.equal(42)
    expect(stub()).to.equal(52)
    expect(stub()).to.equal(62)
    expect(stub()).to.equal(62)
    expect(stub()).to.equal(62)
  })
})
