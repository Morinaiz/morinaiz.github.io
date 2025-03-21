const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const blogRoot = path.join(__dirname, "blog");
const outputPath = path.join(__dirname, "rss.xml");
const siteURL = "https://lorenzomorini.dev"; // ← replace with your GitHub Pages URL

const folders = fs.readdirSync(blogRoot).filter(name =>
  fs.statSync(path.join(blogRoot, name)).isDirectory()
);

let rssItems = "";

folders.forEach(folder => {
  const postPath = path.join(blogRoot, folder, "post.html");
  if (!fs.existsSync(postPath)) return;

  const html = fs.readFileSync(postPath, "utf8");
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  const title = doc.querySelector("title")?.textContent.trim();
  const description = doc.querySelector('meta[name="description"]')?.getAttribute("content") || "";
  const pubDate = doc.querySelector(".post-date")?.textContent.trim();
  const link = `${siteURL}/blog/${folder}/post.html`;

  if (!title || !pubDate) return;

  rssItems += `
<item>
  <title>${title}</title>
  <link>${link}</link>
  <guid>${link}</guid>
  <pubDate>${new Date(pubDate).toUTCString()}</pubDate>
  <description>${description}</description>
</item>
`;
});

const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Lorenzo Morini's Blog</title>
    <link>${siteURL}</link>
    <description>My blog, I post about Game Dev, Procedural Generation, Shaders and more</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <image>
      <url>${siteURL}/data/favicon.png</url>
      <title>Lorenzo Morini's Blog favicon</title>
      <link>${siteURL}</link>
    </image>
    ${rssItems}
  </channel>
</rss>`;

fs.writeFileSync(outputPath, rss);
console.log("✅ RSS feed generated at /rss.xml");
