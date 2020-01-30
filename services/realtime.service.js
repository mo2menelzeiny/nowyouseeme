"use strict";

const {NatsError, connect, Client} = require('nats');

/**
 * realtime service
 */
module.exports = {

    name: "realtime",

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
            payload.ts = Date.now();
            this.logger.info('realtime.user.heartbeat:', payload);
        },
        "realtime.user.offline"(payload) {
            this.logger.info('realtime.user.offline:', payload);
            if (this._NATSClient) {
                this._NATSClient.publish('user.' + payload.userId, 'offline')
            }
        },
        "realtime.user.online"(payload) {
            this.logger.info('realtime.user.online:', payload);
            if (this._NATSClient) {
                this._NATSClient.publish('user.' + payload.userId, 'online')
            }
        }

    },

    /**
     * Methods
     */
    methods: {
        /**
         * connect service to NATS server
         * @private
         * @return {Promise<Client|NatsError>}
         */
        _connectToNATS() {
            return new Promise((resolve, reject) => {
                this._NATSClient = connect();
                this._NATSClient.on('error', (err) => reject(err));
                this._NATSClient.on('connect', (nc) => resolve(nc));
            });
        },

        /**
         * disconnect service from NATS server
         * @private
         */
        _disconnectFromNATS() {
            if (this._NATSClient) {
                this._NATSClient.close();
                this._NATSClient = undefined;
            }
        },

        /**
         * subscribe to NATS load balanced channel using job workers
         * @private
         */
        _subscribeToNATSQueueGroup() {
            if (this._NATSClient) {
                this._subscriptionId = this._NATSClient.subscribe('realtime', {queue: 'q1'},
                    (msg) => {
                        this.broker.emit('realtime.heartbeat', {userId: msg})
                    });
            }
        },

        /**
         * unsubscribe from NATS load-balanced channel
         * @private
         */
        _unsubscribeFromNATSQueueGroup() {
            if (this._NATSClient && this._subscriptionId) {
                this._NATSClient.unsubscribe(this._subscriptionId);
                this._subscriptionId = undefined
            }
        }
    },

    /**
     * Service created lifecycle event handler
     */
    created() {

    },

    /**
     * Service started lifecycle event handler
     */
    started() {
        return this._connectToNATS().then(() => {
            this._subscribeToNATSQueueGroup()
        });
    },

    /**
     * Service stopped lifecycle event handler
     */
    stopped() {
        this._unsubscribeFromNATSQueueGroup();
        this._disconnectFromNATS()
    }
};
