enyo.path.addPath("enyo", "/usr/palm/frameworks/enyo-bundle/1.0-alpha-3/enyo");
enyo.path.addPath("lib\garnet", "/usr/palm/frameworks/enyo-bundle/1.0-alpha-3/lib/garnet");
enyo.path.addPath("lib\enyo-webos", "/usr/palm/frameworks/enyo-bundle/1.0-alpha-3/lib/enyo-webos");
enyo.path.addPath("lib\enyo-ilib", "/usr/palm/frameworks/enyo-bundle/1.0-alpha-3/lib/enyo-ilib");
enyo.path.addPath("lib\enyo-cordova", "/usr/palm/frameworks/enyo-bundle/1.0-alpha-3/lib/enyo-cordova");
enyo.path.addPath("lib", "lib");
enyo.depends(
	"/usr/palm/frameworks/enyo-bundle/1.0-alpha-3/lib/enyo-webos",
	"/usr/palm/frameworks/enyo-bundle/1.0-alpha-3/lib/garnet",
	"build\app1.css",
	"build\app1.js"
);