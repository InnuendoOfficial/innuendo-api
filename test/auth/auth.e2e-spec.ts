import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing'
import { PrismaService } from '../../src/prisma/prisma.service';
import { AppModule } from '../../src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from '../../src/auth/dto';

describe('Auth e2e', () => {
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
    await app.listen(4445);

    prisma = app.get(PrismaService);
    prisma.cleanDb();

    pactum.request.setBaseUrl('http://localhost:4445');
  });

  afterAll(() => {
    app.close();
  });

  describe('POST /signup', () => {
    const dto: AuthDto = {
      email: 'toto@epitech.eu',
      password: '4242',
      firstname: 'lucas',
      lastname: 'courteaud'
    }
    const noEmail = {
      email: '',
      password: '4242',
      firstname: 'lucas',
      lastname: 'courteaud'
    }
    const noPassword = {
      email: 'toto@epitech.eu',
      password: '',
      firstname: 'lucas',
      lastname: 'courteaud'
    }
    const incorrectEmail = {
      email: 'toto@epitech',
      password: '4242',
      firstname: 'lucas',
      lastname: 'courteaud'
    }
    describe('Signup a user', () => {
      it('Should create a new user', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
      });
    });
    describe('Signup a user without email', () => {
      it('Should return an error', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(noEmail)
          .expectStatus(400)
      });
    });
    describe('Signup a user without password', () => {
      it('Should return an error', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(noPassword)
          .expectStatus(400)
      });
    });
    describe('Signup a user with incorrect email', () => {
      it('Should return an error', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(incorrectEmail)
          .expectStatus(400)
      });
    });
  });

  describe('Login as a user', () => {
    const dto = {
      email: 'toto@epitech.eu',
      password: '4242',
    }
    const noEmail = {
      email: '',
      password: '4242',
    }
    const noPassword = {
      email: 'toto@epitech.eu',
      password: '',
    }
    const incorrectEmail = {
      email: 'toto@epitech',
      password: '4242',
    }
    describe('Login as a user', () => {
      it('Should return the access token', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(201)
      });
    });
    describe('Login a user without email', () => {
      it('Should return an error', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(noEmail)
          .expectStatus(400)
      });
    });
    describe('Login a user without password', () => {
      it('Should return an error', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(noPassword)
          .expectStatus(400)
      });
    });
    describe('Login a user with incorrect email', () => {
      it('Should return an error', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(incorrectEmail)
          .expectStatus(400)
      });
    });
  });
});
