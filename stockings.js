/**
 * The heck is this?
 * For Christmas 2015, I had the idea that everybody on Christmas should get a stocking.
 * Rather than drawing names "secret santa" style, everybody makes one generic stocking full of goodies.
 * Then, on Christmas morning, everybody is allocated somebody else's stocking randomly :)
 * Since some people are in couples, they would know each other's stockings, so I wrote this quick app.
 * Basically, each person ticks off the stockings they helped to put together.
 * Then, the app will distribute the stockings to ensure that everyone gets one they didn't make.
 */

var inq = require("inquirer");
var clear = require("cli-clear");
var stdio = require("stdio");

var opts = stdio.getopt({
  debug: {
    description: "Run in debug mode?",
    default: false,
  }
});

var debug = opts.debug;

// load people array
var people = require("./people.json");

var stockings_count = people.length;

console.log("Starting up stockings allocator...");
console.log("We have " + stockings_count + " stockings to give out...");

var results = {};

function ShowPeople(cb) {
  clear();

  var stockings = [];
  for (var i = 0; i < stockings_count; i++) stockings.push({
    value: i + 1,
    name: "Stocking " + (i + 1),
  });

  var people_choices = [];
  for (var i = 0, person; person = people[i++];) {
    people_choices.push({
      value: person,
      name: person + (results[person] ? " (DONE)" : ""),
    });
  }

  inq.prompt([{
    name: "person",
    type: "list",
    message: "Who are you?",
    choices: people_choices,
  }, {
    name: "stocking",
    type: "checkbox",
    message: "Which stockings are yours? (you will not receive any stockings you tick)",
    choices: stockings,
  }], function(ans) {
    if (ans.stocking.length) {
      // make sure stockings values are ints
      for (var i = 0; i < ans.stocking.length; i++) {
        ans.stocking[i] = parseInt(ans.stocking[i], 10);
      }

      // only add to results if at least one stocking was added (and they didn't select all of them!)
      if (ans.stocking.length < stockings_count && ans.stocking.length > 0) {
        results[ans.person] = ans.stocking;
      }
    }

    return cb(null, ans);
  });
}

function CheckForPeople(cb) {
  var person_missing = false;
  for (var i = 0, person; person = people[i++];) {
    if (!results[person]) {
      person_missing = true;
      break;
    }
  }

  if (person_missing) {
    ShowPeople(function(err) {
      process.nextTick(CheckForPeople);
    });
  } else {
    // calculate results
    var res = null;
    while (!res) {
      res = AllocateStockings();
    }

    if (!debug) clear();

    // print out stocking list
    for (var person in res) {
      console.log(person + " ===> Stocking " + res[person] + "\n");
    }
  }
}

function AllocateStockings() {
  var r = {};
  var claimed_stockings = [];

  shuffle(people);

  for (var i = 0, person; person = people[i++];) {
    // how many stockings do we have up-for-grabs?
    var count = stockings_count - results[person].length;
    var poss_stockings = [];
    for (var j = 1; j <= stockings_count; j++) {
      if (results[person].indexOf(j) < 0 && claimed_stockings.indexOf(j) < 0) {
        poss_stockings.push(j);
      }
    }

    if (poss_stockings.length == 0) {
      console.error("Ran out of stockings... trying again...")
      return false;
    }

    var stocking = poss_stockings[RandInt(0, poss_stockings.length)];
    if (debug) console.log(person + " potential stockings: " + JSON.stringify(poss_stockings));
    if (debug) console.log("Gave " + person + " stocking " + stocking);
    claimed_stockings.push(stocking);
    if (debug) console.log("Claimed so far: " + JSON.stringify(claimed_stockings));
    r[person] = stocking;
  }

  return r;
}

function RandInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

if (debug) {
  results[people[0]] = [1, 2];
  results[people[1]] = [1, 2];
  results[people[2]] = [3, 4];
  results[people[3]] = [3, 4];
  results[people[4]] = [5];
  results[people[5]] = [6];
}

CheckForPeople();