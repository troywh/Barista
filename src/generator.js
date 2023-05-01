// CODE GENERATOR: Carlos -> JavaScript
//
// Invoke generate(program) with the program node to get back the JavaScript
// translation as a string.

import { Type } from "./core.js"

export default function generate(program) {
  const output = []
  const targetName = ((mapping) => {
    return (entity) => {
      if (!mapping.has(entity)) {
        mapping.set(entity, mapping.size + 1)
      }
      return `${entity.name ?? entity.description ?? entity.id}`
    }
  })(new Map())

  function gen(node) {
    return generators[node.constructor.name](node)
  }

  const generators = {
    // Key idea: when generating an expression, just return the JS string; when
    // generating a statement, write lines of translated JS to the output array.
    Program(p) {
      gen(p.statements)
    },
    VariableDeclaration(d) {
      // We don't care about const vs. let in the generated code! The analyzer has
      // already checked that we never updated a const, so let is always fine.
      output.push(`let ${gen(d.variable)} = ${gen(d.initializer)};`)
    },
    ClassDeclaration(d) {
      output.push(`class ${targetName(d.typeCreated)} {`)
      gen(d.constructorDec)
      for (let method of d.methods) {
        gen(method)
      }
      output.push("}")
    },
    Field(f) {
      return `this["${targetName(f.variable)}"] = ${targetName(f.initializer)};`
    },
    FunctionDeclaration(d) {
      output.push(
        `function ${gen(d.fun)}(${gen(d.fun.parameters).join(", ")}) {`
      )
      gen(d.body)
      output.push("}")
    },
    Parameter(p) {
      return targetName(p)
    },
    Variable(v) {
      return targetName(v)
    },
    Function(f) {
      return targetName(f)
    },
    AssignmentStatement(s) {
      output.push(`${gen(s.target)} = ${gen(s.source)};`)
    },
    IncrementStatement(s) {
      output.push(`${gen(s.target)} += ${gen(s.source)};`)
    },
    BreakStatement(s) {
      output.push("break;")
    },
    ReturnStatement(s) {
      output.push(`return ${gen(s.expression)};`)
    },
    ShortReturnStatement(s) {
      output.push("return;")
    },
    Conditional(s) {
      output.push(`if(${gen(s.test)}) {`)
      gen(s.consequent)
      output.push(`}`)
      s.alternates.forEach((alt) => {
        output.push(`else if (${gen(alt.test)}) {`)
        gen(alt.consequent)
        output.push(`}`)
      })
      if (s.final.length != 0) {
        output.push(`else {`)
        gen(s.final)
        output.push(`}`)
      }
    },
    WhileLoop(s) {
      output.push(`while (${gen(s.test)}) {`)
      gen(s.body)
      output.push("}")
    },
    ForLoop(s) {
      const i = targetName(s.variable)
      output.push(
        `for (let ${i} = ${gen(s.start)}; ${i} < ${gen(s.end)}; ${i}++) {`
      )
      gen(s.body)
      output.push("}")
    },
    ForEachLoop(s) {
      output.push(`for (let ${gen(s.variable)} of ${gen(s.expression)}) {`)
      gen(s.body)
      output.push("}")
    },
    BinaryExpression(e) {
      let op =
        {
          "equal to": "===",
          "not equal to": "!==",
          or: "||",
          and: "&&",
          "less than": "<",
          "less than equal to": "<=",
          "greater than": ">",
          "greater than equal to": ">=",
        }[e.op] ?? e.op
      return `(${gen(e.left)} ${op} ${gen(e.right)})`
    },
    UnaryExpression(e) {
      return `${e.op}(${gen(e.operand)})`
    },
    SubscriptExpression(e) {
      return `${gen(e.array)}[${gen(e.index)}]`
    },
    ArrayExpression(e) {
      return `[${gen(e.elements).join(",")}]`
    },
    DotExpression(e) {
      const object = gen(e.object)
      const member = gen(e.member.variable)
      return `(${object}["${member}"])`
    },
    ThisExpression(e) {
      return "this"
    },
    ObjectDec(o) {
      return `new ${targetName(o.type)}(${gen(o.args)})`
    },
    ConstructorDeclaration(c) {
      output.push(`constructor(${gen(c.parameters).join(",")}) {`)
      for (let field of c.body) {
        output.push(`${gen(field)}`)
      }
      output.push("}")
    },
    PrintStatement(e) {
      const argument = gen(e.argument)
      output.push(`console.log(${argument});`)
    },
    DotCall(c) {
      let targetCode = `${targetName(c.object)}.${targetName(
        c.member.callee.name
      )}()`
      if (
        c.member.callee instanceof Type ||
        c.member.callee.name.returnType !== Type.NONE
      ) {
        return targetCode
      }
      output.push(`${targetCode};`)
    },
    MethodDeclaration(c) {
      output.push(
        `${targetName(c.name)}(${gen(c.name.parameters).join(", ")}) {`
      )
      gen(c.body)
      output.push("}")
    },
    Call(c) {
      const targetCode = `${gen(c.callee)}(${gen(c.args).join(", ")})`
      // Calls in expressions vs in statements are handled differently
      if (c.callee instanceof Type || c.callee.type.returnType !== Type.NONE) {
        return targetCode
      }
      output.push(`${targetCode};`)
    },
    Number(e) {
      return e
    },
    BigInt(e) {
      return e
    },
    Boolean(e) {
      return e
    },
    String(e) {
      return e
    },
    Array(a) {
      return a.map(gen)
    },
  }

  gen(program)
  return output.join("\n")
}
