import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CATALOG, Shoe } from '../../data/catalog';
import { ShellService } from '../../services/shell.service';
import { ShoeArtComponent } from '../recommendation/shoe-art.component';

@Component({
  selector: 'senso-store',
  standalone: true,
  imports: [CommonModule, FormsModule, ShoeArtComponent],
  templateUrl: './store.component.html',
  styleUrl: './store.component.css'
})
export class StoreComponent implements OnInit {
  private readonly shell = inject(ShellService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly catalog = CATALOG;
  readonly brands = Array.from(new Set(CATALOG.map(shoe => shoe.brand))).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  readonly colorFilters = [
    { id: 'neutras', label: 'Neutras', color: '#d9d5c8' },
    { id: 'terrosas', label: 'Terrosas', color: '#a37b52' },
    { id: 'vibrantes', label: 'Vibrantes', color: '#c8ff2f' }
  ];

  query = '';
  selectedBrand = 'Todas';
  selectedKind = 'todos';
  selectedPalette = 'todas';
  sort = 'relevancia';
  favorites = new Set<string>();
  mobileFiltersOpen = false;

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.query = params.get('q') ?? '';
    });
  }

  get filteredShoes(): Shoe[] {
    const query = this.query.trim().toLocaleLowerCase('pt-BR');
    const result = this.catalog.filter(shoe => {
      const matchesQuery = !query || `${shoe.brand} ${shoe.name} ${shoe.colorway}`.toLocaleLowerCase('pt-BR').includes(query);
      const matchesBrand = this.selectedBrand === 'Todas' || shoe.brand === this.selectedBrand;
      const matchesKind = this.selectedKind === 'todos' || shoe.kind === this.selectedKind;
      const matchesPalette = this.selectedPalette === 'todas' || shoe.palette === this.selectedPalette;
      return matchesQuery && matchesBrand && matchesKind && matchesPalette;
    });

    return [...result].sort((a, b) => {
      if (this.sort === 'menor-preco') return a.lowest - b.lowest;
      if (this.sort === 'maior-preco') return b.lowest - a.lowest;
      if (this.sort === 'maior-conforto') return b.comfort - a.comfort;
      return b.volume - a.volume;
    });
  }

  toggleFavorite(id: string): void {
    if (this.favorites.has(id)) this.favorites.delete(id);
    else this.favorites.add(id);
  }

  isFavorite(id: string): boolean {
    return this.favorites.has(id);
  }

  countKind(kind: string): number {
    return this.catalog.filter(shoe => shoe.kind === kind).length;
  }

  countBrand(brand: string): number {
    return this.catalog.filter(shoe => shoe.brand === brand).length;
  }

  clearFilters(): void {
    this.query = '';
    this.selectedBrand = 'Todas';
    this.selectedKind = 'todos';
    this.selectedPalette = 'todas';
  }

  goToRecommendation(): void {
    void this.router.navigate(['/recomendacao']);
  }

  toast(message: string): void {
    this.shell.toast(message);
  }
}

export type StoreFilterKind = 'todos' | 'tenis' | 'bota' | 'sapato';
