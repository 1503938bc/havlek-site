const fs = require("fs");
const path = require("path");

const repoRoot = process.cwd();
const posts = JSON.parse(
  fs.readFileSync(path.join(repoRoot, "posts", "index.json"), "utf8"),
);
const POSTS_PER_PAGE = 6;
const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function pageFile(pageNumber) {
  return pageNumber === 1 ? "blog.html" : `blog-page-${pageNumber}.html`;
}

function pageLastmod(pageNumber) {
  const start = (pageNumber - 1) * POSTS_PER_PAGE;
  return posts[start]?.date || posts[posts.length - 1]?.date;
}

function renderUrl(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${xmlEscape(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function main() {
  const staticPages = [
    renderUrl("https://havlek.ca/", posts[0].date, "weekly", "1.0"),
    renderUrl("https://havlek.ca/services.html", "2026-06-14", "monthly", "0.9"),
    renderUrl("https://havlek.ca/portfolio.html", "2026-06-14", "monthly", "0.8"),
    renderUrl("https://havlek.ca/about.html", "2026-06-14", "monthly", "0.7"),
    renderUrl("https://havlek.ca/contact.html", "2026-06-14", "monthly", "0.8"),
  ];

  const blogPages = [];
  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
    blogPages.push(
      renderUrl(
        `https://havlek.ca/${pageFile(pageNumber)}`,
        pageLastmod(pageNumber),
        pageNumber === 1 ? "weekly" : "monthly",
        pageNumber === 1 ? "0.9" : "0.6",
      ),
    );
  }

  const postPages = posts.map((post) =>
    renderUrl(
      `https://havlek.ca/posts/${post.slug}.html`,
      post.date,
      "never",
      "0.7",
    ),
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticPages, ...blogPages, ...postPages].join("\n")}
</urlset>
`;

  fs.writeFileSync(path.join(repoRoot, "sitemap.xml"), xml);
}

main();
