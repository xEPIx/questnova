import sqlite3
c=sqlite3.connect(r'D:\Binance Custom Bot\Database\bot.db')
cur=c.cursor()
rows=cur.execute("SELECT name, sql FROM sqlite_master WHERE type='table'").fetchall()
for r in rows:
    print(r[0])
    print(r[1])
    print('---')
