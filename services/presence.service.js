"use strict";

module.exports = {
    name: "presence",
    actions: {
        getPresenceTimestamp: {
            params : {
                userId: {type: "string"}
            },
            handler(ctx) {
                return this._presenceTimestamp(ctx.params.userId);
            }
        }
    },
    events: {
        "realtime.user.heartbeat"(payload) {
            const userId = payload.userId;
            if (!this._timeouts.hasOwnProperty(userId)) {
                this._timeouts[userId] = {};
            }
            clearTimeout(this._timeouts[userId]);
            this._timeouts[userId] = setTimeout(() => {
                this.broker.emit("realtime.user.offline", payload)
            }, 10000);

            return this.broker.cacher.set("presence." + payload.userId, payload.timestamp)
        }
    },
    methods: {
        _presenceTimestamp(userId) {
            return this.broker.cacher.get("presence." + userId)
        }
    },
    created() {
        this._timeouts = {};
    }
};
