// app.ts
var App;
(function (App) {
    function isGeneratorLabel(label) {
        return label === "eliteStar" || label === "markovCityFr" || label === "markovCityGb" || label === "markovFirstnameFr";
    }
    App.isGeneratorLabel = isGeneratorLabel;
    App.generatorLabel = "eliteStar";
    App.nbNames = 1;
    var rng = new RNGLib.RandXorshift();
    var nameGen;
    function onChangeGenerator(event) {
        var target = event.target;
        var value = target.value;
        App.generatorLabel = value;
        setGenerator();
    }
    App.onChangeGenerator = onChangeGenerator;
    function onChangeNbNames(event) {
        var target = event.target;
        var value = parseInt(target.value);
        App.nbNames = value;
    }
    App.onChangeNbNames = onChangeNbNames;
    function onDisplayNames(event) {
        var names = "";
        for (var i = 0; i < App.nbNames; i++) {
            var name_1 = nameGen.randName();
            name_1 = name_1.substr(0, 1).toUpperCase() + name_1.substr(1);
            names += name_1 + "<br />";
        } // for i
        $("#names").html(names);
    }
    App.onDisplayNames = onDisplayNames;
    function setGenerator() {
        switch (App.generatorLabel) {
            case "eliteStar":
                nameGen = new NameGenerator.Elite(rng);
                break;
            case "markovCityFr":
                Util.loadFileJson("data/city.fr.json", function (response) {
                    var parse = JSON.parse(response);
                    nameGen = new NameGenerator.Markov(rng, parse.database.city, 4);
                });
                break;
            case "markovCityGb":
                Util.loadFileJson("data/city.gb.json", function (response) {
                    var parse = JSON.parse(response);
                    nameGen = new NameGenerator.Markov(rng, parse.database.city, 4);
                });
                break;
            case "markovFirstnameFr":
                Util.loadFileJson("data/firstname.fr.json", function (response) {
                    var parse = JSON.parse(response);
                    nameGen = new NameGenerator.Markov(rng, parse.database.firstname, 3);
                });
                break;
            default:
                nameGen = new NameGenerator.Elite(rng);
        } // switch
    }
    App.setGenerator = setGenerator;
})(App || (App = {})); // App
window.onload = function () {
    // default values
    $("#generator").val(App.generatorLabel);
    $("#nbNames").val(App.nbNames.toString());
    App.setGenerator();
    // listeners
    $("#generator").on("change", App.onChangeGenerator);
    $("#nbNames").on("change", App.onChangeNbNames);
    $("#generate").on("click", App.onDisplayNames);
};
// namegen.ts
var NameGenerator;
(function (NameGenerator) {
    var Elite = (function () {
        function Elite(rng) {
            this.rng = rng;
            this.pairs =
                "..lexegezacebiso";
            "usesarmaindirea.";
            "eratenberalaveti";
            "edorquanteisrion";
        } // constructor
        Elite.prototype.randName = function () {
            var pair1 = 2 * Math.floor(this.rng.rand() * (this.pairs.length / 2));
            var pair2 = 2 * Math.floor(this.rng.rand() * (this.pairs.length / 2));
            var pair3 = 2 * Math.floor(this.rng.rand() * (this.pairs.length / 2));
            var pair4 = 2 * Math.floor(this.rng.rand() * (this.pairs.length / 2));
            var name = "";
            name += this.pairs.substr(pair1, 2);
            name += this.pairs.substr(pair2, 2);
            name += this.pairs.substr(pair3, 2);
            name += this.pairs.substr(pair4, 2);
            name = name.replace(/[.]/g, "");
            return name;
        }; // randName
        return Elite;
    }());
    NameGenerator.Elite = Elite; // Elite
    var Markov = (function () {
        function Markov(rng, database, order) {
            this.rng = rng;
            this.order = order;
            this.database = database;
            this.transitions = {};
            this.computeTransitions();
        } // constructor
        Markov.prototype.computeTransitions = function () {
            for (var i = 0; i < this.database.length; i++) {
                var word = this.database[i];
                var prev = "";
                var next = "";
                for (var j = 0; j < this.order; j++) {
                    prev += "^";
                } // for j
                for (var j = 0; j < word.length; j++) {
                    next = word.substr(j, 1);
                    this.updateTransitions(prev, next);
                    prev = prev.substr(-this.order + 1) + next;
                } // for j
                next = "$";
                this.updateTransitions(prev, next);
            } // for i
        }; // computeTransitions
        Markov.prototype.updateTransitions = function (prev, next) {
            var key = prev + next;
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
        }; // updateTransitions
        Markov.prototype.produce = function (prev) {
            var result = prev;
            while (prev !== "$") {
                var key = "#" + prev;
                if (!this.transitions.hasOwnProperty(key)) {
                    break;
                }
                var total = this.transitions[key];
                var random = Math.floor(total * this.rng.rand());
                var k = 0;
                for (var property in this.transitions) {
                    if (this.transitions.hasOwnProperty(key) &&
                        property.substr(0, prev.length) === prev) {
                        k += this.transitions[property];
                        if (k >= random) {
                            var next = property.substr(prev.length);
                            result += next;
                            prev = prev.substr(-this.order + 1) + next;
                            break;
                        }
                    }
                } // for property
            } // while
            return result.replace(/[\^$]/g, "");
        }; // produce
        Markov.prototype.randName = function () {
            var prev = "";
            for (var j = 0; j < this.order; j++) {
                prev += "^";
            } // for j
            return this.produce(prev);
        }; // randName
        return Markov;
    }());
    NameGenerator.Markov = Markov; // Markov
})(NameGenerator || (NameGenerator = {}));
// randXorshift.ts
var RNGLib;
(function (RNGLib) {
    var RandXorshift = (function () {
        function RandXorshift(seed) {
            if (seed === void 0) { seed = Date.now(); }
            this.seedInit = seed;
            this.seed = seed;
            this.reset(seed);
        }
        // Xorshift algorithm
        // See: https://github.com/StickyBeat/pseudo-random-generator-xor-shift
        RandXorshift.prototype.rand = function () {
            var t = (this.x ^ (this.x << 11)) & 0x7fffffff;
            this.x = this.y;
            this.y = this.z;
            this.z = this.seed;
            this.seed = (this.seed ^ (this.seed >> 19) ^ (t ^ (t >> 8)));
            return this.seed / 2147483648.0;
        }; // rand
        RandXorshift.prototype.reset = function (seed) {
            this.seed = seed ? seed : this.seedInit;
            // Xorshift initialization
            this.x = 123456789;
            this.y = 362436069;
            this.z = 521288629;
            for (var i = 0; i < 14; i++)
                this.rand(); // skip first random numbers which are not really random
        }; // reset
        return RandXorshift;
    }());
    RNGLib.RandXorshift = RandXorshift;
})(RNGLib || (RNGLib = {}));
// util.ts
var Util;
(function (Util) {
    function loadFile(filename, mimeType, callback) {
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType(mimeType);
        xobj.open("GET", filename, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState === 4 && xobj.status === 200) {
                callback(xobj.responseText);
            }
        };
        xobj.send(null);
    }
    Util.loadFile = loadFile; // loadFile
    function loadFileJson(filename, callback) {
        loadFile(filename, "application/json", callback);
    }
    Util.loadFileJson = loadFileJson; // loadFileJson
})(Util || (Util = {}));
