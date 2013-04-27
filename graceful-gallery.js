/*
*
* Graceful gallery
* by Tim Perry (www.applicious.co)
* v1.0 - April 2013
* 
*/
(function($) {

	$.fn.GracefulGallery = function( args ) {

		var opts = $.extend({

			"current_class": "is-current",
			"pagination_classes" : "",
			"slider_speed" : 1000,
			"slider_timeout" : 6000

		}, args);

		return this.each( function( ) {

			var self = $( this ),
				width = $( this ).outerWidth( ),
				pagination = false,
				images_holder = $( this ).find( ".slider-images" ),
				images = $( images_holder ).find( "img" ),
				total_images = $( images ).length,
				slider_timer = 0,
				index = 0,
				i = 1,
				html = [

					'<div class="slider-pagination"><a class="',
					opts.pagination_classes,
					' ',
					opts.current_class,
					'" href="#">1</a>'

				];

			var slide = function( left ) {

				if ( typeof window.Modernizr !== 'undefined' && Modernizr.csstransitions ) {

					images_holder.css( 'transform', [ "translate(-", left, "px)" ].join("") );
					images_holder.css( 'transition', [ opts.slider_speed + 'ms cubic-bezier( 0.25, 0.1, 0.25, 1)' ].join("") );

				} else {

					images_holder.animate({ 'left': [ "-", left, "px" ].join("") }, opts.slider_speed );

				}

				// restart timer
				clearTimeout( slider_timer );
				slider_timer = setTimeout( function() {

					if ( ++index < total_images ) {
						left = width * index;
					} else {
						left = index = 0;
					}

					slide( left );

				}, opts.slider_timeout );

				$( pagination ).siblings( ).removeClass( opts.current_class ).eq( index ).addClass( opts.current_class );

			};

			// setup the holder width
			$( images_holder ).width( width * total_images );

			// generate the pagination markup
			while( i < total_images ) {	html.push( '<a class="' ); html.push( opts.pagination_classes ); html.push( '" href="#">' ); html.push( ++i ); html.push( '</a>' ); }
			html.push( '</div>' );
			$( self ).append( html.join("") );
			pagination = $( self ).find( '.slider-pagination a' );

			// setup pagination
			$( pagination ).on( 'click', function( ) {

				index = $( this ).index( );
				slide( width * index );

				return false;

			});

			// update width on resize
			$( window ).resize( function( ) {
				width = $( self ).outerWidth( );
			});

			// puase on hover
			$( self ).hover( function( ) {

				clearTimeout( slider_timer );

			}, function( ) {

				slide( width * index );

			});

			// start up
			slide( 0 );

		});

	};

})(jQuery);