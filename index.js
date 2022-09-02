//@ts-check
'use strict'

/**
 * @typedef {object} Format
 * @property {number} Format.len
 * @property {string} Format.tag
 * @property {string} Format.type
 */

/**
 * Creates a new BinaryParser.
 * @class
 */
class BinaryParser {
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

    format.forEach((f) => {
      const size = (f.len / 8) * 2
      const end = start + size
      const bufferString = buffer.toString('hex').slice(start, end)
      const data = parseInt(bufferString, 16)
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
    const buffer = Buffer.concat(
      format.map((f) => {
        const value = _object[f.tag]
        const bufSize = Math.ceil(f.len / 8)
        const buf = Buffer.alloc(bufSize)

        buf.writeIntBE(value, 0, bufSize)
        return buf
      })
    )
    const size = Buffer.byteLength(buffer) * 8
    return { size, buffer }
  }
}

module.exports = BinaryParser
