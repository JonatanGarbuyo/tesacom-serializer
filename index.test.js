const BinaryParser = require('./')

describe('test BinaryParser encoder function', () => {
  let format = []
  let data = {}
  const bp = new BinaryParser()

  it('should throw an error on empty format', () => {
    expect(() => bp.encode(data, format)).toThrow()
  })

  it('should throw an error on wrong data type', () => {
    format = [{ tag: 'v0', type: 'int', len: 8 }]
    expect(() => bp.encode((data = ''), format)).toThrow()
  })

  it('should throw an error on mismatching data/format', () => {
    format = [{ tag: 'v0', type: 'int', len: 8 }]
    expect(() => bp.encode(data, format)).toThrow()
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

    const { size, buffer } = bp.encode(data, format)

    expect(typeof size).toBe('number')
    expect(size).toBe(24)
    expect(Buffer.isBuffer(buffer)).toBe(true)
    expect(buffer.toString('hex')).toBe('010203')
  })

  it('should return the size of buffer and an encoded buffer from diferents size of data', () => {
    format = [
      { tag: 'PTemp', type: 'int', len: 12 },
      { tag: 'BattVolt.value', type: 'int', len: 12 },
      { tag: 'WaterLevel', type: 'int', len: 8 },
    ]
    data = { PTemp: 268, 'BattVolt.value': 224, WaterLevel: 115 }

    const { size, buffer } = bp.encode(data, format)

    expect(buffer.toString('hex')).toBe('10c0e073')
    expect(size).toBe(32)
  })

  it('should return the size of buffer and an encoded buffer from diferents type of data', () => {
    format = [
      { tag: 'PTemp', type: 'int', len: 12 },
      { tag: 'BattVolt.value', type: 'uint', len: 12 },
      { tag: 'WaterLevel', type: 'int', len: 8 },
    ]
    data = { PTemp: 268, 'BattVolt.value': 224, WaterLevel: 115 }

    const { size, buffer } = bp.encode(data, format)

    expect(buffer.toString('hex')).toBe('10c0e073')
    expect(size).toBe(32)
  })

  it('should return the size of buffer and an encoded buffer of integers and floats', () => {
    format = [
      { tag: 'var2.value', type: 'uint', len: 11 },
      { tag: 'var3.value', type: 'int', len: 10 },
      { tag: 'var6.value', type: 'float' },
    ]
    data = {
      'var2.value': 5,
      'var3.value': 11,
      'var6.value': 263.3,
    }
    const { size, buffer } = bp.encode(data, format)

    expect(buffer.toString('hex')).toBe('00a05a1c1d3306')
    expect(size).toBe(53)
  })
})

describe('test BinaryParser decoder function', () => {
  let format = []
  let buffer = Buffer.from('0x0', 'hex')
  const bp = new BinaryParser()

  it('should throw an error on empty format', () => {
    expect(() => bp.decode(buffer, format)).toThrow()
  })

  it('should throw an error on wrong buffer type', () => {
    format = [{ tag: 'v0', type: 'int', len: 8 }]
    expect(() => bp.decode((buffer = ''), format)).toThrow()
  })

  it('should return an object with passed format', () => {
    format = [
      { tag: 'v0', type: 'int', len: 8 },
      { tag: 'v1', type: 'int', len: 8 },
      { tag: 'v2', type: 'int', len: 8 },
    ]
    buffer = Buffer.from('010203', 'hex')
    const expectedData = {
      v0: 1,
      v1: 2,
      v2: 3,
    }

    const _object = bp.decode(buffer, format)
    expect(_object).toEqual(expectedData)
  })

  it('should return an object with passed format with diferents size of data', () => {
    format = [
      { tag: 'PTemp', type: 'int', len: 12 },
      { tag: 'BattVolt.value', type: 'int', len: 12 },
      { tag: 'WaterLevel', type: 'int', len: 8 },
    ]
    buffer = Buffer.from('10c0e073', 'hex')
    const expectedData = { PTemp: 268, 'BattVolt.value': 224, WaterLevel: 115 }

    const _object = bp.decode(buffer, format)
    expect(_object).toEqual(expectedData)
  })

  it('should return an object with passed format with diferents types of data', () => {
    format = [
      { tag: 'var2.value', type: 'uint', len: 11 },
      { tag: 'var3.value', type: 'int', len: 10 },
      { tag: 'var6.value', type: 'float' },
    ]
    buffer = Buffer.from('00a05a1c1d3306', 'hex')
    const expectedData = {
      'var2.value': 5,
      'var3.value': 11,
      'var6.value': 263.3,
    }

    const _object = bp.decode(buffer, format)
    expect(_object).toEqual(expectedData)
  })
})
