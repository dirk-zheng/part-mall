import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { AppContent } from './App';
import { getSeoForPath, getStructuredData } from './seo';

export function render(pathname, initialProducts = []) {
  return renderToString(
    <StaticRouter location={pathname}>
      <AppContent initialProducts={initialProducts} />
    </StaticRouter>
  );
}

export { getSeoForPath, getStructuredData };
