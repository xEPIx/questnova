import sqlite3
c = sqlite3.connect(r"D:\Binance Custom Bot\dist\Database\bot.db")
print([r[1] for r in c.execute("PRAGMA table_info(paper_trades)").fetchall()])
print("count", c.execute("SELECT COUNT(*) FROM paper_trades").fetchone())
c.close()
