# LotPilot 🧭

<div align="center">

### **Know Your Risk. Calculate Your Size. Trade With a Plan.**

*An institutional-grade risk management and multi-asset position-sizing engine designed for traders who prioritize capital preservation.*

[![Trading Risk Management](https://img.shields.io/badge/Risk_Management-First_Principle-indigo?style=for-the-badge&logo=shield)](https://github.com)
[![Precision Arithmetic](https://img.shields.io/badge/Arithmetic-Decimal_Safe-emerald?style=for-the-badge&logo=code)](https://github.com)
[![Multi-Asset](https://img.shields.io/badge/Markets-Forex_•_Metals_•_Crypto_•_Indices_•_Equities-blue?style=for-the-badge)](https://github.com)

<br/>

<img src="https://media.giphy.com/media/JtBZm3Getg3dqxK0zP/giphy.gif" alt="Market Chart Trading Animation" width="680" style="border-radius: 12px;" />

<br/>

</div>

---

## 🎯 The Trader's Dilemma: Why Position Sizing is Everything

> *"It’s not whether you’re right or wrong that’s important, but how much money you make when you’re right and how much you lose when you’re wrong."*  
> — **George Soros**

In financial markets, 90% of retail traders blow up their accounts not because their technical analysis was wrong, but because **their position size was completely disconnected from their risk tolerance**.

Many traders obsess over:
- ❌ Finding the "holy grail" entry indicator
- ❌ Guessing where price will go next
- ❌ Chasing arbitrary high-win-rate systems

Professional quantitative traders and institutional hedge funds know the truth: **Your edge does not exist without strict position sizing.**

---

## 🛡️ The Math of Ruin: Why Survival Comes First

The asymmetry of financial loss is brutal. When your position size is too large for your account, a single adverse market shock can inflict irreversible drawdowns:

<div align="center">

| Account Drawdown | Capital Lost | Gain Required Just to Break Even |
|:---:|:---:|:---:|
| **10%** | $1,000 | **+11.1%** |
| **20%** | $2,000 | **+25.0%** |
| **30%** | $3,000 | **+42.8%** |
| **50%** | $5,000 | **+100.0%** (Double your account!) |
| **75%** | $7,500 | **+300.0%** (4x your account!) |
| **90%** | $9,000 | **+900.0%** (Virtually impossible) |

</div>

```
Loss: -10%  ──► Requires: +11.1%  (Manageable)
Loss: -30%  ──► Requires: +42.8%  (Stressful)
Loss: -50%  ──► Requires: +100%   (Critical Danger)
Loss: -80%  ──► Requires: +400%   (Mathematical Ruin)
```

**The Core Takeaway:** Protecting your downside is not passive — it is the single most aggressive, profitable habit in trading. When you control risk on every single trade, you give the law of large numbers time to work in your favor.

---

## ⚖️ The Golden Equation of Risk Management

Every trade begins with a predefined risk budget — the maximum dollar amount you are willing to lose if your thesis is disproven.

$$\text{Position Size} = \frac{\text{Risk Budget (\$) Angled to Account Currency}}{\text{Loss Per Unit at Stop-Loss Level}}$$

<div align="center">
<img src="https://media.giphy.com/media/3o7TKMt1VVNkHV2PaE/giphy.gif" alt="Data Flow Animation" width="480" style="border-radius: 10px;" />
</div>

### 1️⃣ Stop Distance Dictates Size, Never the Reverse
- If your technical invalidation level is **wide**, your position size must **decrease**.
- If your technical invalidation level is **tight**, your position size can safely **increase**.
- Your total financial risk remains **identical and controlled** in both setups.

### 2️⃣ The Floor Rounding Invariant
Most retail calculators use simple rounding, which can accidentally round `0.358 lots` up to `0.36 lots`. While that seems trivial, rounding up means your actual loss exceeds your risk budget before the trade even opens.

**LotPilot enforces a strict floor rounding invariant:**
$$\text{Permitted Quantity} = \left\lfloor \frac{\text{Theoretical Quantity}}{\text{Broker Step Increment}} \right\rfloor \times \text{Broker Step Increment}$$

> **Under all modelled assumptions, your estimated stop-loss risk will NEVER exceed your requested risk budget.**

---

## 🌐 Cross-Market Nuances: Why One Formula Fails

Different asset classes speak entirely different mathematical languages. Applying an identical formula across markets leads to catastrophic over-leveraging:

<div align="center">

```
  ┌────────────────────────────────────────────────────────┐
  │                 ASSET CLASS SPECTRUM                   │
  └──────────────────────────┬─────────────────────────────┘
                             │
     ┌───────────────────────┼───────────────────────┐
     ▼                       ▼                       ▼
  FOREX                   METALS                  FUTURES
  100k Standard Lots      100 oz Troy Units       Fixed Dollar Ticks
  Pips & Cross-Rates      $1 Move = $100/lot      ES 0.25 tick = $12.50
     │                       │                       │
     ▼                       ▼                       ▼
  CRYPTO SPOT             CRYPTO PERPS            INDIAN F&O
  Fractional Coins        Linear vs Inverse       Mandatory Bundles
  0.0001 BTC increments   BTC-settled Payoffs     NIFTY 25 Shares/Lot
```

</div>

### 💱 Forex Currency Pairs
A pip value is not universally $10. It depends entirely on the quote currency and your account denomination. Trading USD/CHF with a USD account converts pip loss inversely through the active exchange rate ($10 \text{ CHF} / \text{USDCHF}$).

### 🥇 Gold & Precious Metals (XAUUSD)
A $7 move on a 100-ounce institutional gold contract represents $700 per lot. Treating Gold as an ordinary currency pair without accounting for contract size results in sudden margin liquidation.

### ⚡ Cryptocurrency Perpetuals
- **Linear Contracts (USDT-Margined):** Linear risk ($1 movement = $1 per coin).
- **Inverse Contracts (Coin-Margined):** Risk and margin settled in Bitcoin or Ethereum, requiring dedicated non-linear payoff formulas.

### 📈 Exchange-Traded Futures (CME & NYMEX)
Futures do not trade in fractional shares. They trade in discrete exchange contracts with strict tick sizes and tick multipliers (e.g. E-mini S&P 500 ES has a 0.25 tick size valued at $12.50 per contract).

### 🇮🇳 Indian Equities & Derivatives (NSE F&O)
Cash equities trade in whole shares with a 0.05 INR tick size. Derivatives enforce strict exchange lot bundles (e.g., NIFTY 50 requires orders in integer multiples of 25 shares).

---

## 💎 The Three Golden Laws of Professional Risk

<div align="center">

| Law | Principle | Trading Execution |
|---|---|---|
| **Law 1: The 1% - 2% Rule** | Never risk more than 1% to 2% of total account equity on any single idea. | You can withstand 10 consecutive losses and still preserve 80%+ of your capital. |
| **Law 2: Predefined Invalidation** | Know where you are wrong *before* entering the order. | A stop-loss is not an emergency brake — it is the level where your trade premise ceases to be true. |
| **Law 3: Positive Asymmetry** | Only take trades where the potential reward justifies the risk ($R:R \ge 1:2$). | Even with a 40% win rate, a 1:2 risk-to-reward ratio yields a mathematically profitable equity curve. |

</div>

<br/>

<div align="center">
<img src="https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif" alt="Bull and Bear Financial Market" width="600" style="border-radius: 12px;" />
</div>

---

## 📋 The Quantitative Trade Checklist

Before executing any trade in the market, ensure your setup passes the **LotPilot Invariant Test**:

- [ ] **Thesis Defined**: What technical or fundamental condition validates this trade?
- [ ] **Hard Invalidation (Stop Loss)**: Where is the thesis mathematically invalidated?
- [ ] **Risk Budget Locked**: Have you chosen an absolute cash risk ($) or percentage (%)?
- [ ] **Exact Instrument Multiplier**: Have you verified your broker's contract size (e.g., 100 oz vs 10 oz for gold)?
- [ ] **Floor Quantity Applied**: Has your position size been floored to the broker's minimum increment?
- [ ] **Execution Plan Ready**: Size is known, risk is known, emotion is eliminated.

---

## ⚠️ Risk & Reality Disclaimer

*Trading financial markets — including Foreign Exchange, Equities, Futures, Commodities, Options, and Cryptocurrencies — carries a high level of risk and may not be suitable for all investors. High leverage can work against you as well as for you.*

*LotPilot is an analytical calculation and trade planning utility. It models theoretical stop-loss risk under user-defined assumptions. Realized market losses may exceed theoretical estimates due to execution slippage, market gaps during news or weekend breaks, spread expansion, commissions, and liquidity shocks. A stop-loss order does not guarantee execution at the specified price. Always verify contract multipliers with your broker before placing live capital at risk.*

<div align="center">

---

**Plan the trade. Size the risk. Trade with clarity.** 🧭

</div>
