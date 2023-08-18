import { PropsWithChildren, createContext, createElement, useContext, useSyncExternalStore } from "react";

export type UnsubscribeFunction = () => void;

export default function createExternalStore<T>(
    update: (set: (nextValue: T | ((previousValue: T) => T)) => T, get: () => T) => T
) {
    class ExternalStore {
        value: T | null = null;
        listeners: Array<() => void> = [];
            
        set(newValue: T) {
            if(this.value !== newValue) {
                this.value = newValue;
                this.notify();
            }
        }
      
        getSnapshot(): T {
            if(this.value === null) {
                throw new Error();
            }

            return this.value;
        }
      
        subscribe(listener: () => void): UnsubscribeFunction {
          this.listeners = [...this.listeners, listener];
      
          return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
          }
        }
      
        notify() {
          this.listeners.forEach(listener => listener());
        }
    };

    const store = new ExternalStore();

    function setter(nextValue: T | ((previousValue: T) => T)): T {
        if(nextValue instanceof Function) {
            /* Type inferred from initial value, so guaranteed to be type T */
            const newValue = nextValue({} as T);
            store.set(newValue);
            return newValue;
        }

        store.set(nextValue);
        return nextValue;
    }

    const subscribe = store.subscribe.bind(store);
    const getSnapshot = store.getSnapshot.bind(store);


    const ValueContext = createContext<T | null>(null);

    function Provider({children}: PropsWithChildren) {
        const value = useSyncExternalStore(subscribe, getSnapshot);
        return createElement(ValueContext.Provider, {value}, children);
    }

    function useState<SelectedType extends {}>(selector?: (state: T) => SelectedType) {
        const context = useContext(ValueContext);
        if(context === null) {
            const state = useSyncExternalStore(subscribe, getSnapshot);
            return selector ? selector(state) : state;
        }

        return selector ? selector(context) : context;
    }

    /* set initial state */
    update(setter, getSnapshot);

    return { Provider, useState, getSnapshot };
}