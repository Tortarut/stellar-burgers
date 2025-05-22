import constructorSlice, {
  addIngredient,
  initialState,
  moveIngredientDown,
  moveIngredientUp,
  orderBurger,
  removeIngredient
} from './constructorSlice';
import { expect, test, describe } from '@jest/globals';

describe('Тесты для редьюсера constructorSlice', () => {
  describe('Тестирование добавления ингредиентов', () => {
    const initialState = {
      constructorItems: {
        bun: null,
        ingredients: []
      },
      loading: false,
      orderRequest: false,
      orderModalData: null,
      error: null
    };

    test('Добавление ингредиента типа sauce в конструктор', () => {
      const sauce = {
        _id: '643d69a5c3f7b9001cfa0943',
        name: 'Соус фирменный Space Sauce',
        type: 'sauce',
        proteins: 50,
        fat: 22,
        carbohydrates: 11,
        calories: 14,
        price: 80,
        image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png'
      };

      const newState = constructorSlice(initialState, addIngredient(sauce));
      const addedIngredient = newState.constructorItems.ingredients[0];

      expect(addedIngredient).toEqual({
        ...sauce,
        id: expect.any(String) // Проверяем что добавился уникальный id
      });
    });

    test('Добавление булки в пустой конструктор', () => {
      const bun = {
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
      };

      const newState = constructorSlice(initialState, addIngredient(bun));
      const addedBun = newState.constructorItems.bun;

      expect(addedBun).toEqual({
        ...bun,
        id: expect.any(String) // Булки тоже получают уникальный id
      });
    });

    test('Замена существующей булки на новую', () => {
      const initialBun = {
        _id: '643d69a5c3f7b9001cfa093c',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        id: 'initial-bun-id',
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
      };

      const newBun = {
        _id: '643d69a5c3f7b9001cfa093d',
        name: 'Флюоресцентная булка R2-D3',
        type: 'bun',
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: 'https://code.s3.yandex.net/react/code/bun-01.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
      };

      const initialStateWithBun = {
        ...initialState,
        constructorItems: {
          bun: initialBun,
          ingredients: []
        }
      };

      const newState = constructorSlice(initialStateWithBun, addIngredient(newBun));
      const updatedBun = newState.constructorItems.bun;

      // Проверяем что булка не null
      expect(updatedBun).not.toBeNull();
      
      // Проверяем основные свойства новой булки
      expect(updatedBun).toEqual({
        ...newBun,
        id: expect.any(String)
      });

      // Проверяем что ID изменился, только если updatedBun существует
      if (updatedBun) {
        expect(updatedBun.id).not.toBe(initialBun.id);
      }
    });
  });

  describe('Тестирование удаления ингредиентов', () => {
    const ingredientToRemove = {
      id: 'ingredient-to-remove',
      _id: '643d69a5c3f7b9001cfa0944',
      name: 'Соус традиционный галактический',
      type: 'sauce',
      proteins: 42,
      fat: 24,
      carbohydrates: 42,
      calories: 99,
      price: 15,
      image: 'https://code.s3.yandex.net/react/code/sauce-03.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-03-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-03-large.png'
    };

    const initialStateWithIngredients = {
      ...initialState,
      constructorItems: {
        bun: null,
        ingredients: [ingredientToRemove]
      }
    };

    test('Удаление ингредиента по id', () => {
      const newState = constructorSlice(
        initialStateWithIngredients,
        removeIngredient(ingredientToRemove.id)
      );

      expect(newState.constructorItems.ingredients).toHaveLength(0);
    });
  });

  describe('Тестирование перемещения ингредиентов', () => {
    const ingredients = [
      {
        id: 'first-ingredient',
        _id: '643d69a5c3f7b9001cfa0944',
        name: 'Соус традиционный галактический',
        type: 'sauce',
        proteins: 42,
        fat: 24,
        carbohydrates: 42,
        calories: 99,
        price: 15,
        image: 'https://code.s3.yandex.net/react/code/sauce-03.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/sauce-03-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/sauce-03-large.png'
      },
      {
        id: 'second-ingredient',
        _id: '643d69a5c3f7b9001cfa0946',
        name: 'Хрустящие минеральные кольца',
        type: 'main',
        proteins: 808,
        fat: 689,
        carbohydrates: 609,
        calories: 986,
        price: 300,
        image: 'https://code.s3.yandex.net/react/code/mineral_rings.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/mineral_rings-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/mineral_rings-large.png'
      },
      {
        id: 'third-ingredient',
        _id: '643d69a5c3f7b9001cfa0947',
        name: 'Плоды Фалленианского дерева',
        type: 'main',
        proteins: 20,
        fat: 5,
        carbohydrates: 55,
        calories: 77,
        price: 874,
        image: 'https://code.s3.yandex.net/react/code/sp_1.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/sp_1-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/sp_1-large.png'
      }
    ];

    const initialStateWithMultipleIngredients = {
      ...initialState,
      constructorItems: {
        bun: {
          id: 'bun-id',
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
        ingredients: [...ingredients]
      }
    };

    test('Перемещение ингредиента вверх по списку', () => {
      // Исходно: [first, second, third]
      const newState = constructorSlice(
        initialStateWithMultipleIngredients,
        moveIngredientUp(2) // Перемещаем третий элемент (index 2)
      );
      // Ожидаем: [first, third, second]
      expect(newState.constructorItems.ingredients[1].id).toBe('third-ingredient');
      expect(newState.constructorItems.ingredients[2].id).toBe('second-ingredient');
    });

    test('Перемещение ингредиента вниз по списку', () => {
      // Исходно: [first, second, third]
      const newState = constructorSlice(
        initialStateWithMultipleIngredients,
        moveIngredientDown(1) // Перемещаем второй элемент (index 1)
      );
      // Ожидаем: [first, third, second]
      expect(newState.constructorItems.ingredients[1].id).toBe('third-ingredient');
      expect(newState.constructorItems.ingredients[2].id).toBe('second-ingredient');
    });
  });

  describe('Тестирование создания заказа', () => {
    const testActions = {
      pending: {
        type: orderBurger.pending.type,
        payload: null
      },
      rejected: {
        type: orderBurger.rejected.type,
        error: { message: 'Тестовая ошибка' }
      },
      fulfilled: {
        type: orderBurger.fulfilled.type,
        payload: { order: { number: 12345 } }
      }
    };

    test('Состояние загрузки при отправке заказа', () => {
      const state = constructorSlice(initialState, testActions.pending);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('Обработка ошибки при создании заказа', () => {
      const state = constructorSlice(initialState, testActions.rejected);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(testActions.rejected.error.message);
      expect(state.orderModalData).toBeNull();
    });

    test('Успешное создание заказа', () => {
      const state = constructorSlice(initialState, testActions.fulfilled);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.orderModalData?.number).toBe(
        testActions.fulfilled.payload.order.number
      );
    });
  });
});