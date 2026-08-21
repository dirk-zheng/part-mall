import { productSlug, servicePages } from './data/seoContent';

export const defaultSiteUrl = 'https://www.driveline-global.com';

const basePages = {
  '/': ['Driveline Wheels | Guangzhou Wheel Supplier & On-site QC', 'Wheel trading from Guangzhou Yongning for distributors. Fitment support, random-carton QC, mixed loads and export document coordination.'],
  '/products': ['Wholesale Wheel Programs & Fitment Support | Driveline Wheels', 'Explore forged, cast and fitment-ready wheel programs for distributors. Request market-specific fitment support and export quotations.'],
  '/about': ['Guangzhou Yongning Wheel Trading Team | Driveline Wheels', 'Meet the Driveline Wheels team and learn how we support fitment, random-carton QC, mixed loads and export documents.'],
  '/news-blog/': ['Wheel Fitment, QC & Buying Guides | Driveline Wheels', 'Practical wheel fitment, quality inspection and wholesale buying guides for distributors and modification shops.'],
  '/faq': ['Wheel Wholesale, Fitment & QC FAQ | Driveline Wheels', 'Answers about wheel fitment, mixed-container orders, random-carton inspections, reports, packing and after-sales requirements.'],
  '/contact': ['Request a Wholesale Wheel Quote | Driveline Wheels', 'Request a wheel quotation without creating an account. Share your market, target vehicles, specifications, quantity and destination port.'],
};

const privatePages = {
  '/login': ['Distributor Sign In | Driveline Wheels', 'Sign in to build a private mixed-load wheel request.'],
  '/quote': ['Build a Mixed-load RFQ | Driveline Wheels', 'Prepare a private mixed-load wheel request.'],
  '/admin': ['Product Administration | Driveline Wheels', 'Private product administration area.'],
  '/admin/users': ['User Lookup | Driveline Wheels Admin', 'Private admin user information lookup.'],
  '/admin/roles': ['Member Roles | Driveline Wheels Admin', 'Private admin workspace for assigning seller roles.'],
  '/admin/articles': ['Article Upload | Driveline Wheels Admin', 'Private news-blog article upload workspace.'],
  '/admin/faqs': ['FAQ Editor | Driveline Wheels Admin', 'Private FAQ writing workspace.'],
  '/support/inbox': ['Customer Conversation Inbox | Driveline Wheels', 'Private customer support workspace for sales staff and administrators.'],
};

//seo:处理normalizeSeoPath相关逻辑
export function normalizeSeoPath(pathname = '/') {
  if (pathname === '/news-blog' || pathname === '/news-blog/') return '/news-blog/';
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1);
  return pathname;
}

//seo:处理buildPublicSeoPaths相关逻辑
export function buildPublicSeoPaths(products = [], articles = []) {
  return [
    ...Object.keys(basePages),
    ...products.map((product) => {
                      //seo:处理SEO相关回调
                      return `/products/${productSlug(product)}`;
                    }),
    ...Object.keys(servicePages).map((slug) => {
                                       //seo:处理SEO相关回调
                                       return `/services/${slug}`;
                                     }),
    ...articles.map((article) => {
      //seo:将已发布文章转换为公开页面路径
      return `/news-blog/${article.slug}`;
    }),
  ];
}

//seo:处理buildPrerenderPaths相关逻辑
export function buildPrerenderPaths(products = [], articles = []) {
  return [...buildPublicSeoPaths(products, articles), ...Object.keys(privatePages), '/404'];
}

//seo:处理getSeoForPath相关逻辑
export function getSeoForPath(pathname = '/', products = [], articles = []) {
  const path = normalizeSeoPath(pathname);
  const defaults = { path, canonical: path, image: '/wheels/hero-wheel.png', type: 'website', noindex: false };
  if (basePages[path]) return { ...defaults, title: basePages[path][0], description: basePages[path][1], schemaType: path === '/' || path === '/about' ? 'organization' : 'webpage' };
  if (privatePages[path]) return { ...defaults, title: privatePages[path][0], description: privatePages[path][1], noindex: true };

  const productMatch = path.match(/^\/products\/(.+)$/);
  if (productMatch) {
    const product = products.find((item) => {
                                    //seo:处理SEO相关回调
                                    return productSlug(item) === productMatch[1];
                                  });
    if (product) return { ...defaults, title: `${product.name} Wholesale | Driveline Wheels`, description: `${product.description}. Confirm fitment, finish, MOQ, packing, QC and available documents before ordering.`, image: product.image, schemaType: 'product', product };
  }
  const serviceMatch = path.match(/^\/services\/(.+)$/);
  if (serviceMatch && servicePages[serviceMatch[1]]) {
    const service = servicePages[serviceMatch[1]];
    return { ...defaults, title: `${service.title} | Driveline Wheels`, description: service.intro, image: service.image, schemaType: 'webpage' };
  }
  const articleMatch = path.match(/^\/news-blog\/(.+)$/);
  if (articleMatch) {
    const article = articles.find((item) => {
      //seo:查找当前URL对应的已发布文章
      return item.slug === articleMatch[1];
    });
    if (article) return { ...defaults, title: `${article.title} | Driveline Wheels`, description: article.summary, image: article.image || '/wheels/hero-wheel.png', type: 'article', schemaType: 'article', article };
  }
  return { ...defaults, title: 'Page Not Found | Driveline Wheels', description: 'The requested Driveline Wheels page could not be found.', canonical: null, noindex: true };
}

//seo:处理getStructuredData相关逻辑
export function getStructuredData(seo, siteUrl = defaultSiteUrl, faqs = []) {
  const root = siteUrl.replace(/\/$/, '');
  const url = seo.canonical ? `${root}${seo.canonical}` : root;
  const organization = { '@type': 'Organization', name: 'Driveline Wheels', url: root, email: 'info@driveline-global.com', description: 'Guangzhou-based wheel sourcing, quality control and export service partner.' };
  if (seo.path === '/faq') return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => {
      //seo:将已发布FAQ转换为结构化问答数据
      return {
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      };
    }),
  };
  if (seo.schemaType === 'organization') return { '@context': 'https://schema.org', ...organization };
  if (seo.schemaType === 'product' && seo.product) return { '@context': 'https://schema.org', '@type': 'Product', name: seo.product.name, description: seo.product.description, image: `${root}${seo.product.image}`, sku: seo.product.id, url, audience: { '@type': 'BusinessAudience', audienceType: 'Wheel distributors and modification shops' } };
  if (seo.schemaType === 'article' && seo.article) return { '@context': 'https://schema.org', '@type': 'Article', headline: seo.article.title, description: seo.article.summary, image: `${root}${seo.article.image || '/wheels/hero-wheel.png'}`, datePublished: seo.article.publishedAt || seo.article.createdAt, dateModified: seo.article.updatedAt || seo.article.publishedAt || seo.article.createdAt, mainEntityOfPage: url, author: { '@type': 'Person', name: seo.article.authorName || 'Driveline Wheels Editorial Team' }, publisher: organization };
  return { '@context': 'https://schema.org', '@type': 'WebPage', name: seo.title, description: seo.description, url };
}
