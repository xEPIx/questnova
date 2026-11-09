import sqlite3, json
c = sqlite3.connect(r"D:\Binance Custom Bot\dist\Database\bot.db")
knowledge = [
    ("risk", "Kill switches: daily PnL < -X% flatten; 1h realized vol >3x normal pause; API latency >5s or error>10% cancel; orderbook depth <50% reduce; corr>0.95 reduce gross 50%."),
    ("risk", "Position limits: max 5-10% portfolio per token; 3-5x leverage majors, 1-2x alts, no leverage microcaps."),
    ("regime", "Regime detection: HMM 2-3 states (bull/bear/sideways) on returns/vol/volume; adjust params or shut off in unfavorable."),
    ("strategy", "Breakout momentum: enter on new 20-day highs with volume >2x 20-day avg; trail stop at 2 ATR."),
    ("strategy", "Time-series momentum: go long if 20-day return >0; volatility-scale position_size = target_vol / realized_vol."),
    ("strategy", "Mean reversion: enter at |z|>2.0, exit at |z|<0.5; Kalman filter for dynamic beta."),
    ("execution", "Kelly criterion: f*=(p*b-q)/b; use fractional Kelly (0.25-0.5). TWAP: slice Q into N, limit mid +/-1-2 ticks, sweep at market if not filled in 80% interval."),
    ("execution", "Avellaneda-Stoikov: optimal bid/ask around mid adjusted for inventory; gamma controls spread width."),
    ("architecture", "Event-driven: MarketData/Signal/Order/Fill/Risk events; strategy state serializable; hot param updates; state machine for order lifecycle with reconciliation every 60s."),
    ("portfolio", "Do NOT use standard MVO in crypto (too sensitive). Use min-variance/risk parity. Regime-aware sector allocation. Max 15-20 tokens."),
    ("analytics", "Exchange flows: inflows=sell pressure, outflows=accumulation. TVL/MC ratio as valuation. Whale tracking. Network health (filter bots)."),
    ("anti-pattern", "Avoid: static spreads, single-asset MM without portfolio risk, standard MVO, ignoring regime changes, 50+ token diversification, no kill switches, chasing extended moves, overfitting."),
]
for cat, content in knowledge:
    c.execute("INSERT INTO knowledge (timestamp, category, content, outcome) VALUES (?,?,?,?)",
              (time.strftime("%Y-%m-%d %H:%M:%S") if False else __import__("time").strftime("%Y-%m-%d %H:%M:%S"), cat, content, "learned"))
c.commit()
c.close()
print("inserted", len(knowledge))
