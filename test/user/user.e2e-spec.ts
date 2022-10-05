import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing'
import { PrismaService } from '../../src/prisma/prisma.service';
import { AppModule } from '../../src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from '../../src/auth/dto';
import { AuthService } from 'src/auth/auth.service';
import { UserDto } from 'src/user/dto';

describe('Auth e2e', () => {
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
      email: 'lucas@epitech.eu',
      password: 'toto42',
      isPro: false,
      firstname: 'lucas',
      lastname: 'courteaud',
    }
    authToken = (await app.get(AuthService).userSignup(loginDto)).access_token;
  });

  afterAll(() => {
    app.close();
  });

  describe('GET /me', () => {
    describe('Get user profile', () => {
      it('Should get the connected profile', () => {
        return pactum
          .spec()
          .get('/user/me')
          .withHeaders("Authorization", "Bearer " + authToken)
          .expectStatus(200)
      });
    });
  });
  describe('PUT /update', () => {
    const dto: UserDto = {
      firstname: "luan",
      lastname: "sautron"
    }
    describe('Update user profile', () => {
      it('Should update the connected profile', () => {
        return pactum
          .spec()
          .put('/user/update')
          .withHeaders("Authorization", "Bearer " + authToken)
          .withBody(dto)
          .expectStatus(200)
      });
    });
  });
  describe('DELETE /delete', () => {
    describe('Delete user profile', () => {
      it('Should delete the connected profile', () => {
        return pactum
          .spec()
          .delete('/user/delete')
          .withHeaders("Authorization", "Bearer " + authToken)
          .expectStatus(200)
      });
    });
  });
});
