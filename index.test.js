const BinaryParser = require('./')

describe('test BinaryParser encoder function', () => {
  let format = []
  let data = {}

  it('should return a number and a buffer', () => {
    const bp = new BinaryParser()
    const { size, buffer } = bp.encode(data, format)

    expect(typeof size).toBe('number')
    expect(Buffer.isBuffer(buffer)).toBe(true)
  })

  it('should return the size of buffer and an encoded buffer', () => {
    format = [
      { tag: 'v0', type: 'int', len: 8 },
      { tag: 'v1', type: 'int', len: 8 },
      { tag: 'v2', type: 'int', len: 8 },
    ]
    data = {
      v0: 1,
      v1: 2,
      v2: 3,
    }

    const bp = new BinaryParser()
    const { size, buffer } = bp.encode(data, format)

    expect(size).toBe(3)
    expect(buffer.toString('hex')).toBe('010203')
  })
})
