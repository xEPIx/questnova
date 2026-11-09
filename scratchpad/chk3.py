import sqlite3
c = sqlite3.connect(r"D:\Binance Custom Bot\dist\Database\bot.db")
for r in c.execute("SELECT setting_key, setting_value FROM settings WHERE setting_key IN ('auto_trade_enabled','ai_training_mode')").fetchall():
    print(r)
c.close()
