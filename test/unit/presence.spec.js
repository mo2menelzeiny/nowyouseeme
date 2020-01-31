const {ServiceBroker} = require("moleculer");
const TestService = require("../../services/presence.service");

describe("Test 'presence' service", () => {

    describe("Test 'presence.events.realtime.user.heartbeat'", () => {

        it("should set timeout in the user object", () => {
            const broker = new ServiceBroker({logger: false});
            const service = broker.createService(TestService);
            const payload = {userId: "SOME_ID", timestamp: Date.now()};
            service.broker.cacher = {set: jest.fn()};
            service.schema.events["realtime.user.heartbeat"].call(service, payload);
            expect(service._timeouts["SOME_ID"]).toBeDefined();
        });

    });

    describe("Test 'presence.actions.getPresenceTimestamp' action", () => {

        it("should return user object", async () => {
            const broker = new ServiceBroker({logger: false, cacher: "memory"});
            const service = broker.createService(TestService);
            const payload = {userId: "SOME_ID", timestamp: Date.now()};
            // service.broker.cacher = {set: jest.fn(), get: jest.fn()};
            // service.schema.events["realtime.user.heartbeat"].call(service, payload);
            await broker.start();
            await broker.emit("realtime.user.heartbeat", payload);
            const result = await broker.call("presence.getPresenceTimestamp",
                {userId: payload.userId});
            expect(result).toBeDefined();
            expect(result).toBe(payload.timestamp)
        })
    })
});