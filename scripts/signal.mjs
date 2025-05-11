export class Signal {
    static #currentEffect = null;
    static #maxEffectIterations = 100;

    static sg(initialValue) {
        let value = initialValue;
        const subscribers = new Set();

        const read = () => {
            if (Signal.#currentEffect) {
                subscribers.add(Signal.#currentEffect);
                Signal.#currentEffect.dependencies.add(subscribers);
            }
            return value;
        };


        const write = (newValue) => {
            if (Object.is(value, newValue)) {
                return;
            }
            value = newValue;

            [...subscribers].forEach(effect => {
                try {
                    effect.execute();
                } catch (error) {
                    console.error("Error executing effect:", error);
                }
            });
        };

        return [read, write];
    }

    static fx(effectFn) {
        let iteration = 0;
        const effect = {

            execute: () => {
                if (iteration++ > Signal.#maxEffectIterations) {
                    console.error("⛔️ Effect reached max iterations. Possible infinite loop.");
                    effect.dispose();
                    iteration = 0;
                    return;
                }

                effect.cleanup();

                Signal.#currentEffect = effect;
                try {
                    effectFn();
                } finally {
                    Signal.#currentEffect = null;
                    iteration = 0;
                }
            },

            dependencies: new Set(),

            cleanup: () => {
                effect.dependencies.forEach(subscriberSet => {
                    subscriberSet.delete(effect);
                });
                effect.dependencies.clear();
            },

            dispose: () => {
                effect.cleanup();
                // effect.execute = () => { console.warn("Executed disposed effect."); };
            }
        };

        effect.execute();

        return { dispose: effect.dispose };
    }
}