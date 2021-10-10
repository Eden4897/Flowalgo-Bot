const puppeteer = require('puppeteer');
const { FLOWALGO_USERNAME, FLOWALGO_PASSWORD } = require('./util/globals');
const { newFlowResponse } = require('./flowalgo/new-flow-response');
const { newDarkflowResponse } = require('./flowalgo/new-darkflow-response');
const { newAlphaaiResponse } = require('./flowalgo/new-alphaai-response');

let browser;
let pages;
let isSetUp = false;

(async () => {
  /**
   * Browser setup
   */

  browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: false,
    defaultViewport: null
  });

  const asyncSetupProcedures = [];

  /* Login */
  const page = (await browser.pages())[0];
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4298.0 Safari/537.36'
  );
  await page.setViewport({ width: 1400, height: 2000 });
  await page.goto('https://app.flowalgo.com/users/login');

  await page.waitForSelector('input[name="amember_login"]');
  await page.type('input[name="amember_login"]', FLOWALGO_USERNAME);

  await page.waitForSelector('input[name="amember_pass"]');
  await page.type('input[name="amember_pass"]', FLOWALGO_PASSWORD);

  await page.waitForSelector('[name="login"]>input[type="submit"]');
  await page.click('[name="login"]>input[type="submit"]');
  await page.waitForNavigation();

  asyncSetupProcedures.push(
    new Promise(async (res) => {
      await page.waitForSelector('.component.notice-agreement>button');
      await page.evaluate(() => {
        document.querySelector('.component.notice-agreement>button').click();
      });

      await page.waitForSelector('div#chat > * > * > .close');
      await page.click('div#chat > * > * > .close');
      res();
    })
  );

  /* Setup page to be searched */

  asyncSetupProcedures.push(
    new Promise(async (res) => {
      const searchPage = await browser.newPage();
      await searchPage.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4298.0 Safari/537.36'
      );
      await searchPage.setViewport({ width: 1700, height: 2000 });
      await searchPage.goto('https://app.flowalgo.com/');

      await searchPage.waitForSelector('.component.notice-agreement>button');
      await searchPage.evaluate(() => {
        document.querySelector('.component.notice-agreement>button').click();
      });
      res();
    })
  );

  /* Setup page for daily snapshot */
  asyncSetupProcedures.push(
    new Promise(async (res) => {
      const snapPage = await browser.newPage();
      await snapPage.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4298.0 Safari/537.36'
      );
      await snapPage.setViewport({ width: 1700, height: 5000 });
      await snapPage.goto('https://app.flowalgo.com/snapshot/?period=today');
      res();
    })
  );

  /* Setup page for zoom */
  asyncSetupProcedures.push(
    new Promise(async (res) => {
      const historicalZoomPage = await browser.newPage();
      await historicalZoomPage.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4298.0 Safari/537.36'
      );
      await historicalZoomPage.setViewport({ width: 1920, height: 1080 });
      await historicalZoomPage.goto('https://app.flowalgo.com/');

      await historicalZoomPage.waitForSelector(
        '.component.notice-agreement>button'
      );
      await historicalZoomPage.evaluate(() => {
        document.querySelector('.component.notice-agreement>button').click();
      });

      await historicalZoomPage.waitForSelector('div#chat > * > * > .close');
      await historicalZoomPage.click('div#chat > * > * > .close');

      await historicalZoomPage.waitForSelector(
        '.darkflow-component > * > * > .close'
      );
      await historicalZoomPage.click('.darkflow-component>*>*>.close');

      await historicalZoomPage.click('h6');
      res();
    })
  );

  /* Setup page for equity */
  asyncSetupProcedures.push(
    new Promise(async (res) => {
      const equityPage = await browser.newPage();
      await equityPage.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4298.0 Safari/537.36'
      );
      await equityPage.setViewport({ width: 1700, height: 3000 });
      await equityPage.goto(
        'https://app.flowalgo.com/snapshot/equity/?period=today'
      );
      res();
    })
  );

  /* Setup page for io */
  asyncSetupProcedures.push(
    new Promise(async (res) => {
      const ioPage = await browser.newPage();
      await ioPage.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4298.0 Safari/537.36'
      );
      await ioPage.setViewport({ width: 1700, height: 10000 });
      await ioPage.goto('https://app.flowalgo.com/top-oi-change/');
      res();
    })
  );

  /* Setup page for zoom */
  asyncSetupProcedures.push(
    new Promise(async (res) => {
      const zoomPage = await browser.newPage();
      await zoomPage.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4298.0 Safari/537.36'
      );
      await zoomPage.setViewport({ width: 1920, height: 1080 });
      await zoomPage.goto('https://app.flowalgo.com/');

      await zoomPage.waitForSelector('.component.notice-agreement>button');
      await zoomPage.evaluate(() => {
        document.querySelector('.component.notice-agreement>button').click();
      });

      await zoomPage.waitForSelector('div#chat > * > * > .close');
      await zoomPage.click('div#chat > * > * > .close');

      await zoomPage.waitForSelector('.darkflow-component > * > * > .close');
      await zoomPage.click('.darkflow-component>*>*>.close');

      await zoomPage.click('h6');
      res();
    })
  );

  /**
   * Responses
   */

  await page.exposeFunction('newFlow', newFlowResponse);
  await page.exposeFunction('newDarkflow', newDarkflowResponse);
  await page.exposeFunction('newAlphaSig', newAlphaaiResponse);

  /**
   * Listeners
   */

  await page.evaluate(
    async () => {
      /**
       * Flow Listener
       */
      const flowObserver = new MutationObserver(() => {
        const flow = document.querySelector(
          '.optionflow-component>*>.data-body > div'
        );

        let details = flow.querySelector('.details>span').innerText;
        details =
          details.split('@')[0].trim() + ' @ $' + details.split('@')[1].trim();

        const data = {
          algoScore: parseFloat(flow.getAttribute('data-score')).toFixed(2),
          ticker: flow.querySelector('.ticker').innerText,
          type: flow.getAttribute('data-ordertype'),
          isCall: flow.classList.contains('bullflow'),
          strike: flow.querySelector('.strike > span').innerText,
          spot: flow.querySelector('.ref > span').innerText,
          premium: flow.querySelector('.premium').innerText,
          details: details,
          date: new Date().toLocaleDateString(),
          expiry: flow.querySelector('.expiry > span').innerText.trim(),
          isUnusual: flow.getAttribute('data-unusual') == 'true',
          isGolden: flow.getAttribute('data-agsweep') == 'true'
        };

        newFlow(data);
      });

      flowObserver.observe(
        document.querySelector('.optionflow-component>*>.data-body'),
        { childList: true, subtree: true }
      );

      /**
       * Darkflow Listener
       */

      let lastDarkflow = null;

      const darkflowObserver = new MutationObserver(() => {
        const darkflow = document.querySelector(
          '.darkflow-component>*>.data-body > div'
        );

        const data = {
          ticker: darkflow.querySelector('.ticker').innerText,
          time: darkflow.querySelector('.time').innerText,
          quantity: darkflow.querySelector('.quantity>span').innerText,
          spot: darkflow.querySelector('.ref>span').innerText,
          mm: darkflow.querySelector('.notional').innerText,
          darkprint: darkflow.classList.contains('darkprint'),
          isBuy: 'rgba(2, 185, 71, 0.72)' == window.getComputedStyle(darkflow)['background-color'],
          isSell: !['rgba(0, 0, 0, 0.35)', 'rgba(2, 185, 71, 0.72)'].includes(window.getComputedStyle(darkflow)['background-color']),
          greenEquity:
            parseInt(
              darkflow.querySelector('.notional').innerText.replace(/[^0-9]/g, '')
            ) >= 50
        };

        if (JSON.stringify(data) == JSON.stringify(lastDarkflow)) return;

        lastDarkFlow = data;

        newDarkflow(data);
      });
      darkflowObserver.observe(
        document.querySelector('.darkflow-component>*>.data-body'),
        { childList: true, subtree: true }
      );

      /**
       * AlphaSig listener
       */

      let lastAlphaSig = null;

      const alphaSigObserver = new MutationObserver(() => {
        const alphaSig = document.querySelector('.aai_signal');

        const data = {
          symbol: alphaSig.querySelector('.symbol').innerText.trim(),
          ref: alphaSig.querySelector('div:not([class])').innerText.trim(),
          date: alphaSig.querySelector('.date').innerText.trim(),
          sentiment: alphaSig.querySelector('.sentiment').innerText.trim()
        };

        if (JSON.stringify(data) == JSON.stringify(lastAlphaSig)) return;

        lastAlphaSig = data;

        newAlphaSig(data);
      });

      alphaSigObserver.observe(document.querySelector('#fa_aai'), {
        childList: true,
        subtree: true
      });
    }
  );

  await Promise.all(asyncSetupProcedures);

  pages = await browser.pages();
  console.log('Setup completed!');
  isSetUp = true;
})();

module.exports.getChart = function getChart(ticker, period) {
  return `https://charts.finviz.com/chart.ashx?t=${ticker}&p=${period}`;
};

module.exports.getPage = (index) => {
  return pages[index];
};

module.exports.isReady = () => {
  return isSetUp;
};

module.exports.getBrowser = () => {
  return browser;
};
