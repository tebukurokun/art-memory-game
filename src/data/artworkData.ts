// 作品データの型定義
export interface Artwork {
  id: number;
  author: string;
  title: string;
  image: string;
  originalWidth: number;
  originalHeight: number;
}

// 絵画データの例（実際の作品の縦横比を反映した値）
export const allArtworkData: Artwork[] = [
  // モネの作品 - 横長構図が多い
  {
    id: 1,
    author: "クロード・モネ",
    title: "ラ・ジャポネーズ (La Japonaise)",
    image: "/images/monet_japonaise.jpg",
    originalWidth: 1440,
    originalHeight: 2370,
  },
  {
    id: 2,
    author: "クロード・モネ",
    title: "印象・日の出 (Impression, Soleil Levant)",
    image: "/images/monet_impression.jpg",
    originalWidth: 1200,
    originalHeight: 900,
  },
  {
    id: 3,
    author: "クロード・モネ",
    title: "散歩、日傘をさす女性 (La Promenade, Femme à l'Ombrelle)",
    image: "/images/monet_woman_parasol.jpg",
    originalWidth: 1000,
    originalHeight: 1300,
  },

  // ゴッホの作品 - 縦長と横長が混在
  {
    id: 4,
    author: "フィンセント・ファン・ゴッホ",
    title: "ひまわり (Zonnebloemen)",
    image: "/images/gogh_sunflowers.jpg",
    originalWidth: 1000,
    originalHeight: 1300,
  },
  {
    id: 5,
    author: "フィンセント・ファン・ゴッホ",
    title: "星月夜 (De Sterrennacht)",
    image: "/images/gogh_starry_night.jpg",
    originalWidth: 1400,
    originalHeight: 1100,
  },
  {
    id: 6,
    author: "フィンセント・ファン・ゴッホ",
    title: "赤い葡萄畑 (De Rode Wijngaard)",
    image: "/images/gogh_red_vineyards.jpg",
    originalWidth: 1280,
    originalHeight: 1000,
  },

  // ダヴィンチの作品 - モナリザは縦長、最後の晩餐は横長
  {
    id: 7,
    author: "レオナルド・ダ・ヴィンチ",
    title: "モナリザ (La Gioconda)",
    image: "/images/davinci_mona_lisa.jpg",
    originalWidth: 779,
    originalHeight: 1200,
  },
  {
    id: 8,
    author: "レオナルド・ダ・ヴィンチ",
    title: "最後の晩餐 (L'Ultima Cena)",
    image: "/images/davinci_last_supper.jpg",
    originalWidth: 4000,
    originalHeight: 1800,
  },
  {
    id: 9,
    author: "レオナルド・ダ・ヴィンチ",
    title: "岩窟の聖母 (Vergine delle Rocce)",
    image: "/images/davinci_virgin_rocks.jpg",
    originalWidth: 1200,
    originalHeight: 1200,
  },

  // レンブラントの作品 - 縦長のポートレートと横長の風景
  {
    id: 13,
    author: "レンブラント・ファン・レイン",
    title: "夜警 (De Nachtwacht)",
    image: "/images/rembrandt_night_watch.jpg",
    originalWidth: 1642,
    originalHeight: 1312,
  },
  {
    id: 14,
    author: "レンブラント・ファン・レイン",
    title: "34歳の自画像 (Zelfportret op 34-jarige leeftijd)",
    image: "/images/rembrandt_self_portrait.jpg",
    originalWidth: 900,
    originalHeight: 1100,
  },
  {
    id: 15,
    author: "レンブラント・ファン・レイン",
    title:
      "テュルプ博士の解剖学講義 (De anatomische les van Dr. Nicolaes Tulp)",
    image: "/images/rembrandt_anatomy.jpg",
    originalWidth: 1700,
    originalHeight: 1300,
  },

  // フェルメールの作品 - 縦長が多い
  {
    id: 16,
    author: "ヨハネス・フェルメール",
    title: "真珠の耳飾りの少女 (Meisje met de parel)",
    image: "/images/vermeer_girl_pearl.jpg",
    originalWidth: 850,
    originalHeight: 1000,
  },
  {
    id: 17,
    author: "ヨハネス・フェルメール",
    title: "牛乳を注ぐ女 (De Melkmeid)",
    image: "/images/vermeer_milkmaid.jpg",
    originalWidth: 950,
    originalHeight: 1050,
  },

  // ミュシャの作品 - アール・ヌーヴォーのポスター
  {
    id: 19,
    author: "アルフォンス・ミュシャ",
    title: "黄道十二宮 (Zodiac)",
    image: "/images/mucha_zodiac.jpg",
    originalWidth: 1000,
    originalHeight: 1500,
  },
  {
    id: 20,
    author: "アルフォンス・ミュシャ",
    title: "ジスモンダ (Gismonda)",
    image: "/images/mucha_gismonda.jpg",
    originalWidth: 800,
    originalHeight: 2100,
  },

  // ルノワールの作品 - 印象派、人物画が多い
  {
    id: 21,
    author: "ピエール=オーギュスト・ルノワール",
    title: "舟遊びの昼食 (Le Déjeuner des canotiers)",
    image: "/images/renoir_luncheon.jpg",
    originalWidth: 1300,
    originalHeight: 1000,
  },
  {
    id: 22,
    author: "ピエール=オーギュスト・ルノワール",
    title: "ムーラン・ド・ラ・ギャレットの舞踏会 (Bal du moulin de la Galette)",
    image: "/images/renoir_moulin_de_la_galette.jpg",
    originalWidth: 1400,
    originalHeight: 900,
  },

  // 葛飾北斎の作品 - 浮世絵、富嶽三十六景など
  {
    id: 23,
    author: "葛飾北斎",
    title: "神奈川沖浪裏",
    image: "/images/hokusai_wave.jpg",
    originalWidth: 1500,
    originalHeight: 1000,
  },
  {
    id: 24,
    author: "葛飾北斎",
    title: "凱風快晴",
    image: "/images/hokusai_fuji.jpg",
    originalWidth: 1500,
    originalHeight: 1000,
  },

  // 歌川広重の作品 - 東海道五十三次など
  {
    id: 25,
    author: "歌川広重",
    title: "東海道五十三次・日本橋",
    image: "/images/hiroshige_nihonbashi.jpg",
    originalWidth: 1400,
    originalHeight: 900,
  },
  {
    id: 26,
    author: "歌川広重",
    title: "名所江戸百景・大はしあたけの夕立",
    image: "/images/hiroshige_rain.jpg",
    originalWidth: 900,
    originalHeight: 1300,
  },

  // クリムトの作品 - 装飾的な金箔の作品
  {
    id: 27,
    author: "グスタフ・クリムト",
    title: "接吻 (Der Kuss)",
    image: "/images/klimt_kiss.jpg",
    originalWidth: 1100,
    originalHeight: 1100,
  },
  {
    id: 28,
    author: "グスタフ・クリムト",
    title: "アデーレ・ブロッホ=バウアーの肖像 I (Adele Bloch-Bauer I)",
    image: "/images/klimt_adele.jpg",
    originalWidth: 1000,
    originalHeight: 1400,
  },

  // ミケランジェロの作品 - システィーナ礼拝堂の天井画
  {
    id: 29,
    author: "ミケランジェロ・ブオナローティ",
    title: "アダムの創造 (La Creazione di Adamo)",
    image: "/images/michelangelo_adam.jpg",
    originalWidth: 1500,
    originalHeight: 700,
  },
  {
    id: 30,
    author: "ミケランジェロ・ブオナローティ",
    title: "最後の審判 (Il Giudizio Universale)",
    image: "/images/michelangelo_judgement.jpg",
    originalWidth: 1200,
    originalHeight: 1800,
  },

  // 横山大観の作品 - 日本画
  {
    id: 31,
    author: "横山大観",
    title: "屈原",
    image: "/images/yokoyama_kutsugen.jpg",
    originalWidth: 1179,
    originalHeight: 541,
  },
  {
    id: 32,
    author: "横山大観",
    title: "無我",
    image: "/images/yokoyama_muga.jpg",
    originalWidth: 1200,
    originalHeight: 1800,
  },
];
