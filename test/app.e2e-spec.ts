import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('API E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/time (GET) should return server time', async () => {
    const res = await request(app.getHttpServer()).get('/time');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('time');
  });

  it('/transactions/find-by-user (GET) should return array', async () => {
    const res = await request(app.getHttpServer()).get('/transactions/find-by-user?p=1');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('/transactions/search (POST) should return filtered results', async () => {
  const res = await request(app.getHttpServer())
    .post('/transactions/search')
    .send({ query: 'surafel' });

  expect(res.status).toBe(201);
  expect(Array.isArray(res.body.data)).toBe(true);

  // If results exist, make sure at least one contains the search keyword
  if (res.body.data.length > 0) {
    const serialized = JSON.stringify(res.body.data).toLowerCase();
    expect(serialized).toContain('surafel');
  }
});
});
