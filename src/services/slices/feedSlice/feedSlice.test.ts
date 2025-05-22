import feedSlice, { getFeeds, initialState } from './feedSlice';

describe('Тестирование редьюсера feedSlice', () => {
  describe('Тестирование асинхронного действия getFeeds', () => {
    const testCases = {
      pending: {
        action: {
          type: getFeeds.pending.type,
          payload: null
        },
        expectedState: {
          loading: true,
          error: null,
          orders: []
        }
      },
      rejected: {
        action: {
          type: getFeeds.rejected.type,
          error: { message: 'Ошибка загрузки данных' }
        },
        expectedState: {
          loading: false,
          error: 'Ошибка загрузки данных',
          orders: []
        }
      },
      fulfilled: {
        action: {
          type: getFeeds.fulfilled.type,
          payload: { 
            orders: [
              { id: 1, status: 'created' },
              { id: 2, status: 'pending' }
            ],
            total: 100,
            totalToday: 10
          }
        },
        expectedState: {
          loading: false,
          error: null,
          orders: [
            { id: 1, status: 'created' },
            { id: 2, status: 'pending' }
          ],
          total: 100,
          totalToday: 10
        }
      }
    };

    test('Состояние загрузки при pending', () => {
      const newState = feedSlice(initialState, testCases.pending.action);
      
      expect(newState).toEqual({
        ...initialState,
        ...testCases.pending.expectedState
      });
      expect(newState.loading).toBeTruthy();
      expect(newState.orders).toHaveLength(0);
    });

    test('Обработка ошибки при rejected', () => {
      const newState = feedSlice(initialState, testCases.rejected.action);
      
      expect(newState).toEqual({
        ...initialState,
        ...testCases.rejected.expectedState
      });
      expect(newState.loading).toBeFalsy();
      expect(newState.error).toBeTruthy();
    });

    test('Успешная загрузка данных при fulfilled', () => {
      const newState = feedSlice(initialState, testCases.fulfilled.action);
      
      expect(newState).toEqual({
        ...initialState,
        ...testCases.fulfilled.expectedState
      });
      expect(newState.loading).toBeFalsy();
      expect(newState.error).toBeNull();
      expect(newState.orders).toHaveLength(2);
      expect(newState.orders).toEqual(expect.arrayContaining([
        expect.objectContaining({ id: 1 }),
        expect.objectContaining({ id: 2 })
      ]));
      expect(newState.total).toBe(100);
      expect(newState.totalToday).toBe(10);
    });
  });
});