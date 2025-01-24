const prev = document.querySelector(".bx-chevron-left");
const next = document.querySelector(".bx-chevron-right");
const slide = document.querySelector(".swiper-wrapper");
const swiperSlide = document.querySelector(".swiper-wrapper").children;
const swiperSliders = Array.from(swiperSlide);
const navbar = document.querySelectorAll(".navbar li a");


let index = 0;
function resize() {
    const windowsWidth = window.innerWidth;
    return windowsWidth
}
function slideUI() {
    slide.style.transform =` translateX(-${index * resize()}px)`
}
function sliderRight() {
    if (index == swiperSliders.length-1) {
        index = 0;
    } else {
        index++;
    }
    slideUI();
}
function sliderLeft() {

    if (index == 0) {
        index = swiperSliders.length-1;
    } 
    else {
        index--;
        console.log("index1", index);
    }
    console.log("index2", index);
    slideUI();
}

function updateCategories() {
    navbar.forEach((eleman) => eleman.classList.remove("active"));
    navbar[index].classList.add("active");
    
}


navbar.forEach((nav, indexnav) => {
    nav.addEventListener("click", () => {
        index = indexnav;
        updateCategories()
        


    })
})
next.addEventListener("click", sliderRight);
prev.addEventListener("click", sliderLeft);
slide.addEventListener("resize", resize);

