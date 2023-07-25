import Contenedor from "./class/contenedor.js"

async function main(){
    const productos = new Contenedor('/files/productos.txt')    
    let contenido = await productos.getAll()
    console.log(`\nContenido del archivo\n------------------------------\n${JSON.stringify(contenido)}\n------------------------------\n`)

    await productos.save({title: 'Escuadra', price: 123.45, thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png' })

    contenido = await productos.getAll()
    console.log(`\nContenido del archivo\n------------------------------\n${JSON.stringify(contenido)}\n------------------------------\n`)

    await productos.save({title: 'Calculadora', price: 234.56, thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png' })
    await productos.save({title: 'Globo terráqueo', price: 5, thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png' })

    contenido = await productos.getAll()
    console.log(`\nContenido del archivo\n------------------------------\n${JSON.stringify(contenido)}\n------------------------------\n`)

    let item = await productos.getById(2)
    console.log(`El item con ID 2 es: ${JSON.stringify(item)}`)

    await productos.deleteById(2)

    contenido = await productos.getAll()
    console.log(`\nContenido del archivo\n------------------------------\n${JSON.stringify(contenido)}\n------------------------------\n`)

    await productos.deleteAll()

    contenido = await productos.getAll()
    console.log(`\nContenido del archivo\n------------------------------\n${JSON.stringify(contenido)}\n------------------------------\n`)
}

main()
