let lastDarkFlow = null;
module.exports = function () {
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
    isSell: darkflow.classList.contains(/* TO ADD */),
    greenEquity:
      parseInt(
        darkflow.querySelector('.notional').innerText.replace(/[^0-9]/g, '')
      ) >= 50
  };

  if (JSON.stringify(data) == JSON.stringify(lastDarkFlow)) return;

  lastDarkFlow = data;

  window.newDarkflow(data);
};
