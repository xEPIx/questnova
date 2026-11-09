import sqlite3
c = sqlite3.connect(r"D:\Binance Custom Bot\dist\Database\bot.db")
c.execute("DELETE FROM paper_trades")
c.execute("DELETE FROM live_trades")
c.execute("DELETE FROM ai_training")
c.execute("DELETE FROM coin_scores")
c.commit()
c.close()
print("cleared")
