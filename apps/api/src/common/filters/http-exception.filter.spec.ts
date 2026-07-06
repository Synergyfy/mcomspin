import { HttpExceptionFilter } from './http-exception.filter';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('HttpExceptionFilter', () => {
  const filter = new HttpExceptionFilter();

  const mockJson = jest.fn();
  const mockStatus = jest.fn().mockReturnValue({ json: mockJson });
  const mockResponse = { status: mockStatus };
  const mockHost = {
    switchToHttp: () => ({
      getResponse: () => mockResponse,
    }),
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should format 404 error correctly', () => {
    const exception = new HttpException('User not found', HttpStatus.NOT_FOUND);
    filter.catch(exception, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(404);
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      error: { code: 'NOT_FOUND', message: 'User not found', details: undefined },
    });
  });

  it('should format 401 error correctly', () => {
    const exception = new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    filter.catch(exception, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(401);
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Unauthorized', details: undefined },
    });
  });

  it('should preserve custom error code and details', () => {
    const exception = new HttpException(
      { code: 'VALIDATION_ERROR', message: 'Validation failed', details: [{ field: 'email' }] },
      HttpStatus.BAD_REQUEST,
    );
    filter.catch(exception, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Validation failed', details: [{ field: 'email' }] },
    });
  });
});
