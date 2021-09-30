let lastAlphaSig = null;

module.exports = function () {
  console.log('update');
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
};
