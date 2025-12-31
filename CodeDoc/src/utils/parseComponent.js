// parseComponent.js
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";

export function parseComponent(value) {
  let componentName = "No component found";
  let props = [];

  try {
    const ast = parse(value, {
      sourceType: "module",
      plugins: ["jsx"],
    });

    traverse(ast, {
      ExportDefaultDeclaration(path) {
        const declaration = path.node.declaration;
        let funcNode = null;

        // export default function Button() {}
        if (declaration.type === "FunctionDeclaration") {
          funcNode = declaration;
        }
        // const Button = () => {}; export default Button;
        else if (declaration.type === "Identifier") {
            const binding = path.scope.getBinding(declaration.name);
            if (binding) {
                const nodePath = binding.path;
                // Accept arrow functions too!
                if (nodePath.isFunctionDeclaration() || 
                    nodePath.isFunctionExpression() || 
                    nodePath.isArrowFunctionExpression()) 
                {
                    funcNode = nodePath.node;
                }
            }
        }

        if (funcNode) {
          componentName = funcNode.id ? funcNode.id.name : "Anonymous";

          funcNode.params.forEach((param) => {
            if (param.type === "Identifier") {
              props.push({ name: param.name, default: null });
            } else if (
              param.type === "AssignmentPattern" &&
              param.left.type === "Identifier"
            ) {
              props.push({
                name: param.left.name,
                default: param.right.value ?? "complex",
              });
            } else if (param.type === "ObjectPattern") {
              param.properties.forEach((p) => {
                if (
                  p.type === "ObjectProperty" &&
                  p.key.type === "Identifier"
                ) {
                  let defaultVal = null;
                  let keyNode = p;

                  if (p.value.type === "AssignmentPattern") {
                    defaultVal = p.value.right.value ?? "complex";
                    keyNode = p.value.left;
                  }

                  const name =
                    keyNode.key && keyNode.key.name
                      ? keyNode.key.name
                      : keyNode.name;

                  props.push({
                    name,
                    default: defaultVal,
                  });
                }
              });
            }
          });
        }
      },

      AssignmentExpression(path) {
        if (
          path.node.left.type === "MemberExpression" &&
          path.node.left.property.name === "defaultProps" &&
          path.node.right.type === "ObjectExpression"
        ) {
          const obj = path.node.left.object;
          if (obj.name === componentName) {
            path.node.right.properties.forEach((prop) => {
              if (
                prop.type === "ObjectProperty" &&
                prop.key.type === "Identifier"
              ) {
                const existing = props.find(
                  (p) => p.name === prop.key.name
                );
                if (existing) {
                  existing.default = prop.value.value ?? "complex";
                }
              }
            });
          }
        }
      },
    });
  } catch (err) {
    console.error("Parse error:", err);
    return { error: "Invalid code or syntax error" };
  }

  return { name: componentName, props };
}
