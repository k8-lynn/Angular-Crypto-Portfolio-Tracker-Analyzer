import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CryptoService } from '../../core/services/crypto.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="section-header">
        <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
        <h2>Market Overview</h2>
      </div>
      
      @if (cryptoService.loading()) {
        <p class="loading-text">Fetching live data stream...</p>
      } @else {
        <div class="grid">
          @for (coin of cryptoService.cryptos(); track coin.id) {
            <div class="card">
              <div class="card-header">
                <h3>{{ coin.name }}</h3>
                <span class="badge">{{ coin.symbol | uppercase }}</span>
              </div>
              <div class="card-body">
                <p class="price data-figure">\${{ coin.currentPrice | number:'1.2-2' }}</p>
                <span class="data-figure" [ngClass]="coin.priceChange24h >= 0 ? 'data-figure--up' : 'data-figure--down'">
                  {{ coin.priceChange24h > 0 ? '+' : '' }}{{ coin.priceChange24h | number:'1.2-2' }}%
                </span>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; border-bottom: 1px solid var(--hairline); padding-bottom: 12px; }
    .header-icon { width: 20px; height: 20px; color: var(--amber); }
    h2 { font-family: var(--font-display); font-size: 1.3rem; font-weight: 500; color: var(--paper); }
    
    .loading-text { font-family: var(--font-mono); color: var(--paper-dim); font-size: 0.9rem; }
    
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
    .card { background: var(--surface); border: 1px solid var(--hairline); border-radius: 6px; padding: 16px; transition: border-color 0.2s; }
    .card:hover { border-color: var(--hairline); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
    
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .card-header h3 { font-size: 1rem; font-weight: 500; color: var(--paper); margin: 0; }
    .badge { background: var(--surface-raised); padding: 4px 8px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.7rem; color: var(--paper-dim); border: 1px solid var(--hairline); }
    
    .price { font-size: 1.4rem; margin-bottom: 4px; color: var(--paper); }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  public cryptoService = inject(CryptoService);
  ngOnInit() { this.cryptoService.startAutoRefresh(); }
  ngOnDestroy() { this.cryptoService.stopAutoRefresh(); }
}