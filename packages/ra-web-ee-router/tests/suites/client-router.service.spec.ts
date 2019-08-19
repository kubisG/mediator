import { Test, TestingModule } from "@nestjs/testing";
import { LoggerMock } from "../mocks/logger-mock";
import { Subscription } from "rxjs/internal/Subscription";
import { ClientRouterService } from "../../src/client-router.service";
import { Subject } from "rxjs";

describe("ClientRouterService", () => {
  let app: TestingModule;
  let service: ClientRouterService;
  const subscriptions: Subscription[] = [];

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        ClientRouterService,
        {
          provide: "logger",
          useClass: LoggerMock,
        },
      ],
    }).compile();
    service = app.get<ClientRouterService>(ClientRouterService);
  });

  afterEach(() => {
    for (const sub of subscriptions) {
      sub.unsubscribe();
    }
  });

  it("getClientSubject()", async () => {
    await service.addClientToAccount("testClient", "testAccount");
    const subject = service.getClientSubject("testClient");
    expect(subject).toBeInstanceOf(Subject);
  });

  it("removeClient(client)", async () => {
    await service.addClientToAccount("testClient", "testAccount");
    let subjects = service.getAccountSubjects("testAccount");
    expect(subjects.length).toEqual(1);
    service.removeClient("testClient", "testAccount");
    subjects = service.getAccountSubjects("testAccount");
    expect(subjects.length).toEqual(0);
  });

  it("pushToClient(clientId: string, data)", (done) => {
    service.addClientToAccount("testClient", "testAccount");
    const response = { id: "1", result: "OK" };

    const subject = service.getClientSubject("testClient");
    subscriptions.push(subject.subscribe((msg) => {
      try {
        expect((msg as any).id).toEqual(response.id);
        expect((msg as any).result).toEqual(response.result);
        done();
      } catch (ex) {
        done.fail(ex);
      }
    }, (err) => {
      done.fail(err);
    }));
    service.pushToClient("testClient", response);
  });


  it("pushToAccount(accountId: string, data)", (done) => {
    service.addClientToAccount("testClient", "testAccount");
    const response = { id: "1", result: "OK" };

    const subject = service.getClientSubject("testClient");
    subscriptions.push(subject.subscribe((msg) => {
      try {
        expect((msg as any).id).toEqual(response.id);
        expect((msg as any).result).toEqual(response.result);
        done();
      } catch (ex) {
        done.fail(ex);
      }
    }, (err) => {
      done.fail(err);
    }));
    service.pushToAccount("testAccount", response);
  });

});
