"use strict";

const {ServiceBroker} = require("moleculer");
const TestService = require("../../services/realtime.service");

describe("Test 'realtime' service", () => {

    describe("Test 'realtime._connectToNATS' method", () => {

        it("should return client if NATS online else NatsError'", () => {
            let broker = new ServiceBroker({logger: false});
            const service = broker.createService(TestService);
            return service._connectToNATS().then((nc) => {
                expect(nc.connected).toBeTruthy()
            }).catch(err => expect(err.code).toBe("CONN_ERR"))
        });

    });

    describe("Test 'realtime._disconnectFromNATS' method", () => {
        let broker = new ServiceBroker({logger: false});
        const service = broker.createService(TestService);

        it("should disconnect and clear client", () => {
            service._disconnectFromNATS();
            expect(service._NATSClient).toBeUndefined();
        });

    });


    describe("Test 'realtime._subscribeToNATSQueueGroup' method", () => {

        it("should subscribe to NATS realtime channel and update subscription id", () => {
            let broker = new ServiceBroker({logger: false});
            const service = broker.createService(TestService);
            return service._connectToNATS().then((nc) => {
                service._subscribeToNATSQueueGroup();
                expect(typeof service._subscriptionId).toBe('number');
                service._disconnectFromNATS()
            }).catch(err => expect(err.code).toBe("CONN_ERR"))
        });

    });

    describe("Test 'realtime._unsubscribeFromNATSQueueGroup' method", () => {

        it("should unsubscribe from NATS realtime channel and unset", () => {
            const broker = new ServiceBroker({logger: false});
            const service = broker.createService(TestService);

            return service._connectToNATS().then((nc) => {
                service._subscribeToNATSQueueGroup();
                service._unsubscribeFromNATSQueueGroup();
                expect(service._subscriptionId).toBeUndefined();
                service._disconnectFromNATS()
            }).catch(err => expect(err.code).toBe("CONN_ERR"))
        });

    });

    describe("Test 'life cycle hooks' ", () => {

        it("should subscribe to NATS realtime channel when service started", () => {
            const broker = new ServiceBroker({logger: false});
            const service = broker.createService(TestService);
            return service.schema.started.call(service).then(() => {
                expect(typeof service._subscriptionId).toBe('number');
            }).catch((err) => expect(err.code).toBe("CONN_ERR"));
        });

       it("should connect and unsubscribe to realtime when service stopped", () => {
           const broker = new ServiceBroker({logger: false});
           const service = broker.createService(TestService);
           service.schema.stopped.call(service);
           expect(service._subscriptionId).toBeUndefined();
           expect(service._NATSClient).toBeUndefined();
       })

    });


});

