const getCartQty = async () => {
    let response = await fetch('/cart/cartqty', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        method: "get",
    })

    const data = await response.json();
    const cartQty = data.cartQty;

    if (cartQty > 0) {
        document.querySelector('#cart-btn-lg').innerHTML = cartQty;
        document.querySelector('#cart-btn-sm').innerHTML = cartQty;
        document.querySelector('#cartQty').innerHTML = cartQty;
    } else {
        document.querySelector('#cart-btn-lg').innerHTML = 0;
        document.querySelector('#cart-btn-sm').innerHTML = 0;
        document.querySelector('#cartQty').innerHTML = 0;
    }
};

const populateCart = async () => {
    const response = await fetch('/cart/cartdata', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })

    const data = await response.json();
    const cart = data.cart;
    const subtotal = data.subtotal;

    let checkoutTable = document.querySelector('#cartBody');
    checkoutTable.innerHTML = '';

    if (cart) {
        cart.forEach((cartItem) => {
            let row = checkoutTable.insertRow(-1);
            let cells = new Array(4);

            for (let i = 0; i < cells.length; i++) {
                cells[i] = row.insertCell(i);
            }

            cells[1].classList.add('text-center');
            cells[2].classList.add('text-center');
            cells[3].classList.add('text-end');
            cells[0].innerHTML = cartItem.name;
            cells[1].innerHTML = cartItem.sku;
            cells[2].innerHTML = cartItem.quantity;
            cells[3].innerHTML = Number(cartItem.price).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD'
            });
        })
    }

    document.querySelector('#subtotal').innerHTML = Number(subtotal).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
    });
}

async function emptyCart() {
    await fetch('/cart/emptycart', {
        method: 'POST'
    })
    populateCart();
    getCartQty();
}

window.addEventListener('load', () => {
    document.querySelectorAll('.add-to-cart-form').forEach((form) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
        })
    })

    getCartQty();
    populateCart();

    var emptyCartBtn = document.getElementById("emptyCart");

    emptyCartBtn.addEventListener('click', () => {
        console.log('empty cart clicked!');
        emptyCart();
    })
})

async function addToCart(productID, quantity) {
    toggleCartBtns('disable');

    await fetch('/cart', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            productID: productID,
            quantity: quantity
        })
    })

    populateCart();
    getCartQty();
    toggleCartBtns('enable');
}

const toggleCartBtns = (option) => {
    let cartBtns = document.querySelectorAll('.add-to-cart');

    cartBtns.forEach((btn) => {
        if (option === 'disable') {
            btn.disabled = true;
            btn.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div>';
        }
        if (option === 'enable') {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-cart-plus"></i>&#160;&#160;Add to Cart';
        }
    })
}