document.addEventListener( 'DOMContentLoaded', (e) => {

	const cssResult = document.getElementById( 'css-result' ),
		  sassResult = document.getElementById( 'sass-result' ),
		  form = document.getElementById( 'generator' ),
		  colorsWrapper = document.getElementById( 'colors' ),
		  addColor = document.getElementById( 'add-color' );

	var counter = 3;

	addColor.addEventListener( 'click', e => {
		e.preventDefault();
		cloneColor();
	} );

	form.addEventListener( 'submit', e => {
		e.preventDefault();
		const colors = getColors();
		if ( Array.isArray( colors ) && colors.length ) {
			generateCode( colors );
			Prism.highlightAll();
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
			sass = '$colors: ( ';

		colors.forEach( function( color, index ) {
			css += '.has-' + color.slug + '-background-color {\n\tbackground-color: ' + color.code + ';\n}\n';
			css += '.has-' + color.slug + '-color {\n\tcolor: ' + color.code + ';\n}\n';
			sass += color.slug + ': ' + color.code;
			if ( index !== colors.length - 1 ) {
				sass += ', '
			}
		} );
		sass += ' );';
		cssResult.innerHTML = css;
		sassResult.innerHTML = sass;
	}

} );