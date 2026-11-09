import sqlite3
c = sqlite3.connect(r"D:\Binance Custom Bot\dist\Database\bot.db")
knowledge = [
    ("strategy", "Momentum trading: ride strong trend; exit when momentum wanes or RSI overbought/oversold."),
    ("strategy", "Breakout trading: enter on break above resistance/below support; high volume = reliable."),
    ("strategy", "Range trading: buy at support, sell at resistance; use RSI for overbought/oversold near bounds."),
    ("strategy", "Reversal trading: hunt turning points; combine RSI divergence + Bollinger Bands + candlestick patterns (Doji/Hammer)."),
    ("strategy", "Trend following: align with prevailing direction; 200-day MA: price above = bullish, below = bearish."),
    ("strategy", "Scalping: many trades in minutes, tiny profits; needs high liquidity, tight spreads, fast execution."),
    ("strategy", "News-based trading: act fast on market-moving news; exit quickly as reactions are sharp."),
    ("strategy", "Fibonacci retracement: 38.2/50/61.8% levels for pullback entries; combine with MAs/trendlines."),
]
for cat, content in knowledge:
    c.execute("INSERT INTO knowledge (timestamp, category, content, outcome) VALUES (?,?,?,?)",
              (__import__("time").strftime("%Y-%m-%d %H:%M:%S"), cat, content, "learned"))
c.commit()
c.close()
print("inserted", len(knowledge))
