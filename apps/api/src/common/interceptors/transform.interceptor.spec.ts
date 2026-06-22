import { TransformInterceptor } from './transform.interceptor';
import { of } from 'rxjs';

describe('TransformInterceptor', () => {
  const interceptor = new TransformInterceptor();

  const mockExecutionContext = () =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({}),
        getResponse: () => ({ statusCode: 200 }),
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    }) as any;

  const mockCallHandler = (data: any) => ({
    handle: () => of(data),
  });

  it('should wrap response in success envelope', (done) => {
    interceptor
      .intercept(mockExecutionContext(), mockCallHandler({ id: 1, name: 'test' }))
      .subscribe((result) => {
        expect(result).toEqual({ success: true, data: { id: 1, name: 'test' } });
        done();
      });
  });

  it('should not double-wrap if already in envelope', (done) => {
    const enveloped = { success: false, error: { code: 'ERR', message: 'fail' } };
    interceptor
      .intercept(mockExecutionContext(), mockCallHandler(enveloped))
      .subscribe((result) => {
        expect(result).toEqual(enveloped);
        done();
      });
  });

  it('should preserve meta when present', (done) => {
    const withMeta = { data: [1, 2, 3], meta: { page: 1, total: 3 } };
    interceptor
      .intercept(mockExecutionContext(), mockCallHandler(withMeta))
      .subscribe((result) => {
        expect(result).toEqual({ success: true, ...withMeta });
        done();
      });
  });
});
