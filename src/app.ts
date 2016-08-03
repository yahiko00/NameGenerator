// app.ts

namespace App {
    export type GeneratorLabel = "eliteStar" | "markovCityFr" | "markovCityGb" | "markovFirstnameFr";
    export function isGeneratorLabel(label: string): label is GeneratorLabel {
        return label === "eliteStar" || label === "markovCityFr" || label === "markovCityGb" || label === "markovFirstnameFr";
    }

    export let generatorLabel: string = "eliteStar";
    export let nbNames: number = 1;
    let rng = new RNGLib.RandXorshift();
    let nameGen: NameGenerator.NameGenerator;

    export function onChangeGenerator(event: BaseJQueryEventObject) {
        let target = <HTMLSelectElement>event.target;
        let value = target.value;
        generatorLabel = value;
        setGenerator();
    }

    export function onChangeNbNames(event: BaseJQueryEventObject) {
        let target = <HTMLInputElement>event.target;
        let value = parseInt(target.value);
        nbNames = value;
    }

    export function onDisplayNames(event: BaseJQueryEventObject) {
        let names: string = "";

        for (let i = 0; i < nbNames; i++) {
            let name = nameGen.randName();
            name = name.substr(0, 1).toUpperCase() + name.substr(1);
            names += name + "<br />";
        } // for i

        $("#names").html(names);
    }

    export function setGenerator() {
        switch (generatorLabel) {
            case "eliteStar":
                nameGen = new NameGenerator.Elite(rng);
                break;
            case "markovCityFr":
                Util.loadFileJson("data/city.fr.json", (response: string) => {
                    let parse = JSON.parse(response);
                    nameGen = new NameGenerator.Markov(rng, parse.database.city, 4);
                });
                break;
            case "markovCityGb":
                Util.loadFileJson("data/city.gb.json", (response: string) => {
                    let parse = JSON.parse(response);
                    nameGen = new NameGenerator.Markov(rng, parse.database.city, 4);
                });
                break;
            case "markovFirstnameFr":
                Util.loadFileJson("data/firstname.fr.json", (response: string) => {
                    let parse = JSON.parse(response);
                    nameGen = new NameGenerator.Markov(rng, parse.database.firstname, 3);
                });
                break;
            default:
                nameGen = new NameGenerator.Elite(rng);
        } // switch
    }
} // App

window.onload = () => {
    // default values
    $("#generator").val(App.generatorLabel);
    $("#nbNames").val(App.nbNames.toString());

    App.setGenerator();

    // listeners
    $("#generator").on("change", App.onChangeGenerator);
    $("#nbNames").on("change", App.onChangeNbNames);
    $("#generate").on("click", App.onDisplayNames);
};
