"use strict";

const ApiGateway = require("moleculer-web");

module.exports = {
	name: "api",
	mixins: [ApiGateway],
	settings: {
		port: process.env.PORT || 3000,

		routes: [{
			path: "/api",
			whitelist: [
				// Access to any actions in all services under "/api" URL
				"authorization.generateUserId",
				"presence.getPresenceTimestamp"
			]
		}],

		// Serve assets from "public" folder
		assets: {
			folder: "public"
		}
	}
};
