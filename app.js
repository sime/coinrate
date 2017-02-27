(function () {
    'use strict';
    let rates;
    let currency = 'USD';

    let fiat = document.getElementById("fiat");
    let btc = document.getElementById("btc");
    let currencies = document.getElementById("currencies");

    fetch('https://blockchain.info/ticker?cors=true').then(response => {
      response.json().then(json => {
        rates = json;
        let inputEvent = new Event("input");
        if (btc.value) {
          btc.dispatchEvent(inputEvent);
        }

        if (fiat.value) {
          fiat.dispatchEvent(inputEvent);
        }
      });
    });

    var fiatToBtc = function (value) {
      if (!rates || !rates[currency]) {
        return;
      }

      let btcValue = value / rates[currency]['15m'];
      btc.value = parseFloat(btcValue.toFixed(8));
    };

    fiat.addEventListener("input", event => {
      fiatToBtc(event.target.value);
    });

    fiat.addEventListener("change", event => {
      localStorage.setItem("lastConversion", JSON.stringify({fiat: event.target.value}));
    });

    var btcToFiat = function (value) {
      if (!rates || !rates[currency]) {
        return;
      }

      let fiatValue = value * rates[currency]['15m'];
      fiat.value = fiatValue.toFixed(2);
    };

    btc.addEventListener("input", event => {
      btcToFiat(event.target.value);
    });

    btc.addEventListener("change", event => {
      localStorage.setItem("lastConversion", JSON.stringify({btc: event.target.value}));
    });

    currencies.addEventListener("change", event => {
      currency = event.target.value;

      btcToFiat(btc.value);
      localStorage.setItem("lastCurrency", currency);
    });

    (function() {
      let lastCurrency = localStorage.getItem("lastCurrency");
      if (lastCurrency) {
        currencies.value = lastCurrency;
        currencies.dispatchEvent(new Event("change"));
      }

      let lastConversion = JSON.parse(localStorage.getItem("lastConversion"));
      if (!lastConversion) {
        lastConversion = {btc: 1};
      }

      if (lastConversion.fiat) {
        fiat.value = parseFloat(lastConversion.fiat);
      }

      if (lastConversion.btc) {
        btc.value = parseFloat(lastConversion.btc);
      }

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').then(() => {
          // SW registered
        }).catch(err => {
          // SW Registration failed
        });
      }
    }());
}());

