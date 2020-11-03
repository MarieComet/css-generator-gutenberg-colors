document.addEventListener( 'DOMContentLoaded', (e) => {

	const colorGroups = document.querySelectorAll( '.color-group' ),
		  cssResult = document.getElementById( 'css-result' ),
		  sassResult = document.getElementById( 'sass-result' );

	/**
	* Get all fieldset colors, construct array of colors objects, return an array
	*/
	function getColors() {
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

	const form = document.getElementById( 'generator' );
	form.addEventListener( 'submit', e => {
		e.preventDefault();
		const colors = getColors();
		if ( Array.isArray( colors ) && colors.length ) {
			generateCode( colors );
			Prism.highlightAll();
		}
	} );
} );