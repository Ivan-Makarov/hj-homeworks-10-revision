'use strict';

const colors = document.querySelector('#colorSwatch');
const sizes = document.querySelector('#sizeSwatch');
const cart = document.querySelector('#quick-cart');
const cartForm = document.querySelector('#AddToCartForm');
const addToCart = document.querySelector('#AddToCart');
let remove;

function getData(from, handler) {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
        const data = JSON.parse(xhr.response);
        handler(data);
    });

    xhr.open('GET', from);
    xhr.send()
}

getData('https://neto-api.herokuapp.com/cart/colors', handleColors);
getData('https://neto-api.herokuapp.com/cart/sizes', handleSizes);

addToCart.addEventListener('click', (e) => {
    e.preventDefault();
    const formData = new FormData(cartForm);

    formData.append('productId', cartForm.dataset.productId);

    const getItems = new XMLHttpRequest();
    getItems.addEventListener('load', () => {
        updateItems(getItems);
    });

    getItems.open('POST',  'https://neto-api.herokuapp.com/cart');
    getItems.send(formData)
});

function updateItems(xhr) {
    let total = 0;
    cart.innerHTML = '';
    const items = JSON.parse(xhr.response);
    items.forEach(item => {
        total += item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.classList.add('quick-cart-product', 'quick-cart-product-static');
        cartItem.id = `quick-cart-product-${item.id}`;
        cartItem.style.opacity = '1';
        cartItem.innerHTML = `<div class="quick-cart-product-wrap">
                                  <img src="${item.pic}" title="${item.title}">
                                  <span class="s1" style="background-color: #000; opacity: .5">$800.00</span>
                                  <span class="s2"></span>
                                </div>
                             <span class="count hide fadeUp" id="quick-cart-product-count-${item.id}">${item.quantity}</span>
                             <span class="quick-cart-product-remove remove" data-id="${item.id}"></span>`
        cart.appendChild(cartItem);
    })
    updateRemove();
    updateCart(total);
}

function updateRemove() {
    remove = [...document.querySelectorAll('.remove')];
    remove.forEach(button => {
        button.addEventListener('click', () => {
            const removeItem = new XMLHttpRequest();
            const id = new FormData();
            id.append('productId', button.dataset.id)
            removeItem.addEventListener('load', () => {
                updateItems(removeItem);
            });
            removeItem.open('POST', 'https://neto-api.herokuapp.com/cart/remove');
            removeItem.send(id);
        });
    })
}

function updateCart(total) {
    const cartSnippet = document.createElement('a');
    cartSnippet.id = 'quick-cart-pay';
    cartSnippet.quickbeam = 'cart-pay';
    cartSnippet.classList.add('cart-ico')
    if (cart.innerHTML !== '') {
        cartSnippet.classList.add('open')
    }
    cartSnippet.innerHTML = `<span>
                              <strong class="quick-cart-text">Оформить заказ<br></strong>
                              <span id="quick-cart-price">$${total}</span>
                            </span>`
    cart.appendChild(cartSnippet);
}

function handleColors(data) {
    function makeHTML(html, color) {
        if (color.isAvailable) {
            html += `<div data-value="${color.type}" class="swatch-element color ${color.type} available">
                        <div class="tooltip">${color.title}</div>
                        <input quickbeam="color" id="swatch-1-${color.type}" type="radio" name="color" value="${color.type}">
                        <label for="swatch-1-${color.type}" style="border-color: ${color.type};">
                            <span style="background-color: ${color.code};"></span>
                            <img class="crossed-out" src="https://neto-api.herokuapp.com/hj/3.3/cart/soldout.png?10994296540668815886">
                        </label>
                    </div>`
        } else {
            html += `<div data-value="${color.type}" class="swatch-element color ${color.type} soldout">
                        <div class="tooltip">${color.title}</div>
                        <input quickbeam="color" id="swatch-1-${color.type}" type="radio" name="color" value="${color.type}" disabled>
                        <label for="swatch-1-${color.type}" style="border-color: ${color.type};">
                            <span style="background-color: ${color.code};"></span>
                            <img class="crossed-out" src="https://neto-api.herokuapp.com/hj/3.3/cart/soldout.png?10994296540668815886">
                        </label>
                    </div>`
        }
        return html;
    }
    colors.innerHTML = data.reduce(makeHTML, colors.innerHTML);
    const availableColors = [...colors.querySelectorAll('.swatch-element.available')];
    availableColors.find(color => {
        if (color.classList.contains(localStorage.color)) {
            color.querySelector('input').checked = true;
        }
    })
}

function handleSizes(data) {
    function makeHTML(html, size) {
        if (size.isAvailable) {
            html += `<div data-value="${size.type}" class="swatch-element plain ${size.type} available">
                        <input id="swatch-0-${size.type}" type="radio" name="size" value="${size.type}">
                        <label for="swatch-0-${size.type}">
                          ${size.title}
                            <img class="crossed-out" src="https://neto-api.herokuapp.com/hj/3.3/cart/soldout.png?10994296540668815886">
                        </label>
                    </div>`
        } else {
            html += `<div data-value="${size.type}" class="swatch-element plain ${size.type} soldout">
                        <input id="swatch-0-${size.type}" type="radio" name="size" value="${size.type}" disabled>
                        <label for="swatch-0-${size.type}">
                          ${size.title}
                            <img class="crossed-out" src="https://neto-api.herokuapp.com/hj/3.3/cart/soldout.png?10994296540668815886">
                        </label>
                    </div>`
        }
        return html;
    }
    sizes.innerHTML = data.reduce(makeHTML, sizes.innerHTML);
    const availableSizes = [...sizes.querySelectorAll('.swatch-element.available')];
    availableSizes.find(size => {
        if (size.classList.contains(localStorage.size)) {
            size.querySelector('input').checked = true;
        }
    })
}

colors.addEventListener('change', (e) => {
    localStorage.color = e.target.value;
});

sizes.addEventListener('change', (e) => {
    localStorage.size = e.target.value;
});
