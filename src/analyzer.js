import fs from "fs"
import ohm from "ohm-js"
import * as core from "./core.js"

const baristaGrammar = ohm.grammar(fs.readFileSync("src/barista.ohm"))

const INT = core.Type.INT
const FLOAT = core.Type.FLOAT
const STRING = core.Type.STRING
const BOOLEAN = core.Type.BOOLEAN
const ANY = core.Type.ANY
const VOID = core.Type.VOID

function must(condition, message, errorLocation) {
  if (!condition) error(message, errorLocation)
}

function mustNotAlreadyBeDeclared(context, name) {
  must(!context.sees(name), `Identifier ${name} already declared`)
}

function mustHaveBeenFound(entity, name, at) {
  must(entity, `Identifier ${name} not declared`, at)
}

function mustHaveNumericType(e, at) {
  must([INT, FLOAT].includes(e.type), "Expected a number", at)
}

function mustHaveNumericOrStringType(e, at) {
  must([INT, FLOAT, STRING].includes(e.type), "Expected a number or string", at)
}

function mustHaveBooleanType(e, at) {
  must(e.type === BOOLEAN, "Expected a boolean", at)
}

function mustHaveIntegerType(e, at) {
  must(e.type === INT, "Expected an integer", at)
}

function mustHaveAnArrayType(e, at) {
  must(e.type instanceof core.ArrayType, "Expected an array", at)
}

function mustHaveAnOptionalType(e, at) {
  must(e.type instanceof core.OptionalType, "Expected an optional", at)
}

function mustHaveAStructType(e, at) {
  must(e.type instanceof core.StructType, "Expected a struct", at)
}

function mustHaveOptionalStructType(e, at) {
  must(
    e.type instanceof core.OptionalType &&
      e.type.baseType.constructor == core.StructType,
    "Expected an optional struct",
    at
  )
}

function entityMustBeAType(e, at) {
  must(e instanceof core.Type, "Type expected", at)
}

function mustBeTheSameType(e1, e2, at) {
  must(equivalent(e1.type, e2.type), "Operands do not have the same type", at)
}

function mustAllHaveSameType(expressions, at) {
  // Used to check array elements, for example
  must(
    expressions.slice(1).every((e) => equivalent(e.type, expressions[0].type)),
    "Not all elements have the same type",
    at
  )
}

function mustHaveRightNumberOfArguments(args, params, at) {
  must(
    args.length === params.length,
    `Expected ${params.length} arguments but got ${args.length}`,
    at
  )
}

function mustBeFunction(entity, at) {
  must(entity instanceof core.Function, "Function expected", at)
}

function mustNotBeRecursive(struct, at) {
  must(
    !struct.fields.map((f) => f.type).includes(struct),
    "Struct type must not be recursive",
    at
  )
}

function equivalent(t1, t2) {
  return (
    t1 === t2 ||
    (t1 instanceof core.OptionalType &&
      t2 instanceof core.OptionalType &&
      equivalent(t1.baseType, t2.baseType)) ||
    (t1 instanceof core.ArrayType &&
      t2 instanceof core.ArrayType &&
      equivalent(t1.baseType, t2.baseType)) ||
    (t1.constructor === core.FunctionType &&
      t2.constructor === core.FunctionType &&
      equivalent(t1.returnType, t2.returnType) &&
      t1.paramTypes.length === t2.paramTypes.length &&
      t1.paramTypes.every((t, i) => equivalent(t, t2.paramTypes[i])))
  )
}

function assignable(fromType, toType) {
  return (
    toType == ANY ||
    equivalent(fromType, toType) ||
    (fromType.constructor === core.FunctionType &&
      toType.constructor === core.FunctionType &&
      // covariant in return types
      assignable(fromType.returnType, toType.returnType) &&
      fromType.paramTypes.length === toType.paramTypes.length &&
      // contravariant in parameter types
      toType.paramTypes.every((t, i) => assignable(t, fromType.paramTypes[i])))
  )
}

function mustBeAssignable(e, { toType: type }, at) {
  must(
    assignable(e.type, type),
    `Cannot assign a ${e.type.description} to a ${type.description}`,
    at
  )
}

function mustBePrintableType(e) {
  const type = e.type
  must(
    type === STRING || type === INT || type === FLOAT || type === BOOLEAN,
    `${e.type} is not printable`
  )
}

function mustNotBeReadOnly(e, at) {
  must(!e.readOnly, `Cannot assign to constant ${e.name}`, at)
}

function fieldsMustBeDistinct(fields, at) {
  const fieldNames = new Set(fields.map((f) => f.name))
  must(fieldNames.size === fields.length, "Fields must be distinct", at)
}

function memberMustBeDeclared(field, { in: structType }, at) {
  must(
    structType.fields.map((f) => f.name).includes(field),
    "No such field",
    at
  )
}

function mustBeInLoop(context, at) {
  must(context.inLoop, "Break can only appear in a loop", at)
}

function mustBeInAFunction(context, at) {
  must(context.function, "Return can only appear in a function", at)
}

function mustBeCallable(e, at) {
  must(
    e instanceof core.StructType || e.type.constructor == core.FunctionType,
    "Call of non-function or non-constructor",
    at
  )
}

function mustNotReturnAnything(f, at) {
  must(f.type.returnType === VOID, "Something should be returned", at)
}

function mustReturnSomething(f, at) {
  must(
    f.type.returnType !== VOID,
    "Cannot return a value from this function",
    at
  )
}

function mustBeReturnable({ expression: e, from: f }, at) {
  mustBeAssignable(e, { toType: f.type.returnType }, at)
}

function argumentsMustMatch(args, targetTypes, at) {
  must(
    targetTypes.length === args.length,
    `Expected ${targetTypes.length} arguments but got ${args.length}`,
    at
  )
  targetTypes.forEach((type, i) => mustBeAssignable(args[i], { toType: type }))
}

function callArgumentsMustMatch(args, calleeType, at) {
  argumentsMustMatch(args, calleeType.paramTypes, at)
}

function constructorArgumentsMustMatch(args, structType, at) {
  const fieldTypes = structType.fields.map((f) => f.type)
  argumentsMustMatch(args, fieldTypes, at)
}

class Context {
  constructor({
    parent = null,
    locals = new Map(),
    inLoop = false,
    function: f = null,
  }) {
    Object.assign(this, { parent, locals, inLoop, function: f })
  }
  sees(name) {
    // Search "outward" through enclosing scopes
    return this.locals.has(name) || this.parent?.sees(name)
  }
  printable(argument) {
    mustBePrintableType(argument)
  }
  add(name, entity) {
    mustNotAlreadyBeDeclared(this, name)
    this.locals.set(name, entity)
  }
  lookup(name) {
    const entity = this.locals.get(name) || this.parent?.lookup(name)
    return entity
  }
  newChildContext(props) {
    return new Context({ ...this, ...props, parent: this, locals: new Map() })
  }
}

// Throw an error message that takes advantage of Ohm's messaging
function error(message, node) {
  if (node && node.source) {
    throw new Error(`${node.source.getLineAndColumnMessage()}${message}`)
  }
  throw new Error(message)
}

export default function analyze(sourceCode) {
  let context = new Context({})

  const analyzer = baristaGrammar.createSemantics().addOperation("rep", {
    Program(body) {
      return new core.Program(body.children.map((s) => s.rep()))
    },
    Statement_return(_serve, expression) {
      return new core.ReturnStatement(expression.rep())
    },
    Statement_print(_print, argument) {
      const arg = argument.rep()
      context.printable(arg)
      return new core.PrintStatement(arg)
    },
    Statement_ifstmt(_if, test, consequent, alternates, _else, final) {
      const tst = test.rep()
      mustHaveBooleanType(tst, test)
      return new core.Conditional(
        tst,
        consequent.rep(),
        alternates.rep(),
        final.rep()
      )
    },
    Statement_vardec(expression, type, readonly, id) {
      const iden = id.sourceString
      const t = type.rep()
      const expr = expression.rep()
      readonly = readonly.rep().length !== 0
      const variable = new core.Variable(iden, t, readonly, expr)
      context.add(iden, variable)
      return new core.VariableDeclaration(expr, t, readonly, iden)
    },
    Statement_booldec(value, readonly, id) {
      const iden = id.rep()
      const val = value.rep()
      readonly = readonly.rep().length !== 0
      const variable = new core.Variable(iden, BOOLEAN, readonly, val)
      context.add(iden, variable)
      return new core.VariableDeclaration(val, BOOLEAN, readonly, iden)
    },
    Statement_fundec(_order, id, paramList, type, block) {
      const returnType = type?.rep()[0] ?? VOID
      const iden = id.rep()
      const params = paramList.rep()
      const paramTypes = params.map((param) => param.type)
      const funType = new core.FunctionType(paramTypes, returnType)
      const fun = new core.Function(iden, funType)
      context.add(iden, fun)
      context = context.newChildContext({ inLoop: false, function: fun })
      for (const param of params) context.add(param.name, param)
      const body = block.rep()
      context = context.parent
      return new core.FunctionDeclaration(iden, fun, params, body)
    },
    Statement_classdec(_item, id, _left, body, _right) {
      return new core.ClassDeclaration(id.rep(), body.rep())
    },
    Statement_while(_blend, _while, test, body) {
      const expr = test.rep()
      mustHaveBooleanType(expr, { at: test })
      context = context.newChildContext({ inLoop: true })
      const block = body.rep()
      context = context.parent
      return new core.WhileLoop(expr, block)
    },
    Statement_dowhile(_blend, body, _until, test) {
      const expr = test.rep()
      mustHaveBooleanType(expr, { at: test })
      context = context.newChildContext({ inLoop: true })
      const block = body.rep()
      context = context.parent
      return new core.DoWhileLoop(expr, block)
    },
    Statement_break(breakKeyword) {
      mustBeInLoop(context, { at: breakKeyword })
      return new core.BreakStatement()
    },

    FunReturn(_arrow, type) {
      return type.rep()
    },
    ElIf(_else, _if, test, consequent) {
      return new core.Conditional(test.rep(), consequent.rep())
    },
    Block(_left, body, _right) {
      return body.rep()
    },
    Assignment_plain(id, _equals, expression) {
      const variable = id.sourceString
      const entity = context.lookup(variable)
      mustHaveBeenFound(entity, variable, id)
      mustNotBeReadOnly(entity, id)
      return new core.AssignmentStatement(variable, expression.rep())
    },
    Assignment_increment(_add, expression, _to, id) {
      const variable = id.sourceString
      const entity = context.lookup(variable)
      mustHaveBeenFound(entity, variable, id)
      mustNotBeReadOnly(entity, id)
      return new core.IncrementStatement(variable, expression.rep())
    },

    Exp_unary(op, expression) {
      return new core.UnaryExpression(op.rep(), expression.rep())
    },
    Exp_ternary(test, _questionMark, consequent, _colon, alternate) {
      return new core.TernaryExpression(
        test.rep(),
        consequent.rep(),
        alternate.rep()
      )
    },
    OrExp_binary(left, op, right) {
      return new core.BinaryExpression(
        op.rep(),
        left.rep(),
        right.rep(),
        BOOLEAN
      )
    },
    AndExp_binary(left, op, right) {
      return new core.BinaryExpression(
        op.rep(),
        left.rep(),
        right.rep(),
        BOOLEAN
      )
    },
    CmpExp_binary(left, op, right) {
      return new core.BinaryExpression(
        op.rep(),
        left.rep(),
        right.rep(),
        BOOLEAN
      )
    },
    AddExp_binary(left, op, right) {
      return new core.BinaryExpression(op.rep(), left.rep(), right.rep(), INT)
    },
    MulExp_binary(left, op, right) {
      return new core.BinaryExpression(op.rep(), left.rep(), right.rep(), INT)
    },
    ExpExp_binary(left, op, right) {
      return new core.BinaryExpression(op.rep(), left.rep(), right.rep(), INT)
    },
    Term_member(parent, _dot, id) {
      //Not complete
      if (parent.sourceString !== "this") {
        const entity = context.lookup(parent.sourceString)
        mustHaveBeenFound(entity, parent.sourceString, id)
        return entity
        // TODO
      }

      return new core.Program() // TODO FIX THIS
    },
    Term_id(id) {
      const entity = context.lookup(id.sourceString)
      mustHaveBeenFound(entity, id.sourceString, id)
      return entity
    },
    Term_parens(_left, expression, _right) {
      return expression.rep()
    },

    Call(id, args) {
      const entity = context.lookup(id.sourceString)
      const argsRep = args.rep()
      mustHaveBeenFound(entity, id.sourceString, id)
      mustBeFunction(entity, id.sourceString)
      mustHaveRightNumberOfArguments(argsRep, entity.type.paramTypes, id)
      if (entity.params > 0) {
        argumentsMustMatch(argsRep, entity.type.paramTypes, id)
      }
      return new core.Call(entity, argsRep)
    },
    Param(type, id) {
      return new core.Parameter(type.sourceString, id.sourceString)
    },
    Params(_left, list, _right) {
      return list.asIteration().children.map((p) => p.rep())
    },
    Args(_left, list, _right) {
      return list.asIteration().children.map((p) => p.rep())
    },

    Type(type) {
      return type.rep()
    },

    true(_) {
      return true
    },
    false(_) {
      return false
    },
    numlit(_leading, _dot, _fractional) {
      return Number(this.sourceString)
    },
    strlit(_open, chars, _close) {
      return new core.StringLiteral(chars.sourceString)
    },
    id(chars) {
      return chars.sourceString
    },
    _terminal() {
      return this.sourceString
    },
    _iter(...children) {
      return children.map((child) => child.rep())
    },
  })

  const match = baristaGrammar.match(sourceCode)
  if (!match.succeeded()) error(match.message)
  return analyzer(match).rep()
}
