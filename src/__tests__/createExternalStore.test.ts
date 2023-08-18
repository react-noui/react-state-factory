import createExternalStore from "createExternalStore";

function initializeIncrementerGetter() {
  const { getSnapshot } = createExternalStore(set => ({
    counter: 0,
    setCounter: (counter: number) => set({ counter }),
    /* Fix me */
    increment: () => set(({ counter }: {counter: number}) => ({ counter: counter + 1 })),
  }));
  return getSnapshot;
}

let incrementerGetter = initializeIncrementerGetter();

describe('#createExternalStore', () => {
  beforeEach(() => {
    incrementerGetter = initializeIncrementerGetter();
  });

  describe('store', () => {
    it('stores initial values', () => {
      expect(incrementerGetter()).toHaveProperty('counter', 0);
    });

    it('updates value with absolute setter', () => {
      (incrementerGetter() as any).setCounter(21); /* Fix me */
      expect(incrementerGetter()).toHaveProperty('counter', 21);
    });

    it('updates value with function setter', () => {
      (incrementerGetter() as any).increment(); /* Fix me */
      expect(incrementerGetter()).toHaveProperty('counter', 1);
    });

    // it('notifies listeners on `set`', () => {
    //   const listener = jest.fn();

    //   incrementerGetter.subscribe(listener);
    //   expect(listener.mock.calls.length).toBe(0);

    //   incrementerGetter.set(21);
    //   expect(listener.mock.calls.length).toBe(1);
    // });

    // it('does not notify listeners that have been unsubscribed', () => {
    //   const listener1 = jest.fn();
    //   const listener2 = jest.fn();

    //   const unsubscribeListener1 = incrementerGetter.subscribe(listener1);
    //   const unsubscribeListener2 = incrementerGetter.subscribe(listener2);
    //   expect(listener1.mock.calls.length).toBe(0);
    //   expect(listener2.mock.calls.length).toBe(0);

    //   incrementerGetter.set(21);
    //   expect(listener1.mock.calls.length).toBe(1);
    //   expect(listener2.mock.calls.length).toBe(1);

    //   unsubscribeListener2();

    //   incrementerGetter.set(34);
    //   expect(listener1.mock.calls.length).toBe(2);
    //   expect(listener2.mock.calls.length).toBe(1);

    //   unsubscribeListener1();

    //   incrementerGetter.set(55);
    //   expect(listener1.mock.calls.length).toBe(2);
    //   expect(listener2.mock.calls.length).toBe(1);
    // });

    // it('notifies listeners on `set` only if value changes', () => {
    //   const listener = jest.fn();

    //   incrementerGetter.subscribe(listener);
    //   expect(listener.mock.calls.length).toBe(0);

    //   incrementerGetter.set(21);
    //   expect(listener.mock.calls.length).toBe(1);
    //   incrementerGetter.set(21);
    //   expect(listener.mock.calls.length).toBe(1);

    //   incrementerGetter.set(34);
    //   expect(listener.mock.calls.length).toBe(2);
    //   incrementerGetter.set(34);
    //   expect(listener.mock.calls.length).toBe(2);
    // });
  });
});