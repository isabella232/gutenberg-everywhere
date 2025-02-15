<?php

class Gutenberg_bbPress extends Gutenberg_Handler {
	/**
	 * Constructor
	 */
	public function __construct() {
		if ( ! is_admin() ) {
			add_filter( 'the_editor', [ $this, 'the_editor' ] );
			add_filter( 'wp_editor_settings', [ $this, 'wp_editor_settings' ], 10, 2 );
		}

		add_filter( 'bbp_get_the_content', [ $this, 'add_to_bbpress' ] );

		// Ensure blocks are processed when displaying
		add_filter( 'bbp_get_forum_content', function( $content ) {
			return $this->do_blocks( $content, 'bbp_get_forum_content' );
		}, 8 );
		add_filter( 'bbp_get_reply_content', function( $content ) {
			return $this->do_blocks( $content, 'bbp_get_reply_content' );
		}, 8 );

		add_filter( 'bbp_register_topic_post_type', [ $this, 'support_gutenberg' ] );
		add_filter( 'bbp_register_reply_post_type', [ $this, 'support_gutenberg' ] );
		add_filter( 'bbp_register_forum_post_type', [ $this, 'support_gutenberg' ] );
	}

	public function support_gutenberg( $args ) {
		$args['show_in_rest'] = true;
		return $args;
	}

	public function add_to_bbpress( $content ) {
		$this->load_editor( '.bbp-the-content', '.gutenberg-everywhere' );
		return $content;
	}
}
