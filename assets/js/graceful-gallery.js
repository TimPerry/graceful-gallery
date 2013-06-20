/*
 *
 * Graceful gallery
 * by Tim Perry (www.applicious.co)
 * v1.0 - April 2013
 *
 */
(function($) {

	$.fn.GracefulGallery = function(args) {

		var opts = $.extend({

			"current_class": "is-current",
			"pagination_classes": "",
			"slider_speed": 1000,
			"slider_timeout": 5000,
			"disable_css_animations": false
			"panels_container" : ".slider-pages"

		}, args );
		
		var methods = {
			
			slide : function( $slider, should_increment ) {
					
				clearTimeout( $slider.timer );
				
				// check if we needs to increment
				if( should_increment && ( ++$slider.page_num >= $slider.pages_count ) ) {
					$slider.page_num = 0;
				}
				
	            // force the class
	            $( $slider.pagination ).siblings( ).removeClass( opts.current_class ).eq( $slider.page_num ).addClass( opts.current_class );
				
				// calc the new left value
				var left = $slider.page_width * $slider.page_num;
				
				// perform the slide
				if ( ! opts.disable_css_animations && typeof window.Modernizr !== 'undefined' && Modernizr.csstransitions ) {

					$slider.pages_holder.css( "transform", [ "translate(-", left, "px)" ].join( "" ) );
					$slider.pages_holder.css( "transition", [ opts.slider_speed + "ms cubic-bezier( 0.25, 0.1, 0.25, 1)" ].join( "" ) );

				} else {

					$slider.pages_holder.animate({
						'left': [ "-", left, "px" ].join( "" )
					}, opts.slider_speed);

				}
				
				// slide again in x seconds
				$slider.timer = setTimeout( function() {
					methods.slide( $slider, true );					
				}, opts.slider_timeout );
				
			}, update_widths : function( $slider ) {
				
				$slider.page_width = $slider.outerWidth();
				$slider.pages.width( $slider.page_width );
				$slider.pages_holder.width( $slider.page_width * $slider.pages_count );
				
			},
			setup_attrs : function( $slider ) {
			
				// setup slider attrs
				$slider.pages_holder = $slider.find( opts.panels_container );
				$slider.pages = $slider.pages_holder.children( );
				$slider.pagination = false; // setup in setup_pagination
				
				$slider.page_width = false; // setup laster in update widths
				$slider.pages_count = $slider.pages.length;
				$slider.timer = 0;
				$slider.page_num = 0;
				
				// setup the width
				methods.update_widths( $slider );
				
			},
			setup_pagination : function( $slider ) {
								
				var i = 1,
		        	html = [

			        '<div class="slider-pagination"><a class="',
			        opts.pagination_classes,
			        ' ',
			        opts.current_class, '" href="#">1</a>'

		        ];

				// generate the pagination markup
				while ( i++ < $slider.pages_count ) {

					html.push( '<a class="' );
					html.push( opts.pagination_classes );
					html.push( '" href="#">' );
					html.push( i );
					html.push( '</a>' );

				}

				html.push( '</div>' );
				$( $slider ).append( html.join( "" ) );
				
				// we can now setup the pagination
				$slider.pagination = $slider.find( '.slider-pagination' ).find( 'a' );	
				
			},
			setup_listeners : function( $slider ) {
				
				// setup click listener
				$slider.pagination.click( function( e ) {
										
					$slider.page_num = $( this ).index( );
					methods.slide( $slider, false );
					
					e.preventDefault( );

				});
			
				// update widths on resize
				$( window ).resize( function( ) {
					
					// update widths
					methods.update_widths( $slider );
					$slider.pages_holder.css( 'left', [ "-", ( $slider.page_width * $slider.page_num ), "px" ].join( "" ) );
					
				});
				
		        // pause on hover
		        $( $slider ).hover( function( ) {
		        	clearTimeout( $slider.timer );
		        }, function( ) {
		        	methods.slide( $slider, false );
		        });

			}

		};

		// setup each slider
		return this.each( function( ) {

			// cache the slider
			var $slider = $( this );

			// set everything up
			methods.setup_attrs( $slider );
			methods.setup_pagination( $slider );
			methods.setup_listeners( $slider );
			
			// start animating
			methods.slide( $slider, false );

		});

	};

})(jQuery);