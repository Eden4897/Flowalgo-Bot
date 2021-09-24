const puppeteer = require('puppeteer');
const { FLOWALGO_USERNAME, FLOWALGO_PASSWORD } = require('./util/globals');
const bot = require('./index');
const { MessageEmbed } = require('discord.js');
const file = new (require('./util/file'))('guilds.json');

let browser;
let pages;
let isSetUp = false;

(async () => {
  /**
   * Browser setup
   */

  browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
    //headless: false, defaultViewport: null,
  });

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

  await page.waitForSelector('.component.notice-agreement>button');
  await page.evaluate(() => {
    document.querySelector('.component.notice-agreement>button').click();
  });

  await page.waitForSelector('div#chat > * > * > .close');
  await page.click('div#chat > * > * > .close');

  /* Setup page to be searched */
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

  /* Setup page for daily snapshot */
  const snapPage = await browser.newPage();
  await snapPage.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4298.0 Safari/537.36'
  );
  await snapPage.setViewport({ width: 1700, height: 5000 });
  await snapPage.goto('https://app.flowalgo.com/snapshot/?period=today');

  /* Setup page for zoom */
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

  /* Setup page for equity */
  const equityPage = await browser.newPage();
  await equityPage.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4298.0 Safari/537.36'
  );
  await equityPage.setViewport({ width: 1700, height: 3000 });
  await equityPage.goto(
    'https://app.flowalgo.com/snapshot/equity/?period=today'
  );

  /* Setup page for io */
  const ioPage = await browser.newPage();
  await ioPage.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4298.0 Safari/537.36'
  );
  await ioPage.setViewport({ width: 1700, height: 10000 });
  await ioPage.goto('https://app.flowalgo.com/top-oi-change/');

  pages = await browser.pages();
  console.log('Setup completed!');
  isSetUp = true;

  /* Setup page for zoom */
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

  /**
   * Flow detection
   */

  await page.exposeFunction('newFlow', (flow) => {
    function getProgressBar(num) {
      const fill = '█';
      const unfill = ' ';
      let out = '';

      for (let i = 5; i <= 100; i += 5) {
        if (i < num) out += fill;
        else out += unfill;
      }

      return `\`${out}\``;
    }

    const guilds = file.read();

    const embed = new MessageEmbed()
      .setColor(
        flow.isUnusual
          ? '#950FF5'
          : flow.isGolden
          ? '#F5CB0F'
          : flow.isCall
          ? '#33CC6B'
          : '#CC4A33'
      )
      .setTitle(
        `${flow.ticker} ${flow.isCall ? 'CALLS' : 'PUTS'} ${
          flow.isUnusual ? '(UNUSUAL)' : flow.isGolden ? '(GOLDEN SIGNAL)' : ''
        }`
      )
      .setDescription(
        `Score: **[${getProgressBar(flow.algoScore)}]** *(${
          flow.algoScore
        }/100)*`
      )
      .addFields(
        { name: 'Ticker', value: flow.ticker, inline: true },
        { name: 'Type', value: flow.type, inline: true },
        { name: 'C/P', value: flow.isCall ? 'CALLS' : 'PUTS', inline: true },
        { name: 'Strike', value: flow.strike, inline: true },
        { name: 'Spot price', value: flow.spot, inline: true },
        { name: 'Premium', value: flow.premium, inline: true },
        { name: 'Details', value: flow.details, inline: true },
        { name: 'Date', value: flow.date, inline: true },
        { name: 'Expiry Date', value: flow.expiry, inline: true }
      );

    guilds.forEach((guild) => {
      const channel = bot.channels.cache.get(
        flow.isUnusual
          ? guild.unusual
          : flow.isGolden
          ? guild.golden
          : guild.flow
      );
      if (!channel) return;
      channel
        .send(
          flow.isUnusual
            ? guild.unusual_ping
            : flow.isGolden
            ? guild.golden_ping
            : guild.flow_ping,
          (
            flow.isUnusual
              ? guild.unusual_chart
              : flow.isGolden
              ? guild.golden_chart
              : guild.flow_chart
          )
            ? embed.setImage(
                getChart(
                  (flow.ticker,
                  flow.isUnusual
                    ? guild.unusual_chart_duration
                    : flow.isGolden
                    ? guild.golden_chart_duration
                    : guild.flow_chart_duration) ?? 'i5'
                )
              )
            : embed
        )
        .catch(() => {});
    });
  });

  /**
   * Darkflow detection
   */

  await page.exposeFunction('newDarkflow', (darkflow) => {
    const guilds = file.read();

    const embed = new MessageEmbed()
      .setColor(
        darkflow.greenEquity
          ? '#4be352'
          : darkflow.darkprint
          ? '#000000'
          : '#9ea2a8'
      )
      .setTitle(
        `${darkflow.ticker} ${
          darkflow.greenEquity
            ? 'Green Equity'
            : darkflow.darkprint
            ? 'Darkpool Prints'
            : 'Equity Blocks'
        }`
      )
      .addFields(
        { name: 'Ticker', value: darkflow.ticker, inline: true },
        { name: 'Quantity', value: darkflow.quantity, inline: true },
        { name: '$MM', value: darkflow.mm, inline: true },
        { name: 'Spot Price', value: darkflow.spot, inline: true },
        { name: 'Date', value: darkflow.time, inline: true }
      );

    guilds.forEach((guild) => {
      const channel = bot.channels.cache.get(
        darkflow.greenEquity
          ? guild.greenequity
          : darkflow.darkprint
          ? guild.darkprint
          : guild.equity
      );
      if (!channel) return;
      channel
        .send(
          darkflow.greenEquity
            ? guild.greenequity_ping
            : darkflow.darkprint
            ? guild.darkprint_ping
            : guild.equity_ping,
          embed
        )
        .catch(() => {});
    });
  });

  /**
   * Alpha AI detection
   */

  await page.exposeFunction('newAlphaSig', (alphaSig) => {
    const guilds = file.read();

    const embed = new MessageEmbed()
      .setColor('#2A466E')
      .setTitle(`AI Alert ${alphaSig.symbol}`)
      .addFields(
        { name: 'Symbol', value: alphaSig.symbol, inline: true },
        { name: 'Signal', value: alphaSig.sentiment, inline: true },
        { name: 'Ref', value: alphaSig.ref, inline: true },
        { name: 'Date', value: alphaSig.date, inline: true }
      );

    guilds.forEach((guild) => {
      const channel = bot.channels.cache.get(guild.alphaai);
      if (!channel) return;
      channel
        .send(
          guild.alphaai_ping,
          guild.alphaai_chart
            ? embed.setImage(
                getChart(alphaSig.symbol, guild.alphaai_chart_duration ?? 'i5')
              )
            : embed
        )
        .catch(() => {});
    });
  });

  await page.evaluate(() => {
    /**
     * Flow Listener
     */
    const flowObserver = new MutationObserver(function () {
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

      window.newFlow(data);
    });

    flowObserver.observe(
      document.querySelector('.optionflow-component>*>.data-body'),
      { childList: true, subtree: true }
    );

    /**
     * Darkflow Listener
     */
    let lastDarkFlow = null;
    const darkflowObserver = new MutationObserver(function () {
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
        greenEquity:
          parseInt(
            darkflow.querySelector('.notional').innerText.replace(/[^0-9]/g, '')
          ) >= 50
      };

      if (JSON.stringify(data) == JSON.stringify(lastDarkFlow)) return;

      lastDarkFlow = data;

      window.newDarkflow(data);
    });
    darkflowObserver.observe(
      document.querySelector('.darkflow-component>*>.data-body'),
      { childList: true, subtree: true }
    );

    /**
     * AlphaSig listener
     */

    let lastAlphaSig = null;
    const alphaSigObserver = new MutationObserver(function () {
      const alphaSig = document.querySelector('.aai_signal');

      const data = {
        symbol: alphaSig.querySelector('.symbol').innerText.trim(),
        ref: alphaSig.querySelector('div:not([class])').innerText.trim(),
        date: alphaSig.querySelector('.date').innerText.trim(),
        sentiment: alphaSig.querySelector('.sentiment').innerText.trim()
      };

      if (JSON.stringify(data) == JSON.stringify(lastAlphaSig)) return;

      lastAlphaSig = data;

      window.newAlphaSig(data);
    });

    alphaSigObserver.observe(document.querySelector('#fa_aai'), {
      childList: true,
      subtree: true
    });
  });
})();

function getChart(ticker, period) {
  return `https://charts.finviz.com/chart.ashx?t=${ticker}&p=${period}`;
}

module.exports.getPage = (index) => {
  return pages[index];
};

module.exports.isReady = () => {
  return isSetUp;
};

module.exports.getBrowser = () => {
  return browser;
};

module.exports.test = () => {
  (async (alphaSig) => {
    const guilds = file.read();

    const embed = new MessageEmbed()
      .setColor('#2A466E')
      .setTitle(`AI Alert ${alphaSig.symbol}`)
      .addFields(
        { name: 'Symbol', value: alphaSig.symbol, inline: true },
        { name: 'Signal', value: alphaSig.sentiment, inline: true },
        { name: 'Ref', value: alphaSig.ref, inline: true },
        { name: 'Date', value: alphaSig.date, inline: true }
      );

    guilds.forEach((guild) => {
      const channel = bot.channels.cache.get(guild.alphaai);
      if (!channel) return;
      channel
        .send(
          guild.alphaai_ping,
          guild.alphaai_chart
            ? embed.setImage(
                getChart(alphaSig.symbol, guild.alphaai_chart_duration ?? 'i5')
              )
            : embed
        )
        .catch(() => {});
    });
  })({
    symbol: 'TSLA',
    sentiment: 'LONG',
    ref: '727.43',
    date: '08/30'
  });
};
