/**
 * API 服务层 - 与数码商城后端对接
 * 
 * 使用方式：当后端服务运行后，前端可通过此模块调用后端 API。
 * 当前前端使用 Context + localStorage 做本地状态管理，
 * 如需切换为后端模式，只需修改 Context 中的 dispatch 逻辑调用此模块即可。
 */

// 开发模式下 Vite proxy 会将 /api 代理到后端，生产部署时可改为实际地址
const API_BASE = '/api';

// 通用请求方法
async function request(url, options = {}) {
  const token = JSON.parse(localStorage.getItem('mall_user') || '{}')?.token;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    },
    ...options
  };

  const response = await fetch(`${API_BASE}${url}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || '请求失败');
  }

  return data;
}

// ─── 认证 API ─────────────────────────────────────

export const authAPI = {
  /** 登录 */
  login: (username, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    }),

  /** 注册 */
  register: (username, password, name) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, name })
    }),

  /** 获取当前登录用户 */
  getMe: () => request('/auth/me')
};

// ─── 商品 API ─────────────────────────────────────

export const productAPI = {
  /** 获取商品列表（支持搜索、分类、排序、分页） */
  getList: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/products${query ? '?' + query : ''}`);
  },

  /** 获取分类统计 */
  getCategories: () => request('/products/categories'),

  /** 获取单个商品 */
  getById: (id) => request(`/products/${id}`),

  /** 添加商品（管理员） */
  create: (product) =>
    request('/products', {
      method: 'POST',
      body: JSON.stringify(product)
    }),

  /** 更新商品（管理员） */
  update: (id, product) =>
    request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product)
    }),

  /** 删除商品（管理员） */
  delete: (id) =>
    request(`/products/${id}`, {
      method: 'DELETE'
    })
};

// ─── 购物车 API ──────────────────────────────────

export const cartAPI = {
  /** 获取购物车 */
  getList: () => request('/cart'),

  /** 添加商品到购物车 */
  add: (productId, quantity = 1) =>
    request('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity })
    }),

  /** 更新购物车商品数量 */
  updateQuantity: (productId, quantity) =>
    request(`/cart/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity })
    }),

  /** 从购物车移除商品 */
  remove: (productId) =>
    request(`/cart/${productId}`, {
      method: 'DELETE'
    }),

  /** 清空购物车 */
  clear: () =>
    request('/cart', {
      method: 'DELETE'
    })
};

// ─── 客服 API ─────────────────────────────────────

export const supportAPI = {
  /** 发送消息获取 AI 回复 */
  chat: (message) =>
    request('/support/chat', {
      method: 'POST',
      body: JSON.stringify({ message })
    }),

  /** 获取常见问题 */
  getFAQ: () => request('/support/faq')
};

export default { authAPI, productAPI, cartAPI, supportAPI };
