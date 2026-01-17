import React from 'react';
import Layout from './src/components/Layout';
import './prismjs/themes/prism-custom.css';

export function wrapPageElement({ element, props }) {
  return <Layout {...props}>{element}</Layout>;
}
