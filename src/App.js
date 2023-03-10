import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  const [eur, setEur] = useState(0)
  const [usd, setUsd] = useState(0)
  const [fxRate, setFxRate] = useState(1.1)
  const [fxRateOverride, setFxRateOverride] = useState("")
  const [applyFxRateOverride, setApplyFxRateOverride] = useState(false)
  const [currency, setCurrency] = useState("EUR");
  const [history, setHistory] = useState([]);

  function convertCurrency() {
    var fxRateToUse = fxRate;
    if (applyFxRateOverride && fxRateOverride) {
      fxRateToUse = fxRateOverride;
    }

    var initialAmount = "";
    var convertedAmount = "";

    if (currency === 'EUR') {
      if (eur) {
        const newUsd = eur * fxRateToUse;
        setUsd(newUsd);

        initialAmount = "EUR: " + Number(eur).toFixed(2);
        convertedAmount = "USD: " + newUsd.toFixed(2);
      }
    } else if (currency === 'USD') {
      if (usd) {
        const newEur = usd / fxRateToUse;
        setEur(newEur);

        initialAmount = "USD: " + Number(usd).toFixed(2);
        convertedAmount = "EUR: " + newEur.toFixed(2);
      }
    }

    // Add most recent conversion to top of history and keep the history length to 5
    setHistory(prevHistory => [{time: Date.now(), fxRate: fxRate.toFixed(2), fxRateOverride: applyFxRateOverride ? fxRateOverride : "", initialAmount: initialAmount, convertedAmount: convertedAmount}, ...prevHistory.slice(0, 4)]);
  }

  function onApplyFxRateOverride() {
    if (fxRateOverride) {
      setApplyFxRateOverride(!applyFxRateOverride);
    }
  }

  function onChangeCurrency(event) {
    setCurrency(event.target.value);
  }

  function updateFxRate(fxRate, fxRateOverride, applyFxRateOverride) {
    // Deactivate the override on the fx rate (if activated) when there is a 2% difference with the real time fx rate
    if (applyFxRateOverride && fxRateOverride) {
      if ((Math.abs(fxRate - fxRateOverride) / fxRate) >= 0.2) {
        setApplyFxRateOverride(false);
      }
    }

    // Update FX rate between -0.05 and +0.05
    var fxRateDelta = (Math.random() * 0.1) - 0.05;
    return fxRate + fxRateDelta;
  }

  useEffect(() => {
    // Update FX rate between -0.05 and +0.05 every 3 seconds
    const interval = setInterval(function () {
      setFxRate((prevFxRate) => updateFxRate(prevFxRate, fxRateOverride, applyFxRateOverride))
    }, 3000);

    return () => clearInterval(interval);
  }, [fxRate, fxRateOverride, applyFxRateOverride]);

  return (
    <div className="App">
      <header className="App-header">

        FX Rate: {fxRate.toFixed(2)}
        <span>
          FX Rate Override: <input type="number" name="fxRateOverride" value={fxRateOverride} disabled={applyFxRateOverride} onInput={e => setFxRateOverride(e.target.value)} />
        </span>

        <button onClick={onApplyFxRateOverride}>{ applyFxRateOverride ? "Unapply FX Rate Override" : "Apply FX Rate Override"}</button>

        <br />
        Enter currency in:
        <div onChange={onChangeCurrency}>
          <input type="radio" value="EUR" defaultChecked name="currency" /> EUR
          <input type="radio" value="USD" name="currency" /> USD
        </div>
    
        <br />

        <span>
          { currency === "EUR" ? (
              <>
                {currency}: <input type="number" name="eur" value={eur} onInput={e => setEur(e.target.value)} />
              </>
            ) : (
              <>
                {currency}: <input type="number" name="usd" value={usd} onInput={e => setUsd(e.target.value)} />
              </>
            )
          }
        </span>

        <br />
        <button onClick={convertCurrency}>{currency === "EUR" ? "Convert EUR To USD" : "Convert USD To EUR" }</button>

        { currency === "EUR" ? (
            <>
              USD: {Number(usd).toFixed(2)}
            </>
          ) : (
            <>
              EUR: {Number(eur).toFixed(2)}
            </>
          )
        }

        <br />
        <br />
        <br />

        History
        <table>
          <thead>
            <tr>
              <th>Real Time FX Rate</th>
              <th>FX Rate Override</th>
              <th>Initial Amount</th>
              <th>Converted Amount</th>
            </tr>
          </thead>
          <tbody>
            {history.map(item => {
              return (
                <tr key={item.time}>
                  <td>{ item.fxRate }</td>
                  <td>{ item.fxRateOverride }</td>
                  <td>{ item.initialAmount }</td>
                  <td>{ item.convertedAmount }</td>
                </tr>
              );
            })}
          </tbody>
        </table>

      </header>
    </div>
  );
}

export default App;
