"use strict";

/**
 * presence service
 */
module.exports = {

    name: "presence",

    /**
     * Service settings
     */
    settings: {},

    /**
     * Service metadata
     */
    metadata: {},

    /**
     * Service dependencies
     */
    dependencies: [],

    /**
     * Actions
     */
    actions: {},

    /**
     * Events
     */
    events: {
        "realtime.user.heartbeat"(payload) {
            if (this.users.hasOwnProperty(payload.userId)) {
                clearTimeout(this.users[payload.userId])
            }
            this.users[payload.userId]['timestamp'] = payload.ts;
            this.users[payload.userId]['timeout'] = setTimeout(() => {
                this.broker.emit("realtime.user.offline", payload)
            }, 14000)
        }
    },

    /**
     * Methods
     */
    methods: {},

    /**
     * Service created lifecycle event handler
     */
    created() {
        this.users = [];
    },

    /**
     * Service started lifecycle event handler
     */
    started() {

    },

    /**
     * Service stopped lifecycle event handler
     */
    stopped() {

    }
};
