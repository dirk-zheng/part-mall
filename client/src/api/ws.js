/**
 * WebSocket 客户端 — 管理与服务端的持久连接
 *
 * 协议:
 *   Client → Server: { type, requestId, payload? }
 *   Server → Client: { type, requestId?, success, data?, error? }
 *
 * 使用方式:
 *   import wsClient from './ws';
 *   const data = await wsClient.send('products.list', { pageSize: 100 });
 *   wsClient.on('connected', (data) => { ... });
 */

const WS_PATH = '/ws';

class WSClient {
  constructor() {
    this.ws = null;
    this.pending = new Map();        // requestId → { resolve, reject, timer }
    this.listeners = new Map();      // type → Set<callback>
    this._queue = [];                // queued messages before connection opens
    this._reconnectTimer = null;
    this._reconnectAttempts = 0;
    this._maxReconnectDelay = 30000; // 30s max
    this._intentionalClose = false;
    this._connected = false;
  }

  // ─── Public API ────────────────────────────────

  /** 发送请求并等待响应，返回 Promise<data> */
  send(type, payload = {}, timeout = 15000) {
    return new Promise((resolve, reject) => {
      const requestId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      const timer = setTimeout(() => {
        this.pending.delete(requestId);
        reject(new Error(`Request timeout: ${type}`));
      }, timeout);

      this.pending.set(requestId, { resolve, reject, timer });

      const message = JSON.stringify({ type, requestId, payload });

      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(message);
      } else {
        // Queue for later delivery
        this._queue.push(message);
        this._ensureConnection();
      }
    });
  }

  /** 订阅服务端广播消息 */
  on(type, callback) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type).add(callback);
    return () => this.listeners.get(type)?.delete(callback);
  }

  /** 更新认证 token 并重连 */
  setToken(token) {
    this._intentionalClose = true;
    if (this.ws) {
      this.ws.close(1000);
      this.ws = null;
    }
    this._intentionalClose = false;
    this._reconnectAttempts = 0;
    if (token) {
      this._connect();
    }
  }

  /** 是否已连接 */
  get connected() {
    return this._connected;
  }

  /** 手动断开 */
  disconnect() {
    this._intentionalClose = true;
    if (this._reconnectTimer) {
      clearTimeout(this._reconnectTimer);
      this._reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close(1000);
      this.ws = null;
    }
    this._connected = false;
    // Reject all pending
    this.pending.forEach(({ reject }) => reject(new Error('Connection closed')));
    this.pending.clear();
    this._queue = [];
  }

  // ─── Internal ──────────────────────────────────

  _getToken() {
    try {
      const saved = JSON.parse(localStorage.getItem('mall_user') || '{}');
      return saved?.token || null;
    } catch {
      return null;
    }
  }

  _getWsUrl() {
    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    const token = this._getToken();
    const url = `${protocol}//${location.host}${WS_PATH}`;
    return token ? `${url}?token=${encodeURIComponent(token)}` : url;
  }

  _ensureConnection() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }
    this._connect();
  }

  _connect() {
    if (this.ws && (this.ws.readyState === WebSocket.CONNECTING)) return;

    try {
      this.ws = new WebSocket(this._getWsUrl());
    } catch (e) {
      this._scheduleReconnect();
      return;
    }

    this.ws.onopen = () => {
      this._connected = true;
      this._reconnectAttempts = 0;

      // Flush queued messages
      const queue = [...this._queue];
      this._queue = [];
      queue.forEach(msg => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(msg);
        }
      });
    };

    this.ws.onmessage = (event) => {
      let msg;
      try {
        msg = JSON.parse(event.data);
      } catch {
        return;
      }

      const { type, requestId } = msg;

      // Response to a pending request
      if (requestId && this.pending.has(requestId)) {
        const { resolve, reject, timer } = this.pending.get(requestId);
        clearTimeout(timer);
        this.pending.delete(requestId);

        if (msg.success) {
          resolve(msg.data);
        } else {
          reject(new Error(msg.error || 'Unknown error'));
        }
        return;
      }

      // Broadcast / server-initiated message
      const listeners = this.listeners.get(type);
      if (listeners) {
        listeners.forEach(fn => {
          try { fn(msg.data || msg); } catch (e) { /* noop */ }
        });
      }
    };

    this.ws.onclose = (event) => {
      this._connected = false;
      // Reject pending requests
      if (!this._intentionalClose) {
        this.pending.forEach(({ reject }) => reject(new Error('Connection lost')));
        this.pending.clear();
      }
      this._scheduleReconnect();
    };

    this.ws.onerror = () => {
      // onclose will follow
    };
  }

  _scheduleReconnect() {
    if (this._intentionalClose || this._reconnectTimer) return;

    const token = this._getToken();
    if (!token) return; // Don't reconnect without auth

    const delay = Math.min(1000 * Math.pow(2, this._reconnectAttempts), this._maxReconnectDelay);
    this._reconnectAttempts++;
    console.log(`[WS] Reconnecting in ${delay}ms (attempt ${this._reconnectAttempts})`);

    this._reconnectTimer = setTimeout(() => {
      this._reconnectTimer = null;
      this._connect();
    }, delay);
  }
}

// Singleton
const wsClient = new WSClient();
export default wsClient;
