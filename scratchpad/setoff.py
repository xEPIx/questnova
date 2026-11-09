import sqlite3
c = sqlite3.connect(r"D:\Binance Custom Bot\dist\Database\bot.db")
c.execute("INSERT OR REPLACE INTO settings(setting_key,setting_value,description) VALUES (?,?,?)", ("auto_trade_enabled","OFF","auto"))
c.commit()
for r in c.execute("SELECT setting_key, setting_value FROM settings WHERE setting_key='auto_trade_enabled'").fetchall():
    print(r)
c.close()
