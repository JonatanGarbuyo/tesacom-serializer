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

    expect(buffer.toString('hex')).toBe('010203')
    expect(size).toBe(3)
  })

  it('should return the size of buffer and an encoded buffer from diferents size of data', () => {
    format = [
      { tag: 'PTemp', type: 'int', len: 12 },
      { tag: 'BattVolt.value', type: 'int', len: 12 },
      { tag: 'WaterLevel', type: 'int', len: 8 },
    ]
    data = { PTemp: 268, 'BattVolt.value': 224, WaterLevel: 115 }

    const bp = new BinaryParser()
    const { size, buffer } = bp.encode(data, format)

    expect(buffer.toString('hex')).toBe('010c00e073')
    expect(size).toBe(5)
  })

  it('should return the size of buffer and an encoded buffer from diferents type of data', () => {
    format = [
      { tag: 'PTemp', type: 'int', len: 12 },
      { tag: 'BattVolt.value', type: 'uint', len: 12 },
      { tag: 'WaterLevel', type: 'int', len: 8 },
    ]
    data = { PTemp: 268, 'BattVolt.value': 224, WaterLevel: 115 }

    const bp = new BinaryParser()
    const { size, buffer } = bp.encode(data, format)

    expect(buffer.toString('hex')).toBe('010c00e073')
    expect(size).toBe(5)
  })
})

describe('test BinaryParser decoder function', () => {
  let format = []
  let buffer = Buffer.from('0x0', 'hex')

  it('should return a data object', () => {
    const bp = new BinaryParser()
    const _object = bp.decode(buffer, format)

    expect(typeof _object).toBe('object')
  })

  it('should return an object with passed format', () => {
    format = [
      { tag: 'v0', type: 'int', len: 8 },
      { tag: 'v1', type: 'int', len: 8 },
      { tag: 'v2', type: 'int', len: 8 },
    ]
    data = Buffer.from('010203', 'hex')
    const expectedData = {
      v0: 1,
      v1: 2,
      v2: 3,
    }

    const bp = new BinaryParser()
    const _object = bp.decode(data, format)

    expect(_object).toEqual(expectedData)
  })

  it('should return an object with passed format with diferents size of data', () => {
    format = [
      { tag: 'PTemp', type: 'int', len: 12 },
      { tag: 'BattVolt.value', type: 'int', len: 12 },
      { tag: 'WaterLevel', type: 'int', len: 8 },
    ]
    data = Buffer.from('10C0E073', 'hex')
    const expectedData = { PTemp: 268, 'BattVolt.value': 224, WaterLevel: 115 }

    const bp = new BinaryParser()
    const _object = bp.decode(data, format)

    expect(_object).toEqual(expectedData)
  })
})
