document.addEventListener( 'DOMContentLoaded', (e) => {

	const cssResult = document.getElementById( 'css-result' ),
		  sassResult = document.getElementById( 'sass-result' ),
		  phpResult = document.getElementById( 'php-result' ),
		  form = document.getElementById( 'generator' ),
		  colorsWrapper = document.getElementById( 'colors' ),
		  addColor = document.getElementById( 'add-color' );

	// initial colors counter (2, start at 3)
	var counter = 3;

	// event on click Add color button
	addColor.addEventListener( 'click', e => {
		e.preventDefault();
		cloneColor();
	} );

	// event on click Generate button
	form.addEventListener( 'submit', e => {
		e.preventDefault();
		const colors = getColors(); // get colors in form
		if ( Array.isArray( colors ) && colors.length ) {
			generateCode( colors );
			Prism.highlightAll(); // highlight new codes
			document.getElementById( 'results' ).scrollIntoView( { behavior: 'smooth' } ); // scroll to results
		}
	} );

	/**
	* Get all fieldset colors, construct array of colors objects, return an array
	*/
	function getColors() {
		const colorGroups = document.querySelectorAll( '.color-group' );
		const colorArr = [];
		// for each fieldset, construct and object
		colorGroups.forEach( function( colorGroup, index ) {
			const colors = colorGroup.querySelectorAll( '.color-input' );
			const colorObj = {};
			// foreach input in fieldset, push name => value in object
			colors.forEach( function( color, index ) {
				const type = color.getAttribute( 'data-type' );
				if ( color.value.length ) {
					colorObj[ type ] = color.value;
				}
			} );
			if ( Object.keys( colorObj ).length !== 0 && colorObj.constructor === Object ) {
				colorArr.push( colorObj );
			}
		});
		
		return colorArr;
	}

	/**
	* Duplicate fieldset color : clone last color group element
	*/
	function cloneColor() {
		var lastItem = document.querySelector( '.color-group:last-of-type' ),
			clone = lastItem.cloneNode( true ),
			legend = clone.getElementsByTagName( 'legend' )[0];

		// Clear all inputs in clone
		clone.querySelectorAll( 'input' ).forEach( function( input, index ) {
			input.value = '';
		} );
		// Increment legend
		legend.innerHTML = 'Color #' + counter;
		colorsWrapper.append( clone );

		counter++;
	}


	/**
	* Generate code with array of colors
	*/
	function generateCode( colors ) {
		var css = '',
			sass = '$colors: ( ',
			php = "add_theme_support( 'editor-color-palette', array(\n";

		colors.forEach( function( color, index ) {
			css += '.has-' + color.slug + '-background-color {\n\tbackground-color: ' + color.code + ';\n}\n';
			css += '.has-' + color.slug + '-color {\n\tcolor: ' + color.code + ';\n}\n';
			sass += color.slug + ': ' + color.code;
			if ( index !== colors.length - 1 ) {
				sass += ', '
			}
			php += "\tarray(\n\t\t'name' => __( '" + color.name + "', 'textdomain' ),\n\t\t'slug' => '" + color.slug + "',\n\t\t'code' => '" + color.code + "', \n\t),\n"
		} );
		sass += ' );';
		php += ') );';

		// insert codes
		cssResult.innerHTML = css;
		sassResult.innerHTML = sass;
		phpResult.innerHTML = php;
	}

} );