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

// ─── 购物车 API ──────────────────────────────────

export const cartAPI = {
  getList: () =>
    wsClient.send('cart.get'),

  add: (productId, quantity = 1) =>
    wsClient.send('cart.add', { productId, quantity }),

  updateQuantity: (productId, quantity) =>
    wsClient.send('cart.update', { productId, quantity }),

  remove: (productId) =>
    wsClient.send('cart.remove', { productId }),

  clear: () =>
    wsClient.send('cart.clear'),
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

export { wsClient };
export default { authAPI, productAPI, cartAPI, supportAPI, imAPI };
