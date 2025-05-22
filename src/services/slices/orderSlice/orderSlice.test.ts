import orderSlice, { initialState, getOrderByNumber } from './orderSlice';

describe('Тестирование редьюсера orderSlice', () => {
  describe('Тестирование асинхронного действия getOrderByNumber', () => {
    const actions = {
      pending: {
        type: getOrderByNumber.pending.type,
        payload: null
      },
      rejected: {
        type: getOrderByNumber.rejected.type,
        error: { message: 'Mock-error' }
      },
      fulfilled: {
        type: getOrderByNumber.fulfilled.type,
        payload: { orders: ['someOrder'] }
      }
    };

    test('Должен установить request=true при getOrderByNumber.pending', () => {
      const nextState = orderSlice(initialState, actions.pending);
      expect(nextState.request).toBe(true);
      expect(nextState.error).toBe(actions.pending.payload);
    });

    test('Должен установить ошибку при getOrderByNumber.rejected', () => {
      const nextState = orderSlice(initialState, actions.rejected);
      expect(nextState.request).toBe(false);
      expect(nextState.error).toBe(actions.rejected.error.message);
    });

    test('Должен сохранить ответ заказа при getOrderByNumber.fulfilled', () => {
      const nextState = orderSlice(initialState, actions.fulfilled);
      expect(nextState.request).toBe(false);
      expect(nextState.error).toBe(null);
      expect(nextState.orderByNumberResponse).toBe(
        actions.fulfilled.payload.orders[0]
      );
    });
  });
});
