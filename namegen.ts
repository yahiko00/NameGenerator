/// <reference path="Scripts/rng/rng.ts"/>

interface NameGenerator {
  randName(): string;
} // NameGenerator

class NameGeneratorElite implements NameGenerator {
  rng: SeededRNG;
  pairs: string;
  
  constructor(rng: SeededRNG) {
    this.rng = rng;
    this.pairs = "..lexegezacebiso"
                 "usesarmaindirea."
                 "eratenberalaveti"
                 "edorquanteisrion";
  } // constructor
  
  randName(): string {
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
  } // randName
} // NameGeneratorElite

class NameGeneratorMarkov implements NameGenerator {
  rng: SeededRNG;
  order: number; // order of the Markov chain
  database: string[];
  transitions: Object;

  constructor(rng: SeededRNG, database: string[], order: number) {
    this.rng = rng;
    this.order = order;

    this.database = database;
    this.transitions = {};

    this.computeTransitions();
  } // constructor

  computeTransitions() {
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
  } // computeTransitions

  updateTransitions(prev: string, next: string) {
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
  } // updateTransitions

  produce(prev: string): string {
    var result = prev;

    while (prev != "$") {
      var key = "#" + prev;
      if (!this.transitions.hasOwnProperty(key)) {
        break;
      }

      var total: number = this.transitions[key];
      var random = Math.floor(total * this.rng.rand());
      var k = 0;

      for (var property in this.transitions) {
        if (this.transitions.hasOwnProperty(key) &&
            property.substr(0, prev.length) == prev) {
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
  } // produce

  randName(): string {
    var prev = "";

    for (var j = 0; j < this.order; j++) {
      prev += "^";
    } // for j

    return this.produce(prev);
  } // randName
} // NameGeneratorMarkov

function loadFile(filename: string, mimeType: string, callback: (response: string) => void) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType(mimeType);
  xobj.open("GET", filename, true);
  xobj.onreadystatechange = () => {
    if (xobj.readyState == 4 && xobj.status == 200) {
      callback(xobj.responseText);
    }
  }
  xobj.send(null);
} // loadFile

function loadFileJson(filename: string, callback: (response: string) => void) {
  loadFile(filename, "application/json", callback);
} // loadFileJson
