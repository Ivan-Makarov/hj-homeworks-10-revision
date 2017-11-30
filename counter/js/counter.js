'use strict';
const counter = document.querySelector('#counter');
const increment = document.querySelector('#increment');
const decrement = document.querySelector('#decrement');
const reset = document.querySelector('#reset');

if (localStorage.counter === 'undefined') {
    counter.value = 0;
} else {
    counter.value = localStorage.counter;
}

updateCounter();

increment.addEventListener('click', increaseCounter);

decrement.addEventListener('click', decreaseCounter);

reset.addEventListener('click', resetCounter);

function updateCounter() {
    counter.textContent = counter.value;
    localStorage.counter = counter.value;
}

function resetCounter() {
    counter.value = 0;
    updateCounter();
}

function increaseCounter() {
    ++counter.value;
    updateCounter();
}

function decreaseCounter() {
    --counter.value;
    if (counter.value < 0) {
        resetCounter();
    }
    updateCounter();
}
