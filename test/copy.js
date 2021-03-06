/*global beforeEach,afterEach,describe,it*/
import copy from '../src/copy'
import { reset, check, expect, expectCount } from './helpers/chaiCounter'

beforeEach(reset)
afterEach(check)

describe('copy()', function () {
  it('should copy a value', function () {
    expectCount(3)

    const action = copy('state:from', 'state:to')

    action({
      state: {
        get (path) {
          expect(path).to.equal('from')
          return 'test'
        },
        set (path, value) {
          expect(path).to.equal('to')
          expect(value).to.equal('test')
        }
      }
    })
  })

  it('should copy a value with inline schemes', function () {
    expectCount(3)

    const action = copy('state:{{input:from}}', 'state:to')

    action({
      input: {
        from: 'from'
      },
      state: {
        get (path) {
          expect(path).to.equal('from')
          return 'test'
        },
        set (path, value) {
          expect(path).to.equal('to')
          expect(value).to.equal('test')
        }
      }
    })
  })

  it('should copy a nested value', function () {
    expectCount(3)

    const action = copy('state:parent.node', 'state:to')

    action({
      state: {
        get (path) {
          expect(path).to.equal('parent.node')
          return 'test'
        },
        set (path, value) {
          expect(path).to.equal('to')
          expect(value).to.equal('test')
        }
      }
    })
  })

  it('should add a value from state into the output', function () {
    expectCount(2)

    const action = copy('state:node', 'output:newNode')

    action({
      input: { node: 'test' },
      state: {
        get (path) {
          expect(path).to.equal('node')
          return '123'
        }
      },
      output (output) {
        expect(output).to.eql({ newNode: '123' })
      }
    })
  })

  it('should copy a nested value from state', function () {
    expectCount(2)

    const action = copy('state:parent.node', 'output:parent')

    action({
      input: {},
      state: {
        get (path) {
          expect(path).to.equal('parent.node')
          return {
            node: 'value'
          }
        }
      },
      output (output) {
        expect(output).to.eql({
          parent: {
            node: 'value'
          }
        })
      }
    })
  })
})
