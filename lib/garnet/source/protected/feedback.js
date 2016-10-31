enyo.ready(function() {

	(function (enyo, g, scope) {
		/**
		* _g.playFeedback_ is a wrapper API to play feedback sound.
		*
		* @public
		*/

		window.webOS = window.webOS || {};

		if (window.webOS && window.webOS.feedback && window.webOS.feedback.play) {
			g.playFeedback = window.webOS.feedback.play;
		} else {
			g.playFeedback = enyo.nop;
		}

	})(enyo, g, this);

});
