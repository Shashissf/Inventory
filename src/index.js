/* eslint-disable no-undef */

import React from "react";
import { createRoot } from "react-dom/client";
import Main from './EntryFile/Main';

createRoot(document.getElementById('app')).render(<Main />);

if (module.hot) {
  module.hot.accept();
}
