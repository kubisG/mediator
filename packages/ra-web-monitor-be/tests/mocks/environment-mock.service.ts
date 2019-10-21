export class EvironmentMockService {
    queue = {
        opt: {
            nats: {
                dataQueue: () => "dataQueue",
                requestQueue: () => "requestQueue",
            },
        },
    };
}
