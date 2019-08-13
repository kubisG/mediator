import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "@ra/web-auth-be/auth.service";
import { AuthMockService } from "../../mocks/auth-mock.service";
import { fastRandomFactory } from "@ra/web-core-be/core.provider";
import { LoggerMock } from "../../mocks/logger-mock";
import { Subscription } from "rxjs/internal/Subscription";
import { CompaniesController } from "../../../src/companies/companies.controller";
import { CompaniesService } from "../../../src/companies/companies.service";
import { CompaniesMockRepository } from "../../mocks/companies-mock.repository";
import { EnvironmentService } from "@ra/web-env-be/environment.service";
import { EnvironmentMockService } from "../../mocks/environment-mock.service";
import { JwtMockService } from "../../mocks/jwt-mock.service";
import { JwtService } from "@nestjs/jwt";

describe("CompaniesController", () => {
  let app: TestingModule;
  let service: CompaniesService;
  let controller: CompaniesController;
  let subscriptions: Subscription[] = [];

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [CompaniesController],
      providers: [
        fastRandomFactory,
        CompaniesService,
        {
          provide: "companyRepository",
          useClass: CompaniesMockRepository,
        },
        {
          provide: AuthService,
          useClass: AuthMockService,
        },
        {
          provide: EnvironmentService,
          useClass: EnvironmentMockService,
        },    
        {
          provide: JwtService,
          useClass: JwtMockService,
        },               
        {
          provide: "logger",
          useClass: LoggerMock,
        }
      ],
    }).compile();
    controller = app.get(CompaniesController);
    service = app.get(CompaniesService);
  });

  afterEach(() => {
    for (const sub of subscriptions) {
      sub.unsubscribe();
    }
  });

  describe('updateMyCompany()', () => {
    it('should update record', async () => {
      const token = "AAAAA";
      const result = await controller.updateMyCompany(token, 1, {
        id: 1, companyName: "name", street: "street", city: "city"
        , numInStreet: "numinstreet", state: "cz", partyID: null, partyIDSource: null, partyRole: null, flgDel: null
      });

      expect((result as any).result).toEqual("OK");
    });
  });

  describe('findOne()', () => {
    it('should find one result', async () => {
      const token = "AAAAA";
      const result = await controller.findOne(token,1);
      expect((result as any).result).toEqual("OK");
    });
  });

  describe('findAll()', () => {
    it('should find all result', async () => {
      const token = "AAAAA";
      const result = await controller.findAll();
      expect((result[0] as any)[0].result).toEqual("OK");
    });
  });  

  describe('create()', () => {
    it('should create record', async () => {
      const token = "AAAAA";
      const result = await controller.create({
        id: 0, companyName: "name", street: "street", city: "city"
        , numInStreet: "numinstreet", state: "cz", partyID: null, partyIDSource: null, partyRole: null, flgDel: null
      });
      expect(result.result).toEqual("OK");
    });
  });

  describe('update()', () => {
    it('should update record', async () => {
      const token = "AAAAA";
      const result = await controller.update(token, 1, {
        id: 2, companyName: "name", street: "street", city: "city"
        , numInStreet: "numinstreet", state: "cz", partyID: null, partyIDSource: null, partyRole: null, flgDel: null
      });
      expect((result as any).result).toEqual("OK");
    });
  });

      describe('remove()', () => {
        it('should deleteOne record', async () => {
            const token = "AAAAA";
          const result = await controller.remove(1);
          expect(result.result).toEqual("OK");
        });
      });         


});
