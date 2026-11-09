import sqlite3
for db in ['D:/Binance Custom Bot/Database/bot.db','D:/Binance Custom Bot/dist/Database/bot.db']:
    c=sqlite3.connect(db)
    c.execute("INSERT OR REPLACE INTO settings(setting_key,setting_value,description) VALUES (?,?,?)", ('auto_trade_enabled','ON','Enable automatic high-probability paper trading.'))
    c.execute("INSERT OR REPLACE INTO settings(setting_key,setting_value,description) VALUES (?,?,?)", ('ai_training_mode','ON','Whether AI training data collection is enabled.'))
    c.commit(); c.close()
    print('updated', db)
