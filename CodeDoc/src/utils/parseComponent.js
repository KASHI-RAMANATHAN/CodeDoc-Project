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

    // PASS 1: Find the Component and its base Props
    traverse(ast, {
      ExportDefaultDeclaration(path) {
        const declaration = path.node.declaration;
        let funcNode = null;

        if (declaration.type === "FunctionDeclaration") {
          funcNode = declaration;
          componentName = declaration.id ? declaration.id.name : "Anonymous";
        } else if (declaration.type === "Identifier") {
          const binding = path.scope.getBinding(declaration.name);
          if (binding) {
            componentName = declaration.name;
            const nodePath = binding.path;
            if (nodePath.isVariableDeclarator()) {
              const init = nodePath.get("init");
              if (init.isFunction() || init.isArrowFunctionExpression()) {
                funcNode = init.node;
              }
            } else if (nodePath.isFunctionDeclaration()) {
              funcNode = nodePath.node;
            }
          }
        }

        if (funcNode) {
          funcNode.params.forEach((param) => {
            if (param.type === "ObjectPattern") {
              param.properties.forEach((p) => {
                if (p.type === "ObjectProperty" && p.key.type === "Identifier") {
                  let defaultVal = null;
                  if (p.value.type === "AssignmentPattern") {
                    defaultVal = p.value.right.value ?? "complex";
                  }
                  props.push({ name: p.key.name, default: defaultVal });
                }
              });
            }
          });
        }
      }
    });

    // PASS 2: Find defaultProps (Now that componentName and props are known)
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
              }
            }
          });
        }
      }
    });

  } catch (err) {
    console.error("Parse error:", err);
    return { error: "Invalid code or syntax error" };
  }

  return { name: componentName, props };
}
// import { parse } from "@babel/parser";
// import traverse from "@babel/traverse";

// export function parseComponent(value) {
//   let componentName = "No component found";
//   let props = [];

//   try {
//     const ast = parse(value, {
//       sourceType: "module",
//       plugins: ["jsx", "typescript"],
//     });

//     // PASS 1: Find Name and Props
//     traverse(ast, {
//       ExportDefaultDeclaration(path) {
//         const declaration = path.node.declaration;
//         let funcNode = null;

//         // Get Name
//         if (declaration.type === "FunctionDeclaration") {
//           funcNode = declaration;
//           componentName = declaration.id?.name || "Anonymous";
//         } else if (declaration.type === "Identifier") {
//           componentName = declaration.name; // This fixes the "Anonymous" bug
//           const binding = path.scope.getBinding(declaration.name);
//           if (binding?.path.isVariableDeclarator()) {
//             funcNode = binding.path.node.init;
//           }
//         }

//         // Process Props
//         if (funcNode && funcNode.params?.[0]?.type === "ObjectPattern") {
//           funcNode.params[0].properties.forEach((p) => {
//             if (p.type === "ObjectProperty") {
//               // 1. Name
//               const name = p.key.name;

//               // 2. Description (JSDoc)
//               const description = p.leadingComments
//                 ? p.leadingComments[0].value.replace(/\*|\/|\n/g, "").trim()
//                 : "No description";

//               // 3. Default Value (The Fix)
//               let defaultValue = "—";
//               if (p.value.type === "AssignmentPattern") {
//                 // We use code slice to get the exact text (e.g., "primary" or "() => {}")
//                 const rightSide = p.value.right;
//                 defaultValue = value.substring(rightSide.start, rightSide.end);
//               }

//               // 4. Type Inference
//               let type = p.value.typeAnnotation 
//                 ? "TS-Typed" 
//                 : (p.value.type === "AssignmentPattern" ? typeof p.value.right.value : "any");

//               props.push({ name, defaultValue, description, type });
//             }
//           });
//         }
//       }
//     });

//     // PASS 2: Check for external defaultProps
//     traverse(ast, {
//       AssignmentExpression(path) {
//         const { left, right } = path.node;
//         if (
//           left.type === "MemberExpression" &&
//           left.property.name === "defaultProps" &&
//           left.object.name === componentName
//         ) {
//           right.properties.forEach((p) => {
//             const prop = props.find((item) => item.name === p.key.name);
//             if (prop) {
//               prop.defaultValue = value.substring(p.value.start, p.value.end);
//               prop.type = typeof p.value.value;
//             }
//           });
//         }
//       },
//     });
//   } catch (err) {
//     return { error: "Parse Error" };
//   }

//   return { name: componentName, props };
// }

// import { parse } from "@babel/parser";
// import traverse from "@babel/traverse";

// export function parseComponent(value) {
//   let componentName = "No component found";
//   let props = [];

//   try {
//     const ast = parse(value, {
//       sourceType: "module",
//       plugins: ["jsx", "typescript"], // Added typescript for future-proofing
//     });

//     traverse(ast, {
//       ExportDefaultDeclaration(path) {
//         const declaration = path.node.declaration;
//         let funcNode = null;

//         if (declaration.type === "FunctionDeclaration") {
//           funcNode = declaration;
//           componentName = declaration.id?.name || "Anonymous";
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
//             }
//           }
//         }

//         if (funcNode) {
//           funcNode.params.forEach((param) => {
//             if (param.type === "ObjectPattern") {
//               param.properties.forEach((p) => {
//                 if (p.type === "ObjectProperty" && p.key.type === "Identifier") {
//                   let defaultVal = null;
//                   let type = "any"; 
                  
//                   // 1. Extract Description from JSDoc
//                   const description = p.leadingComments 
//                     ? p.leadingComments.map(c => c.value.replace(/\*|\/|\n/g, '').trim()).join(' ')
//                     : "No description provided";

//                   // 2. Extract Inline Defaults
//                   if (p.value.type === "AssignmentPattern") {
//                     defaultVal = p.value.right.value ?? "complex";
//                     type = typeof p.value.right.value; // Basic type inference
//                   }

//                   props.push({ 
//                     name: p.key.name, 
//                     default: defaultVal, 
//                     description,
//                     type 
//                   });
//                 }
//               });
//             }
//           });
//         }
//       }
//     });

//     // PASS 2: Update defaults from defaultProps
//     traverse(ast, {
//       AssignmentExpression(path) {
//         const { left, right } = path.node;
//         if (left.type === "MemberExpression" && left.property.name === "defaultProps" && left.object.name === componentName) {
//           right.properties.forEach((prop) => {
//             const existing = props.find((p) => p.name === prop.key.name);
//             if (existing) {
//               existing.default = prop.value.value ?? "complex";
//               existing.type = typeof prop.value.value;
//             }
//           });
//         }
//       }
//     });

//   } catch (err) {
//     return { error: "Parse error" };
//   }

//   return { name: componentName, props };
// }