import assert from "assert/strict"
import analyze from "../src/analyzer.js"

// const semanticChecks = [
//   ["variables can be printed", "1 pump y print y"],
//   ["variables can be reassigned", "1 pump y  y * 5 / ((-3) + y) pump y"],
//   [
//     "all predefined identifiers",
//     "print ln(sqrt(sin(cos(hypot(π,1) + exp(5.52)))))",
//   ],
// ]

const semanticChecks = [
  ["variables can be printed", "1 pump y print y"],
  ["variables can be reassigned", "1 pump y  y = y * 5 / ((-3) + y)"],
  ["variable declarations", "1 pump y"],
  ["functions with return value", "order f(x) -> pumps {serve x * 2}"],
  ["increment ", "1 pump y add 1 to y"],
  ["boolean", "yes x no y y = yes"],
  ["loops", "5 pumps count blend while count less than 10 { print count }"],
  ["function with no return value", "order g(x) { print (x * 2) }"],
  ["conditions", "if true { print 1 }"],
  ["loops with return statement", "blend while true { serve }"],
  ["function return true", "order g() -> bool {serve true}"],
  ["function return false", "order g() -> bool {serve false}"],
  ["condition with no", "if no {print no}"],
  ["condition with yes", "if yes {print yes}"],
  ["if else", " if yes {serve 2} else {serve 5}"],
  ["and statment", "if true && false {serve false}"],
  ["or statement", "if true || false {serve false}"],
  ["multiplication", "(2 * 2) pumps y"],
  ["division", "(2 / 2) pumps t"],
  ["division and multiplication", "(2 / 2)*4 pumps x"],
]

const semanticErrors = [
  ["using undeclared identifiers", "print x", /Identifier x not declared/],
  ["a variable used as function", "1 pump x  x(2) ", /Expected "="/],
  ["a function used as variable", "print sin + 1", /expected/],
  [
    "re-declared identifier",
    "1 pump y 2 pump y",
    /Identifier y already declared/,
  ],
  ["an attempt to write a read-only var", "π = 3", /π is read only/],
  ["too few arguments", "print sin()", /Expected 1 arg\(s\), found 0/],
  ["too many arguments", "print sin(5, 10)", /Expected 1 arg\(s\), found 2/],
]

describe("The analyzer", () => {
  it("throws on syntax errors", () => {
    assert.throws(() => analyze("*(^%$"))
  })
  for (const [scenario, source] of semanticChecks) {
    it(`recognizes ${scenario}`, () => {
      assert.ok(analyze(source))
    })
  }
  for (const [scenario, source, errorMessagePattern] of semanticErrors) {
    it(`throws on ${scenario}`, () => {
      assert.throws(() => analyze(source), errorMessagePattern)
    })
  }
  //   it("builds an unoptimized AST for a trivial program", () => {
  //     const ast = analyze("print 2")
  //     assert.equal(ast.statements[0].callee.name, "print")
  //     assert.equal(ast.statements[0].args[0].left, 1n)
  //   })
})
