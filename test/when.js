/*global beforeEach,afterEach,describe,it*/
import when from '../src/when'
import { reset, check, expect, expectCount } from './helpers/chaiCounter'
import { Controller } from 'cerebral-testable'

beforeEach(reset)
afterEach(check)

describe('when()', function () {
  let controller, signals

  beforeEach(function () {
    [controller, signals] = Controller({
      trueTest: true,
      falseTest: false,
      yesTest: 'yes'
    })

    controller.addSignals({
      whenTestTrue: {
        chain: [
          when('state:trueTest'), {
            true: [ () => { expect(true).to.be.ok } ],
            false: []
          }
        ],
        immediate: true
      },
      whenTestFalse: {
        chain: [
          when('state:falseTest'), {
            true: [],
            false: [ () => { expect(true).to.be.ok } ]
          }
        ],
        immediate: true
      },
      whenTestInputTrue: {
        chain: [
          when('input:test'), {
            true: [ () => { expect(true).to.be.ok } ],
            false: []
          }
        ],
        immediate: true
      },
      whenTestInputFalse: {
        chain: [
          when('input:test'), {
            true: [],
            false: [ () => { expect(true).to.be.ok } ]
          }
        ],
        immediate: true
      },
      whenTestCustomTrue: {
        chain: [
          when('state:trueTest', { yes: true, no: when.otherwise }), {
            yes: [ () => { expect(true).to.be.ok } ],
            no: []
          }
        ],
        immediate: true
      },
      whenTestCustomFalse: {
        chain: [
          when('state:falseTest', { yes: true, no: when.otherwise }), {
            yes: [],
            no: [ () => { expect(true).to.be.ok } ]
          }
        ],
        immediate: true
      },
      whenTestImplicitOtherwise: {
        chain: [
          when('state:falseTest', { yes: true }), {
            yes: [],
            otherwise: [ () => { expect(true).to.be.ok } ]
          }
        ],
        immediate: true
      }
    })
  })

  it('should call true when true', function () {
    expectCount(1)
    signals.whenTestTrue()
  })

  it('should call true when input is true', function () {
    expectCount(1)
    signals.whenTestInputTrue({
      test: true
    })
  })

  it('should call false when false', function () {
    expectCount(1)
    signals.whenTestFalse()
  })

  it('should call false when input is false', function () {
    signals.whenTestInputFalse({
      test: false
    })
  })

  it('should call customTrue when true', function () {
    expectCount(1)
    signals.whenTestCustomTrue()
  })

  it('should call customFalse when false', function () {
    expectCount(1)
    signals.whenTestCustomFalse()
  })

  it('should call implicitally add otherwise when not supplied', function () {
    expectCount(1)
    signals.whenTestImplicitOtherwise()
  })
})
