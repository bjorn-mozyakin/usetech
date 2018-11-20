'use strict';

$(document).ready(function() {

  // Content
  $('.content__btn').on('click', handleClickContentBtn);
  $('.content__article__close').on('click', handleClickContentClose);


  // Slideshow
  changeMotto(1);

  var timerSlide = setInterval(slideshow, 5000);
  $('.slideshow__imgs_list').on('click', handleClickSlideshow);




  // Content Handlers
  function handleClickContentBtn(e) {
    $('.content__article').toggleClass('content__article_hidden');
    $('.content__arrow').toggleClass('content__arrow_hidden')
  }

  function handleClickContentClose(e) {
    $('.content__article').addClass('content__article_hidden');
    $('.content__arrow').addClass('content__arrow_hidden')

  }


  // Slideshow handlers
  function slideshow() {
    var currentNum = +$('.main__background_current').data('num');
    var newNum = currentNum + 1;
    if (newNum > 6) newNum = 1;

    changeBgImg(currentNum, newNum);
  }

  function handleClickSlideshow(e) {
    if (!$(e.target).hasClass('slideshow__img')) return;

    stopSlide();

    var currentNum = $('.slideshow__img_current').data('num');
    var newNumber = +$(e.target).data('num');
    console.log(this);
    console.log(e.target);


    changeBgImg(currentNum, newNumber);

    startSlide();
  }

  function stopSlide (argument) {
    clearInterval(timerSlide);
  }

  function startSlide (argument) {
    timerSlide = setInterval(slideshow, 5000);
  }

  function changeBgImg (currentNum, newNum) {
    var currentBg = $('.main__background[data-num="' + currentNum + '"]');
    var newBg = $('.main__background[data-num="' + newNum + '"]');

    newBg.fadeIn(500).addClass('main__background_current');
    currentBg.fadeOut(500).removeClass('main__background_current');

    changeMotto(newNum);
    changePreview(currentNum, newNum);
  }

  function changeMotto(newNum) {
    var motto = $('.slideshow__img[data-num="' + newNum + '"]').data('text');
    $('.slideshow__img-motto').html(motto);
  }

  function changePreview(currentNum, newNum) {
    $('.slideshow__img[data-num="' + currentNum + '"]').removeClass('slideshow__img_current');
    $('.slideshow__img[data-num="' + newNum + '"]').addClass('slideshow__img_current');
  }


})