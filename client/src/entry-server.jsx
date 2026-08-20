import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { AppContent } from './App';
import { getSeoForPath, getStructuredData } from './seo';

//渲染:渲染render组件或页面内容
export function render(pathname, initialProducts = []) {
  return renderToString(
    <StaticRouter location={pathname}>
      <AppContent initialProducts={initialProducts} />
    </StaticRouter>
  );
}

export { getSeoForPath, getStructuredData };
