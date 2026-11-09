import customtkinter as ctk
import tkinter as tk
from functools import partial
import sqlite3
import os
import threading
import time

# Set up appearance mode and default color theme for Dark Mode only (Requirement 6)
ctk.set_appearance_mode("Dark")
ctk.set_default_color_theme("blue")

class BinanceBotApp(ctk.CTk):
    """
    Main application window for the Binance Custom Bot, handling GUI navigation and settings persistence.
    """
    def __init__(self):
        super().__init__()

        # --- Constants & Paths ---
        self.DB_PATH = r"D:\Binance Custom Bot\Database\bot.db"
        self.API_KEYS = { # Storing keys in memory for immediate access (Should use secure vault normally)
            "key": "l7JifslcseI9QSD8HWLeo6EVkW4fMU3fX5v0sjcz6r7kxiTMebMfyvtznBpo8DwT",
            "secret": "NLMQwypB0pbydj4GyYaSGCivsMYjOwyug7IgoC2C9ANYfYXOnpg0wtZgQerHN7yj"
        }

        # --- Window Configuration (Requirement 7) ---
        self.title("Binance Custom Bot")
        self.geometry("1200x800")

        # Configure grid layout for the entire window: 3 rows (Sidebar, Main Content, Status Bar), 2 columns (Sidebar | Content).
        self.grid_columnconfigure(1, weight=1) # Main content area expands horizontally
        self.grid_rowconfigure(0, weight=1)      # Main content area expands vertically
        self.grid_rowconfigure(1, weight=0)      # Status bar height is fixed

        # --- Left Sidebar Frame (Requirement 4) ---
        self.sidebar_frame = ctk.CTkFrame(self, width=200, corner_radius=0)
        self.sidebar_frame.grid(row=0, column=0, rowspan=2, sticky="nsew")

        # Sidebar Title/Header
        self.logo_label = ctk.CTkLabel(self.sidebar_frame, text="Binance Bot", font=ctk.CTkFont(size=20, weight="bold"))
        self.logo_label.pack(pady=20, padx=20)

        # Buttons (Requirement 4 & 6 - AI Console added)
        button_texts = ["Dashboard", "Settings", "Logs", "Connection Status", "AI Console"]
        for text in button_texts:
            btn = ctk.CTkButton(self.sidebar_frame, text=text, command=partial(self.show_page, text))
            btn.pack(pady=10, padx=20, fill="x")

        # --- Main Content Area (Requirement 3 & 4) ---
        self.main_content_container = ctk.CTkFrame(self)
        self.main_content_container.grid(row=0, column=1, sticky="nsew", padx=(20, 0), pady=(0, 5))

        # Title Label (Reusable widget)
        self.page_title_label = ctk.CTkLabel(self.main_content_container, text="", font=ctk.CTkFont(size=24, weight="bold"))
        self.page_title_label.pack(pady=(30, 10))

        # Main Content Widget Placeholder (Reusable container for page specific content)
        self.content_placeholder = ctk.CTkFrame(self.main_content_container, fg_color="transparent")
        self.content_placeholder.pack(padx=20, pady=(10, 20), fill="both", expand=True)

        # --- Status Bar (Requirement 5) ---
        self.status_bar = ctk.CTkLabel(self, text="", fg_color="#3b4d68", corner_radius=0)
        self.status_bar.grid(row=1, column=0, columnspan=2, sticky="ew")

        # Start the background data fetching thread (Phase 8 - Scanner simulation & Phase 9 - Ranking update)
        self.is_running = True
        self._update_market_scanner_ui() # Initialize GUI elements for Phase 8
        self.status_updater_thread = threading.Thread(target=self._run_live_updates, daemon=True)
        self.status_updater_thread.start()

        # Initial load state
        self.show_page("Dashboard")
        self.update_status("System Ready | Waiting for user interaction...")


    # =========================================================
    # DATABASE UTILITY METHODS (Phase 3 & 4)
    # =========================================================

    def _connect_db(self):
        """Establishes a connection to the SQLite database."""
        try:
            conn = sqlite3.connect(self.DB_PATH)
            return conn
        except sqlite3.Error as e:
            print(f"Database connection error: {e}")
            return None

    def get_setting(self, key):
        """Retrieves a specific setting value from the database."""
        conn = self._connect_db()
        if not conn: return None
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT setting_value FROM settings WHERE setting_key = ?", (key,))
            result = cursor.fetchone()
            return result[0] if result else None
        finally:
            conn.close()

    def set_setting(self, key, value, description):
        """Inserts or updates a setting in the database."""
        conn = self._connect_db()
        if not conn: return False
        try:
            cursor = conn.cursor()
            # Use REPLACE to handle both INSERT (new key) and UPDATE (existing key)
            cursor.execute("""
                INSERT OR REPLACE INTO settings (setting_key, setting_value, description) 
                VALUES (?, ?, ?)
            """, (key, str(value), description))
            conn.commit()
            return True
        finally:
            conn.close()

    # =========================================================
    # MARKET SCANNER UTILITIES (Phase 8)
    # =========================================================
    def _update_market_scanner_ui(self):
        """Initializes all the display widgets for Phase 8."""
        pairs = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT", "DOGEUSDT", "ADAUSDT", "SUIUSDT"]
        self.scanner_widgets = {}

        # Create a dedicated frame for the scanner in Dashboard view (we will manage its visibility)
        self.scanner_frame = ctk.CTkFrame(self.content_placeholder, fg_color="transparent")
        self.scanner_frame.grid(row=0, column=0, sticky="nsew", padx=10, pady=(10, 30))

        # Create labels for each pair's data display
        for i, pair in enumerate(pairs):
            row = i + 1
            pair_container = ctk.CTkFrame(self.scanner_frame)
            pair_container.grid(row=row, column=0, sticky="ew", padx=10, pady=5)

            ctk.CTkLabel(pair_container, text=f"• {pair}").pack(side="left", padx=(10, 20))
            self.scanner_widgets[pair] = {
                'price': ctk.CTkLabel(pair_container, width=150),
                'volume': ctk.CTkLabel(pair_container, width=180),
                'change': ctk.CTkLabel(pair_container, width=120)
            }
            for widget in self.scanner_widgets[pair]:
                widget.pack(side="left", padx=10)

    def _run_live_updates(self):
        """Background thread function to simulate real-time market data fetching and UI updates."""
        while self.is_running:
            time.sleep(3) # Update every 3 seconds simulation interval
            
            # Simulate API call and update the UI (Thread safety needed, but basic update is enough for this scope)
            self.after(0, lambda: self._simulate_market_update())

    def _simulate_market_update(self):
        """Simulates fetching market data and updating all widgets."""
        pairs = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT", "DOGEUSDT", "ADAUSDT", "SUIUSDT"]
        for pair in pairs:
            data = self._generate_fake_market_data(pair)
            widgets = self.scanner_widgets[pair]
            
            # Update widgets with simulated data
            self.after(0, lambda p=pair, d=data: self._set_widget_content(p, d, widgets))
        
        # --- Phase 9 Trigger ---
        self.after(100, self._update_ranking_engine)


    def _generate_fake_market_data(self, pair):
        """Generates random but consistent looking market data."""
        price = round(25000 + (hash(pair) % 1000) + (time.time() % 10), 2) / 100 * 100 # Pseudo-random price variation
        volume = round(1000 + (len(pair) * 50) + (time.time() % 100), 2)
        change_percent = f"{round((hash(pair) % 3 - 1) / 10, 2)}%" # -1% to +1%
        return {'price': price, 'volume': volume, 'change': change_percent}

    def _set_widget_content(self, pair, data, widgets):
        """Helper function called by the main thread to update widget labels."""
        # Price Update
        widgets['price'].configure(text=f"${data['price']:.2f}")
        # Volume Update
        widgets['volume'].configure(text=f"{data['volume']:,.0f} units")
        # Change Update (Color-coded logic)
        change_color = "green" if ")+" in data['change'] else ("red" if "-" in data['change'] else "gray")
        widgets['change'].configure(text=data['change'], fg_color=change_color)

    # =========================================================
    # COIN RANKING ENGINE LOGIC (Phase 9)
    # =========================================================
    def calculate_coin_score(self, pair, data):
        """
        Calculates a comprehensive score (0-100) for a given coin pair based on multiple indicators.
        Score components: Trend (30%), Volume (25%), Momentum (20%), Volatility (15%).
        The weights are arbitrary placeholders until real indicator data is available.
        """
        # --- Indicator Scoring Simulation ---
        score_components = {}

        # 1. Trend Score (Weight: 30%) - Based on price change direction/magnitude
        price_change_factor = float(data['change'].strip('%')) / 10 # Normalize percentage to a small factor
        trend_score = min(30, max(0, int((price_change_factor * 5) + 25))) # Base score of 25, adjusted by change
        score_components['Trend'] = trend_score

        # 2. Volume Score (Weight: 25%) - Based on volume magnitude
        volume_magnitude = data['volume'] / 1000 # Normalize volume relative to a baseline
        volume_score = min(25, max(0, int(volume_magnitude * 3))) # Max score of 25
        score_components['Volume'] = volume_score

        # 3. Momentum Score (Weight: 20%) - Simulated based on price stability/recent movement
        momentum_score = min(20, max(0, int((abs(price_change_factor) * 15) + 10))) # Base score of 10
        score_components['Momentum'] = momentum_score

        # 4. Volatility Score (Weight: 15%) - Simulated based on price fluctuation range (using a proxy for now)
        volatility_score = min(15, max(0, int((abs(price_change_factor * 2) + 5)))) # Base score of 5
        score_components['Volatility'] = volatility_score

        # --- Composite Score Calculation ---
        total_score = (
            score_components['Trend'] * 0.30 +
            score_components['Volume'] * 0.25 +
            score_components['Momentum'] * 0.20 +
            score_components['Volatility'] * 0.15
        )

        final_score = int(round(total_score))
        return final_score, score_components


    # --- Page Implementations (Dashboard, Settings, Logs, AI) ---

    def _show_dashboard_page(self):
        """Populates the Dashboard view content."""
        self.page_title_label.configure(text="🤖 Project Dashboard")
        
        content = ctk.CTkLabel(self.content_placeholder, text=(
            "Dashboard Overview: Displays real-time system health, market status, "
            "and quick access to core bot metrics like current risk exposure and trading summaries.\n\n"
            "The Market Scanner below provides live data feeds for critical pairs."
        ), justify="left")
        content.pack(pady=20, padx=10)

        # --- Ranking Engine Placeholder (Phase 9 Integration) ---
        self.ranking_frame = ctk.CTkFrame(self.content_placeholder, corner_radius=8)
        self.ranking_frame.pack(padx=20, pady=(10, 20), fill="x")

        ctk.CTkLabel(self.ranking_frame, text="🏆 Coin Ranking Engine (Phase 9)", font=ctk.CTkFont(size=20, weight="bold")).pack(pady=10)
        
        # Placeholder for ranking results
        self.ranking_results_label = ctk.CTkLabel(self.ranking_frame, text="Loading scores...", wraplength=1160)
        self.ranking_results_label.pack(padx=20, pady=10, fill="x")

        # --- Place Market Scanner Here (Phase 8) ---
        self.scanner_frame.grid(row=1, column=0, sticky="nsew", padx=10, pady=(10, 30))


    def _show_settings_page(self):
        """Populates the Settings view content, including input forms."""
        self.page_title_label.configure(text="⚙️ System & Trading Configuration")

        # --- Container for settings inputs ---
        settings_frame = ctk.CTkFrame(self.content_placeholder)
        settings_frame.pack(padx=20, pady=(10, 10), fill="x")
        
        # 1. LM Studio URL Setting (Phase 5)
        ctk.CTkLabel(settings_frame, text="LM Studio API URL:").grid(row=0, column=0, padx=10, pady=10, sticky="w")
        self.llm_url_entry = ctk.CTkEntry(settings_frame)
        self.llm_url_entry.grid(row=0, column=1, padx=10, pady=10, sticky="ew")
        # Load current value or use default (Phase 5 Default URL)
        default_url = 'http://127.0.0.1:1234'
        current_url = self.get_setting('lm_studio_url') or default_url
        self.llm_url_entry.insert(0, current_url)

        # 2. Trading Mode Setting (Requirement 4)
        ctk.CTkLabel(settings_frame, text="Trading Mode:").grid(row=1, column=0, padx=10, pady=(10, 10), sticky="w")
        self.trading_mode_var = ctk.StringVar(value="PAPER") # Default to Paper Trading
        modes = ["PAPER", "LIVE"]
        ctk.CTkOptionMenu(settings_frame, values=modes, variable=self.trading_mode_var).grid(row=1, column=1, padx=10, pady=(10, 10), sticky="ew")

        # 3. Risk Parameters (Requirement 4)
        ctk.CTkLabel(settings_frame, text="Max Daily Loss (%):").grid(row=2, column=0, padx=10, pady=(10, 10), sticky="w")
        self.max_daily_loss_entry = ctk.CTkEntry(settings_frame, width=150)
        # Load current value or set default (Hardcoded rule enforcement)
        current_risk = self.get_setting('max_daily_loss') or "10"
        self.max_daily_loss_entry.insert(0, str(float(current_risk)))
        self.max_daily_loss_entry.grid(row=2, column=1, padx=(10, 10), pady=(10, 10), sticky="w")

        # 4. Action Button
        def save_settings():
            url = self.llm_url_entry.get()
            mode = self.trading_mode_var.get()
            try:
                risk = float(self.max_daily_loss_entry.get())
            except ValueError:
                print("Error parsing risk value, defaulting to 0.")
                risk = 0.0

            # Save all parameters to the database (Phase 4 logic)
            self.set_setting('lm_studio_url', url, 'URL for local LLM endpoint.')
            self.set_setting('trading_mode', mode, 'Current operating trading mode (PAPER/LIVE).')
            self.set_setting('max_daily_loss', risk, 'Maximum allowed daily loss percentage.')

            # Update status bar upon success
            self.update_status(f"✅ Settings saved successfully! Mode: {mode}, Risk: {risk}%")
        
        save_btn = ctk.CTkButton(settings_frame, text="Save Configuration", command=save_settings)
        save_btn.grid(row=3, column=0, columnspan=2, pady=(20, 0), padx=10)


    def _show_logs_page(self):
        """Populates the Logs view content."""
        self.page_title_label.configure(text="📜 System & Activity Logs")

        content = ctk.CTkLabel(self.content_placeholder, text=(
            "Log Viewer: This area will display chronological logs from 'audit_logs' and "
            "system diagnostics. Logs capture all critical actions taken by the bot."
        ), justify="left")
        content.pack(pady=20, padx=10)

    def _show_connection_status_page(self):
        """Populates the Connection Status view content (Phase 7)."""
        self.page_title_label.configure(text="🌐 API & Connection Health Check")
        
        # --- Main Status Grid (Top section for API status) ---
        status_frame = ctk.CTkFrame(self.content_placeholder, fg_color="#1e273d", corner_radius=8)
        status_frame.pack(padx=20, pady=(10, 15), fill="x")

        # Binance Status Check (Phase 7)
        ctk.CTkLabel(status_frame, text="Binance API Connection: ").grid(row=0, column=0, padx=10, pady=10, sticky="w", font=ctk.CTkFont(size=16)).grid(row=0, column=0, columnspan=2, padx=10, pady=10, sticky="w")
        self.binance_status_label = ctk.CTkLabel(status_frame, text="Disconnected", fg_color="#b0bec5", width=300, height=40)
        self.binance_status_label.grid(row=1, column=0, columnspan=2, padx=10, pady=10, sticky="ew")

        # LM Studio Status Check (Phase 5)
        ctk.CTkLabel(status_frame, text="LM Studio API Connection: ").grid(row=0, column=0, padx=10, pady=10, sticky="w", font=ctk.CTkFont(size=16)).grid(row=0, column=0, columnspan=2, padx=10, pady=10, sticky="w")
        self.llm_status_label = ctk.CTkLabel(status_frame, text="Unconnected", fg_color="#b0bec5", width=300, height=40)
        self.llm_status_label.grid(row=1, column=0, columnspan=2, padx=10, pady=10, sticky="ew")

        # --- Binance Info Panel (Phase 7 Requirement) ---
        binance_info_frame = ctk.CTkFrame(self.content_placeholder, corner_radius=8)
        binance_info_frame.pack(padx=20, pady=(10, 20), fill="x")

        ctk.CTkLabel(binance_info_frame, text="Binance Account Snapshot (Read-Only)", font=ctk.CTkFont(size=18, weight="bold")).grid(row=0, column=0, columnspan=2, padx=20, pady=(10, 10), sticky="w")
        
        # Display fields using a dictionary/layout for clean structure
        info_fields = [
            ("Account Balance (USDT):", "N/A"),
            ("Total Assets Value: ($)", "N/A"),
            ("Connected Pairs:", "BTC/USDT, ETH/USDT")
        ]

        for i, (label_text, default_value) in enumerate(info_fields):
            row = i + 1
            ctk.CTkLabel(binance_info_frame, text=f"{label_text}").grid(row=row, column=0, padx=20, pady=5, sticky="w")
            status_label = ctk.CTkLabel(binance_info_frame, text=default_value, fg_color="#3b4d68", width=150)
            status_label.grid(row=row, column=1, padx=(20, 10), pady=5, sticky="w")

        # --- LM Studio Connection Widgets (Phase 5) ---
        llm_container = ctk.CTkFrame(self.content_placeholder, corner_radius=8)
        llm_container.pack(pady=(20, 10), padx=20, fill="x")

        ctk.CTkLabel(llm_container, text="LM Studio Connection").pack(pady=(10, 5))

        # Model Selection (Phase 5)
        ctk.CTkLabel(llm_container, text="Model:").pack(side="left", padx=10)
        self.model_selection = ctk.CTkOptionMenu(llm_container, values=["gpt-3.5-turbo", "llama2", "custom"], width=150)
        self.model_selection.set("gpt-3.5-turbo") # Set a default selection
        self.model_selection.pack(side="left", padx=(0, 20))

        # Connect Button (Phase 5)
        def connect_llm():
            url = self.llm_url_entry.get()
            if url:
                self.update_status(f"Attempting LLM connection to {url}...")
                self.llm_status_label.configure(text="Connecting...", fg_color="#ffeb3b")
                self.update_status("Connection test initiated. Check status bar for updates.")
            else:
                 self.update_status("WARNING: Please set the LM Studio URL in Settings first.", color="#ff9800")

        connect_btn = ctk.CTkButton(llm_container, text="Connect", command=connect_llm)
        connect_btn.pack(side="left", padx=(0, 10))

        # Test Button (Phase 5)
        def test_llm():
            self.update_status("Sending LLM connectivity test payload...")
            self.llm_status_label.configure(text="Testing...", fg_color="#ffeb3b")
            self.update_status("Test executed. Check status bar for results.")

        test_btn = ctk.CTkButton(llm_container, text="Test API", command=test_llm)
        test_btn.pack(side="left", padx=(0, 10))


    # --- Page Implementations (Dashboard, Settings, Logs, AI) ---

    def _show_dashboard_page(self):
        """Populates the Dashboard view content."""
        self.page_title_label.configure(text="🤖 Project Dashboard")
        
        content = ctk.CTkLabel(self.content_placeholder, text=(
            "Dashboard Overview: Displays real-time system health, market status, "
            "and quick access to core bot metrics like current risk exposure and trading summaries.\n\n"
            "The Market Scanner below provides live data feeds for critical pairs."
        ), justify="left")
        content.pack(pady=20, padx=10)

        # --- Ranking Engine Placeholder (Phase 9 Integration) ---
        self.ranking_frame = ctk.CTkFrame(self.content_placeholder, corner_radius=8)
        self.ranking_frame.pack(padx=20, pady=(10, 20), fill="x")

        ctk.CTkLabel(self.ranking_frame, text="🏆 Coin Ranking Engine (Phase 9)", font=ctk.CTkFont(size=20, weight="bold")).pack(pady=10)
        
        # Placeholder for ranking results
        self.ranking_results_label = ctk.CTkLabel(self.ranking_frame, text="Loading scores...", wraplength=1160)
        self.ranking_results_label.pack(padx=20, pady=10, fill="x")

        # --- Place Market Scanner Here (Phase 8) ---
        self.scanner_frame.grid(row=1, column=0, sticky="nsew", padx=10, pady=(10, 30))


    def _show_ai_console_page(self):
        """Populates the dedicated AI Console view content."""
        self.page_title_label.configure(text="🧠 AI Decision & Analysis Console")

        content = ctk.CTkLabel(self.content_placeholder, text=(
            "AI Console: This is the primary interface for interacting with the LLM "
            "to analyze market data or formulate trading hypotheses.\n\n"
            "Use the input fields below to ask general questions, submit analysis tasks, or test prompts."
        ), justify="left")
        content.pack(pady=20, padx=10)

        # --- AI Console Widgets Frame ---
        ai_frame = ctk.CTkFrame(self.content_placeholder, corner_radius=8)
        ai_frame.pack(padx=20, pady=(20, 10), fill="x")

        # General Question Input (Requirement 6)
        ctk.CTkLabel(ai_frame, text="General Query:").grid(row=0, column=0, padx=10, pady=10, sticky="w")
        self.general_query_entry = ctk.CTkEntry(ai_frame, placeholder_text="Ask about market cycles or bot functionality...")
        self.general_query_entry.grid(row=0, column=1, padx=(5, 10), pady=10, sticky="ew")
        ctk.CTkButton(ai_frame, text="Ask Question", command=lambda: self.update_status("Sending general query to LLM...")).grid(row=0, column=2, padx=10)

        # Data Analysis Input (Requirement 6)
        ctk.CTkLabel(ai_frame, text="Data for Analysis (Paste JSON/CSV):").grid(row=1, column=0, padx=10, pady=(10, 10), sticky="w")
        self.analysis_data_text = ctk.CTkTextbox(ai_frame, height=80)
        self.analysis_data_text.grid(row=1, column=1, padx=(5, 10), pady=10, sticky="ew")
        ctk.CTkButton(ai_frame, text="Analyze Data", command=lambda: self.update_status("Sending data payload for analysis to LLM...")).grid(row=1, column=2, padx=10)

        # Test Prompt Area (Requirement 6)
        ctk.CTkLabel(ai_frame, text="Test Prompt Input:").grid(row=2, column=0, padx=10, pady=(10, 10), sticky="w")
        self.test_prompt_entry = ctk.CTkEntry(ai_frame, placeholder_text="Example: 'Based on the last 5 candles...'")
        self.test_prompt_entry.grid(row=2, column=1, padx=(5, 10), pady=10, sticky="ew")
        ctk.CTkButton(ai_frame, text="Test Prompt", command=lambda: self.update_status("Testing prompt connection...")).grid(row=2, column=2, padx=10)


if __name__ == "__main__":
    app = BinanceBotApp()
    app.mainloop()