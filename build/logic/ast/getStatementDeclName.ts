import ts from "typescript";

export function getStatementDeclName(
  statement: ts.Statement,
): string | undefined {
  if (ts.isVariableStatement(statement)) {
    for (const dec of statement.declarationList.declarations) {
      if (ts.isIdentifier(dec.name)) {
        return dec.name.text;
      }
    }
  } else if (
    ts.isFunctionDeclaration(statement) ||
    ts.isInterfaceDeclaration(statement) ||
    ts.isTypeAliasDeclaration(statement) ||
    ts.isModuleDeclaration(statement)
  ) {
    return statement.name?.text;
  } else if (ts.isInterfaceDeclaration(statement)) {
    return statement.name.text;
  }
  return undefined;
}
