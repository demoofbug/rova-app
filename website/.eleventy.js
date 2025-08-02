const fs = require("fs");
const path = require("path");
const CleanCSS = require("clean-css");
const { minify } = require("terser");
const { minify: minifyHTML } = require("html-minifier-terser");

function compressAndCopyCSS(srcDir, destDir) {
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  const files = fs.readdirSync(srcDir);
  files.forEach(file => {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      compressAndCopyCSS(srcPath, destPath);
    } else if (file.endsWith(".css")) {
      const css = fs.readFileSync(srcPath, "utf8");
      const minified = new CleanCSS().minify(css).styles;
      fs.writeFileSync(destPath, minified);
      console.log(`✅ 压缩并写入 CSS: ${destPath}`);
    }
  });
}

async function compressAndCopyJS(srcDir, destDir) {
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  const files = fs.readdirSync(srcDir);
  for (const file of files) {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      await compressAndCopyJS(srcPath, destPath);
    } else if (file.endsWith(".js")) {
      const js = fs.readFileSync(srcPath, "utf8");
      const minified = await minify(js);
      fs.writeFileSync(destPath, minified.code);
      console.log(`✅ 压缩并写入 JS: ${destPath}`);
    }
  }
}

async function compressHTML(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      await compressHTML(filePath);
    } else if (file.endsWith(".html")) {
      const html = fs.readFileSync(filePath, "utf8");
      const minified = await minifyHTML(html, {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
      });
      fs.writeFileSync(filePath, minified);
      console.log(`✅ 压缩 HTML: ${filePath}`);
    }
  }
}

// 递归复制文件夹（用于 images）
function copyFolderSync(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  entries.forEach(entry => {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyFolderSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ 复制图片: ${destPath}`);
    }
  });
}

module.exports = function(eleventyConfig) {
  console.log("✅ .eleventy.js 已加载");

  // eleventyConfig.addGlobalData("pkg", pkg);

  eleventyConfig.addPassthroughCopy("public");

  eleventyConfig.on("eleventy.after", async () => {
    console.log("🔧 处理 public 目录资源");

    if (fs.existsSync("public/css")) {
      compressAndCopyCSS("public/css", "dist/public/css");
    }
    if (fs.existsSync("public/js")) {
      await compressAndCopyJS("public/js", "dist/public/js");
    }
    if (fs.existsSync("public/images")) {
      copyFolderSync("public/images", "dist/public/images");
    }

    console.log("🔧 压缩 dist 目录下 HTML 文件");
    if (fs.existsSync("dist")) {
      await compressHTML("dist");
    }
  });

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      layouts: "_includes/layouts"
    }
  };
};