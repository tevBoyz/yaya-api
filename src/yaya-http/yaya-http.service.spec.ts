import { Test, TestingModule } from '@nestjs/testing';
import { YayaHttpService } from './yaya-http.service';

describe('YayaHttpService', () => {
  let service: YayaHttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YayaHttpService],
    }).compile();

    service = module.get<YayaHttpService>(YayaHttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
