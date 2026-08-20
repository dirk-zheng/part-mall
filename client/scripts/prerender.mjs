import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer, loadEnv } from 'vite';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const clientRoot = path.resolve(scriptDir, '..');
const projectRoot = path.resolve(clientRoot, '..');
const distDir = path.join(clientRoot, 'dist');
const productsFile = path.join(projectRoot, 'server', 'data', 'products.json');
const mode = process.env.NODE_ENV || 'production';
const env = loadEnv(mode, clientRoot, '');
const siteUrl = (process.env.SITE_URL || env.VITE_SITE_URL || 'https://www.driveline-global.com').replace(/\/$/, '');

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const absoluteUrl = (value) => `${siteUrl}${value === '/' ? '/' : value}`;

function buildSeoTags(seo, structuredData) {
  const canonicalUrl = seo.canonical ? absoluteUrl(seo.canonical) : null;
  const imageUrl = absoluteUrl(seo.image);
  return [
    `<meta name="robots" content="${seo.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}">`,
    canonicalUrl ? `<link rel="canonical" href="${escapeHtml(canonicalUrl)}">` : '',
    `<meta property="og:title" content="${escapeHtml(seo.title)}">`,
    `<meta property="og:description" content="${escapeHtml(seo.description)}">`,
    `<meta property="og:type" content="${escapeHtml(seo.type)}">`,
    canonicalUrl ? `<meta property="og:url" content="${escapeHtml(canonicalUrl)}">` : '',
    `<meta property="og:image" content="${escapeHtml(imageUrl)}">`,
    '<meta property="og:site_name" content="Driveline Wheels">',
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${escapeHtml(seo.title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}">`,
    `<script type="application/ld+json" data-seo-structured-data>${JSON.stringify(structuredData).replaceAll('<', '\\u003c')}</script>`,
  ].filter(Boolean).join('\n    ');
}

function outputFileForRoute(route) {
  if (route === '/') return path.join(distDir, 'index.html');
  return path.join(distDir, route.replace(/^\//, '').replace(/\/$/, ''), 'index.html');
}

const template = await fs.readFile(path.join(distDir, 'index.html'), 'utf8');
const products = JSON.parse(await fs.readFile(productsFile, 'utf8'));
const serializedProducts = JSON.stringify(products).replaceAll('<', '\\u003c');
const vite = await createServer({
  root: clientRoot,
  logLevel: 'error',
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true },
});

try {
  const { render, getSeoForPath, getStructuredData } = await vite.ssrLoadModule('/src/entry-server.jsx');
  const { buildPrerenderPaths, buildPublicSeoPaths } = await vite.ssrLoadModule('/src/seo.js');
  const prerenderPaths = buildPrerenderPaths(products);
  const publicSeoPaths = buildPublicSeoPaths(products);

  for (const route of prerenderPaths) {
    const seo = getSeoForPath(route, products);
    const structuredData = getStructuredData(seo, siteUrl);
    const appHtml = render(route, products);
    const initialData = `<script>window.__INITIAL_PRODUCTS__=${serializedProducts}</script>`;
    const html = template
      .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(seo.title)}</title>`)
      .replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${escapeHtml(seo.description)}">`)
      .replace('<!-- SEO_TAGS -->', buildSeoTags(seo, structuredData))
      .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
      .replace('<script type="module"', `${initialData}\n    <script type="module"`)
      .replaceAll('\r\n', '\n');

    const outputFile = outputFileForRoute(route);
    await fs.mkdir(path.dirname(outputFile), { recursive: true });
    await fs.writeFile(outputFile, html, 'utf8');
    if (route === '/404') await fs.writeFile(path.join(distDir, '404.html'), html, 'utf8');
  }

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...publicSeoPaths.map(route => `  <url><loc>${escapeHtml(absoluteUrl(route))}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n');
  await fs.writeFile(path.join(distDir, 'sitemap.xml'), sitemap, 'utf8');

  const robots = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /ws',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
    '',
  ].join('\n');
  await fs.writeFile(path.join(distDir, 'robots.txt'), robots, 'utf8');
} finally {
  await vite.close();
}

console.log(`Prerendered SEO routes for ${siteUrl}`);
