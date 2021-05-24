$(document).ready(function () {
	$(".user-panel-profile a").click(function(){
	  $(".profile-dropdown").toggle();
	});
  // active-dropdown
  $(".single-menu").click(function(){
     if($(this).hasClass('active-dropdown')){
        $('.single-menu').removeClass('active-dropdown');
      }else{
        $('.single-menu').removeClass('active-dropdown');
        $(this).addClass('active-dropdown');
      }    
  });
});
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
});
jQuery(document).mouseup(function(e) {
    var container = jQuery('.profile-dropdown');
    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0) {
        jQuery('.profile-dropdown').fadeOut();
    }
});
$(window).on('load', function () { // makes sure the whole site is loaded 
  // $('.theme-preloader').fadeOut(); // will first fade out the loading animation 
  $('.theme-preloader').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website. 
  $('body').delay(350).css({
    'overflow': 'visible'
  });
});