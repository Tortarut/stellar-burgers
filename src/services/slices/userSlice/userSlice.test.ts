import userSlice, {
  getUser,
  getOrdersAll,
  initialState,
  registerUser,
  loginUser,
  updateUser,
  logoutUser
} from './userSlice';

describe('Тестирование редьюсера userSlice', () => {
  describe('Обработка действия getUser', () => {
    const actions = {
      pending: { type: getUser.pending.type, payload: null },
      rejected: { type: getUser.rejected.type, payload: null },
      fulfilled: {
        type: getUser.fulfilled.type,
        payload: { user: { name: 'name', email: 'email' } }
      }
    };

    test('Устанавливает error при getUser.pending', () => {
      const state = userSlice(initialState, actions.pending);
      expect(state.request).toBe(false);
      expect(state.error).toBe(actions.pending.payload);
    });

    test('Устанавливает error при getUser.rejected', () => {
      const state = userSlice(initialState, actions.rejected);
      expect(state.request).toBe(false);
      expect(state.error).toBe(actions.rejected.payload);
    });

    test('Сохраняет данные пользователя при getUser.fulfilled', () => {
      const state = userSlice(initialState, actions.fulfilled);
      expect(state.request).toBe(false);
      expect(state.userData).toEqual(actions.fulfilled.payload.user);
    });
  });

  describe('Обработка действия getOrdersAll', () => {
    const actions = {
      pending: { type: getOrdersAll.pending.type, payload: null },
      rejected: { type: getOrdersAll.rejected.type, error: { message: 'Mock-error' } },
      fulfilled: { type: getOrdersAll.fulfilled.type, payload: ['order1', 'order2'] }
    };

    test('Устанавливает request=true при getOrdersAll.pending', () => {
      const state = userSlice(initialState, actions.pending);
      expect(state.request).toBe(true);
      expect(state.error).toBe(actions.pending.payload);
    });

    test('Устанавливает ошибку при getOrdersAll.rejected', () => {
      const state = userSlice(initialState, actions.rejected);
      expect(state.request).toBe(false);
      expect(state.error).toBe(actions.rejected.error.message);
    });

    test('Сохраняет заказы при getOrdersAll.fulfilled', () => {
      const state = userSlice(initialState, actions.fulfilled);
      expect(state.request).toBe(false);
      expect(state.userOrders).toEqual(actions.fulfilled.payload);
    });
  });

  describe('Обработка действия registerUser', () => {
    const actions = {
      pending: { type: registerUser.pending.type, payload: null },
      rejected: { type: registerUser.rejected.type, error: { message: 'Mock-error' } },
      fulfilled: {
        type: registerUser.fulfilled.type,
        payload: { user: { name: 'name', email: 'email' } }
      }
    };

    test('Устанавливает request=true при registerUser.pending', () => {
      const state = userSlice(initialState, actions.pending);
      expect(state.request).toBe(true);
      expect(state.error).toBe(actions.pending.payload);
    });

    test('Устанавливает ошибку при registerUser.rejected', () => {
      const state = userSlice(initialState, actions.rejected);
      expect(state.request).toBe(false);
      expect(state.error).toBe(actions.rejected.error.message);
    });

    test('Сохраняет данные пользователя при registerUser.fulfilled', () => {
      const state = userSlice(initialState, actions.fulfilled);
      expect(state.request).toBe(false);
      expect(state.error).toBe(null);
      expect(state.userData).toBe(actions.fulfilled.payload.user);
    });
  });

  describe('Обработка действия loginUser', () => {
    const actions = {
      pending: { type: loginUser.pending.type, payload: null },
      rejected: { type: loginUser.rejected.type, error: { message: 'Mock-error' } },
      fulfilled: {
        type: loginUser.fulfilled.type,
        payload: { user: { name: 'name', email: 'email' } }
      }
    };

    test('Устанавливает начальные флаги при loginUser.pending', () => {
      const state = userSlice(initialState, actions.pending);
      expect(state.loginUserRequest).toBe(true);
      expect(state.isAuthChecked).toBe(true);
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBe(actions.pending.payload);
    });

    test('Обрабатывает ошибку при loginUser.rejected', () => {
      const state = userSlice(initialState, actions.rejected);
      expect(state.isAuthChecked).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.loginUserRequest).toBe(false);
      expect(state.error).toBe(actions.rejected.error.message);
    });

    test('Сохраняет авторизацию и пользователя при loginUser.fulfilled', () => {
      const state = userSlice(initialState, actions.fulfilled);
      expect(state.isAuthChecked).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.loginUserRequest).toBe(false);
      expect(state.error).toBe(null);
      expect(state.userData).toBe(actions.fulfilled.payload.user);
    });
  });

  describe('Обработка действия updateUser', () => {
    const actions = {
      pending: { type: updateUser.pending.type, payload: null },
      rejected: { type: updateUser.rejected.type, error: { message: 'Mock-error' } },
      fulfilled: {
        type: updateUser.fulfilled.type,
        payload: { user: { name: 'name', email: 'email' } }
      }
    };

    test('Устанавливает request=true при updateUser.pending', () => {
      const state = userSlice(initialState, actions.pending);
      expect(state.request).toBe(true);
      expect(state.error).toBe(actions.pending.payload);
    });

    test('Устанавливает ошибку при updateUser.rejected', () => {
      const state = userSlice(initialState, actions.rejected);
      expect(state.request).toBe(false);
      expect(state.error).toBe(actions.rejected.error.message);
    });

    test('Обновляет пользователя при updateUser.fulfilled', () => {
      const state = userSlice(initialState, actions.fulfilled);
      expect(state.request).toBe(false);
      expect(state.error).toBe(null);
      expect(state.response).toBe(actions.fulfilled.payload.user);
    });
  });

  describe('Обработка действия logoutUser', () => {
    const actions = {
      pending: { type: logoutUser.pending.type, payload: null },
      rejected: { type: logoutUser.rejected.type, error: { message: 'Mock-error' } },
      fulfilled: { type: logoutUser.fulfilled.type, payload: null }
    };

    test('Устанавливает request=true при logoutUser.pending', () => {
      const state = userSlice(initialState, actions.pending);
      expect(state.request).toBe(true);
      expect(state.isAuthChecked).toBe(true);
      expect(state.isAuthenticated).toBe(true);
      expect(state.error).toBe(actions.pending.payload);
    });

    test('Обрабатывает ошибку при logoutUser.rejected', () => {
      const state = userSlice(initialState, actions.rejected);
      expect(state.isAuthChecked).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.request).toBe(false);
      expect(state.error).toBe(actions.rejected.error.message);
    });

    test('Сбрасывает авторизацию при logoutUser.fulfilled', () => {
      const state = userSlice(initialState, actions.fulfilled);
      expect(state.isAuthChecked).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.request).toBe(false);
      expect(state.error).toBe(null);
      expect(state.userData).toBe(actions.fulfilled.payload);
    });
  });
});
