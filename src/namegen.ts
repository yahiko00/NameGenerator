// namegen.ts

namespace NameGenerator {
    export interface NameGenerator {
        randName(): string;
    } // NameGenerator

    interface Transition {
        [x: string]: number;
    }

    export class Elite implements NameGenerator {
        rng: RNGLib.RandXorshift;
        pairs: string;

        constructor(rng: RNGLib.RandXorshift) {
            this.rng = rng;
            this.pairs =
                "..lexegezacebiso"
                "usesarmaindirea."
                "eratenberalaveti"
                "edorquanteisrion";
        } // constructor

        randName(): string {
            let pair1 = 2 * Math.floor(this.rng.rand() * (this.pairs.length / 2));
            let pair2 = 2 * Math.floor(this.rng.rand() * (this.pairs.length / 2));
            let pair3 = 2 * Math.floor(this.rng.rand() * (this.pairs.length / 2));
            let pair4 = 2 * Math.floor(this.rng.rand() * (this.pairs.length / 2));

            let name = "";
            name += this.pairs.substr(pair1, 2);
            name += this.pairs.substr(pair2, 2);
            name += this.pairs.substr(pair3, 2);
            name += this.pairs.substr(pair4, 2);
            name = name.replace(/[.]/g, "");

            return name;
        } // randName
    } // Elite

    export class Markov implements NameGenerator {
        rng: RNGLib.RandXorshift;
        order: number; // order of the Markov chain
        database: string[];
        transitions: Transition;

        constructor(rng: RNGLib.RandXorshift, database: string[], order: number) {
            this.rng = rng;
            this.order = order;

            this.database = database;
            this.transitions = {};

            this.computeTransitions();
        } // constructor

        computeTransitions() {
            for (let i = 0; i < this.database.length; i++) {
                let word = this.database[i];
                let prev = "";
                let next = "";

                for (let j = 0; j < this.order; j++) {
                    prev += "^";
                } // for j

                for (let j = 0; j < word.length; j++) {
                    next = word.substr(j, 1);
                    this.updateTransitions(prev, next);
                    prev = prev.substr(-this.order + 1) + next;
                } // for j

                next = "$";
                this.updateTransitions(prev, next);
            } // for i
        } // computeTransitions

        updateTransitions(prev: string, next: string) {
            let key = prev + next;
            if (this.transitions.hasOwnProperty(key)) {
                this.transitions[key]++;
            }
            else {
                this.transitions[key] = 1;
            }

            key = "#" + prev;
            if (this.transitions.hasOwnProperty(key)) {
                this.transitions[key]++;
            }
            else {
                this.transitions[key] = 1;
            }
        } // updateTransitions

        produce(prev: string): string {
            let result = prev;

            while (prev !== "$") {
                let key = "#" + prev;
                if (!this.transitions.hasOwnProperty(key)) {
                    break;
                }

                let total: number = this.transitions[key];
                let random = Math.floor(total * this.rng.rand());
                let k = 0;

                for (let property in this.transitions) {
                    if (this.transitions.hasOwnProperty(key) &&
                        property.substr(0, prev.length) === prev) {
                        k += this.transitions[property];
                        if (k >= random) {
                            let next = property.substr(prev.length);
                            result += next;
                            prev = prev.substr(-this.order + 1) + next;
                            break;
                        }
                    }
                } // for property
            } // while

            return result.replace(/[\^$]/g, "");
        } // produce

        randName(): string {
            let prev = "";

            for (let j = 0; j < this.order; j++) {
                prev += "^";
            } // for j

            return this.produce(prev);
        } // randName
    } // Markov
}

declare module "namegen" {
    export = NameGenerator;
}
