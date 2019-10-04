const submit = document.querySelector('.submitBtn')
submit.addEventListener('click',(e)=>{
    e.preventDefault()
    const product = {
        name : document.querySelector('#name').value,
        price : document.querySelector('#price').value,
        description : document.querySelector('#des').value,
        id: document.querySelector('#productId').value
    }
    console.log(product.id)
    fetch('/products/'+product.id,{
        method: 'PUT',
        body: JSON.stringify(product),
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(res => res.json()).then(response => window.location.href= '/#products')
})