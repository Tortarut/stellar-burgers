import store, { rootReducer } from '../services/store';

describe('Тестирование rootReducer', () => {
  test('Возвращает корректное состояние по умолчанию при неизвестном действии', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(initialState).toEqual(store.getState());
  });
});
