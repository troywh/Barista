import assert from "node:assert/strict"
import analyze from "../src/analyzer.js"
import optimize from "../src/optimizer.js"
import generate from "../src/generator.js"

function dedent(s) {
  return `${s}`.replace(/(?<=\n)\s+/g, "").trim()
}

const fixtures = [
  {
    name: "small",
    source: `
      3*7 pumps x
      add 1 to x
      add -1 to x
      yes y
      y = 5 ** (-x) / (-100) greater than (-x) or false
      print((y and y) or false or (x*2) not equal to 5)
    `,
    expected: dedent`
      let x = 21;
      x += 1;
      x += -1;
      let y = true;
      y = (((5 ** -(x)) / -100) > -(x));
      console.log(((y && y) || ((x * 2) !== 5)));
    `,
  },
  {
    name: "if",
    source: `
      0 pumps x
      if x equal to 0 { print "1" }
      if x equal to 0 { print 1 } else { print 2 }
      if x equal to 0 { print 1 } else if x equal to 2 { print 3 }
      if x equal to 0 { print 1 } else if x equal to 2 { print 3 } else { print 4 }
    `,
    expected: dedent`
      let x = 0;
      if((x === 0)) {
      console.log("1");
      }
      if((x === 0)) {
      console.log(1);
      }
      else {
      console.log(2);
      }
      if((x === 0)) {
      console.log(1);
      }
      else if ((x === 2)) {
      console.log(3);
      }
      if((x === 0)) {
      console.log(1);
      }
      else if ((x === 2)) {
      console.log(3);
      }
      else {
      console.log(4);
      }
    `,
  },
  {
    name: "while",
    source: `
      0 pumps x
      blend while x less than 5 {
        0 pumps y
        blend while y less than 5 {
          print x * y
          add 1 to y
          stop
        }
        add 1 to x
      }
    `,
    expected: dedent`
      let x = 0;
      while ((x < 5)) {
      let y = 0;
      while ((y < 5)) {
      console.log((x * y));
      y += 1;
      break;
      }
      x += 1;
      }
    `,
  },
  {
    name: "dowhile",
    source: `
      5 pumps max
      0 pumps count
      blend {
        add 1 to count
        print count
      } until count greater than max
    `,
    expected: dedent`
      let max = 5;
      let count = 0;
      do {
        count += 1;
        console.log(count);
      } while (!(count > max));
    `,
  },
  {
    name: "functions",
    source: `
      1 pumps z
      order f(pumps x, pumps y) {
        print x greater than equal to y
      }
      order g()->pumps {
        serve 2
      }
      f(z, g())
    `,
    expected: dedent`
      let z = 1;
      function f(x, y) {
      console.log((x >= y));
      }
      function g() {
      return 2;
      }
      f(z, g());
    `,
  },
  /*{
    name: "arrays",
    source: `
      let a = [true, false, true];
      let b = [10, #a - 20, 30];
      const c = [[int]]();
      const d = random b;
      print(a[1] || (b[0] < 88 ? false : true));
    `,
    expected: dedent`
      let a_1 = [true,false,true];
      let b_2 = [10,(a_1.length - 20),30];
      let c_3 = [];
      let d_4 = _r(b_2);
      console.log((a_1[1] || (((b_2[0] < 88)) ? (false) : (true))));
      function _r(a){return a[~~(Math.random()*a.length)]}
    `,
  },
  {
    name: "structs",
    source: `
      struct S { x: int }
      let x = S(3);
      print(x.x);
    `,
    expected: dedent`
      class S_1 {
      constructor(x_2) {
      this["x_2"] = x_2;
      }
      }
      let x_3 = new S_1(3);
      console.log((x_3["x_2"]));
    `,
  }*/
]

describe("The code generator", () => {
  for (const fixture of fixtures) {
    it(`produces expected js output for the ${fixture.name} program`, () => {
      const actual = generate(optimize(analyze(fixture.source)))
      assert.deepEqual(actual, fixture.expected)
    })
  }
})
