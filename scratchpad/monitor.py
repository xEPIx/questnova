import time, json, urllib.request, os, subprocess, sys
BASE = "http://127.0.0.1:8765"
STATUS_FILE = r"D:\Binance Custom Bot\dist\monitor_status.txt"
REPORT_FILE = r"D:\Binance Custom Bot\dist\analysis_report.txt"
EXPORT = r"D:\Binance Custom Bot\dist\training_export.json"

def api(path, method="GET", body=None):
    url = BASE + path
    data = None
    if body is not None:
        data = json.dumps(body).encode()
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return json.loads(r.read().decode())
    except Exception as e:
        return {"error": str(e)}

def analyze():
    api("/export", "GET")
    time.sleep(2)
    try:
        d = json.load(open(EXPORT, encoding="utf-8"))
    except Exception as e:
        return f"export read error: {e}"
    trades = d.get("recent_trades", [])
    sells = [t for t in trades if t.get("side") == "SELL"]
    lines = []
    lines.append(f"ANALYSIS @ {time.strftime('%Y-%m-%d %H:%M:%S')}")
    lines.append(f"total_trades={len(trades)} sells={len(sells)}")
    # by exit
    from collections import defaultdict
    by_exit = defaultdict(list)
    for t in sells: by_exit[t.get("exit_result")].append(t)
    for k,v in by_exit.items():
        wins = sum(1 for t in v if (t.get("pnl_pct") or 0) >= 0)
        avg = sum((t.get("pnl_pct") or 0) for t in v)/len(v) if v else 0
        lines.append(f"exit={k}: n={len(v)} wins={wins} wr={wins/len(v)*100:.1f}% avg={avg:.3f}%")
    # by score
    by_score = defaultdict(list)
    for t in sells:
        es = t.get("entry_score") if t.get("entry_score") is not None else t.get("score")
        by_score[es].append(t)
    lines.append("by entry_score:")
    for k in sorted(by_score):
        v=by_score[k]; wins=sum(1 for t in v if (t.get("pnl_pct") or 0)>=0)
        avg=sum((t.get("pnl_pct") or 0) for t in v)/len(v)
        lines.append(f"  score={k}: n={len(v)} wins={wins} wr={wins/len(v)*100:.1f}% avg={avg:.3f}%")
    # symbols
    sym = defaultdict(lambda: [0,0])
    for t in sells:
        sym[t.get("pair")][1]+=1
        if (t.get("pnl_pct") or 0) >= 0: sym[t.get("pair")][0]+=1
    lines.append("top symbols:")
    for k,v in sorted(sym.items(), key=lambda x:-x[1][1])[:12]:
        wr = v[0]/v[1]*100 if v[1] else 0
        lines.append(f"  {k}: n={v[1]} wins={v[0]} wr={wr:.0f}%")
    # components
    def comp(t):
        c = t.get("components")
        if isinstance(c, str):
            try: c=json.loads(c)
            except: c={}
        return c or {}
    winners=[t for t in sells if (t.get("pnl_pct") or 0)>=0]
    losers=[t for t in sells if (t.get("pnl_pct") or 0)<0]
    if winners and losers:
        keys=set()
        for t in (winners+losers): keys.update(comp(t).keys())
        lines.append("components (winners vs losers):")
        for k in keys:
            w=sum(comp(t).get(k,0) for t in winners)/len(winners)
            l=sum(comp(t).get(k,0) for t in losers)/len(losers)
            lines.append(f"  {k}: winners={w:.1f} losers={l:.1f}")
    # pnl
    lines.append(f"realized_pnl={d.get('realized_pnl')}")
    report = "\n".join(lines)
    with open(REPORT_FILE, "w", encoding="utf-8") as f:
        f.write(report)
    # log training sample
    api("/feedback", "POST", {"prompt": "AUTO ANALYSIS after 100+ trades",
        "response": report[:1500], "feedback": "analysis", "outcome": "review",
        "reward": None, "model": "monitor", "mode": "research"})
    return report

def main():
    threshold = 100
    done = False
    while True:
        try:
            st = api("/status")
            if "error" in st:
                time.sleep(60); continue
            t = api("/trades?mode=PAPER") if False else api("/trades", "POST", {"action":"trades","mode":"PAPER"})
            # trades endpoint via GET-ish: use /trades?mode not supported in POST? Actually POST action trades works.
            sells = 0
            if isinstance(t, dict) and "trades" in t:
                sells = sum(1 for x in t["trades"] if x.get("side")=="SELL")
            msg = f"{time.strftime('%H:%M:%S')} open={st.get('open_positions')} pnl={st.get('realized_pnl')} sells={sells}\n"
            with open(STATUS_FILE, "a", encoding="utf-8") as f:
                f.write(msg)
            # trim status file
            try:
                lines = open(STATUS_FILE, encoding="utf-8").read().splitlines()
                if len(lines) > 200:
                    open(STATUS_FILE, "w", encoding="utf-8").write("\n".join(lines[-200:]) + "\n")
            except Exception:
                pass
            if (not done) and sells >= threshold:
                done = True
                rep = analyze()
                with open(STATUS_FILE, "a", encoding="utf-8") as f:
                    f.write("=== ANALYSIS DONE ===\n" + rep + "\n")
        except Exception as e:
            with open(STATUS_FILE, "a", encoding="utf-8") as f:
                f.write(f"err: {e}\n")
        time.sleep(300)

if __name__ == "__main__":
    main()
