document.addEventListener( 'DOMContentLoaded', (e) => {

	const cssResult = document.getElementById( 'css-result' ),
		  sassResult = document.getElementById( 'sass-result' ),
		  phpResult = document.getElementById( 'php-result' ),
		  form = document.getElementById( 'generator' ),
		  fieldsetsWrapper = document.querySelectorAll( '.fieldsets-wrapper' ),
		  addFieldset = document.querySelectorAll( '.add-fieldset' );


	// event on click Add color/font button
	addFieldset.forEach( el => el.addEventListener(
		'click', event => {
	  		event.preventDefault();
	  		cloneFieldset( event );
		}
	) );

	// event on click Generate button
	form.addEventListener( 'submit', e => {
		e.preventDefault();
		const values = getValues();
		if ( Object.keys( values ).length !== 0 && values.constructor === Object ) {
			generateCode( values );
			Prism.highlightAll(); // highlight new codes
			document.getElementById( 'results' ).scrollIntoView( { behavior: 'smooth' } ); // scroll to results
		}
	} );

	fieldsetsWrapper.forEach( el => el.addEventListener(
		'click', event => {
	  		if ( event.target && event.target.matches( '.delete-fieldset' ) ) {
	  			event.preventDefault();
	  			removeFieldset( event.target );
	  		}
		}
	) );

	/**
	* Get all fieldset colors, construct array of colors objects, return an array
	*/
	function getValues() {
		const 	colorGroups = document.querySelectorAll( '.fieldset-group[data-type="color"]' ),
				fontGroups = document.querySelectorAll( '.fieldset-group[data-type="font"]' ),
				colorArr = [],
				fontArr = [];
		// for each fieldset, construct and object
		colorGroups.forEach( function( colorGroup, index ) {
			const colors = colorGroup.querySelectorAll( '.fieldset-input' );
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

		fontGroups.forEach( function( fontGroup, index ) {
			const fonts = fontGroup.querySelectorAll( '.fieldset-input' );
			const fontObj = {};
			// foreach input in fieldset, push name => value in object
			fonts.forEach( function( font, index ) {
				const type = font.getAttribute( 'data-type' );
				if ( font.value.length ) {
					fontObj[ type ] = font.value;
				}
			} );
			if ( Object.keys( fontObj ).length !== 0 && fontObj.constructor === Object ) {
				fontArr.push( fontObj );
			}
		});
		
		var values = { 'colors': colorArr, 'fonts': fontArr };
		return values;
	}

	/**
	* Duplicate fieldset color/font : clone last color group element
	*/
	function cloneFieldset( event ) {

		var type = event.target.getAttribute( 'data-type' );
		if ( ! type ) {
			return;
		}
		
		var defaultFieldset = document.getElementById( 'default-' + type ),
			fieldsetWrapper = document.getElementById( 'fieldsets-' + type );

		if ( ! defaultFieldset || ! fieldsetWrapper ) {
			return;
		}		
		
		clone = defaultFieldset.cloneNode( true );

		// remove ID and add class
		clone.removeAttribute( 'id' );
		clone.setAttribute( 'class', 'fieldset-group' );
		// append clone
		fieldsetWrapper.append( clone );
		// give focus to first input in clone
		clone.getElementsByTagName('input')[0].focus();
	}

	function removeFieldset( e ) {
		e.parentElement.remove();	
		// give focus to add color button
		//addColor.focus();	
	}

	/**
	* Generate code with array of colors and fonts
	*/
	function generateCode( values ) {
		
		var css = '',
			sass = '',
			php = "";

		if ( Array.isArray( values.colors ) && values.colors.length ) {
			sass += '/* colors variables */\n$colors: ( ';
			php += "add_theme_support( 'editor-color-palette', array(\n";
			css += '/* colors */\n';
			values.colors.forEach( function( color, index ) {
				const slug = slugify( color.name );
				css += '.has-' + slug + '-background-color {\n\tbackground-color: ' + color.code + ';\n}\n';
				css += '.has-' + slug + '-color {\n\tcolor: ' + color.code + ';\n}\n';
				sass += slug + ': ' + color.code;
				if ( index !== values.colors.length - 1 ) {
					sass += ', '
				}
				php += "\tarray(\n\t\t'name' => __( '" + color.name + "', 'textdomain' ),\n\t\t'slug' => '" + slug + "',\n\t\t'color' => '" + color.code + "', \n\t),\n"
			} );
			sass += ' );';
			php += ') );\n';
		}

		if ( Array.isArray( values.fonts ) && values.fonts.length ) {
			sass += '\n/* font sizes variables */\n$fonts: ( ';
			php += "add_theme_support( 'editor-font-sizes', array(\n";
			css += '/* fonts */\n';
			values.fonts.forEach( function( font, index ) {
				const slug = slugify( font.name );
				css += '.has-' + slug + '-font-size {\n\tfont-size: ' + font.code + 'px;\n}\n';
				sass += slug + ': ' + font.code;
				if ( index !== values.fonts.length - 1 ) {
					sass += ', '
				}
				php += "\tarray(\n\t\t'name' => __( '" + font.name + "', 'textdomain' ),\n\t\t'slug' => '" + slug + "',\n\t\t'size' => '" + font.code + "', \n\t),\n"
			} );
			sass += ' );';
			php += ') );';
		}

		// insert codes
		cssResult.innerHTML = css;
		sassResult.innerHTML = sass;
		phpResult.innerHTML = php;
	}

	/* transform name into slug 
	* https://mhagemann.medium.com/the-ultimate-way-to-slugify-a-url-string-in-javascript-b8e4a0d849e1
	*/
	function slugify(string) {
	  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
	  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
	  const p = new RegExp(a.split('').join('|'), 'g')

	  return string.toString().toLowerCase()
	    .replace(/\s+/g, '-') // Replace spaces with -
	    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
	    .replace(/&/g, '-and-') // Replace & with 'and'
	    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
	    .replace(/\-\-+/g, '-') // Replace multiple - with single -
	    .replace(/^-+/, '') // Trim - from start of text
	    .replace(/-+$/, '') // Trim - from end of text
	}

} );