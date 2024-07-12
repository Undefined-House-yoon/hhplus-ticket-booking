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
    it('[should]결제 및 반품 상태와 transactionId를 처리해야 합니다.', async () => {
      const mockPayment = new Payment(1, 1, 1, 10000, 'success');
      serviceMock.processPayment.mockResolvedValue(mockPayment);
      let processPaymentDto =  new ProcessPaymentDto();
      processPaymentDto.amount=10000
      processPaymentDto.userId=1
      processPaymentDto.reservationId=1
      const result = await useCase.processPayment(processPaymentDto);

      expect(serviceMock.processPayment).toHaveBeenCalledWith({"amount": 10000, "reservationId": 1, "userId": 1});
      expect(result).toEqual({
        status: 'success',
        transactionId: 1,
      });
    });
  });
});
