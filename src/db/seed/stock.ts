/** Unsplash stock register (representative imagery — never presented as Merova facilities, products or people). */
export interface StockImage { file: string; photo: string; id: string; alt: string; credit: string; }
export const STOCK: Record<string, StockImage> = {
  automotive: { file: "industry-automotive.webp", photo: "photo-1698697476354-2145c6f7c0dd", id: "vLTVjiY4Fr0", alt: "A car parked in front of an automotive plant", credit: "Mike van den Bos" },
  "food-beverage": { file: "industry-food-beverage.webp", photo: "photo-1668838225765-daa3a5da6207", id: "5aZ80momNb4", alt: "Trays of prepared food in a commercial kitchen", credit: "Richard R" },
  pharmaceutical: { file: "industry-pharmaceutical.webp", photo: "photo-1630094539386-280edfb5d46a", id: "F6clvre8fGg", alt: "Blister pack of medicine tablets", credit: "Melany @ tuinfosalud.com" },
  retail: { file: "industry-retail.webp", photo: "photo-1441986300917-64674bd600d8", id: "P3pI6xzovu0", alt: "Interior of an apparel retail store", credit: "Clark Street Mercantile" },
  fmcg: { file: "industry-fmcg.webp", photo: "photo-1506617420156-8e4536971650", id: "SvhXD3kPSTY", alt: "Packaged beverages on a retail chiller shelf", credit: "Quilia" },
  cinema: { file: "industry-cinema.webp", photo: "photo-1608170825938-a8ea0305d46c", id: "4VDRCoNuvE0", alt: "Cinema audience holding red and white concession cups", credit: "Felipe Bustillo" },
  construction: { file: "industry-construction.webp", photo: "photo-1599707254554-027aeb4deacd", id: "VoI2jd75M6Q", alt: "Construction crane beside a building under construction", credit: "Frames For Your Heart" },
  industrial: { file: "industry-industrial.webp", photo: "photo-1496247749665-49cf5b1022e9", id: "SLIFI67jv5k", alt: "Interior of a large industrial manufacturing hall", credit: "Ant Rozetsky" },
  ecommerce: { file: "industry-ecommerce.webp", photo: "photo-1709804945989-c8be542e04db", id: "DU2ybvshovg", alt: "Stacked corrugated cartons in a fulfilment warehouse", credit: "Ali Mkumbwa" },
  electronics: { file: "industry-electronics.webp", photo: "photo-1562408590-e32931084e23", id: "jXd2FSvcRr8", alt: "Close-up of an electronic circuit board", credit: "Umberto" },
  "gifts-premium": { file: "industry-gifts.webp", photo: "photo-1671150590216-f138600130ce", id: "NrAv5nwdIrw", alt: "White gift box with a red bow on a red background", credit: "Anastasiia Chepinska" },
  corporates: { file: "industry-corporates.webp", photo: "photo-1549637642-90187f64f420", id: "2zZp12ChxhU", alt: "Open-plan corporate office workspace", credit: "kate.sade" },
  hospitality: { file: "industry-hospitality.webp", photo: "photo-1551530241-1ccbaa7a9a84", id: "TTuRieJW2YI", alt: "Tables and chairs inside a restaurant", credit: "Ruslan Keba" },
  agriculture: { file: "industry-agriculture.webp", photo: "photo-1535379453347-1ffd615e2e08", id: "l_5MJnbrmrs", alt: "Aerial view of a harvester loading grain into a trailer", credit: "Unsplash contributor" },
  warehouse: { file: "editorial-warehouse.webp", photo: "photo-1587293852726-70cdb56c2866", id: "BNBA1h-NgdY", alt: "Corrugated cartons stored on warehouse racking", credit: "CHUTTERSNAP" },
};
