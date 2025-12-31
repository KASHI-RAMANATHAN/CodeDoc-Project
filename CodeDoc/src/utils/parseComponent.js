// import { parse } from "@babel/parser";
// import traverse from "@babel/traverse";

// export function parseComponent(value) {
//   let componentName = "No component found";
//   let props = [];

//   try {
//     const ast = parse(value, {
//       sourceType: "module",
//       plugins: ["jsx"],
//     });

//     // PASS 1: Find the Component and its base Props
//     traverse(ast, {
//       ExportDefaultDeclaration(path) {
//         const declaration = path.node.declaration;
//         let funcNode = null;

//         if (declaration.type === "FunctionDeclaration") {
//           funcNode = declaration;
//           componentName = declaration.id ? declaration.id.name : "Anonymous";
//         } else if (declaration.type === "Identifier") {
//           const binding = path.scope.getBinding(declaration.name);
//           if (binding) {
//             componentName = declaration.name;
//             const nodePath = binding.path;
//             if (nodePath.isVariableDeclarator()) {
//               const init = nodePath.get("init");
//               if (init.isFunction() || init.isArrowFunctionExpression()) {
//                 funcNode = init.node;
//               }
//             } else if (nodePath.isFunctionDeclaration()) {
//               funcNode = nodePath.node;
//             }
//           }
//         }

//         if (funcNode) {
//           funcNode.params.forEach((param) => {
//             if (param.type === "ObjectPattern") {
//               param.properties.forEach((p) => {
//                 if (p.type === "ObjectProperty" && p.key.type === "Identifier") {
//                   let defaultVal = null;
//                   if (p.value.type === "AssignmentPattern") {
//                     defaultVal = p.value.right.value ?? "complex";
//                   }
//                   props.push({ name: p.key.name, default: defaultVal });
//                 }
//               });
//             }
//           });
//         }
//       }
//     });

//     // PASS 2: Find defaultProps (Now that componentName and props are known)
//     traverse(ast, {
//       AssignmentExpression(path) {
//         const { left, right } = path.node;
//         if (
//           left.type === "MemberExpression" &&
//           left.property.name === "defaultProps" &&
//           left.object.name === componentName &&
//           right.type === "ObjectExpression"
//         ) {
//           right.properties.forEach((prop) => {
//             if (prop.type === "ObjectProperty" && prop.key.type === "Identifier") {
//               const existing = props.find((p) => p.name === prop.key.name);
//               if (existing) {
//                 existing.default = prop.value.value ?? "complex";
//               }
//             }
//           });
//         }
//       }
//     });

//   } catch (err) {
//     console.error("Parse error:", err);
//     return { error: "Invalid code or syntax error" };
//   }

//   return { name: componentName, props };
// }

import { parse } from "@babel/parser";
import traverse from "@babel/traverse";

export function parseComponent(value) {
  let componentName = "No component found";
  let props = [];
  let description = ""; // ← New: JSDoc description

  try {
    const ast = parse(value, {
      sourceType: "module",
      plugins: ["jsx"],
    });

    // PASS 1: Find the component, props, and leading JSDoc comment
    traverse(ast, {
      ExportDefaultDeclaration(path) {
        const declaration = path.node.declaration;
        let funcNode = null;
        let funcPath = null;

        // Grab leading comment (JSDoc) if it exists
        if (path.node.leadingComments && path.node.leadingComments.length > 0) {
          const comment = path.node.leadingComments[path.node.leadingComments.length - 1];
          if (comment.type === "CommentBlock" && comment.value.trim().startsWith("*")) {
            description = comment.value
              .split("\n")
              .map(line => line.trim().replace(/^\* ?/, ""))
              .join("\n")
              .trim();
          }
        }

        if (declaration.type === "FunctionDeclaration") {
          funcNode = declaration;
          funcPath = path.get("declaration");
          componentName = declaration.id ? declaration.id.name : "Anonymous";
        } else if (declaration.type === "Identifier") {
          const binding = path.scope.getBinding(declaration.name);
          if (binding) {
            componentName = declaration.name;
            const nodePath = binding.path;
            if (nodePath.isVariableDeclarator()) {
              const init = nodePath.get("init");
              if (init.isArrowFunctionExpression() || init.isFunctionExpression()) {
                funcNode = init.node;
                funcPath = init;

                // Also check for comment on the variable declarator
                if (nodePath.node.leadingComments) {
                  const comment = nodePath.node.leadingComments[nodePath.node.leadingComments.length - 1];
                  if (comment.type === "CommentBlock" && comment.value.trim().startsWith("*")) {
                    description = comment.value
                      .split("\n")
                      .map(line => line.trim().replace(/^\* ?/, ""))
                      .join("\n")
                      .trim();
                  }
                }
              }
            }
          }
        }

        if (funcNode && funcPath) {
          funcNode.params.forEach((param) => {
            if (param.type === "ObjectPattern") {
              param.properties.forEach((p) => {
                if (p.type === "ObjectProperty" && p.key.type === "Identifier") {
                  let defaultVal = null;
                  if (p.value && p.value.type === "AssignmentPattern") {
                    defaultVal = p.value.right.value ?? "complex";
                  }
                  props.push({ name: p.key.name, default: defaultVal });
                }
              });
            } else if (param.type === "Identifier") {
              props.push({ name: param.name, default: null });
            } else if (param.type === "AssignmentPattern") {
              props.push({
                name: param.left.name,
                default: param.right.value ?? "complex",
              });
            }
          });
        }
      },
    });

    // PASS 2: defaultProps
    traverse(ast, {
      AssignmentExpression(path) {
        const { left, right } = path.node;
        if (
          left.type === "MemberExpression" &&
          left.property.name === "defaultProps" &&
          left.object.name === componentName &&
          right.type === "ObjectExpression"
        ) {
          right.properties.forEach((prop) => {
            if (prop.type === "ObjectProperty" && prop.key.type === "Identifier") {
              const existing = props.find((p) => p.name === prop.key.name);
              if (existing) {
                existing.default = prop.value.value ?? "complex";
              } else {
                props.push({ name: prop.key.name, default: prop.value.value ?? "complex" });
              }
            }
          });
        }
      },
    });

  } catch (err) {
    console.error("Parse error:", err);
    return { error: "Invalid code or syntax error" };
  }

  return { name: componentName, props, description };
}