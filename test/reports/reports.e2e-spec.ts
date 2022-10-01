import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing'
import { PrismaService } from '../../src/prisma/prisma.service';
import { AppModule } from '../../src/app.module';
import * as pactum from 'pactum';
import { AuthService } from 'src/auth/auth.service';
import { AuthDto } from 'src/auth/dto';

describe('IndicatorTypes e2e', () => {
  let app:  INestApplication;
  let prisma: PrismaService;
  let authToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true
    }));
    await app.init();
    await app.listen(4446);

    prisma = app.get(PrismaService);
    prisma.cleanDb();

    pactum.request.setBaseUrl('http://localhost:4446');
    const loginDto: AuthDto = {
      email: 'superemail@epitech.eu',
      password: '4242',
      firstname: '',
      lastname: '',
    }
    authToken = (await app.get(AuthService).signup(loginDto)).access_token;
  });

  afterAll(() => {
    app.close();
  });

  describe('POST /reports', () => {
    const dto = {
      "indicators": [
          { "value": 183, "indicator_type_id": 1 }
      ]
    };

    describe('without being authenticated', () => {
      it('should return an unauthorized error',  () => {
        return pactum
          .spec()
          .post('/reports')
          .withBody(dto)
          .expectStatus(401)
      });
    });
    describe('being authenticated', () => {
      it('should create the report',  () => {
        return pactum
          .spec()
          .post('/reports')
          .withBody(dto)
          .withHeaders('Authorization', "Bearer " + authToken)
          .expectStatus(201)
      });
    });
  });

  describe('GET /reports', () => {
    describe('without being authenticated', () => {
      it('should return an unauthorized error',  () => {
        return pactum
          .spec()
          .get('/reports')
          .expectStatus(401)
      });
    });
    describe('being authenticated', () => {
      it('should return all the reports',  () => {
        return pactum
          .spec()
          .get('/reports')
          .withHeaders('Authorization', "Bearer " + authToken)
          .expectStatus(200)
      });
    });
  });

  describe('DELETE /reports', () => {
    describe('without being authenticated', () => {
      it('should return an unauthorized error', async () => {
        const id = (await prisma.report.findMany())[0].id;
        return pactum
          .spec()
          .delete('/reports/' + id)
          .expectStatus(401)
      });
    });
    describe('being authenticated', () => {
      it('should delete the ressource', async () => {
        const id = (await prisma.report.findMany())[0].id;
        return pactum
          .spec()
          .delete('/reports/' + id)
          .withHeaders('Authorization', "Bearer " + authToken)
          .expectStatus(200)
      });
    });
  });
});