'use strict'

class BinaryParser {
  /**
   * v0.1.0 | Jonatan Garbuyo | Primera versión
   *
   * @param {buffer} buffer -> Trama a deserializar
   * @param {*} format -> Formato de serialización (ver notas adjuntas)
   * @return {*} Objeto "composición" (trama deserializada en campos tag = valor)
   * @memberof BinaryParser
   * @version ?
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
   * v0.1.0 | Jonatan Garbuyo | Primera versión
   *
   * @param {*} _object -> Objeto a frasear (serializar)
   * @param {*} format -> Formato de serialización (ver notas adjuntas)
   * @return {*} size -> tamaño en bits de la trama. buffer -> Node.js Buffer.
   * @memberof BinaryParser
   * @version ?
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
