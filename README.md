#Graceful gallery

Graceful gallery is a effcient jQuery image slider with automatic pagination generation.

1. Include graceful gallery.
	
		<script src="/assets/js/libs/graceful-gallery.min.js"></script>

2. Your markup should be (wrap class can be anything but inner images wrap but me called slider-images).
	
		<div class="slider" id="slider">
			<div class="slider-images">
				<img src=""/>
				<img src=""/>
			</div>
		</div>
	
3. Setup graceful gallery in your main.js file.

		$( "#slider" ).GracefulGallery({
			"pagination_classes" : "s s--circle"		
		});
