enyo.kind({
	name: "PanelStack",
	statics: {
        isEmulated: false,
		start: function(self, inInfo, inMoreInfo) {
            // on talkback, multi-creations problem patched
            if(inInfo.name == self.parent.getActive().getName())
                return ;

			if(self.unfocus) {
				self.unfocus();
			}

			self.parent.pushPanel(inInfo, inMoreInfo);

			var nextPanel = self.parent.getActive();
			if(nextPanel.focus) {
				nextPanel.focus();
			}
		},
		finish: function(self) {
			var lastIndex = self.parent.getIndex();
			var panels = self.parent;
			if(self.unfocus) {
				self.unfocus();
			}

			self.parent.popPanels(lastIndex);

			var currentIndex = lastIndex - 1;
			if(currentIndex >= 0) {
				var prevPanel = panels.getActive();
				if(prevPanel.focus) {
					prevPanel.focus();
				}
			}
		},
		isFocused: function(self) {
			if(self === self.parent.getActive()) {
				return true;
			} else {
				return false;
			}
		}
	}
});