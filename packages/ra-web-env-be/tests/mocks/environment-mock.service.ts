export class EnvironmentMockService {
    queue = {
        opt: {
            nats: {
                dataQueue: "dataQueue",
                requestQueue: "requestQueue",
            }
        }
    };

    auth = {
        expiresIn: 100,
    }
}
