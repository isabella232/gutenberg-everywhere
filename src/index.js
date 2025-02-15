/**
 * WordPress dependencies
 */

import { render } from '@wordpress/element';
import { useEffect } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';
import { useDispatch } from '@wordpress/data';
import IsolatedBlockEditor, { EditorLoaded } from '@automattic/isolated-block-editor';

/**
 * Internal dependencies
 */

import './style.scss';

/**
 * Save blocks to the comment form
 *
 * @param {string} content Comment content.
 */
function saveBlocks( textarea, content ) {
	if ( textarea ) {
		textarea.value = content;
	}
}

function setLoaded( container ) {
	const closest = container.closest( '.iso-editor__loading' );

	if ( closest ) {
		closest.classList.remove( 'iso-editor__loading' );
	}
}

function createContainer( textarea, existingContainer ) {
	if ( existingContainer && ! existingContainer.contains( textarea ) ) {
		return existingContainer;
	}

	const container = document.createElement( 'div' );

	// Insert the container
	textarea.parentNode.insertBefore( container, textarea );

	return container;
}

function BuddyPress( props ) {
	const { textarea } = props;
	const { resetBlocks } = useDispatch( 'core/block-editor' );

	function onClear( mutationsList, observer ) {
		jQuery( '#whats-new' ).focusin();
		resetBlocks( [] );
	}

	useEffect( () => {
		// Show the buddypress buttons
		jQuery( '#whats-new' ).focusin();
		const observer = new MutationObserver( onClear );

		observer.observe( textarea, { attributes: true } );

		return () => {
			observer.disconnect();
		};
	}, [] );

	return null;
}

function createEditor( container, textarea, settings ) {
	render(
		<IsolatedBlockEditor
			settings={ settings }
			onSaveContent={ ( content ) => saveBlocks( textarea, content ) }
			onLoad={ ( parser ) => ( textarea && textarea.nodeName === 'TEXTAREA' ? parser( textarea.value ) : [] ) }
			onError={ () => document.location.reload() }
		>
			<EditorLoaded onLoaded={ () => setLoaded( container ) } />

			{ settings.editorType === 'buddypress' && <BuddyPress textarea={ textarea } /> }
		</IsolatedBlockEditor>,
		container
	);
}

domReady( () => {
	document.querySelectorAll( wpGutenbergEverywhere.saveTextarea ).forEach( ( node ) => {
		const container = createContainer( node, document.querySelector( wpGutenbergEverywhere.container ) );

		createEditor( container, node, wpGutenbergEverywhere );
	} );
} );
