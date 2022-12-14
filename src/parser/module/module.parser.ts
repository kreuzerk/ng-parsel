import * as ts from 'typescript';
import { tsquery } from '@phenomnomnominal/tsquery';

import { parseClassName } from '../shared/parser/class.parser';
import { NgParselOutputType } from '../shared/model/types.model';

import { NgParselModule } from './module.model';

export function parseModule(ast: ts.SourceFile): NgParselModule {
  return {
    className: parseClassName(ast),
    type: NgParselOutputType.MODULE,
    imports: getImports(ast),
    exports: getExports(ast),
    declarations: getDeclarations(ast),
    providers: getProviders(ast),
    bootstrap: getBootstrap(ast),
  };
}

function getImports(ast: ts.SourceFile): string[] {
  return getDecoratorPropertyValue(ast, 'imports');
}

function getDeclarations(ast: ts.SourceFile): string[] {
  return getDecoratorPropertyValue(ast, 'declarations');
}

function getExports(ast: ts.SourceFile): string[] {
  return getDecoratorPropertyValue(ast, 'exports');
}

function getProviders(ast: ts.SourceFile): string[] {
  return [...getDecoratorPropertyValue(ast, 'providers'), ...getDecoratorPropertyObject(ast, 'providers')];
}

function getBootstrap(ast: ts.SourceFile): string[] {
  return getDecoratorPropertyValue(ast, 'bootstrap');
}

function getDecoratorPropertyValue(ast: ts.SourceFile, identifier: string): string[] {
  return [
    ...tsquery(
      ast,
      `Decorator > CallExpression > ObjectLiteralExpression > PropertyAssignment:has(Identifier[escapedText="${identifier}"]) > ArrayLiteralExpression > Identifier`
    ),
  ].map((identifier: any) => identifier.getText());
}

function getDecoratorPropertyObject(ast: ts.SourceFile, identifier: string): string[] {
  return [
    ...tsquery(
      ast,
      `Decorator > CallExpression > ObjectLiteralExpression > PropertyAssignment:has(Identifier[escapedText="${identifier}"]) > ArrayLiteralExpression > ObjectLiteralExpression`
    ),
  ].map((identifier: any) => identifier.getText());
}

// TODO - test this function - or just store it as string and remove the function
function normalizeDecoratorObject(decoratorObject: string): any {
  console.log('blubi');
  console.log(decoratorObject);
  console.log(`${decoratorObject.replace(/(['"])?([a-zA-Z0-9]+)(['"])?:/g, '"$2":').replace(/'/g, '"')}`);

  return JSON.parse(`${decoratorObject.replace(/(['"])?([a-zA-Z0-9]+)(['"])?:/g, '"$2":').replace(/'/g, '"')}`);
}
