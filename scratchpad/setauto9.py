import sqlite3
c = sqlite3.connect(r"D:\Binance Custom Bot\dist\Database\bot.db")
c.execute("INSERT OR REPLACE INTO settings(setting_key,setting_value,description) VALUES (?,?,?)", ("auto_trade_enabled","OFF","auto"))
c.execute("INSERT OR REPLACE INTO settings(setting_key,setting_value,description) VALUES (?,?,?)", ("ai_training_mode","ON","auto"))
c.commit()
c.close()
print("done")
