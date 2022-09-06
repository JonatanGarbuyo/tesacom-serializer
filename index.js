//@ts-check
'use strict'

/**
 * @typedef {object} Format
 * @property {number} [Format.len]
 * @property {string} Format.tag
 * @property {string} Format.type
 */

/**
 * Creates a new BinaryParser.
 * @class
 */
class BinaryParser {
  /**
   * @description Encodes a floating point number to a binary string representation.
   * @param {number} value Floating point number
   * @return {string} String
   * @memberof BinaryParser
   * @version v0.1.0
   * @author Jonatan Garbuyo <jonatangarbuyo@gmail.com>
   */
  floatToBinary(value) {
    const number = value
    const isPositive = value > 0
    let [first, second] = number.toString(2).split('.')
    const bias = 127
    const singBit = isPositive ? 0 : 1
    const exp = first.length - 1
    const exponentialBits = (number > 0 ? bias + exp : bias - exp).toString(2)
    const mantissa = first.slice(1) + second
    return (singBit + exponentialBits + mantissa).slice(0, 32)
  }

  /**
   * @description Decodes a string representing a binary floating point number to a number.
   * @param {string} value Binary floating point number
   * @return {number} Number
   * @memberof BinaryParser
   * @version v0.1.0
   * @author Jonatan Garbuyo <jonatangarbuyo@gmail.com>
   */
  binaryToFloat(value) {
    const radix = 2
    const bias = 127
    const signBit = parseInt(value.slice(0, 1), radix)
    const exponent = parseInt(value.slice(1, 9), radix)
    const fraction = getFraction(value.slice(9))

    function getFraction(str) {
      const bits = str.split('')
      let fraction = 0
      for (let i = 0, j = 1; i < bits.length; i++, j++) {
        const exp = j * -1
        console.log('exp:', j * -1)
        fraction += parseInt(bits[i]) * 2 ** exp
      }

      console.log('fraction:', fraction)
      return fraction
    }

    return Number(
      ((-1) ** signBit * (1 + fraction) * 2 ** (exponent - bias)).toPrecision(4)
    )
  }

  /**
   * @description Decodes a bufer to specified format object
   * @param {Buffer} buffer  Node.js Buffer.
   * @param {Format[]} format Format of de-serialization
   * @return {object}  Formated object
   * @memberof BinaryParser
   * @version v0.1.0
   * @author Jonatan Garbuyo <jonatangarbuyo@gmail.com>
   */
  decode(buffer, format) {
    // validate format
    if (Array.isArray(format) && format.length < 1)
      throw new Error('wrong format data')
    // validate buffer
    if (!Buffer.isBuffer(buffer)) throw new Error('wrong buffer type')

    const _object = {}
    let start = 0

    const bufferString = buffer
      .toJSON()
      .data.map((n) => n.toString(2).padStart(8, '0'))
      .join('')

    format.forEach((f) => {
      const size = f.len || 32
      const end = start + size
      let data
      const value = bufferString.slice(start, end)

      if (f.type === 'float') {
        data = this.binaryToFloat(value)
      } else {
        data = parseInt(value, 2)
      }

      start += size
      _object[f.tag] = data
    })

    return _object
  }

  /**
   * @description Encodes an Object of specified format to a Buffer
   * @param {object} _object  Object to serialize
   * @param {Format[]} format  Format of serialization
   * @return {{size: number, buffer: Buffer}} Object  (size -> bits size of buffer) - (buffer -> Node.js Buffer).
   * @memberof BinaryParser
   * @version v0.1.0
   * @author Jonatan Garbuyo <jonatangarbuyo@gmail.com>
   */
  encode(_object, format) {
    // validate format
    if (Array.isArray(format) && format.length < 1)
      throw new Error('wrong format data')
    //validate _object
    if (typeof _object != 'object') throw new Error('wrong  data type.')
    // validate matching data/format
    const matchingFormat = format.every((f) => _object.hasOwnProperty(f.tag))
    if (!matchingFormat) throw new Error('wrong data or format')

    // encode
    let size = 0
    let data = ''

    for (let f of format) {
      const { tag, type } = f
      const len = f.len || 32
      let value = _object[tag]

      if (type === 'float') {
        value = this.floatToBinary(value)
      } else {
        value = value.toString(2).padStart(len, 0)
      }

      data += value
      size += len
    }

    const bufferSize = Math.ceil(size / 8)
    let buffer = Buffer.alloc(bufferSize)

    for (var i = 0; i < bufferSize; i++) {
      let start = i * 8
      let end = start + 8
      let byte = data.slice(start, end)
      buffer[i] = parseInt(byte, 2)
    }

    return { size, buffer }
  }
}

module.exports = BinaryParser
