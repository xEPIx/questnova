import json, collections
p = r"D:\Binance Custom Bot\dist\training_export.json"
d = json.load(open(p, encoding="utf-8"))
trades = d.get("recent_trades", [])
sells = [t for t in trades if t.get("side") == "SELL"]
print("total trades", len(trades), "sells", len(sells))
# by exit_result
by_exit = collections.defaultdict(list)
for t in sells:
    by_exit[t.get("exit_result")].append(t)
for k,v in by_exit.items():
    wins = sum(1 for t in v if (t.get("pnl_pct") or 0) >= 0)
    avg = sum((t.get("pnl_pct") or 0) for t in v)/len(v) if v else 0
    print(f"exit={k}: n={len(v)} wins={wins} winrate={wins/len(v)*100:.1f}% avg_pnl={avg:.3f}%")
# by entry_score
by_score = collections.defaultdict(list)
for t in sells:
    es = t.get("entry_score") if t.get("entry_score") is not None else t.get("score")
    by_score[es].append(t)
print("\nby entry_score:")
for k in sorted(by_score):
    v=by_score[k]; wins=sum(1 for t in v if (t.get("pnl_pct") or 0)>=0)
    avg=sum((t.get("pnl_pct") or 0) for t in v)/len(v)
    print(f"  score={k}: n={len(v)} wins={wins} winrate={wins/len(v)*100:.1f}% avg={avg:.3f}%")
# top losing symbols
sym = collections.defaultdict(lambda: [0,0])
for t in sells:
    sym[t.get("pair")][1]+=1
    if (t.get("pnl_pct") or 0) >= 0:
        sym[t.get("pair")][0]+=1
print("\ntop symbols by count:")
for k,v in sorted(sym.items(), key=lambda x:-x[1][1])[:15]:
    wr = v[0]/v[1]*100 if v[1] else 0
    print(f"  {k}: n={v[1]} wins={v[0]} wr={wr:.0f}%")
# components of winners vs losers
def comp(t):
    c = t.get("components")
    if isinstance(c, str):
        try: c=json.loads(c)
        except: c={}
    return c or {}
winners=[t for t in sells if (t.get("pnl_pct") or 0)>=0]
losers=[t for t in sells if (t.get("pnl_pct") or 0)<0]
print("\navg components winners:", collections.Counter())
if winners:
    keys=set()
    for t in (winners+losers): keys.update(comp(t).keys())
    for k in keys:
        w=sum(comp(t).get(k,0) for t in winners)/len(winners) if winners else 0
        l=sum(comp(t).get(k,0) for t in losers)/len(losers) if losers else 0
        print(f"  {k}: winners={w:.1f} losers={l:.1f}")
# hold duration
import statistics
hd=[t.get("hold_seconds") for t in sells if t.get("hold_seconds")]
print("\nhold_seconds: min/max/avg", min(hd) if hd else None, max(hd) if hd else None, (sum(hd)/len(hd) if hd else None))
# win hold vs loss hold
wh=[t.get("hold_seconds") for t in winners if t.get("hold_seconds")]
lh=[t.get("hold_seconds") for t in losers if t.get("hold_seconds")]
print("win hold avg", (sum(wh)/len(wh) if wh else None), "loss hold avg", (sum(lh)/len(lh) if lh else None))
# change_pct of entry data? not stored; skip
print("\nmarket regime:", d.get("positions") and "n/a")
