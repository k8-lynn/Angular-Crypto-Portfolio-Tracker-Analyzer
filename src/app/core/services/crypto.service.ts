import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CryptoAsset } from '../../models/crypto.model';
import { catchError, of, tap, timer, switchMap, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CryptoService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1';

  cryptos = signal<CryptoAsset[]>([]);
  loading = signal<boolean>(false);
  private pollingSub?: Subscription;

  startAutoRefresh() {
    this.loading.set(true);
    this.pollingSub = timer(0, 60000).pipe(
      switchMap(() => this.http.get<any[]>(this.apiUrl).pipe(
        catchError(error => {
          console.error("API Error:", error);
          return of([]);
        })
      )),
      tap(data => {
        if (data && data.length > 0) {
            const mappedData: CryptoAsset[] = data.map(coin => ({
                id: coin.id,
                name: coin.name,
                symbol: coin.symbol,
                currentPrice: coin.current_price,
                // If the API sends null, default to 0 so the UI doesn't break
                priceChange24h: coin.price_change_percentage_24h || 0 
              }));
          this.cryptos.set(mappedData);
        }
        this.loading.set(false);
      })
    ).subscribe();
  }

  stopAutoRefresh() {
    if (this.pollingSub) this.pollingSub.unsubscribe();
  }
}