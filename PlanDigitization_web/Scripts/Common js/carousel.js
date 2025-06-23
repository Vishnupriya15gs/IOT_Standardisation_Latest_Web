let checkCarousel = document.querySelector('.carousel_panel') || false;

if (checkCarousel) {

    setInterval(() => {
        document.querySelector('section').focus();
        console.log("focus");
    }, 5000);

}