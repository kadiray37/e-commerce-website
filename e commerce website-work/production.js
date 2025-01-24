const box = document.querySelector(".products-container");
const basketContainers = document.querySelector(".basket-item-wrapper");
const basketData = [];
const basketIcon = document.querySelector("#basket-icon");
const basketContainer = document.querySelector(".basket-area-content");

function init() {
const productionBox = document.querySelectorAll("#production-box");
const productItem = document.querySelector("#production-box");
const productPrevBtn = document.querySelector("#product-left");
const productNextBtn = document.querySelector("#product-right");
const productbtn = document.querySelectorAll("#productbtn i");
const dotsContainer = document.querySelector(".dats");
    




/* products slider */
const totalGroups = Math.ceil(productionBox.length / 3);
const boxWidth = Math.round(productItem.offsetWidth);
let productIndex = 0;
const GAP_WIDTH = 6; // Ortadaki kartın sağ ve solundaki gap
function createDots() {
    for (let i = 0; i < totalGroups; i++) {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        if (i === 0) dot.classList.add("active"); // İlk dot aktif
        dotsContainer.appendChild(dot);
    }
}
createDots();
const dot = document.querySelectorAll(".dats .dot");
function updateDots() { 
    dot.forEach((eleman) => eleman.classList.remove("active")); 
    dot[productIndex].classList.add("active");
}
function productSlider() {
    const cardWidth = Math.round(boxWidth);
    const slideWidth = Math.round((cardWidth * 3) + (GAP_WIDTH * 3));
    const slideDistance = Math.round(productIndex * slideWidth);
    box.style.transform = `translateX(-${slideDistance}px)`;
    updateDots();
}

function productBtnHandler(direction) {
    console.log("giriyormu");
    if (direction === "next" && productIndex < totalGroups - 1) {
        productIndex++;
    } else if (direction === "prev" && productIndex > 0) {
        productIndex--;
    }
    btnDisabled()
    productSlider();
    updateDots();
}
function btnDisabled() { 
    productbtn[0].classList.toggle("disabled", productIndex == 0);
    productbtn[1].classList.toggle("disabled", productIndex == totalGroups - 1);
}
dot.forEach((dats, index) => {
    dats.addEventListener("click", () => {
        productIndex = index;
        productSlider();
        updateDots();
        btnDisabled()
    })
});  
productNextBtn.addEventListener("click", ()=> productBtnHandler("next"));
productPrevBtn.addEventListener("click", ()=> productBtnHandler("prev"));
window.addEventListener('resize', () => {
    productSlider();
});
document.addEventListener("DOMContentLoaded", () => {
    const products = new Products();
    const ui = new UI();
    products.getProducts().then(products => {
        ui.displayProducts(products)
    });
});
//mobilde dokunmatik olarak sliderı kaydırmak istediğimizde bu kodlar aktif olacak
let xDown = null;
let yDown = null;
const touchTotal = 100;
box.addEventListener("touchstart", touchStart);
box.addEventListener("touchmove", touchMove);
box.addEventListener("touchend", touchEnd);
function touchStart(e) {
    xDown = e.touches[0].clientX;
    yDown = e.touches[0].clientY;
}
function touchMove(e) {
    if (!xDown || !yDown) return;

    const xUp = e.touches[0].clientX;
    const yUp = e.touches[0].clientY;
    const xDiff = xDown - xUp;
    const yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(xDiff) > touchTotal) {
        if (xDiff > 0) {
            console.log("Next butonu, xDiff:", xDiff);
            productBtnHandler("next");
        } else {
            console.log("prev butonu, xDiff: ", xDiff);
            productBtnHandler("prev");
        }
        xDown = null;
        yDown = null;
    }
}
function touchEnd() {
    xDown = null;
    yDown = null;
    }  

box.addEventListener("click", (event) => {
        console.log(event);
    if (event.target.matches(".bx-cart-alt")) {
        let target = event.target.closest("#production-box");
    if (target) {
        const cardData = {
            title: target.dataset.title,
            price: target.dataset.price,
            images: target.dataset.images,
        };

        addLocalStorage(cardData);
        addToBasket()
        basketContainer.classList.toggle("active", true);
        basketIcon.classList.toggle("active");
    }
    }
    
})
addToBasket()    
}
class Products{
    async getProducts() {
        try {
        const response = await fetch('https://dummyjson.com/products');
        const data = await response.json();
        return data;
        } catch (e) {
            console.error("veri eklenemedi",e);
        }  
    }
}
class UI {
    displayProducts(products) { 
        
        let result = "";

        products.forEach(item => {
            result +=`
            <div id="production-box" class="box" 
                    data-title="${item.title}" 
                    data-price="${item.price}" 
                    data-discount="-25%" 
                    data-images="${item.images}">
                <img src="${item.images}" alt="">
                <span>${item.category}</span>
                <h2>${item.title}</h2>
                <h3 class="price">${item.price}TL <span>/kg</span></h3>
                <i class='bx bx-cart-alt'></i>
                <i class='bx bx-heart'></i>
                <span class="discount">-25%</span>
            </div>
            `
        });
        box.innerHTML = result;   
    }   
}


document.addEventListener("DOMContentLoaded", () => {
    const products = new Products();
    const ui = new UI();
    products.getProducts()
    .then(products => {
    ui.displayProducts(products.products)
    
        init();    
    })
    
});

function basketToggle() {
    basketIcon.addEventListener("click", () => {
    basketContainer.classList.toggle("active");
    basketIcon.classList.toggle("active");
        
});
}
basketToggle()






function addToBasket() {
    let itemData = JSON.parse(localStorage.getItem("card")) || [];
    let result = "";
    itemData.forEach(item => {
            result +=`
                <div class="basket-item">
                    <div class="basket-item-img">
                        <img src="${item.images}" alt="product1">
                    </div>
                <div class="basket-item-info">
                    <h3>${item.title}</h3>
                    <p>1 adet</p>
                    <span>$${item.price}</span>
                </div>
                    <div class="basket-item-remove">
                        <i class='bx bx-trash'></i>
                    </div>
                </div>
            `
        });
        basketContainers.innerHTML = result;
        
}



function addLocalStorage(card) {

    let itemData = JSON.parse(localStorage.getItem("card")) || [];
    let cardExists = itemData.some(item => item.title === card.title && card.images === item.images)
    if (cardExists)return
    itemData.push(card);
    localStorage.setItem("card", JSON.stringify(itemData));
    console.log(itemData);
} 
