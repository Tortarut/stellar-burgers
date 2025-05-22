import ingredientSlice, {
  getIngredients,
  initialState
} from './ingredientSlice';

describe('Тестирование редьюсера ingredientSlice', () => {
  const mockIngredients = [
    {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
    }
  ];

  describe('Тестирование асинхронного действия getIngredients', () => {
    const testCases = {
      pending: {
        description: 'должен обрабатывать состояние загрузки',
        action: {
          type: getIngredients.pending.type,
          payload: null
        },
        expected: {
          loading: true,
          error: null,
          ingredients: []
        }
      },
      rejected: {
        description: 'должен обрабатывать состояние ошибки',
        action: {
          type: getIngredients.rejected.type,
          error: { message: 'Ошибка загрузки ингредиентов' }
        },
        expected: {
          loading: false,
          error: 'Ошибка загрузки ингредиентов',
          ingredients: []
        }
      },
      fulfilled: {
        description: 'должен обрабатывать успешную загрузку',
        action: {
          type: getIngredients.fulfilled.type,
          payload: mockIngredients
        },
        expected: {
          loading: false,
          error: null,
          ingredients: mockIngredients
        }
      }
    };

    test(testCases.pending.description, () => {
      const newState = ingredientSlice(initialState, testCases.pending.action);
      
      expect(newState).toEqual({
        ...initialState,
        ...testCases.pending.expected
      });
      expect(newState.loading).toBeTruthy();
      expect(newState.ingredients).toHaveLength(0);
    });

    test(testCases.rejected.description, () => {
      const newState = ingredientSlice(initialState, testCases.rejected.action);
      
      expect(newState).toEqual({
        ...initialState,
        ...testCases.rejected.expected
      });
      expect(newState.loading).toBeFalsy();
      expect(newState.error).toBeTruthy();
      expect(newState.ingredients).toHaveLength(0);
    });

    test(testCases.fulfilled.description, () => {
      const newState = ingredientSlice(initialState, testCases.fulfilled.action);
      
      expect(newState).toEqual({
        ...initialState,
        ...testCases.fulfilled.expected
      });
      expect(newState.loading).toBeFalsy();
      expect(newState.error).toBeNull();
      expect(newState.ingredients).toHaveLength(2);
      expect(newState.ingredients).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ type: 'bun' }),
          expect.objectContaining({ type: 'main' })
        ])
      );
      expect(newState.ingredients[0]).toHaveProperty('_id');
      expect(newState.ingredients[0]).toHaveProperty('name');
      expect(newState.ingredients[0]).toHaveProperty('image');
    });
  });
});