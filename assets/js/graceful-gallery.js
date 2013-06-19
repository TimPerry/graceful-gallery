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
			"slider_timeout" : 2000,
			"disable_css_animations" : false

		}, args);

		return this.each( function( ) {

			var globals = {
			
				self : $( this ),
				width : $( this ).outerWidth( ),
				pagination : false,
				pages_holder : $( this ).find( ".slider-pages" ),
				pages : null,
				total_pages : null,
				slider_timer : 0,
				index : -1,
				i : 1,
				html : [

					'<div class="slider-pagination"><a class="',
					opts.pagination_classes,
					' ',
					opts.current_class,
					'" href="#">1</a>'

				]				
			};
            
            // setup the extra variables now we have all the data
            globals.pages = $( globals.pages_holder ).children();
            globals.total_pages = globals.pages.length;

			var methods = {
				
				slide : function( increment ) {
					 
                    increment = increment || true;
                     
                    // first things first, clear the timeout     
                    clearTimeout( globals.slider_timer );
                    
                    // force the class
					$( globals.pagination ).siblings( ).removeClass( opts.current_class ).eq( globals.index ).addClass( opts.current_class );
                    
                    // now increment our index
					if ( increment && ( ++globals.index >= globals.total_pages ) ) {
						globals.index = 0;
					}
                    
                    // caclulate where we should slide to
                    var left = globals.index * globals.width;
                                    		
                    // perform the slide
					if ( ! opts.disable_css_animations && typeof window.Modernizr !== 'undefined' && Modernizr.csstransitions ) {

						globals.pages_holder.css( 'transform', [ "translate(-", left, "px)" ].join("") );
						globals.pages_holder.css( 'transition', [ opts.slider_speed + 'ms cubic-bezier( 0.25, 0.1, 0.25, 1)' ].join("") );

					} else {

						globals.pages_holder.animate({ 'left': [ "-", left, "px" ].join("") }, opts.slider_speed );

					}

					// restart timer
					globals.slider_timer = setTimeout( function() {

						methods.slide( false );

					}, opts.slider_timeout );

				},
				update_widths : function() {

                    // update the width used for each page
					globals.width = globals.self.outerWidth();
                    
                    // force the width
					globals.pages.width( globals.width );
                    
                    // make the pages holder wide enough for all the pages
					globals.pages_holder.width( globals.width * globals.total_pages );

				},
				setup_pagination : function( ) {
				
					// generate the pagination markup
					while( globals.i < globals.total_pages ) {
					        
                            globals.i++;

                            globals.html.push( '<a class="' );
							globals.html.push( opts.pagination_classes );
							globals.html.push( '" href="#">' );
							globals.html.push( globals.i );
							globals.html.push( '</a>' );

					}
					
					globals.html.push( '</div>' );
					$( globals.self ).append( globals.html.join("") );
					globals.pagination = $( globals.self ).find( '.slider-pagination a' );

					var click_function = function( ) {

						globals.index = $( this ).index( );
						methods.slide( );

						return false;

					};
			
					// setup pagination
					if ( $.isFunction( $.fn.on ) ) {
						$( globals.pagination ).on( 'click', click_function );	
					} else {
						$( globals.pagination ).live( 'click', click_function );
					}
					
				}
			
			};

			// update width on resize
			$( window ).resize( function( ) {
				methods.update_widths();
			});

			// pause on hover
			//$( globals.self ).hover( function( ) {
			//	clearTimeout( globals.slider_timer );
			//}, function( ) {
			//	methods.slide( );
			//});
			
			// setup pagination
			methods.setup_pagination();
			
			// setup the widths
			methods.update_widths();
			
			// start up
			methods.slide( );

		});

	};

})(jQuery);
