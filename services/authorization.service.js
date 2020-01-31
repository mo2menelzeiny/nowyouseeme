"use strict";

const crypto = require("crypto");

module.exports = {
    name: "authorization",
    actions: {
        generateUserId() {
            return crypto.randomBytes(16).toString("hex")
        }
    }
};
