module.exports.flowMutationObserver = function flowMutationObserver() {
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
};
