import sqlite3
c = sqlite3.connect(r"D:\Binance Custom Bot\dist\Database\bot.db")
knowledge = [
    ("strategy", "Liquidity sweep: mark prev highs/lows as liquidity pools; wait for sharp wick beyond level on lower TF; close back inside = signal; pin bar/engulfing confirm; stop beyond sweep; target next liquidity zone."),
    ("strategy", "Breaker block: failed breakout zone becomes defensive area; retest with rejection wicks/engulfing = entry; stop beyond block."),
    ("strategy", "Volatility momentum breakout: ATR-based breakout levels (highest high + k*ATR), trend filter EMA, RSI>50 momentum, 1:2 RR, 5% risk/trade, 0.1% commission+slippage."),
    ("strategy", "Zeiierman: AVSO volatility shift (low vol -> breakout, high vol -> reevaluate); Parametric Oscillator for momentum confirmation/divergence; Liquidation Volume to filter traps; Volatility Impulse green/red bars for entry; exit at liquidity pools, trailing stop when impulse changes color."),
    ("strategy", "Funding rate + open interest: extreme funding + stalling price = squeeze; rising OI sideways = building energy for breakout."),
    ("risk", "Risk layering: separate emotional risk from mathematical risk; capital preservation framework."),
    ("strategy", "Bollinger squeeze: contracting bands signal low vol before breakout; RSI for overbought/oversold reversal."),
]
for cat, content in knowledge:
    c.execute("INSERT INTO knowledge (timestamp, category, content, outcome) VALUES (?,?,?,?)",
              (__import__("time").strftime("%Y-%m-%d %H:%M:%S"), cat, content, "learned"))
c.commit()
c.close()
print("inserted", len(knowledge))
