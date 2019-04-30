var $ = jQuery;

$(document).ready( function (){

	// Tooltip for everywhere in website
	$('[data-toggle="tooltip"]').tooltip();

	// slider of top navigation
	if ($(window).width() < 1300) {
		$('.secondary-nav').slick({
			infinite: false,
			slidesToShow: 6,
			slidesToScroll: 1,
			autoplaySpeed: 4000,
			speed: 700,
			responsive: [
			    {
			      breakpoint: 1300,
			      settings: {
			        slidesToShow: 5,
			        slidesToScroll: 1
			      }
			    },
			     {
			      breakpoint: 1200,
			      settings: {
			        slidesToShow: 4,
			        slidesToScroll: 1
			      }
			    },
			    {
			      breakpoint: 767,
			      settings: {
			        slidesToShow: 1,
			        slidesToScroll: 1
			      }
			    }
			]
		});
	}

	
	$(".secondary-nav a").click(function (){
		$(".secondary-nav a").removeClass('active');
		$(this).addClass('active');
		return false;
	});

	// tree tab accordion functionality
	$(".table-collapse-icon").click(function (){
		if( $(this).hasClass('active') ){
			$(this).removeClass('active');
			$(this).parents('thead').next('tbody').addClass('close');
		}
		else{
			$(this).addClass('active');
			$(this).parents('thead').next('tbody').removeClass('close');
		}
		return false;
	});

	// tree tab accordion functionality
	// $(".article-section h3 a").click(function (){
	// 	if( $(this).parent().hasClass('active') ){
	// 		$(this).parent().removeClass('active');
	// 	}
	// 	else{
	// 		$(this).parent().addClass('active');
	// 	}
	// 	return false;
	// })

	$("#txtEditor").Editor({
		'togglescreen':false,
		'fonteffects':false,
		'font_size':false,
		'fonts':false,
		'rm_format':false,
		'styles':false,
		'status_bar':false,
		'textformats':false
	});

});


$( function() {
    $( ".datepicker" ).datepicker();

    $( ".sortable" ).sortable({
        revert: true
    });

    $( "#sortable1, #sortable2, #sortable3" ).sortable({
      connectWith: ".board-body"
    }).disableSelection();

    
});


