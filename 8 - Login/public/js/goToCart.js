function redirectToCart() {
    console.log("ENTRA EN EL SCRIPT1")
    const cartId = document.getElementById("cartId").value
    console.log("SACA CARTID")
    window.location.assign(`http://localhost:8080/api/carts/${cartId}`)
}