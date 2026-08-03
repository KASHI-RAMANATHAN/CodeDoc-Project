import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";

const DEFAULT_NAME = "No component found";
const ANONYMOUS_NAME = "Component";

function extractDescription(node) {
  if (!node) return "";
  if (node.leadingComments && node.leadingComments.length > 0) {
    const comment = node.leadingComments[node.leadingComments.length - 1];
    if (comment.type === "CommentBlock" && comment.value.trim().startsWith("*")) {
      return comment.value
        .split("\n")
        .map((line) => line.trim().replace(/^\* ?/, ""))
        .join("\n")
        .trim();
    }
  }
  return "";
}

function inferType(node) {
  if (!node) return "any";
  switch (node.type) {
    case "StringLiteral":
    case "TemplateLiteral":
      return "string";
    case "NumericLiteral":
      return "number";
    case "BooleanLiteral":
      return "boolean";
    case "NullLiteral":
      return "null";
    case "ArrayExpression":
      return "array";
    case "ObjectExpression":
      return "object";
    case "ArrowFunctionExpression":
    case "FunctionExpression":
      return "function";
    case "JSXElement":
    case "JSXFragment":
      return "element";
    default:
      return "any";
  }
}

function serializeDefault(node) {
  if (!node) return null;
  switch (node.type) {
    case "StringLiteral":
      return node.value;
    case "NumericLiteral":
      case "BooleanLiteral":
      case "NullLiteral":
      return String(node.value);
    case "TemplateLiteral":
      return node.expressions.length
        ? "complex"
        : node.quasis.map((q) => q.value.raw).join("");
    default:
      try {
        return generate(node).code;
      } catch {
        return "complex";
      }
  }
}

function extractPropsFromParams(params) {
  const props = [];
  params.forEach((param) => {
    if (param.type === "ObjectPattern") {
      param.properties.forEach((prop) => {
        if (prop.type === "RestElement") {
          props.push({
            name: prop.argument.name ?? "rest",
            type: "object",
            default: null,
            required: true,
          });
          return;
        }
        if (prop.type !== "ObjectProperty") return;

        const key = prop.key;
        let name = null;
        if (key.type === "Identifier") name = key.name;
        else if (key.type === "StringLiteral") name = key.value;
        else if (key.type === "NumericLiteral") name = String(key.value);
        else return; // computed keys that can't be statically named

        const value = prop.value;
        if (value.type === "Identifier") {
          props.push({ name, type: "any", default: null, required: true });
        } else if (value.type === "AssignmentPattern") {
          props.push({
            name,
            type: inferType(value.right),
            default: serializeDefault(value.right),
            required: false,
          });
        } else if (value.type === "ObjectPattern") {
          props.push({ name, type: "object", default: null, required: true });
        } else if (value.type === "ArrayPattern") {
          props.push({ name, type: "array", default: null, required: true });
        }
      });
    } else if (param.type === "Identifier") {
      props.push({
        name: param.name,
        type: param.name === "props" ? "object" : "any",
        default: null,
        required: true,
      });
    } else if (param.type === "AssignmentPattern") {
      props.push({
        name: param.left.name,
        type: inferType(param.right),
        default: serializeDefault(param.right),
        required: false,
      });
    } else if (param.type === "RestElement") {
      props.push({
        name: param.argument.name ?? "args",
        type: "array",
        default: null,
        required: true,
      });
    }
  });
  return props;
}

function isComponentName(name) {
  return typeof name === "string" && /^[A-Z]/.test(name);
}

function extractPropsFromDefaultProps(objectExpression) {
  const props = [];
  objectExpression.properties.forEach((prop) => {
    if (prop.type !== "ObjectProperty") return;
    let name = null;
    if (prop.key.type === "Identifier") name = prop.key.name;
    else if (prop.key.type === "StringLiteral") name = prop.key.value;
    if (!name) return;
    const existing = props.find((p) => p.name === name);
    const entry = {
      name,
      type: inferType(prop.value),
      default: serializeDefault(prop.value),
      required: false,
    };
    if (existing) Object.assign(existing, entry);
    else props.push(entry);
  });
  return props;
}

function extractPropsFromClass(node) {
  let props = [];
  const classProps = (node.body && node.body.body) || [];
  for (const member of classProps) {
    if (
      member.static &&
      member.key &&
      member.key.type === "Identifier" &&
      member.key.name === "defaultProps" &&
      member.value &&
      member.value.type === "ObjectExpression"
    ) {
      props = extractPropsFromDefaultProps(member.value);
      break;
    }
  }
  return props;
}

export function getComponentName(value) {
  if (!value || value.trim() === "") return null;
  const result = parseComponent(value);
  if (result.error) return null;
  if (result.name === DEFAULT_NAME) return null;
  return result.name;
}

export function parseComponent(value) {
  let componentName = DEFAULT_NAME;
  let description = "";
  let props = [];
  let found = false;

  const applyDefaultProps = (targetNode) => {
    const defProps = extractPropsFromDefaultProps(targetNode);
    defProps.forEach((entry) => {
      const existing = props.find((p) => p.name === entry.name);
      if (existing) {
        Object.assign(existing, entry, { required: false });
      } else {
        props.push({ ...entry, required: false });
      }
    });
  };

  // Resolve a declaration node to its underlying component.
  const resolveNode = (node) => {
    if (!node) return;

    // Unwrap wrappers like memo(...), forwardRef(...) or any HOC call.
    while (node && node.type === "CallExpression") {
      node = node.arguments && node.arguments[0];
    }
    if (!node) return;

    if (node.type === "FunctionDeclaration") {
      if (node.id && isComponentName(node.id.name)) componentName = node.id.name;
      props = extractPropsFromParams(node.params);
      description = extractDescription(node) || description;
    } else if (node.type === "ArrowFunctionExpression" || node.type === "FunctionExpression") {
      if (componentName === DEFAULT_NAME) componentName = ANONYMOUS_NAME;
      props = extractPropsFromParams(node.params);
    } else if (node.type === "ClassDeclaration") {
      if (node.id && isComponentName(node.id.name)) componentName = node.id.name;
      props = extractPropsFromClass(node);
      description = extractDescription(node) || description;
    } else if (node.type === "VariableDeclarator") {
      if (node.id && node.id.type === "Identifier" && isComponentName(node.id.name)) {
        componentName = node.id.name;
      }
      description = extractDescription(node) || description;
      if (node.init) resolveNode(node.init);
    } else if (node.type === "Identifier") {
      if (isComponentName(node.name)) componentName = node.name;
    }
  };

  // Resolve a default-exported identifier to its definition within the AST.
  const resolveIdentifier = (name, scope) => {
    componentName = name;
    const binding = scope.getBinding(name);
    if (binding && binding.path) {
      resolveNode(binding.path.node);
    } else {
      props = [];
    }
  };

  let ast;
  try {
    ast = parse(value, {
      sourceType: "module",
      plugins: ["jsx"],
    });
  } catch {
    try {
      parse(value, {
        sourceType: "module",
        plugins: ["jsx", "typescript"],
      });
      return {
        error:
          "TypeScript syntax isn't supported - please paste JavaScript/JSX.",
      };
    } catch {
      return { error: "Invalid code or syntax error" };
    }
  }

  traverse(ast, {
    ExportDefaultDeclaration(path) {
      if (found) return;
      found = true;
      description = extractDescription(path.node) || description;
      const declaration = path.node.declaration;
      if (declaration.type === "Identifier") {
        resolveIdentifier(declaration.name, path.scope);
      } else {
        resolveNode(declaration);
      }
    },

    ExportNamedDeclaration(path) {
      if (found) return;
      const declaration = path.node.declaration;
      if (!declaration) return;
      if (declaration.type === "FunctionDeclaration" && declaration.id && isComponentName(declaration.id.name)) {
        found = true;
        description = extractDescription(declaration) || extractDescription(path.node) || description;
        resolveNode(declaration);
      } else if (declaration.type === "ClassDeclaration" && declaration.id && isComponentName(declaration.id.name)) {
        found = true;
        description = extractDescription(declaration) || extractDescription(path.node) || description;
        resolveNode(declaration);
      } else if (declaration.type === "VariableDeclaration") {
        const componentDecl = declaration.declarations.find(
          (d) => d.id && d.id.type === "Identifier" && isComponentName(d.id.name)
        );
        if (componentDecl) {
          found = true;
          description = extractDescription(componentDecl) || description;
          resolveNode(componentDecl);
        }
      }
    },
  });

  // No exports at all — fall back to any top-level component-looking declaration.
  if (!found) {
    traverse(ast, {
      FunctionDeclaration(path) {
        if (found) return;
        const name = path.node.id && path.node.id.name;
        if (name && isComponentName(name)) {
          found = true;
          componentName = name;
          description = extractDescription(path.node) || description;
          props = extractPropsFromParams(path.node.params);
        }
      },
      VariableDeclarator(path) {
        if (found) return;
        const node = path.node;
        if (node.id && node.id.type === "Identifier" && isComponentName(node.id.name)) {
          found = true;
          componentName = node.id.name;
          description = extractDescription(node) || description;
          resolveNode(node);
        }
      },
      ClassDeclaration(path) {
        if (found) return;
        const name = path.node.id && path.node.id.name;
        if (name && isComponentName(name)) {
          found = true;
          componentName = name;
          description = extractDescription(path.node) || description;
          props = extractPropsFromClass(path.node);
        }
      },
    });
  }

  // PASS 2: merge Component.defaultProps = { ... } assignments.
  if (componentName !== DEFAULT_NAME && componentName !== ANONYMOUS_NAME) {
    traverse(ast, {
      AssignmentExpression(path) {
        const { left, right } = path.node;
        if (
          left.type === "MemberExpression" &&
          left.property.name === "defaultProps" &&
          left.object.name === componentName &&
          right.type === "ObjectExpression"
        ) {
          applyDefaultProps(right);
        }
      },
    });
  }

  return { name: componentName, props, description };
}