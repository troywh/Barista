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
    Statement(statement) {
      return new core.AssignmentStatement(statement.rep())
    },
    Statement_fundec(_order, id, _left, params, _right, type, body) {
      return new core.FunctionDeclaration(
        id.rep(),
        params.rep(),
        type.rep(),
        body.rep()
      )
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
    Statement_while(_blend, _while, test, body) {
      return new core.WhileStatement(test.rep(), body.rep())
    },
    Statement_dowhile(_blend, body, _until, test) {
      return new core.DoWhileStatement(test.rep(), body.rep())
    },

    FunReturn(_arrow, type) {
      return new type.rep()
    },
    ElIf(_else, _if, test, consequent) {
      return new core.Conditional(test.rep(), consequent.rep())
    },
    Block(_left, body, _serve, _right) {
      return new body.rep()
    },
    Serve(_serve, value) {
      return new value.rep()
    },

    Assignment_increment(_add, expression, _to, id) {
      return new core.AssignmentStatement(id.rep(), expression.rep())
    },
    Assignment_plain(_this, _dot, id, _equals, expression) {
      return new core.AssignmentStatement(id.rep(), expression.rep())
    },

    BoolDec_true(value, id) {
      return new core.VariableDeclaration(id.rep(), value.rep())
    },
    BoolDec_false(value, id) {
      return new core.VariableDeclaration(id.rep(), value.rep())
    },

    ClassDec(_item, id, _left, body, _right) {
      return new core.ClassDeclaration(id.rep(), body.rep())
    },

    Exp_unary(op, expression) {
      return new core.UnaryExpression(op.rep(), expression.rep())
    },
    Exp_ternary(exp1, _questionMark, exp2, _colon, exp3) {
      return new core.TernaryExpression(exp1.rep(), exp2.rep(), exp3.rep())
    },
    Exp(expression) {
      return new expression.rep()
    },
    OrExp_binary(left, op, right) {
      return new core.BinaryExpression(op.sourceString, left.rep(), right.rep())
    },
    OrExp(expression) {
      return expression.rep()
    },
    AndExp_binary(left, op, right) {
      return new core.BinaryExpression(op.sourceString, left.rep(), right.rep())
    },
    AndExp(expression) {
      return new expression.rep()
    },
    CmpExp_binary(left, op, right) {
      return new core.BinaryExpression(op.sourceString, left.rep(), right.rep())
    },
    AddExp_binary(left, op, right) {
      return new core.BinaryExpression(op.sourceString, left.rep(), right.rep())
    },
    AddExp(expression) {
      return new expression.rep()
    },
    MulExp_binary(left, op, right) {
      return new core.BinaryExpression(op.sourceString, left.rep(), right.rep())
    },
    MulExp(expression) {
      return new expression.rep()
    },
    ExpExp_binary(left, op, right) {
      return new core.BinaryExpression(op.sourceString, left.rep(), right.rep())
    },
    LitExp(expression) {
      return new expression.rep()
    },
    LitExp_id(_parent, _dot, id) {
      return new id.rep()
    },
    LitExp_parens(_left, expression, _right) {
      return new expression.rep()
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

    type(type) {
      return new type.rep()
    },

    numlit(_leading, _dot, _fractional) {
      return this.sourceString
    },
    strlit(_open, chars, _close) {
      return chars.sourceString
    },
    id(chars) {
      return chars.sourceString
    },
    _iter(...children) {
      return children.map((child) => child.rep())
    },
  })

  const match = baristaGrammar.match(sourceCode)
  if (!match.succeeded()) error(match.message)
  return analyzer(match).rep()
}
