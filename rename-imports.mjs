// import FileHound from 'filehound';
// import fs from 'fs';

// const files = FileHound.create().paths('./lib').ext(['js', 'ts']).find();

// files.then((filePaths) => {
//   filePaths.forEach((filepath) => {
//     fs.readFile(filepath, 'utf8', (err, text) => {
//       if (!text.match(/import .* from/g)) {
//         return;
//       }
//       text = text.replace(/(import .* from\s+['"])(?!\.\.?\/)(.*)(?=['"])/g, (match, p1, p2) => {
//         // Only add .js to relative imports, not node_modules imports
//         if (p2.startsWith('.') || p2.startsWith('/')) {
//             return p1 + p2 + '.js';
//         }
//         return match; // Leave node_modules imports unchanged
//         });
//       if (text.match(/export .* from/g)) {
//         text = text.replace(/(export .* from\s+['"])(.*)(?=['"])/g, '$1$2.js');
//       }

//       if (err) throw err;

//       // stupid replacement back
//       text = text.replace(
//         "import * as Canvas from 'canvas.js';",
//         "import * as Canvas from 'canvas';"
//       );

//       // Handle import("./x/y/z") syntax.
//       text = text.replace(/(import .* from\s+['"])(?!\.\.?\/)(.*)(?=['"])/g, (match, p1, p2) => {
//   // Only add .js to relative imports, not node_modules imports
//   if (p2.startsWith('.') || p2.startsWith('/')) {
//     return p1 + p2 + '.js';
//   }
//   return match; // Leave node_modules imports unchanged
// });

//       fs.writeFile(filepath, text, function (err) {
//         if (err) {
//           throw err;
//         }
//       });
//     });
//   });
// });

// const indexFiles = ['lib/index.js', 'lib/index-node.js', 'lib/Core.js'];
// indexFiles.forEach((filepath) => {
//   fs.readFile(filepath, 'utf8', (err, text) => {
//     text = text.replace('exports.default =', 'module.exports =');
//     fs.writeFile(filepath, text, function (err) {
//       if (err) {
//         throw err;
//       }
//     });
//   });
// });
