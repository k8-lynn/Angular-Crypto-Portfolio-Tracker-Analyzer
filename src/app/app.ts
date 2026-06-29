import { Component } from '@angular/core';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { PortfolioComponent } from './features/portfolio/portfolio.component';

@Component({
  selector: 'app-root',
  imports: [DashboardComponent, PortfolioComponent],
  template: `
    <header class="navbar">
      <div class="nav-content">
        <div class="logo">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          <h1>CryptoTracker</h1>
        </div>
        <div class="nav-status">
          <span class="status-dot"></span> Live Market Data
        </div>
      </div>

      <div class="ticker">
        <div class="ticker-track">
          @for (item of [tickerItems, tickerItems, tickerItems].flat(); track $index) {
            <span class="ticker-item">
              <span class="symbol">{{ item.symbol }}</span>
              <span class="data-figure" [class.data-figure--up]="item.up" [class.data-figure--down]="!item.up">
                @if (item.up) {
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                } @else {
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
                }
                {{ item.price }} &nbsp;{{ item.change }}
              </span>
            </span>
          }
        </div>
      </div>
    </header>

    <main class="main-container">
      <app-dashboard></app-dashboard>
      <app-portfolio></app-portfolio>
    </main>
  `,
  styles: [`
    :host { display: block; }

    .navbar { background: var(--surface); border-bottom: 1px solid var(--hairline); position: sticky; top: 0; z-index: 100; backdrop-filter: blur(6px); }
    .nav-content { max-width: 1200px; margin: 0 auto; padding: 18px 24px; display: flex; justify-content: space-between; align-items: center; }
    
    .logo { display: flex; align-items: center; gap: 12px; }
    .logo h1 { font-family: var(--font-display); font-size: 1.5rem; font-weight: 600; letter-spacing: -0.01em; color: var(--paper); margin: 0; }
    .logo .pro { color: var(--amber); font-style: italic; }
    .icon { width: 24px; height: 24px; color: var(--amber); filter: drop-shadow(0 0 6px var(--amber-dim)); }

    .nav-status { display: flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 0.8rem; font-weight: 500; letter-spacing: 0.02em; text-transform: uppercase; color: var(--mint); }
    .status-dot { width: 8px; height: 8px; background-color: var(--mint); border-radius: 50%; box-shadow: 0 0 8px var(--mint); animation: pulse 2s infinite; }

    .ticker { border-top: 1px solid var(--hairline); background: var(--ink); overflow: hidden; white-space: nowrap; }
    .ticker-track { display: inline-flex; animation: scroll-ticker 32s linear infinite; will-change: transform; }
    .ticker-item { display: inline-flex; align-items: center; gap: 8px; padding: 8px 28px; border-right: 1px solid var(--hairline); }
    .ticker-item .symbol { font-family: var(--font-mono); font-size: 0.78rem; font-weight: 600; color: var(--paper-dim); letter-spacing: 0.04em; }
    .ticker-item .data-figure { font-size: 0.78rem; display: flex; align-items: center; gap: 4px; }

    @keyframes scroll-ticker { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }
    @keyframes pulse { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(62, 207, 142, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(62, 207, 142, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(62, 207, 142, 0); } }

    .main-container { max-width: 1200px; margin: 48px auto; padding: 0 24px; display: flex; flex-direction: column; gap: 40px; }
  `]
})
export class App {
  title = 'crypto-tracker';
  tickerItems = [
    { symbol: 'BTC/USD', price: '67,240.18', change: '2.4%', up: true },
    { symbol: 'ETH/USD', price: '3,512.66', change: '1.1%', up: true },
    { symbol: 'SOL/USD', price: '178.32', change: '3.8%', up: false },
    { symbol: 'ADA/USD', price: '0.612', change: '0.6%', up: true },
    { symbol: 'XRP/USD', price: '0.731', change: '1.9%', up: false },
  ];
}