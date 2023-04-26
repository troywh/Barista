import assert from "assert/strict"
import fs from "fs"
import ohm from "ohm-js"

const syntaxChecks = [
  ["all numeric literal forms", "print(8 * 89.123)"],
  ["complex expressions", "print(83 * ((((-((((13 / 21)))))))) + 1 - 0)"],
  ["all unary operators", "print (-3) print (!no)"],
  ["all binary operators", "print x and y or z * 1 / 2 ** 3 + 4 less than 5"],
  ["all arithmetic operators", "(!3) * 2 + 4 - (-7.3) * 8 ** 13 / 1 pumps x"],
  [
    "all relational operators",
    "1 less than (2 less than equal to (3 equal to (4 not equal to (5 greater than (6 greater than equal to 7))))) with x",
  ],
  ["all logical operators", "true and false or (!false) with x"],
  ["the conditional operator", "print x ? y : z"],
  ["end of program inside comment", "print(0) <comment> yay </comment>"],
  ["comments with no text are ok", "print(1) <comment>\nprint(0)</comment>"],
  ["non-Latin letters in identifiers", "5 pumps キャラメル"],
]

const syntaxErrors = [
  ["non-letter in an identifier", "ab😭c = 2", /Line 1, col 3/],
  ["malformed number", "x= 2.", /Line 1, col 6/],
  ["chained inititalization", "x = y = 1", /Line 1, col 7/],
  ["a missing right operand", "print(5 -", /Line 1, col 10/],
  ["a non-operator", "print (7 * (2 _ 3))", /Line 1, col 15/],
  ["an expression starting with a )", ")x+2", /Line 1, col 1/],
  ["a statement starting with expression", "x * 5", /Line 1, col 6/],
  ["an illegal statement on line 2", "print(5)\nx * 5", /Line 2, col 6/],
  ["a statement starting with a )", "print(5)\n) * 5", /Line 2, col 1/],
  ["an expression starting with a *", "x = * 71", /Line 1, col 5/],
]

describe("The grammar", () => {
  const grammar = ohm.grammar(fs.readFileSync("src/barista.ohm"))
  for (const [scenario, source] of syntaxChecks) {
    it(`properly specifies ${scenario}`, () => {
      assert(grammar.match(source).succeeded())
    })
  }
  for (const [scenario, source, errorMessagePattern] of syntaxErrors) {
    it(`does not permit ${scenario}`, () => {
      const match = grammar.match(source)
      assert(!match.succeeded())
      assert(new RegExp(errorMessagePattern).test(match.message))
    })
  }
})
