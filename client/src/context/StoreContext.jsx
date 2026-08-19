import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { productAPI, mixedLoadAPI, quoteAPI } from '../api';

const StoreContext = createContext();

const initialState = {
  products: [],
  mixedLoad: [],
  chatHistory: [],
  loading: true,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload, loading: false };

    case 'SET_MIXED_LOAD':
      return { ...state, mixedLoad: action.payload };

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
      const data = await productAPI.getList({ pageSize: 100 });
      dispatch({ type: 'SET_PRODUCTS', payload: data.list });
    } catch (err) {
      console.error('加载商品失败:', err);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // 加载混装清单
  const loadMixedLoad = useCallback(async () => {
    try {
      const data = await mixedLoadAPI.getList();
      dispatch({ type: 'SET_MIXED_LOAD', payload: data.items });
    } catch (err) {
      console.error('加载混装清单失败:', err);
    }
  }, []);

  // 首次加载商品
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // 用户变化时加载/清空混装清单
  useEffect(() => {
    if (user?.token) {
      loadMixedLoad();
    } else {
      dispatch({ type: 'SET_MIXED_LOAD', payload: [] });
    }
  }, [user, loadMixedLoad]);

  // ─── 混装清单与询盘操作 ────────────────────

  const addToMixedLoad = async (product) => {
    try {
      await mixedLoadAPI.add(product.id, 1);
      await loadMixedLoad();
    } catch (err) {
      console.error('添加到混装清单失败:', err);
      throw err;
    }
  };

  const removeFromMixedLoad = async (productId) => {
    try {
      await mixedLoadAPI.remove(productId);
      await loadMixedLoad();
    } catch (err) {
      console.error('移除混装清单商品失败:', err);
      throw err;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await mixedLoadAPI.updateQuantity(productId, quantity);
      await loadMixedLoad();
    } catch (err) {
      console.error('更新数量失败:', err);
      throw err;
    }
  };

  const clearMixedLoad = async () => {
    try {
      await mixedLoadAPI.clear();
      dispatch({ type: 'SET_MIXED_LOAD', payload: [] });
    } catch (err) {
      console.error('清空混装清单失败:', err);
      throw err;
    }
  };

  const submitQuote = async (request) => {
    const result = await quoteAPI.submit(request);
    dispatch({ type: 'SET_MIXED_LOAD', payload: [] });
    return result;
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
    // 混装清单与询盘
    addToMixedLoad,
    removeFromMixedLoad,
    updateQuantity,
    clearMixedLoad,
    submitQuote,
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
