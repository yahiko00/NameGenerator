/// <reference path="Scripts/rng/rng.ts"/>
var NameGeneratorElite = (function () {
    function NameGeneratorElite(rng) {
        this.rng = rng;
        this.pairs = "..lexegezacebiso";
        "usesarmaindirea.";
        "eratenberalaveti";
        "edorquanteisrion";
    } // constructor
    NameGeneratorElite.prototype.randName = function () {
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
    return NameGeneratorElite;
})(); // NameGeneratorElite
var NameGeneratorMarkov = (function () {
    function NameGeneratorMarkov(rng, database, order) {
        this.rng = rng;
        this.order = order;
        this.database = database;
        this.transitions = {};
        this.computeTransitions();
    } // constructor
    NameGeneratorMarkov.prototype.computeTransitions = function () {
        for (var i = 0; i < this.database.length; i++) {
            var word = this.database[i];
            var prev = "";
            var next = "";
            for (var j = 0; j < this.order; j++) {
                prev += "^";
            }
            for (var j = 0; j < word.length; j++) {
                next = word.substr(j, 1);
                this.updateTransitions(prev, next);
                prev = prev.substr(-this.order + 1) + next;
            }
            next = "$";
            this.updateTransitions(prev, next);
        }
    }; // computeTransitions
    NameGeneratorMarkov.prototype.updateTransitions = function (prev, next) {
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
    NameGeneratorMarkov.prototype.produce = function (prev) {
        var result = prev;
        while (prev != "$") {
            var key = "#" + prev;
            if (!this.transitions.hasOwnProperty(key)) {
                break;
            }
            var total = this.transitions[key];
            var random = Math.floor(total * this.rng.rand());
            var k = 0;
            for (var property in this.transitions) {
                if (this.transitions.hasOwnProperty(key) && property.substr(0, prev.length) == prev) {
                    k += this.transitions[property];
                    if (k >= random) {
                        var next = property.substr(prev.length);
                        result += next;
                        prev = prev.substr(-this.order + 1) + next;
                        break;
                    }
                }
            }
        }
        return result.replace(/[\^$]/g, "");
    }; // produce
    NameGeneratorMarkov.prototype.randName = function () {
        var prev = "";
        for (var j = 0; j < this.order; j++) {
            prev += "^";
        }
        return this.produce(prev);
    }; // randName
    return NameGeneratorMarkov;
})(); // NameGeneratorMarkov
function loadFile(filename, mimeType, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType(mimeType);
    xobj.open("GET", filename, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == 200) {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
} // loadFile
function loadFileJson(filename, callback) {
    loadFile(filename, "application/json", callback);
} // loadFileJson
//# sourceMappingURL=namegen.js.map