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

function formatDate(dateIso) {
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

function pillClass(category) {
  if (category === "Cybersecurity") return "bg-red-600";
  if (category === "AI & Development") return "bg-indigo-600";
  return "bg-cyan-600";
}

function readHeroMeta(slug) {
  const postPath = path.join(repoRoot, "posts", `${slug}.html`);
  const html = fs.readFileSync(postPath, "utf8");
  const match = html.match(/<img src="images\/[^"]+" alt="([^"]+)"/);
  const imagePath = path.join(repoRoot, "posts", "images", `${slug}.png`);
  return {
    imageExists: fs.existsSync(imagePath),
    imageSrc: `posts/images/${slug}.png`,
    imageAlt: match ? match[1] : "",
  };
}

function renderCard(post) {
  const hero = readHeroMeta(post.slug);
  const media = hero.imageExists
    ? `<div class="h-56 bg-gradient-to-br from-slate-950 via-sky-950 to-cyan-900 overflow-hidden">
                        <img src="${escapeHtml(hero.imageSrc)}" alt="${escapeHtml(hero.imageAlt)}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                    </div>`
    : `<div class="h-56 bg-gradient-to-br from-slate-950 via-sky-950 to-cyan-900 flex items-center justify-center p-8">
                        <span class="text-white/70 text-3xl font-bold tracking-[0.2em] uppercase">${escapeHtml(post.category.replace(/[^A-Za-z]/g, "").slice(0, 4) || "Post")}</span>
                    </div>`;
  return `
                <a href="posts/${escapeHtml(post.slug)}.html" class="group rounded-2xl overflow-hidden bg-gray-50 hover:shadow-lg transition fade-in">
                    ${media}
                    <div class="p-6">
                        <span class="inline-block px-3 py-1 text-xs font-semibold text-white ${pillClass(post.category)} rounded-full">${escapeHtml(post.category)}</span>
                        <h3 class="mt-3 text-xl font-bold leading-snug group-hover:text-brand transition">${escapeHtml(post.title)}</h3>
                        <p class="mt-2 text-gray-500 text-sm leading-relaxed">${escapeHtml(post.excerpt)}</p>
                        <div class="mt-4 flex items-center gap-3 text-xs text-gray-400">
                            <span>${escapeHtml(formatDate(post.date))}</span>
                            <span>&middot;</span>
                            <span>${escapeHtml(post.readTime)}</span>
                        </div>
                    </div>
                </a>`;
}

function renderPagination(currentPage, totalPages) {
  const previous = currentPage === 1
    ? `<span class="px-4 py-2 rounded-full bg-gray-100 text-gray-300 text-sm font-semibold cursor-not-allowed">Previous</span>`
    : `<a href="${pageFile(currentPage - 1)}" class="px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 hover:border-brand hover:text-brand transition">Previous</a>`;

  const pageLinks = Array.from({ length: totalPages }, (_, index) => {
    const pageNumber = index + 1;
    if (pageNumber === currentPage) {
      return `<span class="w-10 h-10 flex items-center justify-center rounded-full bg-brand text-white text-sm font-semibold">${pageNumber}</span>`;
    }
    return `<a href="${pageFile(pageNumber)}" class="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 text-sm font-semibold transition">${pageNumber}</a>`;
  }).join("\n                ");

  const next = currentPage === totalPages
    ? `<span class="px-4 py-2 rounded-full bg-gray-100 text-gray-300 text-sm font-semibold cursor-not-allowed">Next</span>`
    : `<a href="${pageFile(currentPage + 1)}" class="px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 hover:border-brand hover:text-brand transition">Next</a>`;

  return `
            <div class="mt-16 flex flex-wrap justify-center items-center gap-3 fade-in">
                ${previous}
                ${pageLinks}
                ${next}
            </div>`;
}

function renderPage(pageNumber, totalPages, pagePosts) {
  const pageHeading = pageNumber === 1
    ? `<h1 class="text-3xl sm:text-4xl md:text-7xl font-bold tracking-tight fade-in">Insights & Analysis</h1>`
    : `<p class="text-sm font-semibold tracking-[0.25em] uppercase text-brand fade-in">Archive Page ${pageNumber}</p>
            <h1 class="mt-3 text-3xl sm:text-4xl md:text-7xl font-bold tracking-tight fade-in">Insights & Analysis</h1>`;

  const prevMeta = pageNumber > 1 ? `    <link rel="prev" href="${pageUrl(pageNumber - 1)}">\n` : "";
  const nextMeta = pageNumber < totalPages ? `    <link rel="next" href="${pageUrl(pageNumber + 1)}">\n` : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageNumber === 1 ? "Blog" : `Blog Page ${pageNumber}`} — Havlek</title>
    <link rel="canonical" href="${pageUrl(pageNumber)}">
${prevMeta}${nextMeta}    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { font-family: 'Inter', sans-serif; }
        .frosted { backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); background: rgba(255,255,255,0.72); }
        .fade-in { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .fade-in.visible { opacity: 1; transform: translateY(0); }
    </style>
    <script>
        tailwind.config = { theme: { extend: { colors: { brand: '#1a73e8' } } } }
    </script>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-D0NJSVQWWE"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-D0NJSVQWWE');
    </script>
</head>
<body class="bg-white text-gray-900 antialiased overflow-x-hidden">

    <nav class="frosted fixed top-0 w-full z-50 border-b border-gray-200/50">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <a href="index.html">
                <img src="images/logo-trans.png" alt="Havlek" class="h-8">
            </a>
            <div class="hidden md:flex gap-8 text-sm font-medium text-gray-600">
                <a href="index.html" class="hover:text-brand transition">Home</a>
                <a href="services.html" class="hover:text-brand transition">Services</a>
                <a href="portfolio.html" class="hover:text-brand transition">Portfolio</a>
                <a href="testimonials.html" class="hover:text-brand transition">Testimonials</a>
                <a href="about.html" class="hover:text-brand transition">About</a>
                <a href="blog.html" class="text-brand">Blog</a>
                <a href="contact.html" class="hover:text-brand transition">Contact</a>
            </div>
            <button id="menuBtn" class="md:hidden text-gray-600" aria-label="Menu">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
            </button>
        </div>
        <div id="mobileMenu" class="hidden md:hidden px-4 sm:px-6 pb-4 space-y-3 text-sm font-medium text-gray-600">
            <a href="index.html" class="block hover:text-brand">Home</a>
            <a href="services.html" class="block hover:text-brand">Services</a>
            <a href="portfolio.html" class="block hover:text-brand">Portfolio</a>
            <a href="testimonials.html" class="block hover:text-brand">Testimonials</a>
            <a href="about.html" class="block hover:text-brand">About</a>
            <a href="blog.html" class="block text-brand">Blog</a>
            <a href="contact.html" class="block hover:text-brand">Contact</a>
        </div>
    </nav>

    <section class="pt-24 pb-12 sm:pt-32 sm:pb-16 bg-gradient-to-b from-gray-50 to-white">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            ${pageHeading}
            <p class="mt-6 text-xl text-gray-500 fade-in">Deep dives into AI, cloud computing, and modern web development.</p>
        </div>
    </section>

    <section class="py-16 sm:py-24 bg-white">
        <div class="max-w-6xl mx-auto px-4 sm:px-6">
            <div class="grid md:grid-cols-2 gap-8">
${pagePosts.map(renderCard).join("\n")}
            </div>
${renderPagination(pageNumber, totalPages)}
        </div>
    </section>

    <section class="py-16 sm:py-24 bg-gray-900 text-white">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 text-center fade-in">
            <h2 class="text-2xl sm:text-3xl md:text-5xl font-bold">Want us to write about a topic?</h2>
            <p class="mt-6 text-gray-400 text-lg">We're always looking for new subjects to explore.</p>
            <a href="contact.html" class="inline-block mt-10 px-8 py-4 bg-brand text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition">Get in Touch</a>
        </div>
    </section>

    <footer class="py-12 bg-gray-950 text-gray-400">
        <div class="max-w-6xl mx-auto px-4 sm:px-6">
            <div class="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <img src="images/logo-trans.png" alt="Havlek" class="h-6 brightness-200">
                    <p class="mt-2 text-sm">Hong Marketing Inc. (DBA: Havlek)</p>
                </div>
                <div class="flex gap-6 text-sm">
                    <a href="services.html" class="hover:text-white transition">Services</a>
                    <a href="portfolio.html" class="hover:text-white transition">Portfolio</a>
                    <a href="about.html" class="hover:text-white transition">About</a>
                    <a href="blog.html" class="hover:text-white transition">Blog</a>
                    <a href="contact.html" class="hover:text-white transition">Contact</a>
                </div>
            </div>
            <div class="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
                <p>&copy; <span id="year"></span> Hong Marketing Inc. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script>
        document.getElementById('menuBtn').addEventListener('click', () => {
            document.getElementById('mobileMenu').classList.toggle('hidden');
        });
        document.getElementById('year').textContent = new Date().getFullYear();
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
        }, { threshold: 0.1 });
        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    </script>
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
