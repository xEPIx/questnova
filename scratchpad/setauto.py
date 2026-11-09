import sqlite3
c = sqlite3.connect(r"D:\Binance Custom Bot\Database\bot.db")
c.execute("INSERT OR REPLACE INTO settings(setting_key,setting_value,description) VALUES (?,?,?)",
          ("auto_trade_enabled", "ON", "auto"))
c.commit()
c.close()
print("done")
