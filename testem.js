/* eslint-env node */
module.exports = {
  test_page: 'tests/index.html?hidepassed',
  disable_watching: true,
  launch_in_ci: [
    'PhantomJS',
    'Chrome',
    'Firefox'
  ],
  launch_in_dev: [
    'PhantomJS',
    'Chrome'
  ],
  browser_args: {
    Firefox: ['-headless'],
    Chrome: [
      '--disable-gpu',
      '--headless',
      '--remote-debugging-port=9222',
      '--window-size=1440,900'
    ]
  }
};
