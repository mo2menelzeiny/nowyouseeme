"use strict";

const { ServiceBroker } = require("moleculer");
const TestService = require("../../services/realtime.service");

describe("Test 'realtime' service", () => {
    let broker = new ServiceBroker({ logger: false });
    broker.createService(TestService);

    describe("Test 'realtime._connectToNATS' method", () => {

        it("should return client if NATS online else NatsError'", () => {
            return TestService.methods._connectToNATS().then((nc) => {
                expect(nc.connected).toBeTruthy()
            }).catch((err) => {
                expect(err).toBeDefined()
            })
        });

    });

    describe("Test 'realtime._disconnectFromNATS' method", () => {

        it("should disconnect and clear client", () => {
            broker.start();
            TestService.methods._disconnectFromNATS();
            expect(TestService.methods._NATSClient).toBeUndefined();
            broker.stop()
        });

        it("should not break if there is no connection", () => {
            TestService.methods._disconnectFromNATS();
            expect(TestService.methods._NATSClient).toBeUndefined()
        });
    });


    describe("Test 'realtime._subscribeToNATSQueueGroup' method", () => {

        it("should subscribe to NATS realtime channel and update subscription id",() => {
            return TestService.methods._connectToNATS().then((nc) => {
                TestService.methods._subscribeToNATSQueueGroup();
                expect(typeof TestService.methods._subscriptionId).toBe('number');
                TestService.methods._disconnectFromNATS()
            }).catch(err => fail(err))
        });

        //TODO: test realtime channel message handler

    });

    describe("Test 'realtime._unsubscribeFromNATSQueueGroup' method", () => {

        it("should unsubscribe from NATS realtime channel and unset ",() => {
            return TestService.methods._connectToNATS().then((nc) => {
                TestService.methods._subscribeToNATSQueueGroup();
                TestService.methods._unsubscribeFromNATSQueueGroup();
                expect(TestService.methods._subscriptionId).toBeUndefined();
                TestService.methods._disconnectFromNATS()
            }).catch(err => fail(err))
        });

    });


});

