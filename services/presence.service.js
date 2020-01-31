"use strict";

module.exports = {
    name: "presence",
    actions: {
        getUserPresence(ctx) {
            return this._userPresenceById(ctx.params.userId)
        }
    },
    events: {
        "realtime.user.heartbeat"(payload) {
            const uid = payload.userId;
            clearTimeout(this._userPresenceById(uid)['timeout']);
            this._userPresenceById(uid)['timestamp'] = payload.timestamp;
            this._userPresenceById(uid)['timeout'] = setTimeout(() => {
                this.broker.emit("realtime.user.offline", payload)
            }, 10000)
        }
    },
    methods: {
        _userPresenceById(userId) {
            if (!this._users.hasOwnProperty(userId)) {
                this._users[userId] = {};
            }
            return this._users[userId]
        }
    },
    created() {
        this._users = {};
    }
};
