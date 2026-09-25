import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RecommendationComponent } from './pages/recommendation/recommendation.component';
import { authGuard, guestGuard } from './auth/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { InsightComponent } from './pages/insight/insight.component';
import { WardrobeComponent } from './pages/wardrobe/wardrobe.component';
import { TermsComponent } from './pages/terms/terms.component';
import { StoreComponent } from './pages/store/store.component';

export const routes: Routes = [
  
  { path: 'entrar', component: LoginComponent, canActivate: [guestGuard], title: 'titles.login' },
  {
    path: '', component: LayoutComponent,
    children: [
      { path: '', pathMatch: 'full', component: HomeComponent, title: 'CactourShoes — Plataforma Inteligente de Calçados' },
      { path: 'guarda-roupa', component: WardrobeComponent, canActivate: [authGuard], title: 'CactourShoes — Criar meu guarda-roupa' },
      { path: 'loja', component: StoreComponent, canActivate: [authGuard], title: 'CactourShoes — Loja' },
      { path: 'recomendacao', component: RecommendationComponent, title: 'CactourShoes — Seu próximo calçado ideal' },
      { path: 'termos', component: TermsComponent, title: 'titles.terms' },
      { path: 'perfil', component: ProfileComponent, canActivate: [authGuard], title: 'CactourShoes — Meu perfil' },
      { path: 'comparar', component: InsightComponent, canActivate: [authGuard], data: { mode: 'compare' }, title: 'CactourShoes — Comparar produtos' },
      { path: 'alertas-preco', redirectTo: 'radar-preco', pathMatch: 'full' },
      { path: 'tamanho-ideal', component: InsightComponent, canActivate: [authGuard], data: { mode: 'size' }, title: 'CactourShoes — Tamanho ideal' },
      { path: 'radar-preco', component: InsightComponent, canActivate: [authGuard], data: { mode: 'radar' }, title: 'CactourShoes — Radar de preço' },
      { path: 'durabilidade', component: InsightComponent, canActivate: [authGuard], data: { mode: 'durability' }, title: 'CactourShoes — Durabilidade' },
      { path: '**', redirectTo: '' }
    ]
  }
];
