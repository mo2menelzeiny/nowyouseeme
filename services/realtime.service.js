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
    events: {},

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
                        // handle messages here
                        this.logger.info(msg)
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
        this._connectToNATS().then(() => {
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
