import util from "util";

export class Program {
  constructor(statements) {
    this.statements = statements;
  }
}

export class Type {
  static INT = new Type("pumps");
  static STRING = new Type("name");
  static BOOLEAN = new Type("whipped cream");
}
