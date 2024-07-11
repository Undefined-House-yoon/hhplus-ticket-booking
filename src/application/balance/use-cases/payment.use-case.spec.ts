import { Test, TestingModule } from '@nestjs/testing';
import { PaymentUseCase } from './payment.use-case';
import { PaymentService } from '../../../domain/balance/services/payment.service';
import { Payment } from '../../../domain/balance/entities/payment';
import { ProcessPaymentDto } from '../../../api/balance/dto/payment.dto';

describe('PaymentUseCase', () => {
  let useCase: PaymentUseCase;
  let serviceMock: jest.Mocked<PaymentService>;

  beforeEach(async () => {
    const serviceMockFactory = jest.fn(() => ({
      processPayment: jest.fn(),
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentUseCase,
        {
          provide: PaymentService,
          useFactory: serviceMockFactory,
        },
      ],
    }).compile();

    useCase = module.get<PaymentUseCase>(PaymentUseCase);
    serviceMock = module.get(PaymentService);
  });

  describe('processPayment', () => {
    it('should process payment and return status and transactionId', async () => {
      const mockPayment = new Payment(1, 1, 1, 10000, 'success');
      serviceMock.processPayment.mockResolvedValue(mockPayment);
      let processPaymentDto =  new ProcessPaymentDto();
      processPaymentDto.amount=10000
      processPaymentDto.amount=1
      processPaymentDto.amount=1
      const result = await useCase.processPayment(processPaymentDto);

      expect(serviceMock.processPayment).toHaveBeenCalledWith('user1', 'reservation1', 10000);
      expect(result).toEqual({
        status: 'success',
        transactionId: 'transaction1',
      });
    });
  });
});
