import assert from "assert/strict"
import analyze from "../src/analyzer.js"

// const semanticChecks = [
//   ["variables can be printed", "1 pumps y print y"],
//   ["variables can be reassigned", "1 pumps y  y * 5 / ((-3) + y) pumps y"],
//   [
//     "all predefined identifiers",
//     "print ln(sqrt(sin(cos(hypot(π,1) + exp(5.52)))))",
//   ],
// ]

const semanticChecks = [
  ["variables can be printed", "1 pumps y print y"],
  ["variables can be reassigned", "1 pumps y  y = y * 5 / ((-3) + y)"],
  ["variable declarations", "1 pumps y"],
  ["functions with return value", "order f(pumps x) -> pumps {serve x * 2}"],
  ["increment ", "1 pumps y add 1 to y"],
  ["boolean", "yes x print x"],
  ["loops", "5 pumps count blend while count less than 10 { print count }"],
  ["function with no return value", "order g(pumps x) { print (1 * 2) }"],
  ["conditions", "if true { print 1 }"],
  ["loops with return statement", "blend while true { serve }"],
  ["function return true", "order g() -> bool {serve true}"],
  ["function return false", "order g() -> bool {serve false}"],
  ["condition with no", "if no {print no}"],
  ["condition with yes", "if yes {print yes}"],
  ["if else", " if yes {serve 2} else {serve 5}"],
  ["and statment", "if true and false {serve false}"],
  ["or statement", "if true or false {serve false}"],
  ["multiplication", "(2 * 2) pumps y"],
  ["division", "(2 / 2) pumps t"],
  ["division and multiplication", "(2 / 2)*4 pumps x"],
]

const semanticErrors = [
  ["using undeclared identifiers", "print x", /Identifier x not declared/],
  [
    "function used as a variable",
    "order g(x) -> bool {serve true} g(2) + 1 ",
    /Expected/,
  ],
  [
    "an undeclared var used as variable",
    "print sin + 1",
    /Identifier sin not declared/,
  ],
  [
    "re-declared identifier",
    "1 pumps y 2 pumps y",
    /Identifier y already declared/,
  ],
  [
    "an attempt to write a read-only var",
    "3 pumps* x x = 3",
    /Cannot assign to constant x/,
  ],
  [
    "too few arguments",
    "order g(pumps x, pumps y) -> bool {serve true} g(1)",
    /Expected 2 arguments but got 1/,
  ],
  [
    "too many arguments",
    "order g() -> bool {serve true} g(1,2,3,4)",
    /Expected 0 arguments but got 4/,
  ],
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
