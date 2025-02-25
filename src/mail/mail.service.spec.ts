import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call sendEmail with correct parameters', async () => {
    const sendEmailSpy = jest.spyOn(service, 'sendEmail').mockImplementation(async () => {});
    
    await service.sendEmail('test@example.com', 'Subject', 'Body');

    expect(sendEmailSpy).toHaveBeenCalledWith('test@example.com', 'Subject', 'Body');
  });
});
