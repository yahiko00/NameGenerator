// app.ts

let rng = new RNGLib.RandXorshift();
let nameGen: NameGenerator.NameGenerator;
let nbNames: number = 1;
let generator: string = "eliteStar";

window.onload = () => {
    // default values
    $("#generator").val(generator);
    $("#nbNames").val(nbNames.toString());

    setGenerator(generator);

    // listeners
    $("#generator").on("change", changeGenerator);
    $("#nbNames").on("change", changeNbNames);
    $("#generate").on("click", displayNames);
};

function changeGenerator(event: BaseJQueryEventObject) {
    let target = <HTMLSelectElement>event.target;
    let value = target.value;
    generator = value;
    setGenerator(generator);
}

function changeNbNames(event: BaseJQueryEventObject) {
    let target = <HTMLInputElement>event.target;
    let value = parseInt(target.value);
    nbNames = value;
}

function displayNames(event: BaseJQueryEventObject) {
    let names: string = "";

    for (let i = 0; i < nbNames; i++) {
        let name = nameGen.randName();
        name = name.substr(0, 1).toUpperCase() + name.substr(1);
        names += name + "<br />";
    } // for i

    $("#names").html(names);
}

function setGenerator(generator: string) {
    switch (generator) {
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
