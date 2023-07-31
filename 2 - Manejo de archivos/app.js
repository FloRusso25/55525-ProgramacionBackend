import Contenedor from "./class/contenedor.js"

async function main(){
    const products = new Contenedor('/files/productos.txt')

    console.log(`Getting file content`)    
    let content = await products.getAll()
    console.log(`\nFile content\n------------------------------\n${JSON.stringify(content)}\n------------------------------\n`)

    console.log(`Save item escuadra`)
    await products.save({title: 'Escuadra', price: 123.45, thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png' })
    console.log(`Item escuadra saved`)

    content = await products.getAll()
    console.log(`\nFile content\n------------------------------\n${JSON.stringify(content)}\n------------------------------\n`)

    console.log(`Save items calculadora and globo terraqueo`)
    await products.save({title: 'Calculadora', price: 234.56, thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png' })
    await products.save({title: 'Globo terráqueo', price: 5, thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png' })
    console.log(`Items calculadora and globo terraqueo saved`)

    content = await products.getAll()
    console.log(`\nFile content\n------------------------------\n${JSON.stringify(content)}\n------------------------------\n`)

    console.log(`Getting item with ID 2`)
    let item = await products.getById(2)
    console.log(`Item with ID 2: ${JSON.stringify(item)}`)

    console.log(`\nDelete item with ID 2`)
    await products.deleteById(2)
    console.log(`Item deleted`)

    content = await products.getAll()
    console.log(`\nFile content\n------------------------------\n${JSON.stringify(content)}\n------------------------------\n`)

    console.log(`Addig item with missing property`)
    await products.save({price: 8, thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png' })


    content = await products.getAll()
    console.log(`\nFile content\n------------------------------\n${JSON.stringify(content)}\n------------------------------\n`)   

    console.log(`Deleting all items`)
    await products.deleteAll()
    content = await products.getAll()
    console.log(`\nFile content\n------------------------------\n${JSON.stringify(content)}\n------------------------------\n`)   


}

main()
