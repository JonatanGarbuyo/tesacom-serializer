# Tesacom-serializer

Modulo para optimización de tramas de datos a ser enviados desde y hacia dispositivos remotos de manera tal que sean lo más reducidas en longitud posibles (ahorro de bytes / zero overhead).

## Un gran desafío.

Desarrollar una plataforma que incluya: dispositivos de borde para lectura y procesamiento de datos, servicios de ingesta de datos en la nube y aplicaciones que permiten crear reglas para manipulación, transformación y agregación de datos enriquecidos.

## Enunciado del Desafío (DataOps / Ingestando datos).

Un poco de contexto: Los pronósticos respecto al futuro del IoT, hablan de decenas de miles de millones de dispositivos conectados. Entre el 2020 al 2030 se triplicarán la cantidad de los mismos, llegando a superar los 25.000 millones. Las redes de comunicación, en continua evolución, están ampliando sus capacidades para poder soportar tal cantidad de dispositivos conectados, de cosas conectadas, tanto en zonas urbanas como en zonas remotas, donde la cobertura celular no llega y los dispositivos se conectan mediante redes de comunicación satelital, diseñadas específicamente para IoT, y en donde los datos traficados deben ser optimizados a nivel de bit (zero overhead) si se pretende implementar de manera exitosa, un proyecto IoT que permita optimizar la operación de una industria en particular.

El desafío aquí presentado está enmarcado en este contexto, es decir, optimización de tramas de datos a ser enviados desde y hacia dispositivos remotos de manera tal que sean lo más reducidas en longitud posibles (ahorro de bytes / zero overhead).

Para esto se solicita desarrollar una librería en Node.js que cuente con al menos dos métodos, encode y decode, que permitan codificar/decodificar o serializar/deserializar un objeto o estructura de datos en función de un formato definido:

ObjetoDatos <- Formato -> Trama binaria

### ObjetoDatos

Es el objeto que contiene los campos de datos que deben ser codificado/decodificado. Dichos campos pueden de los tipos que se muestran a continuación:

Tipos requeridos:

• uint - entero sin signo, longitud variable (1 a 32bits)  
• int - entero con signo, longitud variable (complemento a 2, 2 a 32bits)  
• float - punto flotante de precisión simple (IEEE 754, 32bits)

Tipos opcionales (valorado):  
• ascii - ASCII string terminada en #0 | 7bits x caracter

### Trama binaria

Es un Node.js Buffer que contiene los datos codificados de manera tal de optimizar la cantidad de bytes utilizados.

### Formato

Es un array o vector de objetos, donde cada elemento corresponde a la definición de cada campo del objeto (ObjetoDatos) que se pretende codificar/decodificar.
Formato del Vector de objetos [ { tag: "?", type: "?", len: ? } ] donde:

- tag - Nombre del campo en el objeto para de/serializar
- type - Tipo de dato del campo
- len - Longitud en bits del campo (si aplica al tipo)

## Ejemplo.

```javascript
const format1 = [
  { tag: 'PTemp', type: 'int', len: 12 },
  { tag: 'BattVolt.value', type: 'int', len: 12 },
  { tag: 'WaterLevel', type: 'int', len: 8 },
]

var data = { PTemp: 268, BattVolt.value: 224, WaterLevel: 115 };

var bp = new BinaryParser();
var dataEncoded = bp.encode(data, format1);
console.log(dataEncoded.buffer.toString('hex')); //prints 010C0E073
console.log(dataEncoded.size); //prints 40

var dataDecoded = bp.decode(dataEncoded.buffer, format1);
console.log(dataDecoded) //prints { PTemp: 268, 'BattVolt.value': 224, WaterLevel: 15 }

```

Otro Ejemplo de deserialización:

```javascript
// La trama de datos: 0x010203
const buffer = Buffer.from('010203', 'hex')

const format = [
  { tag: 'v0', type: 'int', len: 8 },
  { tag: 'v1', type: 'int', len: 8 },
  { tag: 'v2', type: 'int', len: 8 },
]

var dataDecoded = bp.decode(buffer, format)
console.log(dataDecoded) //prints {v0: 1,v1: 2, v2: 3}
```

## Para tener en cuenta.

A elección, y según preferencias, puedes utilizar:

- Typescript
- POO o Funcional
- Librerías de terceros

Se valora:

- Código estructurado y documentado (JSDoc)
- Testeo unitario (Jest)
- Resultados en repositiorio Git
- Poder configurar bit / byte / word order.
- Tipo ASCII string
- Manejo de errores / excepciones
