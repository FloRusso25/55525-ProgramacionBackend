async function showProduct() {
    console.log("ENTRA EN SHOW")
    const prodId = document.getElementById("productId").value
    location.href = `http://localhost:8080/api/products/${prodId}`
    // const cartId = document.getElementById("cartId").value
    // console.log("ENTRA EN EL SCRIPT")
    // await fetch(`http://localhost:8080/api/carts/${cartId}`, {
    //         method: 'GET',
    //         headers: {'Content-Type': 'application/json'}
    // })
}
