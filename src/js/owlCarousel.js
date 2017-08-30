// Module Owl Carousel
module.exports = function() {
  $('.info-slider').owlCarousel({
    loop: false,
    items: 3,
    nav: true,
    navText: ["<img src='../images/icons/left-arrow.svg'>","<img src='../images/icons/right-arrow.svg'>"],
    dots: false
  });
};