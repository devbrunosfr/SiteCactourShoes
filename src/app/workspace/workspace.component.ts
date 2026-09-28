import { Component, HostListener, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, UnitProfile } from '../auth/auth.service';

interface Asset {
  name: string;
  code: string;
  type: string;
  location: string;
  owner: string;
  status: string;
  next: string;
  icon: string;
}

interface AssetTypeOption {
  label: string;
  icon: string;
  prefix: string;
}

interface NewAssetForm {
  name: string;
  type: string;
  location: string;
  owner: string;
  status: string;
  lastMaintenance: string;
  period: string;
}

interface NewMaintenanceForm {
  assetKey: string;
  title: string;
  type: string;
  date: string;
  status: string;
}

interface CalendarEvent {
  date: Date;
  label: string;
  tone: 'amber' | 'green' | 'blue';
}

interface CalendarCell {
  date: Date;
  day: number;
  muted: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

type NavItem = [key: string, label: string, icon: string];
interface NavGroup {
  label: string;
  items: NavItem[];
}

interface MaintenanceItem {
  title: string;
  asset: string;
  date: string;
  type: string;
  status: string;
}

interface WarrantyItem {
  assetName: string;
  assetCode: string;
  supplier: string;
  untilDate: Date;
  coverage: string;
}

interface NewWarrantyForm {
  assetKey: string;
  supplier: string;
  purchaseDate: string;
  period: string;
  coverage: string;
}

interface WarrantyStatus {
  label: string;
  tone: 'green' | 'amber' | 'red';
}

interface SupplierItem {
  name: string;
  services: string;
  contact: string;
  rating: string;
  history: string;
}

interface NewSupplierForm {
  name: string;
  services: string;
  contact: string;
}

interface NotificationItem {
  title: string;
  message: string;
  date: string;
  icon: string;
  tone: string;
  read: boolean;
}
interface CostItem {
  description: string;
  category: string;
  supplier: string;
  date: Date;
  value: number;
}

interface OverviewCostChartPoint {
  x: number;
  y: number;
  value: number;
  dateLabel: string;
  animationIndex: number;
}

interface GlobalSearchResult {
  title: string;
  subtitle: string;
  icon: string;
  section: string;
  kind: string;
}

interface NewCostForm {
  description: string;
  category: string;
  supplier: string;
  date: string;
  value: string;
}

interface CompanySettings {
  name: string;
  cnpj: string;
  segment: string;
  timezone: string;
  description: string;
}

interface UnitEditForm {
  name: string;
  address: string;
  responsible: string;
  segment: string;
}

interface NewCategoryForm {
  label: string;
  icon: string;
  prefix: string;
}

interface TeamUser {
  name: string;
  email: string;
  role: string;
  status: 'Ativo' | 'Convite pendente';
}

interface NewTeamUserForm {
  name: string;
  email: string;
  role: string;
}

interface NotificationPreferences {
  emailMaintenance: boolean;
  emailWarranty: boolean;
  emailCosts: boolean;
  pushEnabled: boolean;
  weeklySummary: boolean;
}

interface AuditLogItem {
  action: string;
  detail: string;
  user: string;
  date: string;
  icon: string;
}

type SettingsTab = 'empresa' | 'unidades' | 'categorias' | 'usuarios' | 'notificacoes-config' | 'auditoria';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './workspace.component.html',
})
export class WorkspaceComponent implements OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  auth = inject(AuthService);

  section = 'visao-geral';
  collapsed = false;
  mobileOpen = false;
  query = '';
  globalSearchQuery = '';
  globalSearchOpen = false;
  assetTypeFilter = 'Todos os tipos';
  assetStatusFilter = 'Todos os status';
  maintenanceTypeFilter = 'Todas';
  warrantyFilter = 'Todas';
  costQuery = '';
  costPeriodFilter = 'Todos os períodos';
  costCategoryFilter = 'Todas as categorias';
  notificationFilter = 'Todas';
  drawer = '';
  user = this.auth.currentUser() || { name: 'Jailson', role: 'Administrador' };
  currentUserEmail = this.auth.currentUser()?.email || 'jailson@senai.com';
  units: UnitProfile[] = this.auth.units();
  activeUnitId = this.auth.activeUnit()?.id || 'unit_main';
  unitMenuOpen = false;
  userMenuOpen = false;
  assetsCountDisplay = 0;
  donutGradient = '';

  assetTypeOptions: AssetTypeOption[] = [
    { label: 'Ar-condicionado', icon: 'ac_unit', prefix: 'AC' },
    { label: 'Computador', icon: 'monitor', prefix: 'COM' },
    { label: 'Impressora', icon: 'print', prefix: 'IMP' },
    { label: 'Gerador', icon: 'bolt', prefix: 'GER' },
    { label: 'Veículo', icon: 'directions_car', prefix: 'VEI' },
    { label: 'Outro', icon: 'category', prefix: 'OUT' },
  ];

  newAsset: NewAssetForm = this.emptyNewAsset();
  newMaintenance: NewMaintenanceForm = this.emptyNewMaintenance();
  newWarranty: NewWarrantyForm = this.emptyNewWarranty();
  newSupplier: NewSupplierForm = this.emptyNewSupplier();
  newSupplierRating: string | null = null;
  fetchingSupplierRating = false;
  newCost: NewCostForm = this.emptyNewCost();

  settingsTab: SettingsTab = 'empresa';

  companySettings: CompanySettings = {
    name: 'Senai Cimatec',
    cnpj: '12.345.678/0001-90',
    segment: 'Escritório',
    timezone: '(GMT-03:00) Brasília',
    description: 'Escritório administrativo com 10 ativos.',
  };
  companySettingsSaved = false;

  editingUnitId: string | null = null;
  unitEditForm: UnitEditForm = { name: '', address: '', responsible: '', segment: '' };

  newCategory: NewCategoryForm = { label: '', icon: 'category', prefix: '' };

  teamUsers: TeamUser[] = [
    { name: this.user.name, email: this.currentUserEmail, role: 'Administrador', status: 'Ativo' },
    { name: 'Pedro Alves', email: 'pedro.alves@senai.com', role: 'Gestor', status: 'Ativo' },
    { name: 'Ana Souza', email: 'ana.souza@senai.com', role: 'Operador', status: 'Ativo' },
    { name: 'Carlos Lima', email: 'carlos.lima@senai.com', role: 'Operador', status: 'Convite pendente' },
  ];
  newTeamUser: NewTeamUserForm = { name: '', email: '', role: 'Operador' };

  notificationPreferences: NotificationPreferences = {
    emailMaintenance: true,
    emailWarranty: true,
    emailCosts: false,
    pushEnabled: true,
    weeklySummary: true,
  };
  notificationPreferencesSaved = false;

  auditLog: AuditLogItem[] = [
    { action: 'Ativo cadastrado', detail: 'Impressora Epson EcoTank (IMP-001) foi adicionada ao patrimônio.', user: 'Ana Souza', date: '25 set, 09:14', icon: 'inventory_2' },
    { action: 'Ordem de serviço atualizada', detail: 'OS-0249 foi movida para Em andamento.', user: 'Ana Souza', date: '25 set, 09:42', icon: 'assignment' },
    { action: 'Custo lançado', detail: 'R$ 380,00 registrado para Higienização AC #03.', user: 'Carlos Lima', date: '23 set, 16:08', icon: 'payments' },
    { action: 'Usuário convidado', detail: 'Convite enviado para Carlos Lima com função Operador.', user: 'Jailson', date: '20 set, 11:20', icon: 'person_add' },
    { action: 'Configurações da empresa alteradas', detail: 'Fuso horário atualizado para (GMT-03:00) Brasília.', user: 'Jailson', date: '18 set, 08:05', icon: 'settings' },
  ];

  private readonly monthAbbr = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  private readonly donutColors = ['#3974ce', '#7fa8e5', '#94c6ad', '#e6b967'];
  private persistenceKey = '';
  private readonly defaultDonutValues = [4, 3, 2, 1];
  private donutTimer: ReturnType<typeof setInterval> | undefined;
  private donutFrame: number | undefined;
  currentBrasiliaDate = '';
  currentBrasiliaTime = '';
  private brasiliaClockTimer: ReturnType<typeof setInterval> | undefined;
  overviewAssetsCount = 0;
  overviewPreventiveCount = 0;
  overviewOpenOrders = 0;
  overviewMonthlyCost = 0;
  overviewMaintenanceCost = 0;
  private overviewNumberFrame: number | undefined;
  overviewChartPointsVisible = false;
  private overviewChartPointsTimer: ReturnType<typeof setTimeout> | undefined;

  navGroups: NavGroup[] = [
    {
      label: 'Operação',
      items: [
        ['visao-geral', 'Visão geral', 'dashboard'],
        ['patrimonio', 'Patrimônio', 'inventory_2'],
        ['manutencao', 'Manutenção', 'build'],
        ['calendario', 'Calendário', 'calendar_month'],
        ['historico', 'Histórico', 'history'],
      ],
    },
    {
      label: 'Gestão',
      items: [
        ['garantias', 'Garantias', 'verified_user'],
        ['fornecedores', 'Fornecedores', 'groups'],
        ['clientes', 'Clientes / Unidades', 'business'],
        ['custos', 'Custos', 'payments'],
        ['relatorios', 'Relatórios', 'bar_chart'],
      ],
    },
    {
      label: 'Sistema',
      items: [
        ['notificacoes', 'Notificações', 'notifications'],
        ['configuracoes', 'Configurações', 'settings'],
      ],
    },
  ];

  assets: Asset[] = [
    { name: 'Ar-condicionado #03', code: 'AC-003', type: 'Ar-condicionado', location: 'Sala de reunião', owner: 'Jailson', status: 'Ativo', next: '07 out 2026', icon: 'ac_unit' },
    { name: 'Notebook Dell Latitude', code: 'COM-001', type: 'Computador', location: 'Financeiro', owner: 'Pedro Alves', status: 'Ativo', next: '14 out 2026', icon: 'monitor' },
    { name: 'Impressora HP LaserJet', code: 'IMP-002', type: 'Impressora', location: 'Recepção', owner: 'Ana Souza', status: 'Em manutenção', next: 'Hoje', icon: 'print' },
    { name: 'Gerador STEMAC 55kVA', code: 'GER-001', type: 'Gerador', location: 'Área técnica', owner: 'Carlos Lima', status: 'Ativo', next: '22 out 2026', icon: 'bolt' },
    { name: 'Ar-condicionado #01', code: 'AC-001', type: 'Ar-condicionado', location: 'Diretoria', owner: 'Jailson', status: 'Ativo', next: '05 nov 2026', icon: 'ac_unit' },
    { name: 'Ar-condicionado #02', code: 'AC-002', type: 'Ar-condicionado', location: 'Open space', owner: 'Jailson', status: 'Ativo', next: '05 nov 2026', icon: 'ac_unit' },
    { name: 'Computador Dell Optiplex', code: 'COM-002', type: 'Computador', location: 'Comercial', owner: 'Pedro Alves', status: 'Ativo', next: '18 nov 2026', icon: 'monitor' },
    { name: 'Impressora Epson EcoTank', code: 'IMP-001', type: 'Impressora', location: 'Financeiro', owner: 'Ana Souza', status: 'Ativo', next: '03 dez 2026', icon: 'print' },
    { name: 'Ar-condicionado #04', code: 'AC-004', type: 'Ar-condicionado', location: 'Copa', owner: 'Jailson', status: 'Ativo', next: '09 dez 2026', icon: 'ac_unit' },
    { name: 'Computador Dell Optiplex', code: 'COM-003', type: 'Computador', location: 'RH', owner: 'Pedro Alves', status: 'Parado', next: 'Sem data', icon: 'monitor' },
  ];

  maintenance: MaintenanceItem[] = [
    { title: 'Higienização de ar-condicionado', asset: 'Ar-condicionado #03 · AC-003', date: '07 out 2026', type: 'Preventiva', status: 'Agendada' },
    { title: 'Troca de toner e limpeza', asset: 'Impressora HP LaserJet · IMP-002', date: 'Hoje, 14:00', type: 'Corretiva', status: 'Em andamento' },
    { title: 'Teste de autonomia', asset: 'Gerador STEMAC · GER-001', date: '22 out 2026', type: 'Preventiva', status: 'Agendada' },
    { title: 'Atualização e revisão', asset: 'Notebook Dell Latitude · COM-001', date: '14 out 2026', type: 'Preventiva', status: 'Aguardando aprovação' },
  ];

  warranties: WarrantyItem[] = [
    { assetName: 'Impressora HP LaserJet', assetCode: 'IMP-002', supplier: 'PrintTech Serviços', untilDate: new Date(2026, 9, 13), coverage: 'Peças e mão de obra' },
    { assetName: 'Notebook Dell Latitude', assetCode: 'COM-001', supplier: 'Dell Brasil', untilDate: new Date(2027, 0, 22), coverage: 'Peças e mão de obra' },
    { assetName: 'Ar-condicionado #04', assetCode: 'AC-004', supplier: 'Clima Forte', untilDate: new Date(2026, 7, 8), coverage: 'Peças e mão de obra' },
    { assetName: 'Gerador STEMAC 55kVA', assetCode: 'GER-001', supplier: 'STEMAC', untilDate: new Date(2027, 2, 15), coverage: 'Peças e mão de obra' },
  ];

  suppliers: SupplierItem[] = [
    { name: 'Clima Forte Assistência', services: 'Ar-condicionado · Preventiva', contact: '(11) 99872-4410', rating: '4,9', history: '18 OS' },
    { name: 'PrintTech Serviços', services: 'Impressoras · Corretiva', contact: '(11) 3344-9080', rating: '4,7', history: '11 OS' },
    { name: 'STEMAC Energia', services: 'Geradores · Preventiva', contact: '(11) 4003-4200', rating: '4,8', history: '06 OS' },
    { name: 'Dell Brasil', services: 'Computadores · Garantia', contact: '0800 970 3355', rating: '4,6', history: '04 OS' },
  ];

  notifications: NotificationItem[] = [
    { title: 'Manutenção se aproxima', message: 'Ar-condicionado #03 precisa de manutenção em 12 dias.', date: 'Há 2 horas', icon: 'schedule', tone: 'amber', read: false },
    { title: 'Ordem de serviço atualizada', message: 'OS-0249 foi movida para Em andamento por Ana Souza.', date: 'Hoje, 09:42', icon: 'assignment', tone: 'blue', read: false },
    { title: 'Garantia vencendo', message: 'A garantia da Impressora HP vence em 18 dias.', date: 'Ontem, 15:28', icon: 'verified_user', tone: 'purple', read: true },
    { title: 'Custo adicionado', message: 'R$ 380,00 registrado na OS-0247.', date: '23 set, 16:08', icon: 'payments', tone: 'green', read: true },
  ];
  costs: CostItem[] = [
    { description: 'Higienização AC #03', category: 'Preventiva', supplier: 'Clima Forte', date: new Date(2026, 8, 23), value: 380 },
    { description: 'Troca de toner', category: 'Peças', supplier: 'PrintTech', date: new Date(2026, 8, 25), value: 240 },
    { description: 'Revisão gerador', category: 'Preventiva', supplier: 'STEMAC', date: new Date(2026, 8, 18), value: 660 },
    { description: 'Cabo de energia', category: 'Peças', supplier: 'Elétrica Santos', date: new Date(2026, 8, 10), value: 89 },
  ];

  private readonly monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  viewDate: Date = this.startOfMonth(new Date());

  subscribePro(): void {
    window.alert('Assinado com sucesso\n\nFoi debitado 1 milhão da sua conta bancária.');
  }
  constructor() {
    this.loadPersistedData();
    this.donutGradient = this.buildDonutGradient(this.assetDistributionValues());
    this.updateBrasiliaClock();
    this.brasiliaClockTimer = setInterval(() => this.updateBrasiliaClock(), 1000);
    this.route.queryParamMap.subscribe((params) => {
      const requestedUnit = params.get('unit');
      if (requestedUnit && this.units.some((unit) => unit.id === requestedUnit)) {
        this.auth.setActiveUnit(requestedUnit);
        this.activeUnitId = requestedUnit;
        if (this.section === 'visao-geral') this.playOverviewNumbers();
      }
    });
    this.route.paramMap.subscribe((params) => {
      this.section = params.get('section') || 'visao-geral';
      if (this.section === 'visao-geral') {
        this.playDonutIntro();
        this.playOverviewNumbers();
        this.playOverviewChartIntro();
      } else {
        if (this.overviewNumberFrame !== undefined) {
          cancelAnimationFrame(this.overviewNumberFrame);
          this.overviewNumberFrame = undefined;
        }
        this.stopOverviewChartIntro();
      }
    });
  }

  private buildDonutGradient(values: number[]): string {
    const total = values.reduce((sum, value) => sum + value, 0) || 1;
    let cumulative = 0;
    const stops = values.map((value, i) => {
      const from = (cumulative / total) * 100;
      cumulative += value;
      const to = (cumulative / total) * 100;
      return `${this.donutColors[i]} ${from}% ${to}%`;
    });
    return `conic-gradient(${stops.join(',')})`;
  }

  playDonutIntro(): void {
    clearInterval(this.donutTimer);
    if (this.donutFrame !== undefined) cancelAnimationFrame(this.donutFrame);

    const total = this.assets.length || 1;
    const duration = 1200;
    const start = performance.now();

    this.assetsCountDisplay = 0;
    const stepTime = Math.max(35, Math.floor(duration / total));
    this.donutTimer = setInterval(() => {
      this.assetsCountDisplay++;
      if (this.assetsCountDisplay >= total) {
        clearInterval(this.donutTimer);
        this.donutTimer = undefined;
      }
    }, stepTime);

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const settle = 1 - Math.pow(1 - t, 3);
      const liveValues = this.assetDistributionValues().map((value, i) => {
        const phase = i * (Math.PI / 2);
        const wobble = Math.sin(t * 5 * Math.PI + phase) * (1 - t) * 0.6;
        const factor = Math.max(0.04, settle + wobble);
        return value * factor;
      });
      this.donutGradient = this.buildDonutGradient(liveValues);
      if (t < 1) {
        this.donutFrame = requestAnimationFrame(step);
      } else {
        this.donutGradient = this.buildDonutGradient(this.assetDistributionValues());
        this.donutFrame = undefined;
      }
    };
    this.donutFrame = requestAnimationFrame(step);
  }

  ngOnDestroy(): void {
    clearInterval(this.donutTimer);
    if (this.donutFrame !== undefined) cancelAnimationFrame(this.donutFrame);
    if (this.brasiliaClockTimer !== undefined) clearInterval(this.brasiliaClockTimer);
    if (this.overviewNumberFrame !== undefined) cancelAnimationFrame(this.overviewNumberFrame);
    this.stopOverviewChartIntro();
  }
  private playOverviewChartIntro(): void {
    this.stopOverviewChartIntro();
    this.overviewChartPointsVisible = false;
    this.overviewChartPointsTimer = setTimeout(() => {
      this.overviewChartPointsVisible = true;
      this.overviewChartPointsTimer = undefined;
    }, 1800);
  }
  private stopOverviewChartIntro(): void {
    if (this.overviewChartPointsTimer !== undefined) {
      clearTimeout(this.overviewChartPointsTimer);
      this.overviewChartPointsTimer = undefined;
    }
    this.overviewChartPointsVisible = false;
  }
  private playOverviewNumbers(): void {
    if (this.overviewNumberFrame !== undefined) cancelAnimationFrame(this.overviewNumberFrame);
    this.overviewAssetsCount = 0;
    this.overviewPreventiveCount = 0;
    this.overviewOpenOrders = 0;
    this.overviewMonthlyCost = 0;
    this.overviewMaintenanceCost = 0;
    const targets = {
      assets: this.assets.length,
      preventive: this.preventiveUpcomingCount(),
      orders: this.openMaintenanceCount(),
      monthlyCost: this.monthlyCostTotal(),
      maintenanceCost: this.costs.reduce((sum, cost) => sum + cost.value, 0),
    };
    const duration = 1100;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      this.overviewAssetsCount = Math.round(targets.assets * eased);
      this.overviewPreventiveCount = Math.round(targets.preventive * eased);
      this.overviewOpenOrders = Math.round(targets.orders * eased);
      this.overviewMonthlyCost = Math.round(targets.monthlyCost * eased);
      this.overviewMaintenanceCost = Math.round(targets.maintenanceCost * eased);
      if (progress < 1) {
        this.overviewNumberFrame = requestAnimationFrame(step);
      } else {
        this.overviewNumberFrame = undefined;
      }
    };
    this.overviewNumberFrame = requestAnimationFrame(step);
  }
  formatOverviewCurrency(value: number): string {
    return `R$ ${value.toLocaleString('pt-BR')}`;
  }

  assetDistributionValues(): number[] {
    return this.assetTypeOptions.slice(0, 4).map((option) => this.assets.filter((asset) => asset.type === option.label).length);
  }

  assetTypeCount(label: string): number {
    return this.assets.filter((asset) => asset.type === label).length;
  }
  assetsInMaintenanceCount(): number {
    return this.assets.filter((asset) => asset.status === 'Em manutenção').length;
  }
  assetsWithoutNextDateCount(): number {
    return this.assets.filter((asset) => asset.next === 'Sem data').length;
  }

  preventiveUpcomingCount(): number {
    return this.maintenance.filter((item) => item.type === 'Preventiva' && item.status !== 'Concluída').length;
  }

  openMaintenanceCount(): number {
    return this.maintenance.filter((item) => item.status !== 'Concluída').length;
  }

  monthlyCostTotal(): number {
    const now = new Date();
    return this.costs
      .filter((cost) => cost.date.getMonth() === now.getMonth() && cost.date.getFullYear() === now.getFullYear())
      .reduce((sum, cost) => sum + cost.value, 0);
  }

  accumulatedCostTotal(): number {
    return this.costs.reduce((sum, cost) => sum + cost.value, 0);
  }

  private loadPersistedData(): void {
    const userId = this.auth.currentUser()?.id || 'anonymous';
    this.persistenceKey = `navycare_workspace_${userId}_${this.activeUnitId}`;
    const stored = localStorage.getItem(this.persistenceKey);
    if (!stored) {
      if (!this.isDemoUnit()) {
        this.assets = [];
        this.maintenance = [];
        this.warranties = [];
        this.suppliers = [];
        this.costs = [];
      }
      this.persistData();
      return;
    }
    try {
      const data = JSON.parse(stored);
      if (Array.isArray(data.assets)) this.assets = data.assets;
      if (Array.isArray(data.maintenance)) this.maintenance = data.maintenance;
      if (Array.isArray(data.warranties)) this.warranties = data.warranties.map((item: WarrantyItem) => ({ ...item, untilDate: new Date(item.untilDate) }));
      if (Array.isArray(data.suppliers)) this.suppliers = data.suppliers;
      if (Array.isArray(data.costs)) this.costs = data.costs.map((item: CostItem) => ({ ...item, date: new Date(item.date) }));
      if (Array.isArray(data.notifications)) this.notifications = data.notifications;
      if (Array.isArray(data.auditLog)) this.auditLog = data.auditLog;
    } catch {
      this.persistData();
    }
  }

  private persistData(): void {
    if (!this.persistenceKey) return;
    localStorage.setItem(this.persistenceKey, JSON.stringify({
      assets: this.assets,
      maintenance: this.maintenance,
      warranties: this.warranties,
      suppliers: this.suppliers,
      costs: this.costs,
      notifications: this.notifications,
      auditLog: this.auditLog,
    }));
  }

  private recordAction(action: string, detail: string, icon: string): void {
    this.auditLog.unshift({ action, detail, user: this.user.name, date: 'Agora', icon });
    this.persistData();
  }

  overviewCostChartPoints(): OverviewCostChartPoint[] {
    const start = new Date(2026, 4, 1).getTime();
    const end = new Date(2026, 8, 30, 23, 59, 59).getTime();
    const xAnchors = [0, 192, 280, 372, 470, 560, 700];
    const yAnchors = [124, 105, 90, 74, 58, 45, 18];

    const visibleCosts = [...this.costs]
      .filter((cost) => cost.date.getTime() >= start && cost.date.getTime() <= end)
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return visibleCosts
      .map((cost, index) => {
        const x = visibleCosts.length === 1 ? 350 : 90 + (index * 520) / (visibleCosts.length - 1);
        let segment = 0;
        while (segment < xAnchors.length - 2 && x > xAnchors[segment + 1]) segment++;
        const segmentProgress = (x - xAnchors[segment]) / (xAnchors[segment + 1] - xAnchors[segment]);
        const y = yAnchors[segment] + (yAnchors[segment + 1] - yAnchors[segment]) * segmentProgress;
        return {
          x,
          y: Math.max(18, y),
          value: cost.value,
          dateLabel: `${cost.date.getDate()} ${this.monthAbbr[cost.date.getMonth()]}`,
          animationIndex: index,
        };
      });
  }
  formatChartCurrency(value: number): string {
    return `R$ ${value.toLocaleString('pt-BR')}`;
  }
  private updateBrasiliaClock(): void {
    const now = new Date();
    this.currentBrasiliaTime = new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(now);
    this.currentBrasiliaDate = new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(now);
  }

  go(section: string): void {
    this.router.navigate(['/app', section]);
    this.mobileOpen = false;
  }

  @HostListener('document:keydown', ['$event'])
  handleGlobalSearchShortcut(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.globalSearchOpen = true;
      document.getElementById('global-search')?.focus();
    }
    if (event.key === 'Escape' && this.globalSearchOpen) {
      this.closeGlobalSearch();
    }
  }

  globalSearchResults(): GlobalSearchResult[] {
    const term = this.globalSearchQuery.trim().toLocaleLowerCase('pt-BR');
    if (!term) return [];
    const results: GlobalSearchResult[] = [];
    const matches = (value: string): boolean => value.toLocaleLowerCase('pt-BR').includes(term);
    this.assets.forEach((asset) => {
      if (matches(`${asset.name} ${asset.code} ${asset.type} ${asset.location} ${asset.owner}`)) {
        results.push({ title: asset.name, subtitle: `${asset.code} · ${asset.location}`, icon: asset.icon, section: 'patrimonio', kind: 'Ativo' });
      }
    });
    this.maintenance.forEach((item) => {
      if (matches(`${item.title} ${item.asset} ${item.type} ${item.status}`)) {
        results.push({ title: item.title, subtitle: `${item.asset} · ${item.date}`, icon: 'build', section: 'manutencao', kind: 'Manutenção' });
      }
    });
    this.warranties.forEach((item) => {
      if (matches(`${item.assetName} ${item.assetCode} ${item.supplier} ${item.coverage}`)) {
        results.push({ title: item.assetName, subtitle: `${item.assetCode} · ${item.supplier}`, icon: 'verified_user', section: 'garantias', kind: 'Garantia' });
      }
    });
    this.suppliers.forEach((item) => {
      if (matches(`${item.name} ${item.services} ${item.contact}`)) {
        results.push({ title: item.name, subtitle: `${item.services} · ${item.contact}`, icon: 'groups', section: 'fornecedores', kind: 'Fornecedor' });
      }
    });
    this.costs.forEach((item) => {
      if (matches(`${item.description} ${item.category} ${item.supplier}`)) {
        results.push({ title: item.description, subtitle: `${item.supplier} · ${this.formatOverviewCurrency(item.value)}`, icon: 'payments', section: 'custos', kind: 'Custo' });
      }
    });
    this.notifications.forEach((item) => {
      if (matches(`${item.title} ${item.message}`)) {
        results.push({ title: item.title, subtitle: item.message, icon: item.icon, section: 'notificacoes', kind: 'Notificação' });
      }
    });
    return results.slice(0, 8);
  }

  openGlobalSearch(): void {
    this.globalSearchOpen = true;
  }

  closeGlobalSearch(): void {
    this.globalSearchOpen = false;
  }

  selectGlobalSearchResult(result: GlobalSearchResult): void {
    this.globalSearchQuery = result.title;
    this.closeGlobalSearch();
    this.go(result.section);
  }

  submitGlobalSearch(): void {
    const firstResult = this.globalSearchResults()[0];
    if (firstResult) this.selectGlobalSearchResult(firstResult);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  toggleUnitMenu(): void {
    this.unitMenuOpen = !this.unitMenuOpen;
    this.userMenuOpen = false;
  }

  activeUnit(): UnitProfile | null {
    return this.units.find((unit) => unit.id === this.activeUnitId) || null;
  }

  isDemoUnit(): boolean {
    return this.activeUnitId === 'unit_main';
  }

  selectUnit(unit: UnitProfile): void {
    this.auth.setActiveUnit(unit.id);
    this.activeUnitId = unit.id;
    this.loadPersistedData();
    this.playOverviewNumbers();
    this.playDonutIntro();
    this.unitMenuOpen = false;
    this.router.navigate(['/app/visao-geral'], { queryParams: { unit: unit.id } });
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
    this.unitMenuOpen = false;
  }

  closeMenus(): void {
    this.unitMenuOpen = false;
    this.userMenuOpen = false;
  }

  addUnit(): void {
    this.closeMenus();
    this.router.navigate(['/onboarding'], { queryParams: { newUnit: '1' } });
  }

  openSettings(): void {
    this.closeMenus();
    this.go('configuracoes');
  }

  filteredAssets(): Asset[] {
    const query = this.query.trim().toLowerCase();
    return this.assets.filter((asset) => {
      const matchesQuery = !query || `${asset.name} ${asset.code} ${asset.type} ${asset.location} ${asset.owner}`.toLowerCase().includes(query);
      const matchesType = this.assetTypeFilter === 'Todos os tipos' || asset.type === this.assetTypeFilter;
      const matchesStatus = this.assetStatusFilter === 'Todos os status' || asset.status === this.assetStatusFilter;
      return matchesQuery && matchesType && matchesStatus;
    });
  }
  filteredMaintenance(): MaintenanceItem[] {
    return this.maintenance.filter((item) => this.maintenanceTypeFilter === 'Todas' || item.type === this.maintenanceTypeFilter);
  }
  filteredWarranties(): WarrantyItem[] {
    return this.warranties.filter((warranty) => this.warrantyFilter === 'Todas' || this.warrantyStatus(warranty).label.startsWith(this.warrantyFilter));
  }
  filteredCosts(): CostItem[] {
    const query = this.costQuery.trim().toLowerCase();
    return this.costs.filter((cost) => {
      const matchesQuery = !query || `${cost.description} ${cost.category} ${cost.supplier}`.toLowerCase().includes(query);
      const matchesPeriod = this.costPeriodFilter === 'Todos os períodos' || (cost.date.getFullYear() === 2026 && cost.date.getMonth() === 8);
      const matchesCategory = this.costCategoryFilter === 'Todas as categorias' || cost.category === this.costCategoryFilter;
      return matchesQuery && matchesPeriod && matchesCategory;
    });
  }
  deleteAsset(asset: Asset): void {
    if (!window.confirm(`Tem certeza que deseja excluir o ativo "${asset.name}"?`)) return;
    this.assets = this.assets.filter((item) => item !== asset);
    this.maintenance = this.maintenance.filter((item) => !item.asset.includes(asset.code));
    this.warranties = this.warranties.filter((item) => item.assetCode !== asset.code);
    this.recordAction('Ativo excluído', `${asset.name} (${asset.code}) foi removido do patrimônio.`, 'delete');
  }

  deleteMaintenance(item: MaintenanceItem): void {
    if (!window.confirm(`Tem certeza que deseja excluir a ordem "${item.title}"?`)) return;
    this.maintenance = this.maintenance.filter((entry) => entry !== item);
    this.recordAction('Ordem de serviço excluída', `${item.title} foi removida da manutenção.`, 'delete');
  }

  deleteWarranty(item: WarrantyItem): void {
    if (!window.confirm(`Tem certeza que deseja excluir a garantia de "${item.assetName}"?`)) return;
    this.warranties = this.warranties.filter((entry) => entry !== item);
    this.recordAction('Garantia excluída', `A garantia de ${item.assetName} foi removida.`, 'delete');
  }

  deleteCost(item: CostItem): void {
    if (!window.confirm(`Tem certeza que deseja excluir o custo "${item.description}"?`)) return;
    this.costs = this.costs.filter((entry) => entry !== item);
    this.recordAction('Custo excluído', `${item.description} foi removido dos lançamentos.`, 'delete');
  }

  filteredNotifications(): NotificationItem[] {
    return this.notifications.filter((item) => this.notificationFilter === 'Todas' || !item.read);
  }
  unreadNotificationsCount(): number {
    return this.notifications.filter((item) => !item.read).length;
  }
  markAllNotificationsAsRead(): void {
    this.notifications = this.notifications.map((item) => ({ ...item, read: true }));
    this.notificationFilter = 'Todas';
  }

  goSettingsTab(tab: SettingsTab): void {
    this.settingsTab = tab;
  }

  saveCompanySettings(): void {
    this.auditLog.unshift({
      action: 'Configurações da empresa alteradas',
      detail: `Dados da empresa "${this.companySettings.name}" foram atualizados.`,
      user: this.user.name,
      date: 'Agora',
      icon: 'settings',
    });
    this.companySettingsSaved = true;
    setTimeout(() => (this.companySettingsSaved = false), 2500);
  }

  startEditUnit(unit: UnitProfile): void {
    this.editingUnitId = unit.id;
    this.unitEditForm = {
      name: unit.name,
      address: unit.address,
      responsible: unit.responsible,
      segment: unit.segment,
    };
  }

  cancelUnitEdit(): void {
    this.editingUnitId = null;
  }

  saveUnitEdit(): void {
    if (!this.editingUnitId) return;
    this.auth.updateUnit(this.editingUnitId, { ...this.unitEditForm });
    this.units = this.auth.units();
    this.auditLog.unshift({
      action: 'Sede atualizada',
      detail: `Dados da sede "${this.unitEditForm.name}" foram atualizados.`,
      user: this.user.name,
      date: 'Agora',
      icon: 'location_on',
    });
    this.editingUnitId = null;
  }

  removeUnitFromSettings(unit: UnitProfile): void {
    if (this.units.length <= 1) return;
    if (!window.confirm(`Remover a sede "${unit.name}"? Esta ação não pode ser desfeita.`)) return;
    this.auth.removeUnit(unit.id);
    this.units = this.auth.units();
    this.activeUnitId = this.auth.activeUnit()?.id || this.units[0]?.id || '';
    if (this.editingUnitId === unit.id) this.editingUnitId = null;
  }

  canAddCategory(): boolean {
    return !!this.newCategory.label.trim() && !!this.newCategory.prefix.trim();
  }

  addCategory(): void {
    if (!this.canAddCategory()) return;
    this.assetTypeOptions.push({
      label: this.newCategory.label.trim(),
      icon: this.newCategory.icon || 'category',
      prefix: this.newCategory.prefix.trim().toUpperCase().slice(0, 4),
    });
    this.newCategory = { label: '', icon: 'category', prefix: '' };
  }

  removeCategory(category: AssetTypeOption): void {
    if (this.assetTypeOptions.length <= 1) return;
    this.assetTypeOptions = this.assetTypeOptions.filter((option) => option !== category);
  }

  canInviteTeamUser(): boolean {
    return !!this.newTeamUser.name.trim() && !!this.newTeamUser.email.trim();
  }

  inviteTeamUser(): void {
    if (!this.canInviteTeamUser()) return;
    this.teamUsers.push({
      name: this.newTeamUser.name.trim(),
      email: this.newTeamUser.email.trim(),
      role: this.newTeamUser.role,
      status: 'Convite pendente',
    });
    this.auditLog.unshift({
      action: 'Usuário convidado',
      detail: `Convite enviado para ${this.newTeamUser.name.trim()} com função ${this.newTeamUser.role}.`,
      user: this.user.name,
      date: 'Agora',
      icon: 'person_add',
    });
    this.newTeamUser = { name: '', email: '', role: 'Operador' };
  }

  removeTeamUser(member: TeamUser): void {
    if (member.email === this.currentUserEmail) return;
    this.teamUsers = this.teamUsers.filter((item) => item !== member);
  }

  saveNotificationPreferences(): void {
    this.notificationPreferencesSaved = true;
    setTimeout(() => (this.notificationPreferencesSaved = false), 2500);
  }

  openDrawer(value: string): void {
    this.drawer = value;
  }

  closeDrawer(): void {
    this.drawer = '';
  }

  private emptyNewAsset(): NewAssetForm {
    return { name: '', type: '', location: '', owner: '', status: 'Ativo', lastMaintenance: '', period: '3' };
  }

  openNewAsset(): void {
    this.newAsset = this.emptyNewAsset();
    this.drawer = 'Novo ativo';
  }

  private selectedTypeOption(): AssetTypeOption | undefined {
    return this.assetTypeOptions.find((option) => option.label === this.newAsset.type);
  }

  newAssetIcon(): string {
    return this.selectedTypeOption()?.icon || 'inventory_2';
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    return `${day} ${this.monthAbbr[date.getMonth()]} ${date.getFullYear()}`;
  }

  newAssetNextDate(): string {
    if (!this.newAsset.lastMaintenance) return '';
    const base = new Date(`${this.newAsset.lastMaintenance}T00:00:00`);
    if (isNaN(base.getTime())) return '';
    const next = new Date(base);
    next.setMonth(next.getMonth() + (Number(this.newAsset.period) || 3));
    return this.formatDate(next);
  }

  canSaveNewAsset(): boolean {
    return !!this.newAsset.type && !!this.newAsset.location.trim();
  }

  saveNewAsset(): void {
    if (!this.canSaveNewAsset()) return;
    const option = this.selectedTypeOption();
    const prefix = option?.prefix || 'OUT';
    const countSameType = this.assets.filter((asset) => asset.type === this.newAsset.type).length;
    const code = `${prefix}-${String(countSameType + 1).padStart(3, '0')}`;
    const next = this.newAsset.lastMaintenance ? this.newAssetNextDate() : 'Sem data';

    this.assets.unshift({
      name: this.newAsset.name.trim() || `${this.newAsset.type} ${code}`,
      code,
      type: this.newAsset.type,
      location: this.newAsset.location.trim(),
      owner: this.newAsset.owner.trim() || 'Sem responsável',
      status: this.newAsset.status,
      next,
      icon: option?.icon || 'category',
    });

    this.recordAction('Ativo cadastrado', `${this.assets[0].name} (${code}) foi adicionado ao patrimônio.`, 'inventory_2');
    this.closeDrawer();
  }

  private emptyNewMaintenance(): NewMaintenanceForm {
    return { assetKey: '', title: '', type: 'Preventiva', date: '', status: 'Agendada' };
  }

  openNewMaintenance(): void {
    this.newMaintenance = this.emptyNewMaintenance();
    this.drawer = 'Abrir ordem de serviço';
  }

  selectedMaintenanceAsset(): Asset | undefined {
    return this.assets.find((asset) => asset.code === this.newMaintenance.assetKey);
  }

  canSaveMaintenance(): boolean {
    return !!this.newMaintenance.assetKey && !!this.newMaintenance.title.trim() && !!this.newMaintenance.date;
  }

  saveMaintenance(): void {
    if (!this.canSaveMaintenance()) return;
    const asset = this.selectedMaintenanceAsset();
    if (!asset) return;

    const dateObj = new Date(`${this.newMaintenance.date}T00:00:00`);
    const formattedDate = isNaN(dateObj.getTime()) ? this.newMaintenance.date : this.formatDate(dateObj);

    this.maintenance.unshift({
      title: this.newMaintenance.title.trim(),
      asset: `${asset.name} · ${asset.code}`,
      date: formattedDate,
      type: this.newMaintenance.type,
      status: this.newMaintenance.status,
    });

    this.recordAction('Ordem de serviço criada', `${this.newMaintenance.title.trim()} foi cadastrada para ${asset.name}.`, 'assignment');
    this.closeDrawer();
  }

  private emptyNewWarranty(): NewWarrantyForm {
    return { assetKey: '', supplier: '', purchaseDate: '', period: '12', coverage: '' };
  }

  openNewWarranty(): void {
    this.newWarranty = this.emptyNewWarranty();
    this.drawer = 'Cadastrar garantia';
  }

  selectedWarrantyAsset(): Asset | undefined {
    return this.assets.find((asset) => asset.code === this.newWarranty.assetKey);
  }

  canSaveWarranty(): boolean {
    return (
      !!this.newWarranty.assetKey &&
      !!this.newWarranty.purchaseDate &&
      !!this.newWarranty.period &&
      !!this.newWarranty.coverage.trim()
    );
  }

  private computeWarrantyUntilDate(purchaseDate: string, periodMonths: string): Date | null {
    if (!purchaseDate) return null;
    const base = new Date(`${purchaseDate}T00:00:00`);
    if (isNaN(base.getTime())) return null;
    const until = new Date(base);
    until.setMonth(until.getMonth() + (Number(periodMonths) || 0));
    return until;
  }

  newWarrantyUntilDate(): Date | null {
    return this.computeWarrantyUntilDate(this.newWarranty.purchaseDate, this.newWarranty.period);
  }

  warrantyStatus(warranty: WarrantyItem): WarrantyStatus {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const until = new Date(warranty.untilDate);
    until.setHours(0, 0, 0, 0);
    const diffDays = Math.round((until.getTime() - today.getTime()) / 86400000);

    if (diffDays < 0) return { label: 'Vencida', tone: 'red' };
    if (diffDays <= 30) return { label: `Vencendo em ${diffDays} dias`, tone: 'amber' };
    return { label: 'Ativa', tone: 'green' };
  }

  warrantiesActiveCount(): number {
    return this.warranties.filter((w) => this.warrantyStatus(w).tone === 'green').length;
  }

  warrantiesExpiringCount(): number {
    return this.warranties.filter((w) => this.warrantyStatus(w).tone === 'amber').length;
  }

  warrantiesExpiredCount(): number {
    return this.warranties.filter((w) => this.warrantyStatus(w).tone === 'red').length;
  }

  saveWarranty(): void {
    if (!this.canSaveWarranty()) return;
    const asset = this.selectedWarrantyAsset();
    if (!asset) return;
    const until = this.newWarrantyUntilDate();
    if (!until) return;

    this.warranties.unshift({
      assetName: asset.name,
      assetCode: asset.code,
      supplier: this.newWarranty.supplier.trim() || 'Sem fornecedor',
      untilDate: until,
      coverage: this.newWarranty.coverage.trim(),
    });

    this.recordAction('Garantia cadastrada', `Garantia de ${asset.name} registrada até ${this.formatDate(until)}.`, 'verified_user');
    this.closeDrawer();
  }

  private emptyNewSupplier(): NewSupplierForm {
    return { name: '', services: '', contact: '' };
  }

  openNewSupplier(): void {
    this.newSupplier = this.emptyNewSupplier();
    this.newSupplierRating = null;
    this.fetchingSupplierRating = false;
    this.drawer = 'Novo fornecedor';
  }

  canFetchSupplierRating(): boolean {
    return !!this.newSupplier.name.trim() && !this.fetchingSupplierRating;
  }

  fetchSupplierRating(): void {
    if (!this.canFetchSupplierRating()) return;
    this.fetchingSupplierRating = true;
    this.newSupplierRating = null;
    setTimeout(() => {
      const value = 4 + Math.random() * 1;
      this.newSupplierRating = value.toFixed(1).replace('.', ',');
      this.fetchingSupplierRating = false;
    }, 900);
  }

  canSaveSupplier(): boolean {
    return (
      !!this.newSupplier.name.trim() &&
      !!this.newSupplier.services.trim() &&
      !!this.newSupplier.contact.trim() &&
      !!this.newSupplierRating
    );
  }

  saveSupplier(): void {
    if (!this.canSaveSupplier() || !this.newSupplierRating) return;

    this.suppliers.unshift({
      name: this.newSupplier.name.trim(),
      services: this.newSupplier.services.trim(),
      contact: this.newSupplier.contact.trim(),
      rating: this.newSupplierRating,
      history: '00 OS',
    });

    this.recordAction('Fornecedor cadastrado', `${this.newSupplier.name.trim()} foi adicionado à operação.`, 'groups');
    this.closeDrawer();
  }

  private emptyNewCost(): NewCostForm {
    return { description: '', category: 'Preventiva', supplier: '', date: '', value: '' };
  }

  openNewCost(): void {
    this.newCost = this.emptyNewCost();
    this.drawer = 'Adicionar custo';
  }

  canSaveCost(): boolean {
    return (
      !!this.newCost.description.trim() &&
      !!this.newCost.supplier.trim() &&
      !!this.newCost.date &&
      Number(this.newCost.value) > 0
    );
  }

  formatCurrency(value: number): string {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  saveCost(): void {
    if (!this.canSaveCost()) return;
    const dateObj = new Date(`${this.newCost.date}T00:00:00`);
    if (isNaN(dateObj.getTime())) return;

    this.costs.unshift({
      description: this.newCost.description.trim(),
      category: this.newCost.category,
      supplier: this.newCost.supplier.trim(),
      date: dateObj,
      value: Number(this.newCost.value),
    });

    this.recordAction('Custo lançado', `${this.formatCurrency(Number(this.newCost.value))} registrado em ${this.newCost.description.trim()}.`, 'payments');
    this.closeDrawer();
  }

  private startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  calendarMonthLabel(): string {
    return `${this.monthNames[this.viewDate.getMonth()]} ${this.viewDate.getFullYear()}`;
  }

  prevMonth(): void {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() - 1, 1);
  }

  nextMonth(): void {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1);
  }

  goToCurrentMonth(): void {
    this.viewDate = this.startOfMonth(new Date());
  }

  private parseDisplayDate(text: string): Date | null {
    if (!text) return null;
    if (text.toLowerCase().startsWith('hoje')) {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }
    const match = text.match(/(\d{1,2})\s+([a-zç]{3})\s+(\d{4})/i);
    if (!match) return null;
    const monthIndex = this.monthAbbr.indexOf(match[2].toLowerCase());
    if (monthIndex === -1) return null;
    return new Date(Number(match[3]), monthIndex, Number(match[1]));
  }

  private calendarEvents(): CalendarEvent[] {
    const events: CalendarEvent[] = [];

    for (const asset of this.assets) {
      const date = this.parseDisplayDate(asset.next);
      if (date) events.push({ date, label: asset.name, tone: asset.status === 'Em manutenção' ? 'amber' : 'blue' });
    }

    for (const item of this.maintenance) {
      const date = this.parseDisplayDate(item.date);
      if (date) events.push({ date, label: item.title, tone: item.type === 'Corretiva' ? 'amber' : 'green' });
    }

    return events;
  }

  calendarCells(): CalendarCell[] {
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const events = this.calendarEvents();
    const today = new Date();

    const buildCell = (date: Date, muted: boolean): CalendarCell => ({
      date,
      day: date.getDate(),
      muted,
      isToday: !muted && date.toDateString() === today.toDateString(),
      events: events.filter((event) => event.date.toDateString() === date.toDateString()),
    });

    const cells: CalendarCell[] = [];

    for (let i = firstWeekday - 1; i >= 0; i--) {
      cells.push(buildCell(new Date(year, month - 1, daysInPrevMonth - i), true));
    }
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push(buildCell(new Date(year, month, day), false));
    }
    const remainder = cells.length % 7;
    if (remainder !== 0) {
      for (let day = 1; day <= 7 - remainder; day++) {
        cells.push(buildCell(new Date(year, month + 1, day), true));
      }
    }

    return cells;
  }
}
