export type Occasion = 'dia' | 'trabalho' | 'festa' | 'esporte';
export type ShoeKind = 'tenis' | 'bota' | 'sapato';
export type Gender = 'feminino' | 'unissex';

export interface Shoe {
  id: string;
  brand: string;
  name: string;
  colorway: string;
  kind: ShoeKind;

  gender?: Gender;

  volume: number;

  boldness: number;
  styles: string[];
  palette: 'neutras' | 'terrosas' | 'vibrantes';
  occasions: Occasion[];
  price: number;
  lowest: number;
  average: number;
  history: number[];
  comfort: number;
  durability: number;
  form: string;
  use: string;
  notFor: string;

  fit: number;
  colors: { upper: string; sole: string; accent: string };
  photo?: string;

  photos?: string[];
  stores: { name: string; price: number }[];
}

export const OCCASIONS: { id: Occasion; label: string }[] = [
  { id: 'dia', label: 'Dia a dia' },
  { id: 'trabalho', label: 'Trabalho' },
  { id: 'festa', label: 'Festa' },
  { id: 'esporte', label: 'Esporte' }
];

export const PALETTES: { id: Shoe['palette']; label: string }[] = [
  { id: 'neutras', label: 'Neutras' },
  { id: 'terrosas', label: 'Terrosas' },
  { id: 'vibrantes', label: 'Vibrantes' }
];

export const EDIT_OPTIONS: Record<string, { id: string; title: string; desc: string; img: string }[]> = {
  estilo: [
    { id: 'streetwear', title: 'Streetwear', desc: 'Peças amplas, neutras e com presença.', img: 'assets/icone_streetwear.png' },
    { id: 'casual', title: 'Casual', desc: 'Conforto no dia a dia, sem exageros.', img: 'assets/icone_casual.png' },
    { id: 'formal', title: 'Formal', desc: 'Alfaiataria e caimento mais estruturado.', img: 'assets/icone_formal.png' },
    { id: 'sport', title: 'Sport', desc: 'Performance e conforto para o movimento.', img: 'assets/icone_sport.png' },
    { id: 'custom', title: 'Custom', desc: 'Uma mistura sob medida de várias referências.', img: 'assets/icone_custom.png' }
  ],
  camisetas: [
    { id: 'oversized', title: 'Oversized', desc: 'Caimento solto, ombro caído.', img: 'assets/senso-wardrobe.jpg' },
    { id: 'regular', title: 'Regular', desc: 'Caimento equilibrado, clássico.', img: 'assets/senso-wardrobe.jpg' },
    { id: 'slim', title: 'Slim', desc: 'Caimento justo ao corpo.', img: 'assets/senso-wardrobe.jpg' }
  ],
  calcas: [
    { id: 'wide-leg', title: 'Wide leg', desc: 'Presença ampla e confortável.', img: 'assets/senso-wardrobe.jpg' },
    { id: 'regular-pants', title: 'Regular', desc: 'Caimento reto, equilibrado.', img: 'assets/senso-wardrobe.jpg' },
    { id: 'skinny', title: 'Skinny', desc: 'Caimento justo do quadril ao tornozelo.', img: 'assets/senso-wardrobe.jpg' },
    { id: 'cargo', title: 'Cargo', desc: 'Bolsos utilitários, presença técnica.', img: 'assets/senso-wardrobe.jpg' }
  ]
};

const stores = (p: number) => [
  { name: 'Passo Certo', price: p },
  { name: 'Urban Sola', price: Math.round(p * 1.04 * 10) / 10 },
  { name: 'Mercado do Tênis', price: Math.round(p * 1.09 * 10) / 10 }
];

export const CATALOG: Shoe[] = [
  // Antigo "Nexus 02" -> New Balance 2002R
  {
    id: 'new-balance-2002r', brand: 'New Balance', name: '2002R', colorway: 'Cinza/Verde-limão', kind: 'tenis',
    volume: 9, boldness: 6, styles: ['streetwear', 'casual'], palette: 'neutras', occasions: ['dia', 'festa'],
    price: 649.9, lowest: 599.9, average: 789.9,
    history: [820, 810, 790, 800, 780, 770, 760, 720, 700, 690, 660, 649.9],
    comfort: 9.1, durability: 8.6, form: 'Ampla', use: 'Diário',
    notFor: 'corridas longas ou ambientes formais.', fit: 0.5,
    colors: { upper: '#8d9188', sole: '#e8e5dc', accent: '#c8ff2f' },
    photos: [
      'assets/shoes/NewBalance2002R_1.jpeg',
      'assets/shoes/NewBalance2002R_2.jpeg',
      'assets/shoes/NewBalance2002R_3.jpeg'
    ],
    stores: stores(649.9)
  },

  // Antigo "Onda Chunky" -> New Balance 530
  {
    id: 'new-balance-530', brand: 'New Balance', name: '530', colorway: 'Branco', kind: 'tenis',
    volume: 10, boldness: 9, styles: ['streetwear', 'custom'], palette: 'neutras', occasions: ['dia', 'festa'],
    price: 759.9, lowest: 699.9, average: 799.9,
    history: [800, 800, 790, 810, 799, 780, 770, 769, 765, 760, 759.9, 759.9],
    comfort: 8.4, durability: 7.9, form: 'Ampla', use: 'Casual e festa',
    notFor: 'quem prefere um visual discreto ou pisa em terrenos molhados.', fit: 0,
    colors: { upper: '#f1efe8', sole: '#d9d5c8', accent: '#111411' },
    photos: [
      'assets/shoes/NewBalance530_1.jpeg',
      'assets/shoes/NewBalance530_2.jpeg',
      'assets/shoes/NewBalance530_3.jpeg'
    ],
    stores: stores(759.9)
  },

  // Antigo "Vortex Runner" -> Nike Air Max Plus (TN)
  {
    id: 'nike-air-max-plus', brand: 'Nike', name: 'Air Max Plus (TN)', colorway: 'Grafite', kind: 'tenis',
    volume: 8, boldness: 8, styles: ['sport', 'streetwear'], palette: 'vibrantes', occasions: ['esporte', 'dia'],
    price: 899.9, lowest: 799.9, average: 869.9,
    history: [860, 870, 880, 869, 850, 860, 875, 885, 890, 895, 899.9, 899.9],
    comfort: 9.3, durability: 8.2, form: 'Média', use: 'Treino e casual',
    notFor: 'ocasiões formais e quem busca o menor preço.', fit: -0.5,
    colors: { upper: '#3a3f39', sole: '#c8ff2f', accent: '#f0ede6' },
    photos: [
      'assets/shoes/NikeAirMaxPlus_1.jpeg',
      'assets/shoes/NikeAirMaxPlus_2.jpeg',
      'assets/shoes/NikeAirMaxPlus_3.jpeg'
    ],
    stores: stores(899.9)
  },

  // Antigo "Terra Cargo" -> Timberland 6-Inch Premium Boot
  {
    id: 'timberland-6-inch', brand: 'Timberland', name: '6-Inch Premium Boot', colorway: 'Preto', kind: 'bota',
    volume: 8, boldness: 5, styles: ['streetwear', 'casual'], palette: 'neutras', occasions: ['dia', 'festa'],
    price: 549.9, lowest: 499.9, average: 620,
    history: [640, 630, 625, 620, 610, 600, 590, 580, 570, 560, 555, 549.9],
    comfort: 8.0, durability: 9.3, form: 'Ampla', use: 'Diário e clima frio',
    notFor: 'calor intenso ou uso esportivo.', fit: 0.5,
    colors: { upper: '#1c201b', sole: '#5b5f55', accent: '#c8ff2f' },
    photos: [
      'assets/shoes/Timberland_1.jpeg',
      'assets/shoes/Timberland_2.jpeg',
      'assets/shoes/Timberland_3.jpeg'
    ],
    stores: stores(549.9)
  },

  // Antigo "Trail Mono" -> New Balance 9060
  {
    id: 'new-balance-9060', brand: 'New Balance', name: '9060', colorway: 'Sea Salt (Areia)', kind: 'tenis',
    volume: 6, boldness: 4, styles: ['casual', 'sport', 'custom'], palette: 'terrosas', occasions: ['dia', 'esporte'],
    price: 329.9, lowest: 309.9, average: 389.9,
    history: [400, 395, 389, 380, 370, 360, 350, 345, 340, 335, 332, 329.9],
    comfort: 8.6, durability: 7.4, form: 'Média', use: 'Diário e caminhadas',
    notFor: 'uso intenso em chuva ou trilhas técnicas.', fit: 0,
    colors: { upper: '#c9b998', sole: '#efe9da', accent: '#5b5f55' },
    photos: [
      'assets/shoes/NewBalance9060_1.jpeg',
      'assets/shoes/NewBalance9060_2.jpeg',
      'assets/shoes/NewBalance9060_3.jpeg'
    ],
    stores: stores(329.9)
  },

  // Antigo "Court Classic" -> Puma Court Star Vintage
  {
    id: 'puma-court-star-vintage', brand: 'Puma', name: 'Court Star Vintage', colorway: 'Off-white', kind: 'tenis',
    volume: 4, boldness: 2, styles: ['casual', 'formal'], palette: 'neutras', occasions: ['dia', 'trabalho'],
    price: 289.9, lowest: 259.9, average: 319.9,
    history: [330, 325, 320, 318, 315, 310, 305, 300, 295, 292, 290, 289.9],
    comfort: 8.1, durability: 7.6, form: 'Estreita', use: 'Dia a dia e trabalho',
    notFor: 'quem quer presença visual ou amortecimento forte.', fit: 0,
    colors: { upper: '#efece3', sole: '#ffffff', accent: '#8d9188' },
    photos: [
      'assets/shoes/PumaCourtStarVintage_1.jpeg',
      'assets/shoes/PumaCourtStarVintage_2.jpeg',
      'assets/shoes/PumaCourtStarVintage_3.jpeg'
    ],
    stores: stores(289.9)
  },

  // Antigo "Derby Solo" -> Democrata (Derby de couro)
  {
    id: 'democrata-derby', brand: 'Democrata', name: 'Derby Anatomic', colorway: 'Café', kind: 'sapato',
    volume: 3, boldness: 1, styles: ['formal'], palette: 'terrosas', occasions: ['trabalho', 'festa'],
    price: 479.9, lowest: 449.9, average: 499.9,
    history: [520, 515, 510, 505, 500, 499, 495, 490, 485, 482, 480, 479.9],
    comfort: 7.4, durability: 8.9, form: 'Estreita', use: 'Trabalho e eventos',
    notFor: 'longas caminhadas ou looks muito amplos.', fit: 0.5,
    colors: { upper: '#5a3b26', sole: '#231710', accent: '#c9b998' },
    photos: [
      'assets/shoes/Democrata_1.jpeg',
      'assets/shoes/Democrata_2.jpeg'
    ],
    stores: stores(479.9)
  },

  {
    id: 'adidas-ultraboost-1', brand: 'Adidas', name: 'Ultraboost 1.0', colorway: 'Preto', kind: 'tenis',
    volume: 7, boldness: 5, styles: ['sport', 'streetwear'], palette: 'neutras', occasions: ['esporte', 'dia'],
    price: 949.9, lowest: 899.9, average: 1049.9,
    history: [1090, 1080, 1070, 1060, 1049.9, 1040, 1020, 1000, 980, 965, 955, 949.9],
    comfort: 9.2, durability: 8.0, form: 'Média', use: 'Corrida leve e casual',
    notFor: 'looks formais ou dias de chuva forte.', fit: 0,
    colors: { upper: '#1c201b', sole: '#f1efe8', accent: '#6b6f66' },
    photos: [
      'assets/shoes/AdidasUltraboost5_1.jpeg',
      'assets/shoes/AdidasUltraboost5_2.jpeg',
      'assets/shoes/AdidasUltraboost5_3.jpeg'
    ],
    stores: stores(949.9)
  },

  {
    id: 'asics-gel-kayano-14', brand: 'ASICS', name: 'GEL-Kayano 14', colorway: 'Creme/Preto', kind: 'tenis',
    volume: 8, boldness: 7, styles: ['streetwear', 'sport', 'custom'], palette: 'neutras', occasions: ['esporte', 'dia'],
    price: 899.9, lowest: 849.9, average: 929.9,
    history: [950, 945, 940, 935, 930, 925, 920, 915, 910, 905, 902, 899.9],
    comfort: 8.8, durability: 8.2, form: 'Média', use: 'Treino e casual',
    notFor: 'quem prefere um visual discreto ou minimalista.', fit: 0,
    colors: { upper: '#e8e2d0', sole: '#d9d5c8', accent: '#1c201b' },
    photos: [
      'assets/shoes/ASICSGEL-Kayano14_1.jpeg',
      'assets/shoes/ASICSGEL-Kayano14_2.jpeg',
      'assets/shoes/ASICSGEL-Kayano14_3.jpeg'
    ],
    stores: stores(899.9)
  },

  {
    id: 'nike-zoom-vomero-5', brand: 'Nike', name: 'Zoom Vomero 5', colorway: 'Cinza Platina', kind: 'tenis',
    volume: 7, boldness: 6, styles: ['sport', 'streetwear'], palette: 'neutras', occasions: ['esporte', 'dia'],
    price: 949.9, lowest: 879.9, average: 979.9,
    history: [990, 985, 979.9, 975, 972, 970, 965, 960, 955, 952, 950, 949.9],
    comfort: 9.0, durability: 8.0, form: 'Média', use: 'Corrida leve e dia a dia',
    notFor: 'ambientes formais e piso muito molhado.', fit: 0,
    colors: { upper: '#b9bcb5', sole: '#efece3', accent: '#8d9188' },
    photos: [
      'assets/shoes/NikeZoomVomero5_1.jpeg',
      'assets/shoes/NikeZoomVomero5_2.jpeg',
      'assets/shoes/NikeZoomVomero5_3.jpeg'
    ],
    stores: stores(949.9)
  },

  {
    id: 'adidas-stan-smith', brand: 'Adidas', name: 'Stan Smith', colorway: 'Branco/Verde', kind: 'tenis',
    volume: 3, boldness: 2, styles: ['casual', 'formal'], palette: 'neutras', occasions: ['dia', 'trabalho'],
    price: 549.9, lowest: 519.9, average: 629.9,
    history: [650, 645, 640, 635, 630, 620, 610, 595, 580, 565, 555, 549.9],
    comfort: 7.8, durability: 8.4, form: 'Média', use: 'Dia a dia e trabalho casual',
    notFor: 'treinos e quem quer amortecimento forte.', fit: 0,
    colors: { upper: '#f1efe8', sole: '#ffffff', accent: '#2f7d4f' },
    photos: [
      'assets/shoes/AdidasStanSmith_1.jpeg',
      'assets/shoes/AdidasStanSmith_2.jpeg',
      'assets/shoes/AdidasStanSmith_3.jpeg'
    ],
    stores: stores(549.9)
  },

  {
    id: 'clarks-desert-boot', brand: 'Clarks', name: 'Originals Desert Boot', colorway: 'Sand Suede', kind: 'bota',
    volume: 4, boldness: 3, styles: ['casual', 'formal'], palette: 'terrosas', occasions: ['trabalho', 'dia'],
    price: 699.9, lowest: 659.9, average: 729.9,
    history: [740, 735, 730, 732, 728, 725, 720, 715, 710, 705, 702, 699.9],
    comfort: 7.6, durability: 8.0, form: 'Estreita', use: 'Trabalho casual e dia a dia',
    notFor: 'chuva, terrenos molhados e uso esportivo.', fit: 0,
    colors: { upper: '#c9b998', sole: '#e0d3b4', accent: '#8a7550' },
    photos: [
      'assets/shoes/ClarksOriginalsDesertBoot_1.jpeg',
      'assets/shoes/ClarksOriginalsDesertBoot_2.jpeg',
      'assets/shoes/ClarksOriginalsDesertBoot_3.jpeg'
    ],
    stores: stores(699.9)
  },

  {
    id: 'dr-martens-adrian', brand: 'Dr. Martens', name: 'Adrian Tassel Loafer', colorway: 'Marrom', kind: 'sapato',
    volume: 4, boldness: 3, styles: ['formal', 'custom'], palette: 'terrosas', occasions: ['trabalho', 'festa'],
    price: 899.9, lowest: 849.9, average: 979.9,
    history: [999, 995, 990, 985, 980, 975, 960, 940, 925, 910, 902, 899.9],
    comfort: 7.2, durability: 9.0, form: 'Média', use: 'Trabalho e eventos',
    notFor: 'esporte e longas caminhadas.', fit: 0.5,
    colors: { upper: '#5a3b26', sole: '#1c1410', accent: '#c9b998' },
    photos: [
      'assets/shoes/Dr.MartensAdrianTasselLoafer_1.jpeg',
      'assets/shoes/Dr.MartensAdrianTasselLoafer_2.jpeg',
      'assets/shoes/Dr.MartensAdrianTasselLoafer_3.jpeg'
    ],
    stores: stores(899.9)
  },

  {
    id: 'salomon-xt-6', brand: 'Salomon', name: 'XT-6', colorway: 'Vanilla Ice', kind: 'tenis',
    volume: 9, boldness: 8, styles: ['streetwear', 'sport', 'custom'], palette: 'terrosas', occasions: ['esporte', 'dia'],
    price: 999.9, lowest: 899.9, average: 959.9,
    history: [940, 945, 950, 955, 960, 965, 970, 980, 985, 990, 995, 999.9],
    comfort: 8.7, durability: 8.8, form: 'Estreita', use: 'Trilha leve e streetwear',
    notFor: 'ambientes formais e pés muito largos.', fit: 0.5,
    colors: { upper: '#e0d6bf', sole: '#b8a984', accent: '#8d9188' },
    photos: [
      'assets/shoes/SalomonXT-6_1.jpeg'
    ],
    stores: stores(999.9)
  },

  {
    id: 'merrell-moab-3', brand: 'Merrell', name: 'Moab 3', colorway: 'Earth', kind: 'tenis',
    volume: 7, boldness: 3, styles: ['casual', 'sport'], palette: 'terrosas', occasions: ['esporte', 'dia'],
    price: 649.9, lowest: 599.9, average: 719.9,
    history: [740, 735, 730, 725, 719.9, 715, 700, 690, 675, 665, 655, 649.9],
    comfort: 8.6, durability: 8.9, form: 'Ampla', use: 'Caminhada e dia a dia',
    notFor: 'looks formais e quem busca perfil fino.', fit: -0.5,
    colors: { upper: '#7a6549', sole: '#2b2a26', accent: '#c9b998' },
    photos: [
      'assets/shoes/MerrellMoab3_1.jpg',
      'assets/shoes/MerrellMoab3_2.jpg'
    ],
    stores: stores(649.9)
  },

  {
    id: 'adidas-gazelle', brand: 'Adidas', name: 'Gazelle', colorway: 'Azul Royal', kind: 'tenis',
    volume: 3, boldness: 6, styles: ['casual', 'streetwear'], palette: 'vibrantes', occasions: ['dia', 'trabalho', 'festa'],
    price: 599.9, lowest: 569.9, average: 639.9,
    history: [650, 648, 645, 642, 640, 638, 640, 635, 625, 615, 605, 599.9],
    comfort: 7.7, durability: 7.6, form: 'Estreita', use: 'Dia a dia e festa',
    notFor: 'treinos e quem tem pé largo.', fit: 0.5,
    colors: { upper: '#2a4fb5', sole: '#e8e2c8', accent: '#f1efe8' },
    photos: [
      'assets/shoes/AdidasGazelle_1.jpeg',
      'assets/shoes/AdidasGazelle_2.jpeg',
      'assets/shoes/AdidasGazelle_3.jpeg'
    ],
    stores: stores(599.9)
  },

  {
    id: 'dr-martens-1461-cherry', brand: 'Dr. Martens', name: '1461', colorway: 'Cherry Red', kind: 'sapato',
    volume: 5, boldness: 7, styles: ['formal', 'custom'], palette: 'vibrantes', occasions: ['trabalho', 'festa'],
    price: 949.9, lowest: 879.9, average: 929.9,
    history: [930, 925, 920, 925, 930, 935, 940, 945, 950, 948, 950, 949.9],
    comfort: 7.0, durability: 9.4, form: 'Média', use: 'Trabalho criativo e festa',
    notFor: 'esporte e quem quer conforto imediato, sem amaciar o couro.', fit: 0.5,
    colors: { upper: '#8e1f2b', sole: '#1c1c1a', accent: '#e9c93a' },
    photos: [
      'assets/shoes/Dr.Martens1461_1.jpeg',
      'assets/shoes/Dr.Martens1461_2.jpeg',
      'assets/shoes/Dr.Martens1461_3.jpeg'
    ],
    stores: stores(949.9)
  },

  {
    id: 'nike-pegasus-41', brand: 'Nike', name: 'Air Zoom Pegasus 41', colorway: 'Volt', kind: 'tenis',
    volume: 6, boldness: 7, styles: ['sport', 'casual'], palette: 'vibrantes', occasions: ['esporte', 'dia'],
    price: 799.9, lowest: 749.9, average: 899.9,
    history: [920, 915, 910, 905, 900, 895, 880, 860, 840, 820, 805, 799.9],
    comfort: 9.2, durability: 7.8, form: 'Média', use: 'Corrida e treino',
    notFor: 'ocasiões formais e looks minimalistas.', fit: 0,
    colors: { upper: '#cdea2f', sole: '#1c201b', accent: '#f0ede6' },
    photos: [
      'assets/shoes/NikeAirZoomPegasus41_1.jpeg',
      'assets/shoes/NikeAirZoomPegasus41_2.jpeg',
      'assets/shoes/NikeAirZoomPegasus41_3.jpeg'
    ],
    stores: stores(799.9)
  },

  {
    id: 'dr-martens-8065-mary-jane', brand: 'Dr. Martens', name: '8065 Mary Jane', colorway: 'Preto', kind: 'sapato', gender: 'feminino',
    volume: 5, boldness: 4, styles: ['formal', 'custom'], palette: 'neutras', occasions: ['trabalho', 'festa'],
    price: 899.9, lowest: 849.9, average: 939.9,
    history: [960, 955, 950, 948, 945, 940, 935, 925, 915, 908, 902, 899.9],
    comfort: 7.3, durability: 9.2, form: 'Média', use: 'Trabalho e eventos',
    notFor: 'esporte e longas caminhadas.', fit: 0.5,
    colors: { upper: '#1c201b', sole: '#111411', accent: '#e9c93a' },
    photos: [
      'assets/shoes/Dr.Martens8065MaryJane_1.jpg',
      'assets/shoes/Dr.Martens8065MaryJane_2.jpg'
    ],
    stores: stores(899.9)
  },

  {
    id: 'adidas-gazelle-bold', brand: 'Adidas', name: 'Gazelle Bold', colorway: 'Pink Fusion', kind: 'tenis', gender: 'feminino',
    volume: 6, boldness: 8, styles: ['casual', 'streetwear'], palette: 'vibrantes', occasions: ['dia', 'festa'],
    price: 649.9, lowest: 599.9, average: 729.9,
    history: [740, 735, 730, 728, 725, 720, 710, 695, 680, 668, 657, 649.9],
    comfort: 7.9, durability: 7.4, form: 'Estreita', use: 'Dia a dia e festa',
    notFor: 'treinos e quem tem pé largo.', fit: 0.5,
    colors: { upper: '#ef6fa8', sole: '#f1efe8', accent: '#ffffff' },
    photos: [
      'assets/shoes/AdidasGazelleBold_1.jpg',
      'assets/shoes/AdidasGazelleBold_2.jpg',
      'assets/shoes/AdidasGazelleBold_3.jpg'
    ],
    stores: stores(649.9)
  },

  {
    id: 'ugg-classic-ultra-mini-platform', brand: 'UGG', name: 'Classic Ultra Mini Platform', colorway: 'Chestnut', kind: 'bota', gender: 'feminino',
    volume: 8, boldness: 5, styles: ['casual', 'custom'], palette: 'terrosas', occasions: ['dia'],
    price: 899.9, lowest: 799.9, average: 879.9,
    history: [860, 865, 870, 872, 875, 880, 885, 890, 895, 898, 899.9, 899.9],
    comfort: 8.8, durability: 7.2, form: 'Ampla', use: 'Dia a dia e clima frio',
    notFor: 'chuva, calor e uso esportivo.', fit: -0.5,
    colors: { upper: '#8a5a34', sole: '#d9c9a8', accent: '#c9b998' },
    photos: [
      'assets/shoes/UGGClassicUltraMiniPlatform_1.jpeg',
      'assets/shoes/UGGClassicUltraMiniPlatform_2.jpeg'
    ],
    stores: stores(899.9)
  },

  {
    id: 'nike-air-force-1-shadow', brand: 'Nike', name: 'Air Force 1 Shadow', colorway: 'Sail', kind: 'tenis', gender: 'feminino',
    volume: 8, boldness: 6, styles: ['streetwear', 'casual'], palette: 'neutras', occasions: ['dia', 'festa'],
    price: 799.9, lowest: 749.9, average: 879.9,
    history: [890, 885, 880, 875, 870, 860, 850, 835, 820, 810, 803, 799.9],
    comfort: 8.2, durability: 8.3, form: 'Média', use: 'Casual e festa',
    notFor: 'esporte e quem prefere um visual discreto.', fit: 0,
    colors: { upper: '#efece3', sole: '#d9d5c8', accent: '#b9bcb5' },
    photos: [
      'assets/shoes/NikeAirForce1Shadow_1.jpg',
      'assets/shoes/NikeAirForce1Shadow_2.jpg',
      'assets/shoes/NikeAirForce1Shadow_3.jpg'
    ],
    stores: stores(799.9)
  },

  {
    id: 'converse-chuck-taylor-lift', brand: 'Converse', name: 'Chuck Taylor All Star Lift', colorway: 'Preto', kind: 'tenis', gender: 'feminino',
    volume: 7, boldness: 5, styles: ['streetwear', 'casual', 'custom'], palette: 'neutras', occasions: ['dia', 'festa'],
    price: 449.9, lowest: 419.9, average: 479.9,
    history: [490, 488, 485, 482, 480, 478, 475, 470, 462, 455, 451, 449.9],
    comfort: 7.4, durability: 7.6, form: 'Média', use: 'Dia a dia e festa',
    notFor: 'treinos, chuva e quem quer amortecimento.', fit: 0,
    colors: { upper: '#1c201b', sole: '#f1efe8', accent: '#f1efe8' },
    photos: [
      'assets/shoes/ConverseChuckTaylorAllStarLift_1.jpg',
      'assets/shoes/ConverseChuckTaylorAllStarLift_2.jpg',
      'assets/shoes/ConverseChuckTaylorAllStarLift_3.jpg'
    ],
    stores: stores(449.9)
  }
];

export const BRANDS: string[] = Array.from(new Set(CATALOG.map(s => s.brand))).sort((a, b) => a.localeCompare(b, 'pt-BR'));
