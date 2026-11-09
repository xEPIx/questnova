import sqlite3
c = sqlite3.connect(r"D:\Binance Custom Bot\dist\Database\bot.db")
rows = c.execute("SELECT timestamp, pair, side, quantity, price, order_id, stop_loss, take_profit, score, status, fee, strategy, entry_score, components, entry_time, exit_result, pnl_pct, hold_seconds FROM paper_trades ORDER BY id DESC LIMIT 5").fetchall()
print(len(rows))
for r in rows[:2]: print(r)
c.close()
