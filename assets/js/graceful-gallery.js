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
			"slider_timeout" : 6000,
			"disable_css_animations" : false

		}, args);

		return this.each( function( ) {

			var self = $( this ),
				width = $( this ).outerWidth( ),
				pagination = false,
				pages_holder = $( this ).find( ".slider-pages" ),
				pages = $( pages_holder ).children(),
				total_pages = $( pages ).length,
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

				if ( ! opts.disable_css_animations && typeof window.Modernizr !== 'undefined' && Modernizr.csstransitions ) {

					pages_holder.css( 'transform', [ "translate(-", left, "px)" ].join("") );
					pages_holder.css( 'transition', [ opts.slider_speed + 'ms cubic-bezier( 0.25, 0.1, 0.25, 1)' ].join("") );

				} else {

					pages_holder.animate({ 'left': [ "-", left, "px" ].join("") }, opts.slider_speed );

				}

				// restart timer
				clearTimeout( slider_timer );
				slider_timer = setTimeout( function() {

					if ( ++index < total_pages ) {
						left = width * index;
					} else {
						left = index = 0;
					}

					slide( left );

				}, opts.slider_timeout );

				$( pagination ).siblings( ).removeClass( opts.current_class ).eq( index ).addClass( opts.current_class );

			};

			// setup the holder width
			$( pages_holder ).width( width * total_pages );

			// generate the pagination markup
			while( i < total_pages ) {	html.push( '<a class="' ); html.push( opts.pagination_classes ); html.push( '" href="#">' ); html.push( ++i ); html.push( '</a>' ); }
			html.push( '</div>' );
			$( self ).append( html.join("") );
			pagination = $( self ).find( '.slider-pagination a' );

			var click_function = function( ) {

				index = $( this ).index( );
				slide( width * index );

				return false;

			};
			
			// setup pagination
			if ( $.isFunction( $.fn.on ) ) {
				
				$( pagination ).on( 'click', click_function );	
				
			} else {
				
				$( pagination ).live( 'click', click_function );
				
			}	

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
