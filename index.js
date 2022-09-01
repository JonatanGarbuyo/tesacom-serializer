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
    const buffer = Buffer.concat(
      format.map((f) => {
        const value = _object[f.tag]
        const bufSize = Math.ceil(f.len / 8)
        const buf = Buffer.alloc(bufSize)

        buf.writeIntBE(value, 0, bufSize)
        return buf
      })
    )

    return { size: Buffer.byteLength(buffer), buffer }
  }
}

module.exports = BinaryParser
