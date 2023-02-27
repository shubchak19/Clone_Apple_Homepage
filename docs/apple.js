const searchBtn = document.querySelector(".search-icon");
const navCloseBtn = document.querySelector(".close-icon");
const searchBar = document.querySelector(".search-icon-wrapper");
const navContainer = document.querySelector(".nav-box-container");
const navItemsArray = Array.from(navContainer.children);
const curtain = document.querySelector(".curtain");
const recentLinksArray = Array.from(document.querySelector(".recent-search-wrapper").children);
const recentLinksContainer = document.querySelector(".recent-wrapper");
const recentWrapper = document.querySelector(".recent-container");
const recentSearchHeading = document.querySelector(".recent-heading");
const searchInput = document.querySelector(".search-input");
const indicatorContainer = document.querySelector(".indicator-container");
const promoContainer = document.querySelector(".promo-container");
const promoInfoArray = [];
let translateValue = getTranslateValue();
let promoCount = 1;
let currentTranslateValue;
let carouselInterval = 3000;
const playPauseBtn = document.querySelector(".play-pause-btn");
let carousel = undefined;
const carouselLeftBtn = document.querySelector(".left.slider");
const carouselRightBtn = document.querySelector(".right.slider");
const recentContainer = document.querySelector(".recent-container");
const searchSubmit = document.querySelector(".search-submit-icon");
const footerNavBox = document.querySelector(".footer-nav-box-container");
const footerNavHeading = document.querySelectorAll(".footer-nav-heading");
const header = document.querySelector(".header");
const menuBtn = document.querySelector(".menu-btn");
const headerNav = document.querySelector(".header-nav");
const navMobile = document.querySelector(".nav-mobile-container");
const cancelBtnContainer = document.querySelector(".cancel-btn-container");
let carouselContainer = undefined;

// Adding Event listener to all the clickable items

searchBtn.addEventListener("click", (e) => {
    setDelays();
    navBarAnimation();
    searchBarAnimation();
});

navCloseBtn.addEventListener("click", (e) => {
    setDelays(true);
    navBarAnimation(true);
    searchBarAnimation(true);

});

playPauseBtn.addEventListener("click", () => {
    if (playPauseBtn.classList.contains("play")) {
        playPauseBtn.classList.remove("play");
        if (carousel !== undefined) {
            clearInterval(carousel);
        }
    } else {
        playPauseBtn.classList.add("play");
        playPromoCarousel();
        carousel = setInterval(playPromoCarousel, carouselInterval);

    }
});

carouselLeftBtn.addEventListener("click", () => {
    if (promoCount > 0) {
        if (playPauseBtn.classList.contains("play")) {
            playPauseBtn.classList.remove("play");
            if (carousel !== undefined) {
                clearInterval(carousel);
            }
        }
        playPromoCarousel(true);
    }
});

carouselRightBtn.addEventListener("click", () => {
    if (playPauseBtn.classList.contains("play")) {
        playPauseBtn.classList.remove("play");
        if (carousel !== undefined) {
            clearInterval(carousel);
        }
    }
    if (promoCount <= 19) {
        playPromoCarousel();
    }
});

menuBtn.addEventListener("click", () => {
    if (header.classList.contains("open-menu")) {
        header.classList.remove("open-menu");
    } else {
        header.classList.add("open-menu");
    }
});

searchInput.addEventListener("click", () => {
    if (window.matchMedia("(max-width: 1100px)").matches) {
        navContainer.classList.add("nav-hide");
        recentContainer.classList.add("recent-show");
        header.style.transform = "translateY(-3.5em)";
        cancelBtnContainer.classList.add("cancel-show");
    }
});

cancelBtnContainer.addEventListener("click", () => {
    closeSearch();
});

searchSubmit.addEventListener("click", (e) => {
    e.preventDefault();
});

Array.from(footerNavHeading).forEach((element) => {
    element.addEventListener("click", () => {
        let footerNav = element.parentElement;
        if (footerNav.classList.contains("footer-nav-open")) {
            footerNav.classList.remove("footer-nav-open");
        } else {
            footerNav.classList.add("footer-nav-open");
        }
    })

});

// Making a class of Promo
class PromoInfo {
    constructor(imageNumber, type, data) {
        this.id = undefined;
        this.image = `images/carousel_images/desktop_images/promo${imageNumber}.jpg`;
        this.phoneImage = `images/carousel_images/phone_images/promo_phone${imageNumber}.jpg`;
        this.name = `images/icons_png/carousel_icons/movie_name${imageNumber}.png`;
        this.type = type;
        this.data = data;
    }
}

// Function to Start image Carousel
initializeCarousel();

// *********************Defining Functions*******************************

// Function to find the animation duration of an element in seconds

function getAnimationDuration(element, property) {
    let duration = undefined;
    if (property === "delay") {
        duration = window.getComputedStyle(element).animationDelay;
    } else if (property === "transition") {
        duration = window.getComputedStyle(element).transitionDuration;
    }
    else {
        duration = window.getComputedStyle(element).animationDuration;
    }
    let seconds = /\d+s/g.test(duration);
    if (seconds) {
        duration = Number(duration.replace(/s/i, ""));
    } else {
        duration = Number(duration.replace(/ms/i, ""));
        duration = duration / 1000;
    }
    return duration;
}

// Function to convert the animation delay from percentage to a actual usable value

function calculateAnimationDelay(animationDelay, animationDuration) {
    let delayInPercentage = /\d+%/g.test(animationDelay);
    if (delayInPercentage) {
        if (animationDuration !== 0) {
            animationDelay = animationDelay.replace(/%/g, "");
            let delay = ((animationDuration * animationDelay) / 100);
            return delay;
        }
    } else {
        return animationDelay;
    }

}

// Function to set the animation delay to an element or an array

function setAnimationDelay(element, animationDelay, reverse, animationDuration, initialDelay) {
    // Checking if element is an array
    let elementIsArray = false;
    if (Array.isArray(element)) {
        elementIsArray = true;
    }

    // Finding the Duration period to set a delay
    let duration = undefined;
    if (animationDuration !== undefined && animationDuration !== "") {
        duration = animationDuration;
    }
    else {
        let item = undefined;
        if (elementIsArray) {
            item = element[0];
        } else {
            item = element;
        }
        duration = getAnimationDuration(item);
    }
    // Setting the Delay

    let delay = calculateAnimationDelay(animationDelay, duration);

    if (elementIsArray) {
        let item = undefined;
        let interval = delay;
        let delayValue = 0;
        let totalDelay = undefined;

        // Setting the initial Delay of an array element
        if (initialDelay !== undefined && initialDelay !== "") {
            delayValue = initialDelay;
        }

        // Iterating Through the elements of an array
        for (let i = 1; i <= element.length; i++) {
            if (reverse) {
                item = element.length - i;
            } else {
                item = i - 1;
            }
            element[item].style.animationDelay = `${delayValue}s`;
            delayValue += interval;
            delayValue = Number(delayValue.toFixed(3));
            totalDelay = delayValue;
        }
        return totalDelay;
    }
    else {
        element.style.animationDelay = `${delay}s`;
        return delay;
    }
}

// Function to switch add or remove a class of an element or an array

function switchClass(element, addClass, removeClass, reverse) {
    if (Array.isArray(element)) {
        let item = undefined;

        // Removing a class from an element array
        if (removeClass !== undefined && removeClass !== "") {
            for (let i = 1; i <= element.length; i++) {
                if (reverse) {
                    item = element.length - i;
                } else {
                    item = i - 1;
                }
                if (element[item].classList.contains(removeClass)) {
                    element[item].classList.remove(removeClass);
                }
            }
        }

        // Adding a class to an element array 
        if (addClass !== undefined && addClass !== "") {
            for (let i = 1; i <= element.length; i++) {
                if (reverse) {
                    item = element.length - i;
                } else {
                    item = i - 1;
                }
                if (!element[item].classList.contains(addClass)) {
                    element[item].classList.add(addClass);
                }
            }
        }
    } else {
        if (addClass !== undefined && addClass !== "" && !element.classList.contains(addClass)) {
            element.classList.add(addClass);
        }
        if (removeClass !== undefined && removeClass !== "" && element.classList.contains(removeClass)) {
            element.classList.remove(removeClass);
        }
    }

}

// Funtion to animate the navbar

function navBarAnimation(reverse) {
    if (reverse === true) {
        switchClass(navItemsArray, "expand", "shrink");
    } else {
        switchClass(navItemsArray, "shrink", "expand", true);
    }
}

// Function to animate the search bar

function searchBarAnimation(reverse) {
    if (reverse) {
        curtain.classList.remove("curtain-show");
        recentSearchHeading.classList.remove("slide-in");
        switchClass(recentLinksArray, "", "slide-in");
        searchBar.classList.remove("padding-in");
    } else {
        curtain.classList.add("curtain-show");
        recentSearchHeading.classList.add("slide-in");
        switchClass(recentLinksArray, "slide-in");
        searchBar.classList.add("padding-in");
        searchInput.focus();
    }
}

// Function to set all the animation delays

function setDelays(reverse) {
    if (reverse) {
        setAnimationDelay(navItemsArray, "15%");
        setAnimationDelay(recentWrapper, 0);
    } else {
        let delay = setAnimationDelay(navItemsArray, "15%", true);
        let totalDuration = getAnimationDuration(navItemsArray[0]) + delay;
        setAnimationDelay(recentWrapper, "30%", false, totalDuration);
        delay = setAnimationDelay(recentSearchHeading, "50%", false, totalDuration);
        setAnimationDelay(recentLinksArray, "15%", false, undefined, delay);
        setAnimationDelay(searchBar, "85%", totalDuration);
    }
}

// IMAGE CAROUSEL
// Function to append all Promo images to the carousel

function initializeCarousel() {
    // Making Promo information array
    makePromoInfoArray();

    // Making all Promo elements
    if (promoContainer.children.length === 0) {
        let i = 1;
        for (let promo of promoInfoArray) {
            let promoElement = makePromoElement(promo);
            promoElement.setAttribute("data-promo-number", i);
            i++;
            promoContainer.appendChild(promoElement);
        }
    }

    // Populating the indicator of the carousel
    populateIndicator();

    // Setting initial focus to element in carousel
    setPromoFocus(document.querySelector("#promo1"));

    // Arranging promo elements
    addExtraPromos();

    // Making the window visible
    carouselContainer = document.querySelector("#image-carousel");
    carouselContainer.style.display = "block";

}

// Function to create image carasoul indicator

function populateIndicator() {
    if (indicatorContainer.children.length !== promoInfoArray.length) {

        for (let i = 1; i <= promoInfoArray.length; i++) {
            let indicatorClone = document.querySelector(".indicator-wrapper-clone").cloneNode(true);
            if (i === 1) {
                indicatorClone.classList.add("focus");
            }
            indicatorClone.classList.remove("indicator-wrapper-clone");
            indicatorClone.classList.add("indicator-wrapper");
            indicatorClone.id = `indicator${i}`;

            indicatorClone.addEventListener("click", (e) => {
                if (playPauseBtn.classList.contains("play")) {
                    playPauseBtn.classList.remove("play");
                    if (carousel !== undefined) {
                        clearInterval(carousel);
                    }
                }
                goToPromo(e.target);
            });
            indicatorClone.setAttribute("data-indicator-number", i);
            indicatorContainer.appendChild(indicatorClone);
        }
    }
}

// Function to make a promo Element

function makePromoElement(promoInfo) {
    // Making a clone of the Promo element without the clone class
    let promoClone = document.querySelector(".promo-clone").cloneNode(true);
    promoClone.classList.remove("promo-clone");

    // Selecting the editable promo elements

    const image = promoClone.querySelector(".cover-image");
    const type = promoClone.querySelector(".promo-type");
    // const data = promoClone.querySelector(".promo-about");
    const data = promoClone.querySelector(".promo-text");
    const movieName = promoClone.querySelector(".movie-name");
    // Giving the values to the promo element from the corresponding promo information object array
    if (window.matchMedia("(min-width: 650px)").matches) {
        image.style.backgroundImage = `url(${promoInfo.image})`;
    } else {
        image.style.backgroundImage = `url(${promoInfo.phoneImage})`;
    }
    movieName.style.backgroundImage = `url(${promoInfo.name})`;
    type.innerText = promoInfo.type;
    data.append(promoInfo.data);
    promoClone.id = promoInfo.id;

    return promoClone;
}

// Function to set active status of the Promo image in a carasoul

function setPromoFocus(element) {
    // Setting the focus to the element

    if (!element.classList.contains("focus")) {
        let elementId = element.id;
        let focusedElement = document.querySelector(".promo.focus");
        if (focusedElement !== null) {
            focusedElement.classList.remove("focus");
        }
        element.classList.add("focus");

        // Setting the focus to the corresponding indicator

        let currentFocusedIndicator = document.querySelector(".indicator-container .focus");
        if (currentFocusedIndicator !== null) {
            currentFocusedIndicator.classList.remove("focus");
        }

        let focusNumber = element.getAttribute("data-promo-number");
        let indicator = document.querySelector(`#indicator${focusNumber}`);
        indicator.classList.add("focus");
    }

}

// Function to keep carousel running
function playPromoCarousel(reverse) {
    let currentElement = document.querySelector(".promo.focus");
    let nextElement;
    if (reverse) {
        nextElement = currentElement.previousElementSibling;
        currentTranslateValue -= translateValue;
        promoCount--;
    } else {
        nextElement = currentElement.nextElementSibling;
        currentTranslateValue += translateValue;
        promoCount++;
    }
    setPromoFocus(nextElement);

    if (!promoContainer.classList.contains("transition")) {
        promoContainer.classList.add("transition");
    }
    promoContainer.style.transform = `translateX(${currentTranslateValue}px)`;

    if (nextElement.classList.contains("extra")) {
        if (promoCount <= 1) {
            document.querySelector(`#${promoInfoArray[promoInfoArray.length - 1].id}`).classList.add("focus");
        } else {
            document.querySelector(`#${promoInfoArray[0].id}`).classList.add("focus");
        }
        setTimeout(() => {
            console.log("run")
            resetPromo();
        }, getAnimationDuration(promoContainer, "transition") * 1000 - 10);
    }
}

// Function to change the carousel according to the indicator

function goToPromo(indicator) {
    let slideNumber = indicator.getAttribute("data-indicator-number");
    promoCount = slideNumber;
    currentTranslateValue = translateValue * slideNumber;
    if (!promoContainer.classList.contains("transition")) {
        promoContainer.classList.add("transition");
    }
    promoContainer.style.transform = `translateX(${currentTranslateValue}px)`;
    let currentFocus = document.querySelector(".indicator-wrapper.focus").getAttribute("data-indicator-number");
    let difference = Math.abs(slideNumber - currentFocus);

    let time = 100 * Math.floor(difference / 3);
    if (time >= 500) {
        time = 500;
    }
    setTimeout(() => {
        setPromoFocus(document.querySelector(`#promo${slideNumber}`));
    }, time);
}

// Function to add the extra promo clone before and after all the promo elements

function addExtraPromos() {
    if (promoContainer.children.length !== promoInfoArray.length + 4) {

        let firstPromoClone = document.querySelector(`#${promoInfoArray[0].id}`).cloneNode(true);
        firstPromoClone.classList.add("extra");
        firstPromoClone.id = `${firstPromoClone.id}-clone`;

        let secondPromoClone = document.querySelector(`#${promoInfoArray[1].id}`).cloneNode(true);
        secondPromoClone.classList.add("extra");
        secondPromoClone.removeAttribute("id");

        let lastPromoClone = document.querySelector(`#${promoInfoArray[promoInfoArray.length - 1].id}`).cloneNode(true);
        lastPromoClone.classList.add("extra");
        lastPromoClone.id = `${lastPromoClone.id}-clone`;

        let secondLastPromoClone = document.querySelector(`#${promoInfoArray[promoInfoArray.length - 2].id}`).cloneNode(true);
        secondLastPromoClone.classList.add("extra");
        secondLastPromoClone.removeAttribute("id");

        promoContainer.appendChild(firstPromoClone);
        promoContainer.appendChild(secondPromoClone);
        promoContainer.insertBefore(lastPromoClone, promoContainer.firstElementChild);
        promoContainer.insertBefore(secondLastPromoClone, promoContainer.firstElementChild);

        let extraArray = Array.from(document.querySelectorAll(".extra"));
        for (let extra of extraArray) {
            if (extra.classList.contains("focus")) {
                extra.classList.remove("focus");
            }
        }

        currentTranslateValue = initialTranslateValue();
        promoContainer.style.transform = `translateX(${currentTranslateValue}px)`;
    }

}

// Function to reset promo to go first promo

function resetPromo() {
    promoContainer.classList.remove("transition");
    console.log(currentTranslateValue)
    if (promoCount <= 1) {
        currentTranslateValue = promoInfoArray.length * translateValue;
        promoCount = 19;
    } else {
        currentTranslateValue = initialTranslateValue();
        promoCount = 1;
    }
    promoContainer.style.transform = `translateX(${currentTranslateValue}px)`;
    document.querySelector(".promo.extra.focus").classList.remove("focus");
}

// Function to find translate value

function getTranslateValue() {
    let promoClone = document.querySelector(".promo-clone");
    if (promoClone !== null) {
        let promoWidth = window.getComputedStyle(promoClone).width;
        promoWidth = promoWidth.replace("px", "");
        let gutter = window.getComputedStyle(promoContainer).gap;
        gutter = gutter.replace("px", "");

        // "+" operator as prefix to a string converts that string to a number if not NAN
        let translateValue = -1 * (+promoWidth + (+gutter));
        return translateValue;
    }
}

// Function to get the first promo translate value

function initialTranslateValue() {
    let loop = true;
    let count = 0;
    while (loop) {
        let currentElement = promoContainer.children[count];
        if (currentElement.classList.contains("extra")) {
            count++;
        } else {
            loop = false;
        }
    }
    let translateNumber = count - 1;
    let scrollBarwidth = window.innerWidth - document.body.offsetWidth;
    return (getTranslateValue() * translateNumber) - scrollBarwidth / 3;
}

// Function to add image in Promo array
function addPromoInfo(imageNumber, type, data) {
    let promoInfo = new PromoInfo(imageNumber, type, data);
    promoInfoArray.push(promoInfo);
    return promoInfo;
}

// Function to make the promo

function makePromoInfoArray() {
    if (promoInfoArray.length === 0) {

        // Always try to make promos in odd number
        addPromoInfo(1, "Thriller", "The rescue is only the beginning.");
        addPromoInfo(2, "Comedy", "Start your holidays on a high note.");
        addPromoInfo(3, "Comedy", "One new office. Same augmented reality.");
        addPromoInfo(4, "Documentry", "Every breath, a breakthrough.");
        addPromoInfo(5, "Thriller", "New Season.");
        addPromoInfo(6, "Drama", "New film.");
        addPromoInfo(7, "Documentary", "His story in his words.");
        addPromoInfo(8, "Comedy", "Dream mas grande!");
        addPromoInfo(9, "Drama", "Two brothers. One final request.");
        addPromoInfo(10, "Drama", "Based on the international best-selling novel.");
        addPromoInfo(11, "Drama", "Friendship has no last call.");
        addPromoInfo(12, "Drama", "The epic seires comes to an end.");
        addPromoInfo(13, "Drama", "Family. It's a killer.");
        addPromoInfo(14, "Animation", "Sometimes all you need is for everything to go wrong.");
        addPromoInfo(15, "Mystery", "Who do you trust when you can't trust yourself?");
        addPromoInfo(16, "Comedy", "Four Emmy r wins including Outstanding Comedy.");
        addPromoInfo(17, "Comedy", "She's about to change her fortune.");
        addPromoInfo(18, "Documentary", "Unknown. Unexplained. Unbelievable. Until now.");
        addPromoInfo(19, "Drama", "The race continues.");

        for (let index in promoInfoArray) {
            promoInfoArray[index].id = `promo${Number(index) + 1}`;
        }

        return promoInfoArray;
    }
}

// Function to Change the images

function changePromoImages() {
    for (let promo of promoInfoArray) {
        let element = document.querySelector(`#${promo.id}`);
        let image = element.querySelector(".cover-image");

        if (window.matchMedia("(min-width: 650px)").matches) {
            image.style.backgroundImage = `url(${promo.image})`;
        } else {
            image.style.backgroundImage = `url(${promo.phoneImage})`;
        }
    }
}


// Function to close the search input and bar
function closeSearch() {
    navContainer.classList.remove("nav-hide");
    recentContainer.classList.remove("recent-show");
    header.style.transform = "translateY(0)";
    cancelBtnContainer.classList.remove("cancel-show");
}


window.addEventListener("resize", () => {
    let currentFocus = document.querySelector(".promo.focus").getAttribute("data-promo-number");
    promoContainer.classList.remove("transition");
    translateValue = getTranslateValue();
    currentTranslateValue = translateValue * currentFocus;
    promoContainer.style.transform = `translateX(${currentTranslateValue}px)`;
    changePromoImages();
    if (window.matchMedia("(min-width: 1100px)").matches) {
        if (header.classList.contains("open-menu")) {
            header.classList.remove("open-menu");
            closeSearch();
        }
    }
    if (window.matchMedia("(max-width: 1100px)").matches) {
        if (navItemsArray[0].classList.contains("shrink")) {
            navBarAnimation(true);
            searchBarAnimation(true);
        }
    }
});


window.addEventListener("scroll", () => {
    let bottom = carouselContainer.getBoundingClientRect().bottom;
    let top = carouselContainer.getBoundingClientRect().top;
    if (top <= (window.innerHeight / 1.5) && bottom >= (window.innerHeight / 3)) {
        if (carousel === undefined) {
            if (playPauseBtn.classList.contains("play")) {
                carousel = setInterval(playPromoCarousel, carouselInterval);
            }
        }
    } else {
        if (carousel !== undefined) {
            clearInterval(carousel);
            carousel = undefined;
        }
    }
});
