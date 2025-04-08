// scripts/patch-html2pdf.js

const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "../node_modules/html2pdf.js/dist/html2pdf.js");

try {
  let fileContent = fs.readFileSync(filePath, "utf8");

  // Remove source map reference
  const updatedContent = fileContent.replace(/\/\/# sourceMappingURL=es6-promise\.map\s*$/, "");

  fs.writeFileSync(filePath, updatedContent, "utf8");
  console.log("✅ Removed source map warning from html2pdf.js");
} catch (error) {
  console.warn("⚠️ Could not patch html2pdf.js:", error.message);
}
