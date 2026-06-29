import { Component, signal, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserTransaction } from '../../models/crypto.model';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="portfolio-container">
      <div class="section-header">
        <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
        <h2>Trade Execution</h2>
      </div>

      <form [formGroup]="tradeForm" (ngSubmit)="onSubmit()" class="form-layout">
        
        <div class="input-group">
          <label>Ticker</label>
          <input
            formControlName="assetId"
            type="text"
            placeholder="BTC"
            (blur)="uppercaseTicker()"
            [class.input-error]="tickerCtrl.invalid && (tickerCtrl.dirty || tickerCtrl.touched)"
          >
          <div class="validation-container">
            @if (tickerCtrl.invalid && (tickerCtrl.dirty || tickerCtrl.touched)) {
              @if (tickerCtrl.hasError('required')) {
                <span class="error-text">Ticker is required</span>
              } @else if (tickerCtrl.hasError('pattern')) {
                <span class="error-text">Letters only, 2&ndash;10 chars</span>
              }
            }
          </div>
        </div>

        <div class="input-group">
          <label>Size</label>
          <input
            formControlName="amount"
            type="number"
            step="0.01"
            placeholder="0.5"
            [class.input-error]="sizeCtrl.invalid && (sizeCtrl.dirty || sizeCtrl.touched)"
          >
          <div class="validation-container">
            @if (sizeCtrl.invalid && (sizeCtrl.dirty || sizeCtrl.touched)) {
              @if (sizeCtrl.hasError('required')) {
                <span class="error-text">Size is required</span>
              } @else if (sizeCtrl.hasError('min')) {
                <span class="error-text">Must be > 0</span>
              }
            }
          </div>
        </div>

        <div class="input-group">
          <label>Entry Price</label>
          <div class="input-prefix">
            <span class="prefix-symbol">$</span>
            <input
              formControlName="buyPrice"
              type="number"
              step="1"
              placeholder="60000"
              class="with-prefix"
              [class.input-error]="priceCtrl.invalid && (priceCtrl.dirty || priceCtrl.touched)"
            >
          </div>
          <div class="validation-container">
            @if (priceCtrl.invalid && (priceCtrl.dirty || priceCtrl.touched)) {
              @if (priceCtrl.hasError('required')) {
                <span class="error-text">Price is required</span>
              } @else if (priceCtrl.hasError('min')) {
                <span class="error-text">Must be > 0</span>
              }
            }
          </div>
        </div>

        <div class="button-container">
          <button type="submit" [class.button-disabled]="tradeForm.invalid">Execute</button>
        </div>
      </form>

      <div class="trade-history">
        <h3 class="history-title">Ledger</h3>
        <div class="history-list">
          @for (trade of trades(); track trade.date) {
            <div class="trade-card">
              <div class="trade-info">
                <span class="trade-type">BUY</span>
                <span class="data-figure">{{ trade.amount }} <span class="dim">{{ trade.assetId | uppercase }}</span></span>
              </div>
              <div class="trade-price data-figure">
                \${{ trade.buyPrice }}
              </div>
            </div>
          } @empty {
            <p class="empty-state">No trades executed in current session.</p>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .portfolio-container { margin-top: 24px; }
    .section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; border-bottom: 1px solid var(--hairline); padding-bottom: 12px; }
    .header-icon { width: 20px; height: 20px; color: var(--amber); }
    h2 { font-family: var(--font-display); font-size: 1.3rem; font-weight: 500; color: var(--paper); }

    /* Form Layout */
    .form-layout { display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start; margin-bottom: 40px; background: var(--surface); padding: 24px; border: 1px solid var(--hairline); border-radius: 6px; }
    .input-group { display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 150px; }
    .button-container { display: flex; align-items: flex-end; padding-bottom: 20px; height: 100%; }

    /* Inputs */
    label { font-family: var(--font-mono); font-size: 0.75rem; font-weight: 500; color: var(--paper-dim); text-transform: uppercase; letter-spacing: 0.05em; }
    input { font-family: var(--font-mono); background: var(--ink); border: 1px solid var(--hairline); color: var(--paper); padding: 10px 12px; border-radius: 4px; font-size: 0.9rem; transition: border-color 0.2s, box-shadow 0.2s; }
    input:focus { outline: none; border-color: var(--amber); box-shadow: 0 0 0 1px var(--amber); }
    input::placeholder { color: #4a5568; }

    /* Error States */
    input.input-error { border-color: var(--coral); }
    input.input-error:focus { box-shadow: 0 0 0 1px var(--coral); }
    .validation-container { height: 16px; margin-top: -4px; }
    .error-text { font-family: var(--font-mono); font-size: 0.7rem; color: var(--coral); font-weight: 600; }

    /* Input with Prefix */
    .input-prefix { position: relative; display: flex; align-items: center; }
    .prefix-symbol { position: absolute; left: 12px; color: var(--paper-dim); font-family: var(--font-mono); font-size: 0.9rem; }
    .with-prefix { padding-left: 28px; width: 100%; box-sizing: border-box; }

    /* Button */
    button { font-family: var(--font-body); padding: 10px 24px; background: var(--amber); color: var(--ink); border: none; border-radius: 4px; cursor: pointer; font-weight: 600; font-size: 0.9rem; transition: filter 0.2s, opacity 0.2s; height: 40px; white-space: nowrap; margin-top: 24px; }
    button:hover { filter: brightness(1.1); }
    button.button-disabled { background: var(--hairline); color: var(--paper-dim); opacity: 0.7; }
    button.button-disabled:hover { filter: none; }

    /* History List */
    .history-title { font-family: var(--font-mono); font-size: 0.85rem; font-weight: 500; color: var(--paper-dim); margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.05em; }
    .history-list { display: flex; flex-direction: column; gap: 8px; }
    .trade-card { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: var(--surface); border: 1px solid var(--hairline); border-left: 3px solid var(--mint); border-radius: 4px; }
    .trade-type { font-family: var(--font-mono); font-size: 0.7rem; font-weight: 600; color: var(--mint); margin-right: 12px; background: rgba(62, 207, 142, 0.1); padding: 2px 6px; border-radius: 3px; }
    .dim { color: var(--paper-dim); }
    .trade-price { color: var(--paper); }
    .empty-state { font-family: var(--font-mono); color: #4a5568; font-size: 0.9rem; font-style: italic; }
  `]
})
export class PortfolioComponent {
  trades = signal<UserTransaction[]>([]);
  
  private cdr = inject(ChangeDetectorRef);

  tradeForm = new FormGroup({
    assetId: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z]{2,10}$/)]),
    amount: new FormControl<number | null>(null, [Validators.required, Validators.min(0.0001)]),
    buyPrice: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)])
  });

  get tickerCtrl() { return this.tradeForm.controls.assetId; }
  get sizeCtrl() { return this.tradeForm.controls.amount; }
  get priceCtrl() { return this.tradeForm.controls.buyPrice; }

  constructor() {
    this.tradeForm.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  uppercaseTicker() {
    const value = this.tradeForm.controls.assetId.value;
    if (value) {
      this.tradeForm.controls.assetId.setValue(value.toUpperCase(), { emitEvent: false });
    }
  }

  onSubmit() {
    if (this.tradeForm.invalid) {
      this.tradeForm.markAllAsTouched();
      this.cdr.markForCheck();
      return;
    }

    const newTrade: UserTransaction = {
      assetId: this.tradeForm.value.assetId!,
      amount: this.tradeForm.value.amount!,
      buyPrice: this.tradeForm.value.buyPrice!,
      date: new Date()
    };
    
    this.trades.update(currentTrades => [newTrade, ...currentTrades]);
    this.tradeForm.reset();
  }
}