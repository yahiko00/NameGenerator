/// <reference path="Scripts/jquery/jquery.d.ts"/>
/// <reference path="Scripts/rng/rng.ts"/>
/// <reference path="namegen.ts"/>
var rng = new SeededRNG();
var nameGen;
var nbNames = 1;
var generator = "eliteStar";
window.onload = function () {
    // default values
    $("#generator").val(generator);
    $("#nbNames").val(nbNames.toString());
    setGenerator(generator);
    // listeners
    $("#generator").on("change", changeGenerator);
    $("#nbNames").on("change", changeNbNames);
    $("#generate").on("click", displayNames);
};
function changeGenerator(event) {
    var target = event.target;
    var value = target.value;
    generator = value;
    setGenerator(generator);
}
function changeNbNames(event) {
    var target = event.target;
    var value = parseInt(target.value);
    nbNames = value;
}
function displayNames(event) {
    var names = "";
    for (var i = 0; i < nbNames; i++) {
        var name = nameGen.randName();
        name = name.substr(0, 1).toUpperCase() + name.substr(1);
        names += name + "<br />";
    }
    $("#names").html(names);
}
function setGenerator(generator) {
    switch (generator) {
        case "eliteStar":
            nameGen = new NameGeneratorElite(rng);
            break;
        case "markovCityFr":
            loadFileJson("data/city.fr.json", function (response) {
                var parse = JSON.parse(response);
                nameGen = new NameGeneratorMarkov(rng, parse.database.city, 4);
            });
            break;
        case "markovCityGb":
            loadFileJson("data/city.gb.json", function (response) {
                var parse = JSON.parse(response);
                nameGen = new NameGeneratorMarkov(rng, parse.database.city, 4);
            });
            break;
        case "markovFirstnameFr":
            loadFileJson("data/firstname.fr.json", function (response) {
                var parse = JSON.parse(response);
                nameGen = new NameGeneratorMarkov(rng, parse.database.firstname, 3);
            });
            break;
        default:
            nameGen = new NameGeneratorElite(rng);
    }
}
//# sourceMappingURL=namegenUI.js.map