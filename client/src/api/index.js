/**
 * API 服务层 — 基于 WebSocket 通信
 *
 * 所有 API 调用通过 WebSocket 持久连接发送，支持请求-响应与实时推送。
 */

import wsClient from './ws';

// ─── 认证 API ─────────────────────────────────────

export const authAPI = {
  login: (username, password) =>
    wsClient.send('auth.login', { username, password }),

  register: (username, password, name) =>
    wsClient.send('auth.register', { username, password, name }),

  getMe: () =>
    wsClient.send('auth.me'),
};

// ─── 商品 API ─────────────────────────────────────

export const productAPI = {
  getList: (params = {}) =>
    wsClient.send('products.list', params),

  getCategories: () =>
    wsClient.send('products.categories'),

  getById: (id) =>
    wsClient.send('products.get', { id }),

  create: (product) =>
    wsClient.send('products.create', product),

  update: (id, product) =>
    wsClient.send('products.update', { id, ...product }),

  delete: (id) =>
    wsClient.send('products.delete', { id }),
};

// ─── 混装清单 API ────────────────────────────────

export const mixedLoadAPI = {
  getList: () =>
    wsClient.send('mix.get'),

  add: (productId, quantity = 1) =>
    wsClient.send('mix.add', { productId, quantity }),

  updateQuantity: (productId, quantity) =>
    wsClient.send('mix.update', { productId, quantity }),

  remove: (productId) =>
    wsClient.send('mix.remove', { productId }),

  clear: () =>
    wsClient.send('mix.clear'),
};

// ─── 询盘 API ────────────────────────────────────

export const quoteAPI = {
  submit: (request) =>
    wsClient.send('quote.submit', request),
};

// ─── 客服 API ─────────────────────────────────────

export const supportAPI = {
  chat: (message) =>
    wsClient.send('support.chat', { message }),

  getFAQ: () =>
    wsClient.send('support.faq'),
};

// ─── IM API ───────────────────────────────────────

export const imAPI = {
  getSales: () =>
    wsClient.send('im.sales'),

  getRooms: () =>
    wsClient.send('im.rooms'),

  getMessages: (roomId) =>
    wsClient.send('im.messages', { roomId }),

  sendMessage: (content, roomId, toUserId) =>
    wsClient.send('im.send', { roomId, toUserId, content }),
};

// ─── 管理员内容与用户 API ─────────────────────────

export const adminAPI = {
  getUsers: () => wsClient.send('admin.users'),
  getArticles: () => wsClient.send('admin.articles.list'),
  createArticle: (article) => wsClient.send('admin.articles.create', article),
  deleteArticle: (id) => wsClient.send('admin.articles.delete', { id }),
  getFaqs: () => wsClient.send('admin.faqs.list'),
  createFaq: (faq) => wsClient.send('admin.faqs.create', faq),
  deleteFaq: (id) => wsClient.send('admin.faqs.delete', { id }),
};

export { wsClient };
export default { authAPI, productAPI, mixedLoadAPI, quoteAPI, supportAPI, imAPI, adminAPI };
