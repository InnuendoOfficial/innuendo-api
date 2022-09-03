import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing'
import { PrismaService } from '../../src/prisma/prisma.service';
import { AppModule } from '../../src/app.module';
import * as pactum from 'pactum';
import { indicatorTypeDto } from 'src/indicatorTypes/dto';

describe('IndicatorTypes e2e', () => {
  let app:  INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true
    }));
    await app.init();
    await app.listen(4444);

    prisma = app.get(PrismaService);
    prisma.cleanDb();

    pactum.request.setBaseUrl('http://localhost:4444');
  });

  afterAll(() => {
    app.close();
  });

  describe('POST /indicator_types', () => {
    const dto: indicatorTypeDto = {
      name: 'Weight (kg)',
      unit_measure: 'INT',
    }
    const wrongDto = {
      name: 'Weight (kg)',
      unit_measure: 'UNSUPPORTEDTYPE',
    }
    describe('create indicator type', () => {
      it('Should create a new indicator type', () => {
        return pactum
          .spec()
          .post('/indicator_types')
          .withBody(dto)
          .expectStatus(201)
      });
    });
    describe('create indicator type with wrong type', () => {
      it('Should return an error', () => {
        return pactum
          .spec()
          .post('/indicator_types')
          .withBody(wrongDto)
          .expectStatus(400)
      });
    });
  });

  describe('GET /indicator_types', () => {
    describe('get indicator types', () =>  {
      it('Should return all the indicator types', async () => {
        return pactum
          .spec()
          .get('/indicator_types')
          .expectStatus(200)
          .expectBodyContains(await prisma.indicatorType.findMany())
      });
    });
    describe('get one indicator type', () =>  {
      it('Should the indicator type with corresponding id', async () => {
        return pactum
          .spec()
          .get('/indicator_types/1')
          .expectStatus(200)
          .expectBodyContains(await prisma.indicatorType.findUnique({where: {id: 1}}))
      });
    });
    describe('get inexistant indicator type', () =>  {
      it('Should return an error', async () => {
        return pactum
          .spec()
          .get('/indicator_types/974')
          .expectStatus(404)
      });
    });
  });

  describe('PUT /indicator_types', () => {
    describe('update one indicator type', () =>  {
      it('Should update the indicator type', async () => {
        const dto: indicatorTypeDto = {
          name: 'Flux (L)',
          unit_measure: 'INT',
        };
        return pactum
          .spec()
          .put('/indicator_types/1')
          .withBody(dto)
          .expectStatus(200)
          .expectJsonLike(dto)
      });
    });
  });

  describe('DELETE /indicator_types', () => {
    describe('delete one indicator type', () =>  {
      it('Should delete the indicator type', async () => {
        pactum
          .spec()
          .delete('/indicator_types/1')
          .expectStatus(200)

        const res = await prisma.indicatorType.findUnique({where: {id: 1}})
      });
    });
  });
});
