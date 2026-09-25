import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CATALOG, Shoe } from '../../data/catalog';
import { brl, fitLabel } from '../../data/engine';
import { ShoeArtComponent } from '../recommendation/shoe-art.component';
import { ShellService } from '../../services/shell.service';

type Mode = 'compare'|'wardrobe'|'size'|'radar'|'durability';

@Component({selector:'senso-insight',standalone:true,imports:[CommonModule,FormsModule,RouterLink,ShoeArtComponent],templateUrl:'./insight.component.html',styleUrl:'./insight.component.css'})
export class InsightComponent {
  readonly catalog = CATALOG;
  readonly route = inject(ActivatedRoute);
  readonly shell = inject(ShellService);
  readonly mode = this.route.snapshot.data['mode'] as Mode;
  readonly brl = brl;
  selectedA: Shoe = CATALOG[0];
  selectedB: Shoe = CATALOG[1];
  target: Shoe = CATALOG[0];
  alertPrice = 520;
  alertSaved = false;
  size = 42;
  foot = 'normal';
  alertItems: {shoe:Shoe; target:number}[] = [];
  markerX: number|null = null;
  hoverX: number|null = null;
  dragging = false;
  readonly recommended = [CATALOG.find(s=>s.id==='new-balance-2002r')!, CATALOG.find(s=>s.id==='timberland-6-inch')!, CATALOG.find(s=>s.id==='new-balance-9060')!];

  constructor(){ this.loadAlerts(); }
  get title(){return ({compare:'Compare antes de escolher',wardrobe:'O que já é seu — e o que falta.',size:'Seu tamanho, sem tentativa e erro.',radar:'O preço muda. A gente acompanha.',durability:'Quanto tempo esse calçado fica com você.'} as Record<Mode,string>)[this.mode];}
  get kicker(){return ({compare:'DECISÃO INTELIGENTE',wardrobe:'CURADORIA PESSOAL',size:'GUIA DE FIT',radar:'RADAR E ALERTAS DE PREÇO',durability:'CUSTO DE USO'} as Record<Mode,string>)[this.mode];}
  get description(){return ({compare:'Coloque dois modelos lado a lado e veja o que realmente muda: conforto, durabilidade, preço e caimento.',wardrobe:'Uma seleção enxuta para acompanhar sua rotina. As três recomendações abaixo completam os espaços do seu armário.',size:'Use seu número de referência, conte como seu pé se comporta e receba uma indicação ajustada ao formato.',radar:'Veja se o preço atual está perto do menor valor e marque um ponto na linha de tendência para ser avisado quando o calçado chegar a esse preço.',durability:'Uma leitura prática baseada em materiais, construção, uso previsto e custo por utilização.'} as Record<Mode,string>)[this.mode];}
  get currentDrop(){return Math.round(((this.target.average-this.target.price)/this.target.average)*100);}
  get maxHistory(){return Math.max(...this.target.history);}
  private occasionLabel(o:string){return ({dia:'Dia a dia',trabalho:'Trabalho',festa:'Festa',esporte:'Esporte'} as Record<string,string>)[o] ?? o;}
  private bestStoreLabel(shoe:Shoe){const best=shoe.stores.reduce((a,b)=>a.price<=b.price?a:b);return `${best.name} · ${this.brl(best.price)}`;}
  get comparisonRows(){return [
    {label:'Marca',a:this.selectedA.brand,b:this.selectedB.brand},
    {label:'Preço atual',a:this.brl(this.selectedA.price),b:this.brl(this.selectedB.price)},
    {label:'Menor preço já visto',a:this.brl(this.selectedA.lowest),b:this.brl(this.selectedB.lowest)},
    {label:'Melhor loja',a:this.bestStoreLabel(this.selectedA),b:this.bestStoreLabel(this.selectedB)},
    {label:'Conforto',a:`${this.selectedA.comfort}/10`,b:`${this.selectedB.comfort}/10`},
    {label:'Durabilidade',a:`${this.selectedA.durability}/10`,b:`${this.selectedB.durability}/10`},
    {label:'Formato',a:this.selectedA.form,b:this.selectedB.form},
    {label:'Ajuste',a:this.fitLabel(this.selectedA),b:this.fitLabel(this.selectedB)},
    {label:'Uso ideal',a:this.selectedA.use,b:this.selectedB.use},
    {label:'Ocasiões',a:this.selectedA.occasions.map(o=>this.occasionLabel(o)).join(', '),b:this.selectedB.occasions.map(o=>this.occasionLabel(o)).join(', ')},
    {label:'Não indicado para',a:this.selectedA.notFor,b:this.selectedB.notFor}
  ];}
  sizeResult(shoe:Shoe){const adjust=this.foot==='largo'?1:this.foot==='fino'?-0.5:0;return this.size+shoe.fit+adjust;}
  setAlert(){this.alertItems=[...this.alertItems.filter(a=>a.shoe.id!==this.target.id),{shoe:this.target,target:this.alertPrice}];this.persistAlerts();this.alertSaved=true;this.shell.toast('Alerta criado. Vamos acompanhar esse preço para você.');}
  removeAlert(id:string){this.alertItems=this.alertItems.filter(a=>a.shoe.id!==id);this.persistAlerts();}
  private lo(shoe:Shoe){return Math.min(...shoe.history,shoe.lowest);}
  private hi(shoe:Shoe){return Math.max(...shoe.history);}
  yOf(price:number,shoe:Shoe=this.target){const lo=this.lo(shoe),span=Math.max(1,this.hi(shoe)-lo);const v=Math.min(Math.max(price,lo),this.hi(shoe));return 46-((v-lo)/span)*38;}
  spark(shoe:Shoe){return shoe.history.map((v,i)=>`${(i/(shoe.history.length-1))*100},${this.yOf(v,shoe)}`).join(' ');}
  priceAt(pct:number){const h=this.target.history,f=Math.min(Math.max(pct,0),100)/100*(h.length-1),i=Math.min(Math.floor(f),h.length-2);return h[i]+(h[i+1]-h[i])*(f-i);}
  monthLabel(pct:number){const h=this.target.history,ago=h.length-1-Math.round(Math.min(Math.max(pct,0),100)/100*(h.length-1));return ago===0?'hoje':ago===1?'há 1 mês':`há ${ago} meses`;}
  private pctFrom(ev:PointerEvent){const r=(ev.currentTarget as HTMLElement).getBoundingClientRect();return Math.min(100,Math.max(0,((ev.clientX-r.left)/r.width)*100));}
  chartDown(ev:PointerEvent){this.dragging=true;(ev.currentTarget as HTMLElement).setPointerCapture?.(ev.pointerId);this.placeMarker(this.pctFrom(ev));}
  chartMove(ev:PointerEvent){const pct=this.pctFrom(ev);if(this.dragging){this.placeMarker(pct);}else{this.hoverX=pct;}}
  chartUp(){this.dragging=false;}
  chartLeave(){this.hoverX=null;}
  placeMarker(pct:number){this.markerX=pct;this.alertPrice=Math.round(this.priceAt(pct)*100)/100;this.alertSaved=false;}
  editPrice(value:number){this.alertPrice=value;this.alertSaved=false;}
  pickTarget(shoe:Shoe){this.target=shoe;this.markerX=null;this.hoverX=null;this.alertPrice=Math.floor(shoe.lowest);this.alertSaved=false;}
  private loadAlerts(){try{this.alertItems=JSON.parse(localStorage.getItem('cactour.alerts')||'[]');}catch{this.alertItems=[];}}
  private persistAlerts(){localStorage.setItem('cactour.alerts',JSON.stringify(this.alertItems));}
  saveWardrobe(shoe:Shoe){this.shell.toast(`${shoe.name} guardado no seu guarda-roupa.`);}
  fitLabel=fitLabel;
}
