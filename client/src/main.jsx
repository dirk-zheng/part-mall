import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const initialProducts = window.__INITIAL_PRODUCTS__ || []
const initialFaqs = window.__INITIAL_FAQS__ || []

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App initialProducts={initialProducts} initialFaqs={initialFaqs} />
  </React.StrictMode>,
)
