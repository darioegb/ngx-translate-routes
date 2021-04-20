// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
var puppeteer = require('puppeteer');
process.env.CHROME_BIN = puppeteer.executablePath();
process.env.CHROME_PATH = puppeteer.executablePath();
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageReporter: {
      dir: require('path').join(__dirname, '../../coverage/ngx-translate-routes'),
      reporters: [
        { type: 'html', subdir: 'report-html-show-case' },
        { type: 'text-summary', subdir: '.', file: 'text-summary.txt' }
      ],
      check: {
        global: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80,
        },

      }
    },
    reporters: ['progress', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 2147483647,
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-web-security'
        ]
      }
    }
  });
};
