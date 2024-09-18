const decreaseButton = document.getElementById('decrease');
const increaseButton = document.getElementById('increase');

const html = document.documentElement;

function decreaseFontSize() {
    let currentSize = window.getComputedStyle(html).fontSize;
    let newSize = parseFloat(currentSize) - 5;
    html.style.fontSize = newSize + 'px';
}

function increaseFontSize() {
    let currentSize = window.getComputedStyle(html).fontSize;
    let newSize = parseFloat(currentSize) + 5;
    html.style.fontSize = newSize + 'px';
}

decreaseButton.addEventListener('click', decreaseFontSize);
increaseButton.addEventListener('click', increaseFontSize);