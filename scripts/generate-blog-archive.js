const fs = require("fs");
const path = require("path");

const repoRoot = process.cwd();
const postsIndexPath = path.join(repoRoot, "posts", "index.json");
const posts = JSON.parse(fs.readFileSync(postsIndexPath, "utf8"));
const POSTS_PER_PAGE = 6;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatShortDate(dateIso) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${dateIso}T00:00:00Z`));
}

function pageFile(pageNumber) {
  return pageNumber === 1 ? "blog.html" : `blog-page-${pageNumber}.html`;
}

function pageUrl(pageNumber) {
  return `https://havlek.ca/${pageFile(pageNumber)}`;
}

function readHeroMeta(slug) {
  const postPath = path.join(repoRoot, "posts", `${slug}.html`);
  const html = fs.readFileSync(postPath, "utf8");
  const srcMatch = html.match(/<img[^>]*class="post-hero-img"[^>]*src="([^"]+)"/);
  const altMatch = html.match(/<img[^>]*class="post-hero-img"[^>]*alt="([^"]+)"/);
  const imageSrc = srcMatch ? srcMatch[1].replace(/^\.?\//, "") : `images/${slug}.png`;
  return {
    imageExists: fs.existsSync(path.join(repoRoot, "posts", imageSrc)),
    imageSrc,
    imageAlt: altMatch ? altMatch[1] : "",
  };
}

function renderCard(post) {
  const hero = readHeroMeta(post.slug);
  if (!hero.imageExists) {
    return `      <article class="blog-card" data-reveal>
        <div class="blog-card-pad">
          <div class="blog-card-meta"><span class="blog-cat">${escapeHtml(post.category)}</span><span>${escapeHtml(formatShortDate(post.date))}</span><span>${escapeHtml(post.readTime)}</span></div>
          <h2><a href="posts/${escapeHtml(post.slug)}.html">${escapeHtml(post.title)}</a></h2>
          <p>${escapeHtml(post.excerpt)}</p>
          <a class="blog-read-more" href="posts/${escapeHtml(post.slug)}.html">Read article →</a>
        </div>
      </article>`;
  }
  return `      <article class="blog-card has-img" data-reveal>
        <a href="posts/${escapeHtml(post.slug)}.html"><img class="blog-card-img" src="posts/${escapeHtml(hero.imageSrc)}" alt="${escapeHtml(hero.imageAlt)}" /></a>
        <div class="blog-card-pad">
          <div class="blog-card-meta"><span class="blog-cat">${escapeHtml(post.category)}</span><span>${escapeHtml(formatShortDate(post.date))}</span><span>${escapeHtml(post.readTime)}</span></div>
          <h2><a href="posts/${escapeHtml(post.slug)}.html">${escapeHtml(post.title)}</a></h2>
          <p>${escapeHtml(post.excerpt)}</p>
          <a class="blog-read-more" href="posts/${escapeHtml(post.slug)}.html">Read article →</a>
        </div>
      </article>`;
}

function renderPagination(currentPage, totalPages) {
  const parts = [];
  if (currentPage === 1) {
    parts.push('      <span class="page-link disabled">Previous</span>');
  } else {
    parts.push(`      <a class="page-link" href="${pageFile(currentPage - 1)}">Previous</a>`);
  }

  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
    if (pageNumber === currentPage) {
      parts.push(`      <span class="page-link active">${pageNumber}</span>`);
      continue;
    }
    parts.push(`      <a class="page-link" href="${pageFile(pageNumber)}">${pageNumber}</a>`);
  }

  if (currentPage === totalPages) {
    parts.push('      <span class="page-link disabled">Next</span>');
  } else {
    parts.push(`      <a class="page-link" href="${pageFile(currentPage + 1)}">Next</a>`);
  }

  return parts.join("\n");
}

function renderPage(pageNumber, totalPages, pagePosts) {
  const prevMeta = pageNumber > 1 ? `    <link rel="prev" href="${pageUrl(pageNumber - 1)}">\n` : "";
  const nextMeta = pageNumber < totalPages ? `    <link rel="next" href="${pageUrl(pageNumber + 1)}">\n` : "";
  const title = pageNumber === 1 ? "Blog" : `Blog Page ${pageNumber}`;
  const breadcrumb = pageNumber === 1
    ? '      <a href="index.html">Home</a><span>›</span><span>Blog</span>'
    : `      <a href="index.html">Home</a><span>›</span><a href="blog.html">Blog</a><span>›</span><span>Page ${pageNumber}</span>`;
  const label = pageNumber === 1 ? "Insights" : `Archive · Page ${pageNumber}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} — Havlek</title>
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="canonical" href="${pageUrl(pageNumber)}">
${prevMeta}${nextMeta}    <script async src="https://www.googletagmanager.com/gtag/js?id=G-D0NJSVQWWE"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-D0NJSVQWWE');
    </script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Albert+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="style.css" />
</head>
<body data-page="blog">
<div class="shell">
<div class="side-rail left"  aria-hidden="true"><span class="rail-text">Havlek · Blog</span></div>
<div class="side-rail right" aria-hidden="true"><span class="rail-text">AI Business Cases</span></div>
<div id="site-nav"></div>

<main>
<section class="page-hero">
  <div class="container">
    <nav class="breadcrumb" aria-label="Breadcrumb">
${breadcrumb}
    </nav>
    <div class="page-hero-inner">
      <div>
        <span class="label">${label}</span>
        <h1>Insights & Analysis</h1>
        <p class="page-hero-sub">Deep dives into AI, cloud computing, and modern web development.</p>
      </div>
    </div>
  </div>
</section>

<section class="services-section" style="padding-top:40px;">
  <div class="container">
    <div class="blog-grid">
${pagePosts.map(renderCard).join("\n")}
    </div>
    <div class="blog-pagination">
${renderPagination(pageNumber, totalPages)}
    </div>
  </div>
</section>

<section class="callout-band">
  <div class="container">
    <div style="text-align:center;max-width:620px;margin:0 auto;">
      <span class="label">Suggest a Topic</span>
      <h2 style="margin-bottom:20px;">Want us to write about a topic?</h2>
      <p style="margin-bottom:32px;">We're always looking for new subjects to explore. Tell us what AI question matters to your business.</p>
      <a href="contact.html" class="btn btn-primary btn-lg">Get in touch</a>
    </div>
  </div>
</section>

</main>
<div id="site-footer"></div>
</div>
<script src="components.js"></script>
</body>
</html>
`;
}

function main() {
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
    const start = (pageNumber - 1) * POSTS_PER_PAGE;
    const pagePosts = posts.slice(start, start + POSTS_PER_PAGE);
    const outputPath = path.join(repoRoot, pageFile(pageNumber));
    fs.writeFileSync(outputPath, renderPage(pageNumber, totalPages, pagePosts));
  }

  const stalePages = fs.readdirSync(repoRoot)
    .filter((file) => /^blog-page-\d+\.html$/.test(file))
    .map((file) => Number(file.match(/\d+/)[0]))
    .filter((pageNumber) => pageNumber > totalPages);

  stalePages.forEach((pageNumber) => {
    fs.unlinkSync(path.join(repoRoot, pageFile(pageNumber)));
  });
}

main();
