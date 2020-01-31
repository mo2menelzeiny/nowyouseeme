const {ServiceBroker} = require("moleculer");
const TestService = require("../../services/presence.service");

describe("Test 'presence' service", () => {

    describe("Test 'presence.methods._userPresenceById' method", () => {

        it("should return object by user id", () => {
            const broker = new ServiceBroker({logger: false});
            const service = broker.createService(TestService);
            service._users["SOME_ID"] = {timeout: undefined, timestamp: Date.now()};
            expect(service._userPresenceById.call(service, "SOME_ID")).toBeDefined()
        })
    });

    describe("Test 'presence.events.realtime.user.heartbeat'", () => {

        it("should set timeout in the user object", () => {
            const broker = new ServiceBroker({logger: false});
            const service = broker.createService(TestService);
            const payload = {userId: "SOME_ID", timestamp: Date.now()};
            service.schema.events["realtime.user.heartbeat"].call(service, payload);
            expect(service._users["SOME_ID"].timeout).toBeDefined();
        });

        it("should set the timestamp in the user object", () => {
            const broker = new ServiceBroker({logger: false});
            const service = broker.createService(TestService);
            const payload = {userId: "SOME_ID", timestamp: Date.now()};
            service.schema.events["realtime.user.heartbeat"].call(service, payload);
            expect(service._users["SOME_ID"].timestamp).toBeDefined();
        })
    });

    describe("Test 'presence.actions.getUserPresence' action", () => {

        it("should return user object", async () => {
            const broker = new ServiceBroker({logger: false});
            const service = broker.createService(TestService);
            const payload = {userId: "SOME_ID", timestamp: Date.now()};
            service.schema.events["realtime.user.heartbeat"].call(service, payload);
            await broker.start();
            const result = await broker.call("presence.getUserPresence", {userId: "SOME_ID"});
            expect(result).toBeDefined();
            expect(result.timestamp).toBe(payload.timestamp)
        })
    })
});