import util from "util"

export class Program {
  constructor(statements) {
    this.statements = statements
  }
}

export class Type {
  static INT = new Type("int")
  static STRING = new Type("string")
  static BOOLEAN = new Type("bool")
}

export class FunctionDeclaration {
  constructor(name, fun, params, body) {
    Object.assign(this, { name, fun, params, body })
  }
}

export class Function {
  // Generated when processing a function declaration
  constructor(name, type) {
    Object.assign(this, { name, type })
  }
}

export class FunctionType extends Type {
  constructor(paramTypes, returnType) {
    super(`(${paramTypes.map((t) => t).join(",")})->${returnType}`)
    Object.assign(this, { paramTypes, returnType })
  }
}

export class PrintStatement {
  constructor(argument) {
    Object.assign(this, { argument })
  }
}

export class Conditional {
  constructor(test, consequent, alternates, final) {
    Object.assign(this, { test, consequent, alternates, final })
  }
}

export class VariableDeclaration {
  constructor(initializer, type, readonly, variable) {
    Object.assign(this, { initializer, type, variable })
  }
}

export class ClassDeclaration {
  constructor(name, body) {
    Object.assign(this, { name, body })
  }
}

export class AssignmentStatement {
  constructor(target, source) {
    Object.assign(this, { target, source })
  }
}

export class Call {
  constructor(callee, args) {
    Object.assign(this, { callee, args })
  }
}

export class WhileStatement {
  constructor(test, body) {
    Object.assign(this, { test, body })
  }
}

export class DoWhileStatement {
  constructor(test, body) {
    Object.assign(this, { test, body })
  }
}

export class BinaryExpression {
  constructor(op, left, right) {
    Object.assign(this, { op, left, right })
  }
}

export class UnaryExpression {
  constructor(op, operand) {
    Object.assign(this, { op, operand })
  }
}

export class TernaryExpression {
  constructor(test, consequent, alternate) {
    Object.assign(this, { test, consequent, alternate })
  }
}

export class Parameters {
  constructor(params) {
    Object.assign(this, { params })
  }
}

export class Arguments {
  constructor(params) {
    Object.assign(this, { params })
  }
}

export class StringLiteral {
  constructor(contents) {
    this.contents = contents
  }
}

Program.prototype[util.inspect.custom] = function () {
  const tags = new Map()

  // Attach a unique integer tag to every node
  function tag(node) {
    if (tags.has(node) || typeof node !== "object" || node === null) return
    tags.set(node, tags.size + 1)
    for (const child of Object.values(node)) {
      Array.isArray(child) ? child.forEach(tag) : tag(child)
    }
  }

  function* lines() {
    function view(e) {
      if (tags.has(e)) return `#${tags.get(e)}`
      if (Array.isArray(e)) return `[${e.map(view)}]`
      return util.inspect(e)
    }
    for (let [node, id] of [...tags.entries()].sort((a, b) => a[1] - b[1])) {
      let type = node.constructor.name
      let props = Object.entries(node).map(([k, v]) => `${k}=${view(v)}`)
      yield `${String(id).padStart(4, " ")} | ${type} ${props.join(" ")}`
    }
  }

  tag(this)
  return [...lines()].join("\n")
}
