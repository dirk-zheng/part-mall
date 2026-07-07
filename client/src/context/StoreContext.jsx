import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { productAPI, cartAPI } from '../api';

const StoreContext = createContext();

const initialState = {
  products: [],
  cart: [],
  chatHistory: [],
  loading: true,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload, loading: false };

    case 'SET_CART':
      return { ...state, cart: action.payload };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'ADD_MESSAGE':
      return {
        ...state,
        chatHistory: [...state.chatHistory, action.payload]
      };

    case 'CLEAR_CHAT':
      return { ...state, chatHistory: [] };

    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user } = useAuth();

  // 加载商品列表
  const loadProducts = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await productAPI.getList({ pageSize: 100 });
      dispatch({ type: 'SET_PRODUCTS', payload: res.data.list });
    } catch (err) {
      console.error('加载商品失败:', err);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // 加载购物车
  const loadCart = useCallback(async () => {
    try {
      const res = await cartAPI.getList();
      dispatch({ type: 'SET_CART', payload: res.data.items });
    } catch (err) {
      console.error('加载购物车失败:', err);
    }
  }, []);

  // 首次加载商品
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // 用户变化时加载/清空购物车
  useEffect(() => {
    if (user?.token) {
      loadCart();
    } else {
      dispatch({ type: 'SET_CART', payload: [] });
    }
  }, [user, loadCart]);

  // ─── 购物车操作 ────────────────────────────

  const addToCart = async (product) => {
    try {
      await cartAPI.add(product.id, 1);
      await loadCart();
    } catch (err) {
      console.error('添加到购物车失败:', err);
      throw err;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await cartAPI.remove(productId);
      await loadCart();
    } catch (err) {
      console.error('移除购物车商品失败:', err);
      throw err;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await cartAPI.updateQuantity(productId, quantity);
      await loadCart();
    } catch (err) {
      console.error('更新数量失败:', err);
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      dispatch({ type: 'SET_CART', payload: [] });
    } catch (err) {
      console.error('清空购物车失败:', err);
      throw err;
    }
  };

  // ─── 商品管理操作 ──────────────────────────

  const addProduct = async (productData) => {
    try {
      await productAPI.create(productData);
      await loadProducts();
    } catch (err) {
      console.error('添加商品失败:', err);
      throw err;
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      await productAPI.update(id, productData);
      await loadProducts();
    } catch (err) {
      console.error('更新商品失败:', err);
      throw err;
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await productAPI.delete(productId);
      await loadProducts();
    } catch (err) {
      console.error('删除商品失败:', err);
      throw err;
    }
  };

  const value = {
    state,
    dispatch,
    loadProducts,
    // 购物车
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    // 商品管理
    addProduct,
    updateProduct,
    deleteProduct,
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
