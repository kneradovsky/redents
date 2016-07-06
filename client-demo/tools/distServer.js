// This file configures a web server for testing the production build
// on your local machine.

import browserSync from 'browser-sync';
import historyApiFallback from 'connect-history-api-fallback';

//run test server
import server from '../../test/testServer';
const testServer = server();

// Run Browsersync
browserSync({
  port: 5000,
  ui: {
    port: 5001
  },
  server: {
    baseDir: 'dist'
  },

  files: [
    'src/*.html'
  ],

  middleware: [historyApiFallback()]
});
