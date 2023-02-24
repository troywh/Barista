import fs from "fs"
import ohm from "ohm-js"
import * as core from "./core.js"

const baristaGrammar = ohm.grammar(fs.readFileSync("src/barista.ohm"))

// Throw an error message that takes advantage of Ohm's messaging
function error(message, node) {
  if (node) {
    throw new Error(`${node.source.getLineAndColumnMessage()}${message}`)
  }
  throw new Error(message)
}

export default function analyze(sourceCode) {
  const analyzer = baristaGrammar.createSemantics().addOperation("rep", {
    Program(body) {
      return new core.Program(body.children.map((s) => s.rep()))
    },
    Statement_return(_serve, value) {
      return value.rep()
    },
    Statement_print(_print, argument) {
      return new core.PrintStatement(argument.rep())
    },
    Statement_ifstmt(_if, test, consequent, elif, _else, alternate) {
      return new core.Conditional(
        test.rep(),
        consequent.rep(),
        elif.rep(),
        alternate.rep()
      )
    },
    Statement_vardec(expression, type, id) {
      return new core.VariableDeclaration(
        expression.rep(),
        type.rep(),
        id.rep()
      )
    },
    Statement_booldec(value, id) {
      return new core.VariableDeclaration(id.rep(), "bool", value.rep())
    },
    Statement_fundec(_order, id, _left, params, _right, type, body) {
      return new core.FunctionDeclaration(
        id.rep(),
        params.rep(),
        type.rep(),
        body.rep()
      )
    },
    Statement_classdec(_item, id, _left, body, _right) {
      return new core.ClassDeclaration(id.rep(), body.rep())
    },
    Statement_while(_blend, _while, test, body) {
      return new core.WhileStatement(test.rep(), body.rep())
    },
    Statement_dowhile(_blend, body, _until, test) {
      return new core.DoWhileStatement(test.rep(), body.rep())
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

    Assignment_plain(_this, _dot, id, _equals, expression) {
      return new core.AssignmentStatement(id.rep(), expression.rep())
    },
    Assignment_increment(_add, expression, _to, id) {
      return new core.AssignmentStatement(id.rep(), expression.rep())
    },

    Exp_unary(op, expression) {
      return new core.UnaryExpression(op.rep(), expression.rep())
    },
    Exp_ternary(test, _questionMark, consequent, _colon, exp3) {
      return new core.TernaryExpression(
        test.rep(),
        consequent.rep(),
        alternate.rep()
      )
    },
    OrExp_binary(left, op, right) {
      return new core.BinaryExpression(op.rep(), left.rep(), right.rep())
    },
    AndExp_binary(left, op, right) {
      return new core.BinaryExpression(op.rep(), left.rep(), right.rep())
    },
    CmpExp_binary(left, op, right) {
      return new core.BinaryExpression(op.rep(), left.rep(), right.rep())
    },
    AddExp_binary(left, op, right) {
      return new core.BinaryExpression(op.rep(), left.rep(), right.rep())
    },
    MulExp_binary(left, op, right) {
      return new core.BinaryExpression(op.rep(), left.rep(), right.rep())
    },
    ExpExp_binary(left, op, right) {
      return new core.BinaryExpression(op.rep(), left.rep(), right.rep())
    },
    Term_id(_parent, _dot, id) {
      return id.rep()
    },
    Term_parens(_left, expression, _right) {
      return expression.rep()
    },

    Call(id, _left, args, _right) {
      return new core.Call(id, args)
    },
    Params(ls) {
      return new core.Parameters(ls)
    },
    Args(ls) {
      return new core.Arguments(ls)
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
