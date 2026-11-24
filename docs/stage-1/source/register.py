"""
Merova Printpack — Stage 1 master register (single source of truth for Stage 1).

Generates:
  docs/stage-1/merova-stage1-register.xlsx   (all registers as spreadsheet tabs)
  docs/stage-1/register.json                 (machine-readable; Stage 2 imports this into src/data)
  docs/stage-1/REGISTERS.md                  (the same tables in Markdown)

Run:  python3 docs/stage-1/source/register.py

Status codes (brief Part 3.2):
  1 = Listed by Merova in the brief without qualification -> becomes "Confirmed" when ticked at sign-off
  2 = Listed "where available / where verified", or a variant whose supply route is unknown -> subject to confirmation
  3 = Proposed by the agency (an omission we recommend) -> requires Merova approval; not published until approved
Compliance flag "SUP" = appears to fall within India's single-use plastic prohibition (PWM Amendment Rules 2021,
in force 1 July 2022). Held from publication until Merova confirms the legal basis for supply.
"""
import json, os, sys
from collections import OrderedDict

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(HERE)

# ───────────────────────── Categories & subcategories ─────────────────────────
CATEGORIES = OrderedDict([
    ("paper", dict(name="Paper Products", slug="paper-products",
        promise="Make the first impression count.",
        intro="Printed paperboard, rigid and foodservice packaging, carry bags, labels, food-grade papers and commercial print.")),
    ("plastic", dict(name="Plastic Products & Films", slug="plastic-products-films",
        promise="Film that seals, wraps and protects at line speed.",
        intro="BOPP, shrink, cling and flexible films, pouches and rigid plastic containers for packing lines and foodservice.")),
    ("compostable", dict(name="Compostable Products", slug="compostable-products",
        promise="Compostable, stated precisely.",
        intro="Compostable bags, films and foodservice formats, each published only against the certificate for its grade.")),
    ("corrugated", dict(name="Corrugated & Fluted Products", slug="corrugated-fluted-products",
        promise="Strength that moves business forward.",
        intro="Corrugated boxes, boards, inserts and retail-ready packaging for storage, transit and export.")),
])

SUBCATS = OrderedDict([
    ("PA-A", ("paper", "Paperboard & Folding Cartons")),
    ("PA-B", ("paper", "Rigid & Premium Boxes")),
    ("PA-C", ("paper", "Foodservice Paper Packaging")),
    ("PA-D", ("paper", "Paper Carry Bags")),
    ("PA-E", ("paper", "Labels & Stickers")),
    ("PA-F", ("paper", "Food Wraps & Specialty Papers")),
    ("PA-G", ("paper", "Commercial Printing")),
    ("PL-A", ("plastic", "BOPP Films")),
    ("PL-B", ("plastic", "Shrink Films")),
    ("PL-C", ("plastic", "Cling, Stretch & Protective Films")),
    ("PL-D", ("plastic", "Flexible Plastic Packaging")),
    ("PL-E", ("plastic", "Plastic Containers & Trays")),
    ("PL-F", ("plastic", "Plastic Cups & Glasses")),
    ("CO-A", ("compostable", "Compostable Bags")),
    ("CO-B", ("compostable", "Compostable Flexible Packaging")),
    ("CO-C", ("compostable", "Compostable Shrink & Cling Films")),
    ("CO-D", ("compostable", "Compostable Foodservice")),
    ("CR-A", ("corrugated", "Corrugated Boxes")),
    ("CR-B", ("corrugated", "Corrugated Boards & Sheets")),
    ("CR-C", ("corrugated", "Corrugated Inserts & Components")),
    ("CR-D", ("corrugated", "Retail-Ready & Display")),
])

# ───────────────────────── RFQ field profiles ─────────────────────────
COMMON_RFQ = ["Quantity per order", "Annual / repeat volume", "Delivery location (city, PIN)", "Required by date",
              "Artwork / reference upload", "Company & contact details"]
RFQ = {
    "carton":     ["Product to be packed", "Internal dimensions (L×W×H)", "Carton style", "Board preference / GSM (if known)", "Print colours & sides", "Finish (varnish, lamination, foil, emboss)", "Window / insert required"],
    "rigid":      ["Product to be packed", "Internal dimensions", "Box style (lid & base, magnetic, drawer, book)", "Wrap paper / finish", "Insert requirement", "Branding (foil, emboss, print)"],
    "cup":        ["Capacity (ml / oz)", "Wall type (single, double, ripple)", "Hot or cold use", "Lid required", "Print colours", "Food-contact documentation required"],
    "foodservice":["Food item & serving size", "Format / dimensions", "Grease or moisture resistance needed", "Lid / closure", "Print colours", "Food-contact documentation required"],
    "bag":        ["Bag size (W×G×H)", "Paper type & GSM (if known)", "Handle type", "Print colours & coverage", "Load to carry (kg)"],
    "label":      ["Label size & shape", "Facestock (paper / synthetic)", "Adhesive (permanent, removable, freezer)", "Supply (rolls with core size / sheets)", "Print colours / variable data", "Application (hand / machine)"],
    "wrap":       ["Paper type (butter, greaseproof, kraft)", "Format (sheets / rolls) & size", "GSM (if known)", "Printed or plain", "Food-contact documentation required"],
    "print":      ["Item (brochure, catalogue, flyer, insert)", "Finished size & page count", "Paper & GSM (if known)", "Binding / folding", "Finish", "Print run"],
    "film":       ["Film type", "Width (mm) & core ID", "Thickness (micron) if known", "Roll length / weight", "Machine / application", "Printed or plain"],
    "pouch":      ["Pouch style", "Dimensions", "Material structure (if known)", "Closure (zip, seal, adhesive)", "Fill weight / product", "Print colours"],
    "container":  ["Item to be packed", "Capacity / dimensions", "Material preference", "Lid / tamper evidence", "Microwave / freezer use", "Food-contact documentation required"],
    "corrugated": ["Contents & weight per box", "Internal dimensions (L×W×H)", "Ply / board grade (if known)", "Box style", "Printing (colours, sides)", "Stacking / transit conditions"],
    "compost":    ["Format & dimensions", "Thickness (micron) if known", "Certification required (industrial / home)", "Printing", "End use"],
}

# ───────────────────────── Products ─────────────────────────
# Each: id, sub, name, slug, status, desc, variants, apps, params, custom, rfq, related, shot, [flags], [merged], [note]
def P(id, sub, name, slug, status, desc, variants, apps, params, custom, rfq, related, shot, flags="", merged="", note=""):
    return dict(id=id, sub=sub, name=name, slug=slug, status=status, desc=desc, variants=variants, apps=apps,
                params=params, custom=custom, rfq=rfq, related=related, shot=shot, flags=flags, merged=merged, note=note)

CARTON_CUSTOM = ["Custom dieline", "CMYK + spot colours", "Varnish / lamination", "Foil & emboss (on enquiry)"]
FS_CUSTOM = ["Brand print", "Custom size within tooling", "Food-contact documentation per material"]

PRODUCTS = [
# ── PAPER · Paperboard & Folding Cartons
P("PA-01","PA-A","Folding Cartons","folding-cartons",1,
  "Printed paperboard cartons supplied flat for packing — the core retail and product packaging format.",
  ["Straight / reverse tuck end","Crash-lock (auto-lock) bottom","Sleeve & tray","Window cartons","Display cartons","Belly bands & sleeves"],
  "Retail, FMCG, personal care, confectionery, electronics accessories",
  ["Board type (FBB, SBS, duplex, kraft-back)","GSM","Dimensions & tolerance","Print process & colours","Finish"],
  CARTON_CUSTOM+["Window patching","Hang tabs"],"carton",["PA-02","PA-05","PA-25","CR-06"],
  "Three printed tuck-end cartons, one open showing board edge, on warm-white sweep; macro of crease and print registration.",
  merged="Printed paperboard boxes; Retail packaging boxes; Product packaging cartons; Specialised printed cartons; Custom paperboard packaging; Window cartons; Printed sleeves"),
P("PA-02","PA-A","Mono Cartons","mono-cartons",1,
  "Single-unit printed cartons for a bottle, tube, jar, strip pack or device, built for consistent dimensions on cartoning lines.",
  ["Tuck-end","Crash-lock","Pharmaceutical mono cartons (leaflet space, coding panel)","With inner partition"],
  "Pharmaceuticals, nutraceuticals, personal care, FMCG, spirits",
  ["Board & GSM","Dimensions to unit","Uncoated coding panel","Braille (on enquiry)"],
  CARTON_CUSTOM+["Multi-SKU artwork management"],"carton",["PA-01","PA-24","CR-07","PA-23"],
  "Row of white mono cartons with one bottle beside, studio light; detail of coding panel.",
  merged="Pharmaceutical cartons (now a variant)"),
P("PA-03","PA-A","Sweet Boxes","sweet-boxes",3,
  "Printed paperboard mithai boxes with food-safe inner surfaces, windows or trays, for daily counter sales and festive gifting.",
  ["Counter boxes (250 g – 1 kg)","Festive / premium printed boxes","Window sweet boxes","Boxes with inner tray or butter-paper liner"],
  "Sweet shops, mithai chains, caterers, festive gifting",
  ["Board & GSM","Box size by weight","Inner surface / liner","Window film","Print & finish"],
  CARTON_CUSTOM,"carton",["PA-04","PA-05","PA-21","PA-13"],
  "Open printed mithai box with assorted sweets on butter paper, warm daylight, brass tray props.",
  note="Not in the brief's category list but required by the Sweet Shops mapping; high-intent search term. Recommend approval."),
P("PA-04","PA-A","Cake & Bakery Boxes","cake-bakery-boxes",3,
  "Paperboard cake, pastry and bakery boxes with windows, inserts and grease-resistant options.",
  ["Cake boxes (½ kg – 2 kg+)","Pastry & cupcake boxes with inserts","Window bakery boxes","Cookie & rusk cartons"],
  "Bakeries, patisseries, cafés, cloud kitchens",
  ["Board & GSM","Size","Grease resistance","Window film","Insert cavities"],
  CARTON_CUSTOM,"carton",["PA-03","PA-21","PA-13","PA-01"],
  "White cake box, lid lifted, with cupcake insert box beside; soft top light.",
  note="Required by the Bakeries mapping; replaces the earlier 'bakery boxes' page."),
# ── PAPER · Rigid & Premium
P("PA-05","PA-B","Rigid Boxes","rigid-boxes",1,
  "Set-up boxes of wrapped greyboard for luxury and presentation packaging — distinct from folding cartons and corrugated shippers.",
  ["Lid & base","Shoulder & neck","Book-style / hinged","Magnetic closure","Drawer / slide","Collapsible rigid"],
  "Jewellery, cosmetics, electronics, spirits, premium apparel, launches",
  ["Greyboard thickness","Wrap paper / finish","Insert material","Closure"],
  ["Foil, emboss, deboss, spot UV","Custom inserts (board, foam, fabric)","Ribbon pulls"],"rigid",["PA-06","PA-12","PA-01"],
  "Black magnetic rigid box, lid open, with red foil detail; macro of wrapped corner.",
  merged="Luxury presentation boxes; Specialised rigid packaging; Custom premium boxes"),
P("PA-06","PA-B","Gift & Hamper Boxes","gift-hamper-boxes",1,
  "Occasion-led gift boxes and hamper packaging for festive, corporate and celebration gifting, in folding or rigid construction.",
  ["Festive gift boxes","Corporate hamper boxes with inserts","Trays with sleeves","Wedding & celebration boxes"],
  "Corporate gifting, festive retail, weddings, events, premium food",
  ["Construction (folding / rigid)","Size & cavities","Finish","Insert"],
  ["Seasonal artwork","Personalised print","Inserts for mixed contents"],"rigid",["PA-05","PA-03","PA-12","PA-23"],
  "Diwali-style hamper box with partitioned contents, red and gold, overhead shot.",
  merged="Premium gift boxes",
  note="Kept separate from Rigid Boxes: occasion-led purchase, multi-item inserts and folding constructions."),
# ── PAPER · Foodservice
P("PA-07","PA-C","Paper Cups","paper-cups",1,
  "Printed paper cups for hot and cold beverages in single-wall, double-wall and ripple constructions.",
  ["Single-wall hot cups","Double-wall / ripple hot cups","Cold beverage cups","Sampling & tasting cups","Compatible lids (on enquiry)"],
  "Cafés, QSR, cinemas, offices, events, vending",
  ["Capacity","Cup stock GSM","Lining (PE / aqueous — confirm)","Rim & lid fit"],FS_CUSTOM,"cup",["PA-18","PA-08","CO-12","PL-14"],
  "Stack of printed double-wall cups with one in hand-sleeve; steam, café counter.",
  merged="Hot beverage cups; Cold beverage paper cups; Beverage cups"),
P("PA-08","PA-C","Ice Cream Cups & Tubs","ice-cream-cups-tubs",1,
  "Printed paper cups and tubs for ice cream and desserts, from single serves to take-home tubs, with lids.",
  ["Single-serve cups (60–150 ml)","Take-home tubs (250 ml – 1 L)","Paper and plastic lids (on enquiry)"],
  "Ice cream parlours, dessert brands, dairies, cinemas",
  ["Capacity","Stock & coating","Lid type","Freezer suitability"],FS_CUSTOM,"cup",["PA-07","PA-16","CO-10","PL-11"],
  "Three printed ice cream cups with scoops, frost on rim, cool light.",
  merged="Ice cream paper cups; Paper tubs (dessert)"),
P("PA-09","PA-C","Popcorn Tubs","popcorn-tubs",1,
  "Printed paperboard popcorn tubs and buckets for cinema concessions, events and snack brands.",
  ["Regular / medium / large / combo","Tubs with lids","Bucket style"],
  "Multiplexes, cinemas, entertainment venues, events",
  ["Capacity","Board & GSM","Grease resistance","Print"],FS_CUSTOM,"foodservice",["PA-10","PA-11","PA-07","CR-01"],
  "Overflowing printed popcorn tub, warm cinema light, shallow depth of field.",),
P("PA-10","PA-C","Popcorn Cones","popcorn-cones",1,
  "Paper cones for single-serve popcorn, fries and snacks — light, quick to fill and easy to hold.",
  ["Plain and printed cones","Sizes by serve"],
  "Cinemas, events, snack kiosks, amusement venues",
  ["Size","Paper / board GSM","Grease resistance"],FS_CUSTOM,"foodservice",["PA-09","PA-12","PA-14"],
  "Printed cone filled with popcorn held in a cone stand.",),
P("PA-11","PA-C","Nachos Trays","nachos-trays",1,
  "Paperboard trays with an integrated dip well for nachos, chaat and sharing snacks.",
  ["Single tray with dip well","Two-compartment trays","Printed or plain"],
  "Cinemas, QSR, cafés, food courts",
  ["Tray size","Dip-well size","Board & coating"],FS_CUSTOM,"foodservice",["PA-09","PA-14","PA-12"],
  "Nachos tray with cheese dip in the well, 45° angle.",
  note="Kept distinct from Paper Food Trays: a dedicated concession SKU with dip well."),
P("PA-12","PA-C","French Fries Cartons","french-fries-cartons",1,
  "Scoop cartons and trays that hold fries upright and keep the serve tidy.",
  ["Scoop cartons","Fry trays / boats","Sizes by serve"],
  "QSR, cinemas, cafés, food courts",
  ["Size","Board & coating","Grease resistance"],FS_CUSTOM,"foodservice",["PA-13","PA-14","PA-21"],
  "Red-printed fries scoop with fries, clean studio background.",
  merged="French fries trays"),
P("PA-13","PA-C","Burger Boxes","burger-boxes",1,
  "Clamshell paperboard boxes that hold burgers securely for dine-in, takeaway and delivery.",
  ["Clamshell boxes","Vented options","Sizes by product"],
  "QSR, restaurants, cloud kitchens",
  ["Size","Board & coating","Vents","Lock style"],FS_CUSTOM,"foodservice",["PA-12","PA-21","PA-20","CR-04"],
  "Kraft clamshell burger box, half-open, burger visible.",),
P("PA-14","PA-C","Sandwich & Wrap Boxes","sandwich-wrap-boxes",1,
  "Wedge and window boxes for sandwiches, wraps and rolls in grab-and-go and delivery service.",
  ["Wedge boxes with window","Wrap / roll holders","Sandwich boxes"],
  "Cafés, QSR, cafeterias, airlines catering",
  ["Size","Board & coating","Window film"],FS_CUSTOM,"foodservice",["PA-13","PA-21","PA-15"],
  "Window wedge box with club sandwich, overhead.",
  merged="Sandwich boxes"),
P("PA-15","PA-C","Paper Food Trays","paper-food-trays",1,
  "Open paperboard serving trays and boats for snacks, street food and combo meals.",
  ["Boat trays","Rectangular trays","Compartment trays"],
  "QSR, food courts, cinemas, events, street food",
  ["Size","Board & coating","Grease resistance"],FS_CUSTOM,"foodservice",["PA-11","PA-12","PA-16"],
  "Two kraft boat trays with snacks, top-down.",
  merged="Foodservice trays"),
P("PA-16","PA-C","Paper Bowls & Food Containers","paper-bowls-containers",1,
  "Round, cup-formed paper bowls and food containers with lids for hot meals, soups and salads.",
  ["Soup & curry containers","Salad & rice bowls","Food tubs with lids","Kraft or printed"],
  "Restaurants, cloud kitchens, cafeterias, caterers",
  ["Capacity","Stock & lining","Lid type","Hot / microwave use"],FS_CUSTOM,"container",["PA-17","PA-07","CO-10","PL-11"],
  "Kraft bowl with steaming curry, lid leaning beside.",
  merged="Paper bowls; Paper food containers; Paper tubs (food)"),
P("PA-17","PA-C","Paper Takeaway Boxes","paper-takeaway-boxes",1,
  "Folded paperboard meal boxes for takeaway and delivery — noodle, meal and lunch boxes.",
  ["Meal / lunch boxes","Noodle boxes","Hinged takeaway boxes"],
  "Cloud kitchens, restaurants, QSR, caterers",
  ["Size","Board & coating","Leak / grease resistance","Lock style"],FS_CUSTOM,"foodservice",["PA-16","PA-13","PA-20","CR-04"],
  "Kraft takeaway box with noodles, chopsticks, delivery bag edge.",
  merged="Takeaway boxes"),
P("PA-18","PA-C","Cup Sleeves","cup-sleeves",1,
  "Printed paper sleeves that insulate hot cups and carry the brand.",
  ["Standard sleeves by cup size","Full-print sleeves","Kraft sleeves"],
  "Cafés, QSR, cinemas, events",
  ["Cup size fit","Board / corrugated (micro-flute)","Print"],["Brand print","Promotional runs"],"foodservice",["PA-07","PA-08"],
  "Printed sleeve on a takeaway cup, hand holding.",
  merged="Paper cup sleeves"),
P("PA-19","PA-C","Pizza Boxes","pizza-boxes",1,
  "Printed pizza boxes in paperboard or micro-flute board for delivery and takeaway.",
  ["7\" to 16\" sizes","Paperboard","Micro-flute (E / F-flute) — corrugated construction","Vented"],
  "Pizzerias, QSR, cloud kitchens",
  ["Size","Board (paperboard / micro-flute)","Print","Vents"],FS_CUSTOM,"foodservice",["PA-17","CR-04","PA-21"],
  "Printed pizza box open with pizza, steam, top-down.",
  note="Decision D-04: kept in Paper (foodservice journey) per brief; micro-flute variant cross-linked from Corrugated."),
# ── PAPER · Carry bags
P("PA-20","PA-D","Kraft & Printed Carry Bags","paper-carry-bags",1,
  "Machine-made kraft and white paper carry bags with twisted or flat handles for retail and food.",
  ["Brown kraft","White kraft","Printed (1–4 colours)","Twisted / flat handles"],
  "Retail, supermarkets, restaurants, bakeries, pharmacies",
  ["Size (W×G×H)","Paper GSM","Handle type","Load rating"],["Brand print","Custom sizes"],"bag",["PA-21","PA-22","CO-01"],
  "Stack of printed kraft carry bags, one standing with handle up.",
  merged="Kraft paper bags; Retail shopping bags; Printed paper carry bags; Custom branded paper bags"),
P("PA-21","PA-D","Food & Takeaway Paper Bags","food-paper-bags",1,
  "SOS and flat paper bags for bakery, takeaway and delivery, with grease-resistant options.",
  ["SOS (square-bottom) bags","Flat & satchel bags","Bags with handles for delivery","Grease-resistant"],
  "Bakeries, QSR, cloud kitchens, sweet shops",
  ["Size","Paper GSM","Grease resistance","Handle"],["Brand print"],"bag",["PA-20","PA-26","PA-17"],
  "SOS bag with baguette and pastries, bakery counter.",
  merged="Foodservice paper bags"),
P("PA-22","PA-D","Premium Paper Bags","premium-paper-bags",1,
  "Finished luxury paper bags with laminated surfaces, rope or ribbon handles and reinforced tops.",
  ["Laminated (matt / gloss)","Rope, ribbon or tape handles","Foil & emboss","Board-reinforced base"],
  "Jewellery, fashion, premium retail, corporate events, gifting",
  ["Size","Paper / board GSM","Finish","Handle"],["Foil, emboss, spot UV","Custom colours"],"bag",["PA-05","PA-06","PA-20"],
  "Matte black bag with red ribbon handle, studio side light.",),
# ── PAPER · Labels
P("PA-23","PA-E","Product & Packaging Labels","product-labels",1,
  "Self-adhesive printed labels for products and packs, supplied on rolls for hand or machine application.",
  ["Paper facestocks","Synthetic facestocks (BOPP, PE — on enquiry)","Permanent, removable, freezer adhesives","Roll or sheet supply"],
  "FMCG, food, cosmetics, pharma, beverages",
  ["Size & shape","Facestock","Adhesive","Core & winding direction"],["Embellishments (foil, varnish)","Variable data"],"label",["PA-24","PA-25","PA-02"],
  "Label rolls with a printed jar label applied, macro of die-cut edge.",
  merged="Self-adhesive labels; Printed product labels; Packaging labels; Custom printed labels",
  note="Labels sit in Paper Products as a printing range; synthetic facestocks are variants (Decision D-05)."),
P("PA-24","PA-E","Barcode & Identification Labels","barcode-labels",1,
  "Blank and pre-printed labels for barcodes, batch data, shipping and warehouse identification.",
  ["Direct thermal","Thermal transfer","Pre-printed with variable data","Shipping & logistics labels"],
  "E-commerce, logistics, pharma, retail, industrial",
  ["Size","Printer type & core","Facestock & adhesive"],["Serial / variable data"],"label",["PA-23","CR-05"],
  "Thermal label roll and printed shipping label on a carton.",
  merged="Barcode and identification labels"),
P("PA-25","PA-E","Stickers & Seals","stickers-seals",1,
  "Die-cut promotional stickers, box seals and tamper-evident seal labels.",
  ["Die-cut stickers","Sheet stickers","Box & bag seals","Tamper-evident seals (on enquiry)"],
  "Retail, sweet shops, bakeries, e-commerce, events",
  ["Size & shape","Material","Finish"],["Custom shapes","Foil"],"label",["PA-23","PA-03","PA-06"],
  "Round red seal sticker closing a sweet box, macro.",
  merged="Promotional stickers"),
# ── PAPER · Food wraps & specialty
P("PA-26","PA-F","Butter Paper & Greaseproof Paper","butter-greaseproof-paper",1,
  "Grease-resistant papers for wrapping, lining and layering food, in sheets and rolls.",
  ["Butter paper","Greaseproof paper","Sheets and rolls","Plain or printed"],
  "Sweet shops, bakeries, restaurants, QSR",
  ["Grade","GSM","Sheet / roll size","Food-contact documentation"],["Printing","Custom sheet sizes"],"wrap",["PA-27","PA-03","PA-04"],
  "Layered mithai on translucent butter paper, close-up of sheen.",
  merged="Butter paper (listed twice in brief); Greaseproof paper (listed twice)",
  note="Single page targets both search terms; grades confirmed by Merova."),
P("PA-27","PA-F","Printed Food Wrapping Paper","food-wrapping-paper",1,
  "Branded wrap sheets for burgers, sandwiches, rolls and deli items.",
  ["Burger & sandwich wraps","Deli sheets","Coated / greaseproof bases"],
  "QSR, cafés, cloud kitchens, delis",
  ["Sheet size","Base paper","Coating","Print"],["Brand print"],"wrap",["PA-26","PA-13","PA-14"],
  "Burger half-wrapped in branded paper on a tray.",
  merged="Paper food wraps; Specialised food wrapping sheets"),
P("PA-28","PA-F","Kraft & Specialty Wrapping Paper","kraft-wrapping-paper",1,
  "Kraft and specialty papers in sheets and rolls for retail wrapping, void fill and product protection.",
  ["Kraft rolls & sheets","Printed wrapping paper","Specialty packaging papers"],
  "Retail, e-commerce, gifting, industrial",
  ["GSM","Width / sheet size","Colour"],["Custom print"],"wrap",["PA-20","CR-08","PA-06"],
  "Kraft roll partly unrolled around a gift parcel.",
  merged="Kraft wrapping paper; Specialty packaging paper; Custom printed paper sheets and rolls"),
# ── PAPER · Commercial printing
P("PA-29","PA-G","Brochures, Catalogues & Company Profiles","brochures-catalogues",1,
  "Multi-page printed sales and corporate literature, from product brochures to bound catalogues.",
  ["Product & corporate brochures","Company profiles","Catalogues (saddle-stitched, perfect-bound)"],
  "Corporates, manufacturers, agencies, publishers, institutions",
  ["Size","Pages","Paper & GSM","Binding","Finish"],["Lamination, spot UV, foil"],"print",["PA-30","PA-23"],
  "Open perfect-bound catalogue with brochure fan, editorial flat-lay.",
  merged="Corporate brochures; Product brochures; Company profiles; Printed catalogues"),
P("PA-30","PA-G","Flyers, Leaflets & Inserts","flyers-leaflets-inserts",1,
  "Single-sheet and folded print — marketing flyers, leaflets, promotional inserts and product information leaflets.",
  ["Flyers & leaflets","Folded leaflets","Promotional inserts","Package inserts / product information leaflets"],
  "Corporates, retail, e-commerce, pharma, events",
  ["Size & fold","Paper & GSM","Print run"],["Variable data (on enquiry)"],"print",["PA-29","PA-02"],
  "Folded pharma leaflet beside a carton and tri-fold flyer.",
  merged="Product flyers; Marketing leaflets; Promotional inserts; Product inserts and leaflets (pharma)",
  note="'Custom printed packaging collateral' removed: covered by inserts, labels and sleeves."),
# ── PLASTIC · BOPP
P("PL-01","PL-A","BOPP Heat-Sealable (HST) Rolls","bopp-hst-rolls",1,
  "Heat-sealable BOPP film rolls for overwrapping and form-fill-seal packing of food and consumer goods.",
  ["One-side / two-side heat-sealable","Plain","Printed (where available)"],
  "Food manufacturers, confectionery, FMCG, tobacco-free overwrap",
  ["Width & core","Micron","Roll length","Seal temperature range","Machine type"],["Printing (where available)","Slit widths"],"film",["PL-02","PL-03","PL-09"],
  "Clear BOPP roll on a mandrel with light passing through, macro of edge.",
  merged="Printed BOPP rolls (variant)"),
P("PL-02","PL-A","BOPP Packaging Films","bopp-films",1,
  "Non-heat-seal BOPP films for lamination, bags, tapes and label stock.",
  ["Plain transparent","Matte / pearlised / metallised (to confirm)","Lamination grade"],
  "Converters, printers, FMCG, textiles",
  ["Width","Micron","Treatment","Finish"],["Slitting"],"film",["PL-01","PL-09"],
  "Stacked BOPP rolls, glossy and matte, side-lit.",
  merged="Other BOPP packaging formats"),
# ── PLASTIC · Shrink
P("PL-03","PL-B","POF Shrink Film","pof-shrink-film",1,
  "Polyolefin shrink film for clear, tight retail shrink-wrapping on L-sealers and shrink tunnels.",
  ["Centre-folded","Single-wound","Cross-linked (to confirm)"],
  "Food, FMCG, cosmetics, stationery, retail bundling",
  ["Width","Micron","Shrink ratio","Machine"],["Perforation (on enquiry)"],"film",["PL-04","PL-05","PL-01"],
  "Shrink-wrapped gift pack with crisp edges, film roll beside.",),
P("PL-04","PL-B","PVC Shrink Film","pvc-shrink-film",2,
  "PVC shrink film for low-cost retail shrink-wrapping where its properties suit the application.",
  ["Centre-folded","Single-wound","Sleeves"],
  "Retail bundling, stationery, hardware",
  ["Width","Micron","Shrink properties"],[],"film",["PL-03"],
  "PVC-shrunk multipack, side light.",
  note="'Where available' in brief."),
P("PL-05","PL-B","PE Shrink Film (Collation)","pe-shrink-film",3,
  "Polyethylene shrink film for bundling bottles, cans and cartons into transit packs.",
  ["Plain and printed","Tubular / sheet"],
  "Beverages, FMCG, food manufacturers",
  ["Width","Micron","Shrink ratio"],["Printing"],"film",["PL-03","PL-06","CR-08"],
  "Six-pack of bottles in clear PE shrink on a corrugated tray.",
  note="Proposed omission: the main shrink format for beverage and FMCG collation."),
# ── PLASTIC · Wrapping & protective
P("PL-06","PL-C","Stretch Film (Pallet Wrap)","stretch-film",3,
  "LLDPE stretch film for unitising pallets by hand or machine.",
  ["Hand rolls","Machine rolls","Pre-stretched"],
  "Warehousing, 3PL, manufacturing, export",
  ["Width","Micron","Roll weight","Hand / machine"],[],"film",["PL-07","CR-05","CR-08"],
  "Pallet of cartons wrapped in clear stretch film, warehouse light.",
  note="Proposed omission: core transit-packaging material for the logistics and industrial mappings."),
P("PL-07","PL-C","PVC Cling Film","pvc-cling-film",1,
  "Food-service cling film in catering rolls and dispenser boxes for covering, wrapping and storage.",
  ["Catering rolls","Dispenser (cutter) boxes"],
  "Restaurants, hotels, bakeries, food processors",
  ["Width","Length","Micron","Food-contact documentation"],["Branded dispenser box"],"film",["CO-09","PL-11"],
  "Cling film dispenser box tearing film over a bowl.",
  merged="Plastic cling wraps; Food wrapping films",
  flags="SUP-partial",
  note="Must not be marketed for wrapping sweet boxes (prohibited use since 1 July 2022)."),
P("PL-08","PL-C","Air Bubble Film","air-bubble-film",3,
  "Air bubble film rolls and bags for cushioning fragile goods in transit.",
  ["Rolls","Bubble bags","Laminated with paper / foil (to confirm)"],
  "E-commerce, electronics, glassware, automotive parts",
  ["Width","Bubble size","Layer count"],[],"film",["CR-07","PL-10","CR-04"],
  "Glassware partly wrapped in bubble film in a mailer box.",
  note="Proposed omission: 'protective wrapping' appears in the automotive and e-commerce mappings with no product behind it."),
# ── PLASTIC · Flexible
P("PL-09","PL-D","LDPE Bags, Pouches & Films","ldpe-pouches-films",1,
  "LDPE film, tubing, liners, flat pouches and zip pouches, plain or printed.",
  ["Flat pouches","Zip-lock pouches (to confirm)","Tubing & sheeting","Bin & carton liners"],
  "Food, industrial, pharma distribution, retail",
  ["Dimensions","Micron","Printed / plain","Closure"],["Printing"],"pouch",["PL-10","PL-12","PL-06"],
  "Clear LDPE zip pouches with components, flat-lay.",
  merged="LDPE pouches; LDPE films; Flexible packaging films",
  note="Carry bags must meet the 120-micron minimum (PWM Rules); positioned as packaging pouches, not carry bags."),
P("PL-10","PL-D","Courier & Mailer Bags","courier-bags",3,
  "Opaque tamper-evident courier bags with permanent adhesive seal, plain or branded.",
  ["With / without POD jacket","Plain & printed","Sizes for apparel and documents"],
  "E-commerce, D2C, courier companies",
  ["Size","Micron","Colour","Print"],["Brand print"],"pouch",["CO-03","CR-04","PA-24"],
  "Grey courier bags with a branded one sealed, top-down.",
  note="Proposed: conventional counterpart to compostable courier bags; the e-commerce mapping needs it."),
P("PL-11","PL-D","Printed Laminated Pouches","laminated-pouches",1,
  "Multi-layer printed pouches for food and consumer products that need barrier and shelf presence.",
  ["Stand-up with zip","Three-side seal","Centre-seal","Gusseted"],
  "Food manufacturers, snacks, spices, pet food, personal care",
  ["Structure (e.g. PET/PE, BOPP/CPP, metallised)","Dimensions","Barrier need","Closure"],["Rotogravure / digital print (to confirm)","Windows, tear notch"],"pouch",["PL-12","PL-01","CO-06"],
  "Row of printed stand-up pouches with spill of contents.",
  merged="Printed plastic pouches"),
P("PL-12","PL-D","Laminated Roll Stock","laminated-roll-stock",2,
  "Printed laminate rolls for form-fill-seal machines.",
  ["Two- and three-layer laminates","Printed"],
  "Food manufacturers, FMCG",
  ["Structure","Width","Repeat length","Machine"],["Printing"],"film",["PL-11","PL-01"],
  "Printed laminate roll feeding a vertical FFS former (detail).",
  merged="Laminated packaging films",
  note="'Where available' in brief."),
# ── PLASTIC · Containers
P("PL-13","PL-E","Plastic Food Containers","plastic-food-containers",1,
  "Rigid PP and PET containers and tubs with lids for takeaway, delivery, storage and retail food.",
  ["Round and rectangular PP containers","Microwave-safe (to confirm per grade)","Tamper-evident","Tubs for sweets and dairy"],
  "Restaurants, cloud kitchens, sweet shops, food manufacturers",
  ["Capacity","Material","Lid type","Temperature range"],["Printed / labelled lids"],"container",["PA-16","CO-10","PL-14"],
  "Stack of clear PP takeaway containers with curry, lids on.",
  merged="Plastic takeaway containers; Plastic tubs"),
P("PL-14","PL-E","Plastic Trays & Clamshells","plastic-trays-clamshells",2,
  "PET and PP clamshells and trays for bakery, fruit and display food.",
  ["Hinged clamshells","Bakery trays","Produce punnets"],
  "Bakeries, supermarkets, produce",
  ["Size","Material","Lid"],[],"container",["PL-13","CO-11"],
  "Clear clamshell with pastries, bakery display.",
  flags="SUP",
  merged="Plastic trays",
  note="'Trays' are on India's SUP prohibited list. Hold until Merova confirms which formats are lawful to supply."),
# ── PLASTIC · Cups
P("PL-15","PL-F","PET Glasses","pet-glasses",1,
  "Clear PET cups for cold beverages, juices and shakes, with flat or dome lids.",
  ["Capacities by serve","Flat and dome lids","Printed (on enquiry)"],
  "Juice bars, QSR, cinemas, cafés",
  ["Capacity","Rim diameter","Lid"],["Printing"],"cup",["PL-16","PA-07","CO-12"],
  "Clear PET glass with iced coffee, dome lid, condensation.",
  flags="SUP",
  note="Disposable 'cups, glasses' are on India's SUP prohibited list. Hold pending legal confirmation."),
P("PL-16","PL-F","PP Glasses & Cups","pp-glasses",1,
  "Translucent PP cups for water, beverages and vending.",
  ["Capacities","Plain"],
  "Offices, events, vending, catering",
  ["Capacity","Material weight"],[],"cup",["PL-15","PA-07"],
  "Stack of PP glasses, clean studio.",
  flags="SUP",
  merged="Plastic cups",
  note="Disposable 'cups, glasses' are on India's SUP prohibited list. Hold pending legal confirmation."),
# ── COMPOSTABLE · Bags
P("CO-01","CO-A","Compostable Carry Bags","compostable-carry-bags",1,
  "Certified-compostable carry bags for retail and food counters, in W-cut, D-cut and loop-handle styles.",
  ["W-cut / vest","D-cut","Loop handle","Printed or plain"],
  "Supermarkets, retail, sweet shops, restaurants, pharmacies",
  ["Size","Thickness","Certification (industrial / home)","CPCB certificate number"],["Printing"],"compost",["CO-02","PA-20","CO-03"],
  "Compostable carry bag with groceries, natural light, no leaf motifs.",
  merged="Compostable shopping bags"),
P("CO-02","CO-A","Compostable Garbage Bags","compostable-garbage-bags",1,
  "Compostable bin liners on rolls for kitchen, food and organic waste.",
  ["Rolls with perforation","Sizes for household to commercial bins"],
  "Hotels, offices, hospitals, households, food businesses",
  ["Size","Thickness","Certification"],[],"compost",["CO-01","CO-05"],
  "Roll of compostable bin liners beside a kitchen caddy.",),
P("CO-03","CO-A","Compostable Courier & E-commerce Bags","compostable-courier-bags",1,
  "Compostable mailers and pouches with adhesive seal for e-commerce dispatch.",
  ["Courier bags with seal","Zip / slider e-commerce pouches"],
  "E-commerce, D2C, apparel",
  ["Size","Thickness","Certification","Print"],["Printing"],"compost",["PL-10","CR-04","CO-06"],
  "Folded apparel in a printed compostable mailer, top-down.",
  merged="Compostable e-commerce pouches; Compostable courier bags"),
P("CO-04","CO-A","Compostable Nursery Bags","compostable-nursery-bags",1,
  "Compostable grow bags for saplings and nursery plants.",
  ["Sizes by sapling","Perforated"],
  "Nurseries, horticulture, forestry, landscaping",
  ["Size","Thickness","Certification","Field life required"],[],"compost",["CO-01","CR-09"],
  "Saplings in compostable nursery bags on a potting bench.",),
P("CO-05","CO-A","Compostable Laundry Bags","compostable-laundry-bags",1,
  "Compostable laundry bags for hotel and institutional laundry services.",
  ["Drawstring","Printed with room / list panel"],
  "Hotels, hospitals, laundries",
  ["Size","Thickness","Certification","Print"],["Printing"],"compost",["CO-02","CO-01"],
  "Folded towels beside a printed compostable laundry bag.",
  note="Low search priority; keep as a product page only if Merova confirms supply."),
# ── COMPOSTABLE · Flexible
P("CO-06","CO-B","Compostable Pouches","compostable-pouches",1,
  "Compostable stand-up and flat pouches for dry food, retail and consumer products.",
  ["Stand-up","Flat","With zip (to confirm)"],
  "Food brands, tea & coffee, retail",
  ["Size","Structure","Barrier need","Certification"],["Printing"],"compost",["CO-07","PL-11"],
  "Kraft-look compostable stand-up pouch with coffee beans.",),
P("CO-07","CO-B","Compostable Packaging Films & Rolls","compostable-films-rolls",1,
  "Compostable film, tubing and sleeves on rolls for converting, wrapping and product packaging.",
  ["Flat film rolls","Tubing","Product sleeves"],
  "Converters, food manufacturers, retail",
  ["Width","Thickness","Certification"],["Printing"],"compost",["CO-08","CO-09","CO-06"],
  "Compostable film roll, matte translucency, studio.",
  merged="Compostable packaging films; Compostable packaging rolls; Compostable sleeves; Compostable wrapping films (3B)"),
# ── COMPOSTABLE · Shrink & cling
P("CO-08","CO-C","Compostable Shrink Film","compostable-shrink-film",1,
  "Compostable shrink film for bundling and overwrapping where a certified alternative is required.",
  ["Centre-folded","Single-wound"],
  "FMCG, food, retail",
  ["Width","Thickness","Shrink properties","Certification"],[],"compost",["PL-03","CO-07"],
  "Shrink-wrapped bundle with compostable film roll.",),
P("CO-09","CO-C","Compostable Cling Wrap","compostable-cling-wrap",1,
  "Compostable cling wrap for covering and wrapping food in kitchens and food service.",
  ["Catering rolls","Dispenser boxes"],
  "Restaurants, hotels, bakeries, households",
  ["Width","Length","Certification","Food-contact documentation"],[],"compost",["PL-07","CO-07"],
  "Cling wrap over a bowl of cut fruit.",
  merged="Compostable wrapping films (3C) — merged; brief listed wrapping film three times"),
# ── COMPOSTABLE · Foodservice
P("CO-10","CO-D","Compostable Food Containers","compostable-food-containers",1,
  "Compostable clamshells, bowls and tubs for takeaway and delivery, in moulded fibre and other certified materials.",
  ["Clamshells","Bowls with lids","Tubs","Meal boxes"],
  "Restaurants, cloud kitchens, caterers, events",
  ["Capacity","Material","Lid","Hot / oil resistance","Certification"],["Embossed logo (on enquiry)"],"compost",["CO-11","CO-12","CO-13"],
  "Moulded-fibre clamshell with a meal, matte texture macro.",
  merged="Compostable containers; Compostable tubs; Compostable takeaway packaging"),
P("CO-11","CO-D","Compostable Trays & Plates","compostable-trays-plates",1,
  "Compostable compartment trays and plates for meals, events and catering.",
  ["Compartment meal trays","Plates","Snack trays"],
  "Caterers, events, cinemas, cafeterias",
  ["Size","Compartments","Material","Certification"],[],"compost",["CO-10","CO-13"],
  "Five-compartment fibre meal tray with thali, overhead.",
  merged="Compostable trays"),
P("CO-12","CO-D","Compostable Cups","compostable-cups",1,
  "Certified-compostable hot and cold cups — compostable-lined paper cups and clear compostable cold cups.",
  ["Compostable-lined paper cups","Clear compostable cold cups (to confirm)","Lids (to confirm)"],
  "Cafés, cinemas, events, offices",
  ["Capacity","Lining / material","Certification"],["Printing"],"compost",["PA-07","CO-10"],
  "Compostable-lined cup with latte; certification text on base (only if certified).",
  note="Paper Cups page lists conventional linings and links here for certified-compostable options (no duplicate)."),
P("CO-13","CO-D","Compostable Cutlery","compostable-cutlery",1,
  "Compostable spoons, forks, knives and stirrers for takeaway and events.",
  ["Spoons, forks, knives","Stirrers","Kits (to confirm)"],
  "QSR, cloud kitchens, ice cream, events",
  ["Material","Length","Certification","Heat resistance"],[],"compost",["CO-10","CO-11"],
  "Fan of compostable cutlery on linen, studio.",),
# ── CORRUGATED · Boxes
P("CR-01","CR-A","3-Ply Corrugated Boxes","3-ply-corrugated-boxes",1,
  "Single-wall corrugated boxes for light-to-medium goods, retail supply and e-commerce.",
  ["Regular slotted carton (RSC)","Half-slotted","Printed (1–2 colours)","Plain brown / white top"],
  "FMCG, food, pharma distribution, e-commerce, retail",
  ["Internal dimensions","Flute (B / C / E)","Paper GSM & BF","Bursting strength / ECT (to confirm)","Print"],["Flexo print","Custom sizes"],"corrugated",["CR-02","CR-04","CR-06"],
  "Stack of brown 3-ply RSCs, one open showing flute edge, warehouse light.",
  merged="Regular slotted cartons (default style); Printed corrugated boxes (option); Custom corrugated boxes (custom route)"),
P("CR-02","CR-A","5-Ply Corrugated Boxes","5-ply-corrugated-boxes",1,
  "Double-wall corrugated boxes for heavier, stacked and longer-distance shipments.",
  ["RSC","Half-slotted","Printed","Double-wall flute combinations"],
  "Food manufacturers, FMCG, auto components, electricals, export",
  ["Internal dimensions","Flute combination","Paper GSM & BF","Load & stacking","Print"],["Flexo print","Custom sizes"],"corrugated",["CR-01","CR-03","CR-05"],
  "5-ply carton cut-away showing two flute layers, macro.",
  merged="Industrial shipping cartons (by ply)"),
P("CR-03","CR-A","7-Ply Corrugated Boxes","7-ply-corrugated-boxes",2,
  "Triple-wall corrugated boxes for heavy industrial and bulk loads.",
  ["RSC","Bulk / pallet boxes"],
  "Engineering, automotive, industrial, export",
  ["Internal dimensions","Load","Paper specification"],["Print"],"corrugated",["CR-02","CR-05"],
  "Large 7-ply box on a pallet with machined parts.",
  note="'Where available' in brief."),
P("CR-04","CR-A","Die-Cut Corrugated Boxes","die-cut-corrugated-boxes",1,
  "Precision die-cut corrugated boxes with locking tabs and crash-lock bases — no glue or tape required.",
  ["Roll-end tuck front","Crash-lock base","Tray with lid","Micro-flute (E / F) printed"],
  "Retail, food delivery, electronics, subscription boxes",
  ["Dimensions","Flute","Board grade","Print"],["Litho-lam / flexo print (to confirm)","Custom dielines"],"corrugated",["CR-06","CR-07","CR-01"],
  "Printed die-cut box opening to show a locked tuck flap.",),
P("CR-05","CR-A","Heavy-Duty & Export Cartons","heavy-duty-export-cartons",1,
  "High-strength 5- and 7-ply cartons specified for export, bulk and industrial shipments, with export markings.",
  ["Export cartons","Heavy-duty RSCs","Bulk boxes","Cartons with pallets / liners"],
  "Exporters, engineering, automotive, chemicals",
  ["Dimensions","Load & stacking","Moisture exposure","Marking requirements"],["Shipping marks","Liners & inserts"],"corrugated",["CR-02","CR-03","CR-07","PL-06"],
  "Export-marked heavy-duty cartons on a pallet, container door.",
  merged="Export cartons; Heavy-duty corrugated boxes; Industrial shipping cartons; Bulk packaging boxes; Export packaging"),
P("CR-06","CR-A","E-commerce Shipping Boxes","ecommerce-boxes",1,
  "Mailer and shipper boxes sized for courier networks — with tear strips, self-seal and branded print options.",
  ["Mailer boxes","Shipper RSCs by size","Tear strip / self-seal (to confirm)","Printed inside / outside"],
  "E-commerce, D2C, marketplace sellers",
  ["Dimensions","Flute","Closure","Print"],["Brand print"],"corrugated",["CR-04","PL-10","CO-03","CR-07"],
  "Branded red mailer box half-opened with tissue and product.",
  merged="E-commerce shipping boxes; Corrugated mailer boxes"),
# ── CORRUGATED · Boards
P("CR-07","CR-C","Corrugated Inserts & Pads","corrugated-inserts-pads",1,
  "Die-cut fitments, pads and protective inserts that hold products still inside the shipper.",
  ["Die-cut fitments","Pads & layer sheets","Edge & corner protectors (to confirm)"],
  "Electronics, glassware, automotive parts, e-commerce",
  ["Product & cavity dimensions","Board","Fit tolerance"],["Custom dielines"],"corrugated",["CR-09","CR-04","PL-08"],
  "Die-cut insert cradling a glass bottle inside a shipper.",
  merged="Protective inserts; Corrugated pads; Custom protective packaging"),
P("CR-08","CR-B","Corrugated Sheets & Rolls","corrugated-sheets-rolls",1,
  "Corrugated board sheets and single-face rolls for wrapping, layering and conversion.",
  ["Single-wall sheets","Double-wall sheets","2-ply single-face rolls (to confirm)"],
  "Converters, furniture, glassware, industrial, e-commerce",
  ["Sheet size / roll width","Flute","Board grade"],["Cut-to-size"],"corrugated",["CR-07","CR-01","PA-28"],
  "Stack of corrugated sheets beside a single-face roll, flute macro.",
  merged="Corrugated sheets; Corrugated boards; Single-wall boards; Double-wall boards"),
P("CR-09","CR-C","Corrugated Partitions & Dividers","corrugated-partitions",1,
  "Interlocking partitions that separate bottles, jars and components inside cartons.",
  ["Interlocking cell partitions","Dividers & separators"],
  "Beverages, pharma, glassware, auto components",
  ["Cell count & size","Height","Board"],[],"corrugated",["CR-07","CR-02","PA-02"],
  "Overhead of a carton with interlocking partition and bottles.",
  merged="Corrugated partitions; Corrugated dividers"),
P("CR-10","CR-C","Corrugated Trays","corrugated-trays",1,
  "Open corrugated trays for produce, shrink-wrapped bundles and bulk handling.",
  ["Open trays","Shrink trays","Produce trays","Stackable trays"],
  "Beverages, FMCG, agriculture, food manufacturers",
  ["Dimensions","Wall height","Board","Stacking"],["Print"],"corrugated",["PL-05","CR-11","CR-01"],
  "Corrugated tray with shrink-wrapped bottles.",),
# ── CORRUGATED · Retail-ready
P("CR-11","CR-D","Retail-Ready & Display Packaging","retail-ready-display",1,
  "Shelf-ready cases and counter displays that go from transit to shelf in one step.",
  ["Shelf-ready cases (tear-away front)","Counter display units","Floor display units (to confirm)"],
  "FMCG, confectionery, personal care, supermarkets",
  ["Dimensions","Opening feature","Print","Load"],["High-graphics print"],"corrugated",["CR-10","CR-04","PA-01"],
  "Printed counter display with products, retail shelf context.",
  merged="Retail-ready corrugated packaging; Display packaging"),
]
# Pizza boxes cross-reference and cup carriers
PRODUCTS.append(P("PA-31","PA-C","Cup Carriers","cup-carriers",3,
  "Two- and four-cup carriers for takeaway beverages, in moulded fibre or board.",
  ["2-cup","4-cup","Moulded fibre or paperboard"],
  "Cafés, QSR, cinemas",
  ["Cup sizes","Material"],[],"foodservice",["PA-07","PA-18"],
  "Four-cup fibre carrier with branded cups, café counter.",
  note="Proposed omission: needed wherever cups are sold for takeaway."))

# ───────────────────────── Industries & operators ─────────────────────────
# operator: (id, name, slug, page?, primary[], secondary[])
def O(id, name, slug, page, primary, secondary, note=""):
    return dict(id=id, name=name, slug=slug, page=page, primary=primary, secondary=secondary, note=note)

INDUSTRIES = [
 dict(id="food-beverage", name="Food & Beverage", slug="food-beverage", ops=[
   O("sweet-shops","Sweet Shops & Mithai Stores","sweet-shops",True,
     ["PA-03","PA-06","PA-05","PA-20","PA-26","PA-25","PA-23","CR-01"],
     ["PA-21","PA-27","PL-13","PL-07","CO-01","CO-10","CR-09","CR-07"]),
   O("bakeries","Bakeries & Patisseries","bakeries",True,
     ["PA-04","PA-21","PA-26","PA-27","PA-23","PA-20"],
     ["PL-13","PL-14","PL-07","CO-10","CO-01","CO-09","CR-01"]),
   O("multiplex-cinema","Multiplexes & Cinemas","multiplex-cinema",True,
     ["PA-09","PA-10","PA-11","PA-12","PA-07","PA-18","PA-15","CR-01"],
     ["PA-20","PA-31","PL-15","PL-16","PL-13","CO-12","CO-10","CO-11","CO-13","CO-01","CR-02"]),
   O("restaurants-cafes","Restaurants & Cafés","restaurants-cafes",True,
     ["PA-07","PA-16","PA-17","PA-13","PA-14","PA-21","PA-27","PA-26","CO-10"],
     ["PA-18","PA-31","PA-15","PL-13","PL-15","PL-16","PL-07","PL-09","CO-12","CO-13","CO-01","CO-09","CR-01","CR-04"]),
   O("qsr","Quick Service Restaurants","quick-service-restaurants",True,
     ["PA-13","PA-12","PA-07","PA-15","PA-21","PA-27","PA-18"],
     ["PA-31","PA-19","PL-15","PL-16","PL-13","CO-10","CO-11","CO-12","CO-13","CR-01","CR-02"]),
   O("ice-cream-desserts","Ice Cream & Dessert Businesses","ice-cream-desserts",True,
     ["PA-08","PA-18","PA-23","CO-13"],
     ["PA-16","PL-13","PL-15","PL-16","CO-12","CO-10","CR-01"]),
   O("cloud-kitchens","Cloud Kitchens & Food Delivery","cloud-kitchens",True,
     ["PA-17","PA-16","PA-21","PL-13","CO-10","CO-13","PA-25"],
     ["PA-27","PA-07","PA-18","PL-15","PL-16","PL-07","PL-09","CO-01","CO-06","CR-04","CR-01"]),
   O("food-manufacturers","Food Manufacturers & Processors","food-manufacturers",True,
     ["PA-01","PA-23","PL-01","PL-03","PL-11","PL-12","CR-01","CR-02"],
     ["PA-28","PL-07","PL-09","PL-05","PL-02","CO-06","CO-07","CO-08","CR-10","CR-11","PL-06"]),
   O("supermarkets","Supermarkets & Retail Food Stores","supermarkets",True,
     ["PA-20","PA-23","PA-24","CO-01","CR-01","CR-11"],
     ["PA-01","PA-26","PL-07","PL-09","PL-13","CO-06","CR-10"]),
 ]),
 dict(id="pharma-healthcare", name="Pharmaceuticals & Healthcare", slug="pharmaceuticals-healthcare", ops=[
   O("pharma-manufacturers","Pharmaceutical Manufacturers","pharmaceutical-manufacturers",True,
     ["PA-02","PA-30","PA-23","CR-01","CR-02","CR-09"],
     ["PA-01","PA-24","PL-09","PL-11"],
     note="Ordinary secondary/tertiary packaging only; validated primary or sterile packaging is out of scope unless Merova confirms."),
   O("pharma-distributors","Pharmaceutical Distributors","pharmaceutical-distributors",False,
     ["CR-01","CR-02","PA-24"],["PL-09","PL-06","CR-07"]),
   O("medical-devices","Medical Device Businesses","medical-devices",True,
     ["PA-01","PA-02","PA-30","PA-23","CR-07","CR-01"],["PA-05","PL-09","PL-08"]),
   O("hospitals-labs","Hospitals & Diagnostic Laboratories","hospitals-labs",False,
     ["PA-23","PA-24","PL-09","CO-02"],["PA-30","CR-01"]),
   O("pharmacies","Pharmacies","pharmacies",False,
     ["PA-20","PA-23","CO-01"],["PL-09","PA-24"]),
 ]),
 dict(id="retail", name="Retail & Consumer Goods", slug="retail-consumer-goods", ops=[
   O("apparel-footwear","Apparel & Footwear Brands","apparel-footwear",True,
     ["PA-01","PA-20","PA-22","PA-23","CR-06","PL-10"],["PA-05","PA-28","CO-03","CO-01","PL-09"]),
   O("jewellery","Jewellery Retailers","jewellery",True,
     ["PA-05","PA-22","PA-25"],["PA-06","PA-23","CR-07"]),
   O("cosmetics-personal-care","Cosmetics & Personal Care","cosmetics-personal-care",True,
     ["PA-01","PA-02","PA-23","PA-05","CR-11"],["PA-22","PL-03","PL-04","PL-11","CR-01"]),
   O("electronics-retail","Electronics & Appliances","electronics-appliances",True,
     ["PA-01","PA-05","CR-07","CR-02","PA-24"],["PL-08","PL-09","CR-04"],
     note="Covers electronics retailers and appliance brands (brief Part 4.8)."),
   O("department-lifestyle","Department & Lifestyle Stores","department-lifestyle-stores",False,
     ["PA-20","PA-22","PA-23","PA-25"],["CO-01","PA-28","CR-01"]),
 ]),
 dict(id="ecommerce-logistics", name="E-commerce & Logistics", slug="ecommerce-logistics", ops=[
   O("ecommerce-d2c","E-commerce, D2C & Marketplace Sellers","ecommerce-d2c",True,
     ["CR-06","CR-04","PL-10","CO-03","PA-24","PL-08"],["CR-07","PA-30","PA-25","PA-28","CR-08","PL-09"]),
   O("fulfilment-3pl","Fulfilment Centres, 3PL & Warehousing","fulfilment-3pl-warehousing",True,
     ["CR-01","CR-02","PL-06","PA-24","PL-10"],["CR-08","CR-07","PL-08","CO-03"]),
   O("courier","Courier Businesses","courier",False,
     ["PL-10","CO-03","PA-24"],["CR-06"]),
 ]),
 dict(id="automotive-industrial", name="Automotive & Industrial", slug="automotive-industrial", ops=[
   O("automotive","Automotive Manufacturers & Component Suppliers","automotive-components",True,
     ["CR-02","CR-03","CR-05","CR-09","CR-07","PA-24"],["PL-06","PL-08","PL-09","CR-08"]),
   O("engineering-electrical","Engineering & Electrical Equipment","engineering-electrical",True,
     ["CR-05","CR-02","CR-07","PA-24","PL-06"],["PL-08","PL-09","CR-03","CR-08"]),
   O("spare-parts","Spare-Parts & Industrial Distributors","spare-parts-distribution",False,
     ["CR-01","CR-09","PA-24","PL-09"],["PL-06","CR-08"]),
 ]),
 dict(id="corporate-publishing", name="Corporate, Publishing & Marketing", slug="corporate-publishing-marketing", ops=[
   O("corporates","Corporates","corporates",True,
     ["PA-29","PA-30","PA-22","PA-06"],["PA-23","PA-05","CR-01"]),
   O("agencies-events","Marketing & Advertising Agencies, Event Organisers","agencies-events",True,
     ["PA-29","PA-30","PA-25","PA-22","PA-20"],["PA-05","PA-06","CR-04"]),
   O("publishers-education","Publishers & Educational Institutions","publishers-education",False,
     ["PA-29","PA-30"],["CR-01","PA-20","PL-02"],
     note="BOPP films listed as secondary for print finishers (lamination film)."),
 ]),
 dict(id="hospitality", name="Hospitality & Catering", slug="hospitality-catering", ops=[
   O("hotels-catering","Hotels, Caterers & Banquets","hotels-catering",True,
     ["CO-05","CO-02","PL-07","PA-16","CO-11","PA-07"],["CO-10","CO-13","PA-27","PA-26","PA-22","CO-09"]),
 ]),
 dict(id="gifting", name="Gifting & Celebrations", slug="gifting-celebrations", ops=[
   O("gifting","Corporate & Festive Gifting","corporate-festive-gifting",True,
     ["PA-06","PA-05","PA-22","PA-03","PA-25"],["PA-28","CR-06","CR-07"]),
 ]),
 dict(id="agri-horticulture", name="Agriculture & Horticulture", slug="agriculture-horticulture", ops=[
   O("nurseries-agri","Nurseries & Produce Growers","nurseries-produce",True,
     ["CO-04","CR-10","CR-01"],["PL-14","PA-23"],
     note="Recommended for Phase 2 unless Merova confirms nursery bags and produce trays."),
 ]),
]

# ───────────────────────── Dedup register (beyond the per-product 'merged' field) ─────────────────────────
DEDUP = [
 ("Butter paper; Greaseproof paper", "Listed in both 1C and 1F", "Merged → PA-26 in Food Wraps & Specialty Papers", "Same buyers, same page intent; one page ranks for both terms."),
 ("Paper food wraps; Specialised food wrapping sheets; Printed food wrapping paper", "Three names for one product", "Merged → PA-27", "Printed branded wrap sheets are one product with base-paper variants."),
 ("Compostable wrapping films (3B), Compostable wrapping films (3C), Compostable cling wraps", "Listed three times", "Cling → CO-09; general wrapping film → CO-07", "Cling (self-adhesive food wrap) differs from general film; the duplicate entry removed."),
 ("Compostable sleeves", "Ambiguous: tubular sleeve vs shrink sleeve", "Variant of CO-07 (tubular); shrink sleeves under CO-08 if supplied", "Prevents a thin standalone page."),
 ("Pharmaceutical cartons (existing page)", "A mono carton for a specific industry", "Variant of PA-02; pharma covered by the industry page", "Avoids cannibalising 'mono cartons'. 301 redirect."),
 ("Window cartons; Printed sleeves; Food cartons; Display packaging (existing pages)", "Formats or applications of folding cartons", "Variants of PA-01 / CR-11", "Kept as variants and anchor sections. 301 redirects."),
 ("Paper cups; Hot beverage cups; Cold beverage cups; Beverage cups", "One product with wall/use variants", "PA-07", "Brief example; no capacity-level pages."),
 ("Paper tubs", "Used for ice cream and food", "Ice cream tubs → PA-08; food tubs → PA-16", "Split by application, no standalone 'tubs' page."),
 ("Paper food trays vs Nachos trays", "Similar construction", "Kept separate (PA-15, PA-11)", "Nachos trays are a dedicated concession SKU with a dip well; distinct search and buyer."),
 ("Burger boxes vs Sandwich boxes", "Similar category", "Kept separate (PA-13, PA-14)", "Different construction (clamshell vs wedge) and buyer."),
 ("Rigid boxes vs Premium gift boxes", "Overlap", "Kept separate (PA-05 construction-led, PA-06 occasion-led)", "Gift & hamper buyers search by occasion and need folding options too."),
 ("Kraft bags; Retail shopping bags; Printed bags; Custom branded bags", "Four names for machine-made carry bags", "Merged → PA-20", "Premium (PA-22) and food bags (PA-21) kept separate: different manufacture and buyers."),
 ("Custom printed packaging collateral", "Undefined product", "Removed", "Covered by inserts (PA-30), labels (PA-23) and sleeves (PA-01)."),
 ("Custom paperboard packaging; Custom premium boxes; Custom corrugated boxes; Custom protective packaging", "Customisation, not a product", "Removed as products; routed to the Custom Requirement journey", "Every product is customisable; one custom route avoids four thin pages."),
 ("Regular slotted cartons; Printed corrugated boxes", "Style and print options of every ply", "Variants of CR-01/02/03", "Ply is how Indian buyers specify; RSC is the default style."),
 ("Export cartons; Heavy-duty boxes; Industrial shipping cartons; Bulk boxes; Export packaging", "Listed in both 4A and 4D", "Merged → CR-05", "One heavy-duty/export page; industrial RSCs covered by ply pages."),
 ("Corrugated sheets; boards; single-wall; double-wall", "Constructions of one product", "Merged → CR-08", ""),
 ("Corrugated partitions; dividers", "Synonyms", "Merged → CR-09", ""),
 ("Protective inserts; pads; custom protective packaging", "One product family", "Merged → CR-07", ""),
 ("E-commerce shipping boxes vs Die-cut boxes", "Mailers are die-cut", "Mailers live on CR-06 only; CR-04 covers non-mailer die-cut styles", "Prevents two pages competing for 'mailer box'."),
 ("Compostable e-commerce pouches; Compostable courier bags", "Same dispatch use", "Merged → CO-03", ""),
 ("Compostable containers; food containers; tubs; takeaway packaging", "Four names for one family", "Merged → CO-10", ""),
 ("Compostable cups vs Paper cups", "Both may be paper-based", "Category by certification: conventional lining → PA-07; certified compostable → CO-12", "Cross-linked; never listed twice."),
 ("Plastic cups (generic); PP glasses", "Same product", "Merged → PL-16", ""),
 ("Plastic food containers; takeaway containers; tubs", "One family", "Merged → PL-13", ""),
 ("LDPE pouches; LDPE films; flexible packaging films", "One material family", "Merged → PL-09", ""),
 ("PVC cling films; plastic cling wraps; food wrapping films", "Synonyms", "Merged → PL-07", ""),
 ("Paper cup sleeves (1C) vs Printed sleeves (existing)", "Different products", "Cup sleeves PA-18; carton sleeves → variant of PA-01", ""),
 ("Pizza boxes", "Paperboard or E-flute corrugated", "Single page in Paper (PA-19) with a micro-flute variant; cross-linked from Corrugated", "Decision D-04."),
]

EXCLUDED = [
 ("Tissue, kitchen and toilet rolls; hygiene paper", "Brief boundary"),
 ("Books, diaries, notebooks, registers, general stationery", "Brief boundary"),
 ("Paper straws, wooden stirrers, napkins", "Foodservice disposables, not printing or packaging"),
 ("Household plastic goods", "Brief boundary"),
 ("Thermocol / EPS packaging", "Outside the four material categories; partly restricted in India"),
 ("Gummed paper tape / BOPP tape", "Considered; not added. Can be added later as a sourced accessory if Merova supplies it."),
]

# ───────────────────────── Verification register ─────────────────────────
VERIFY = [
 # (id, area, item, why, owner, priority, blocks)
 ("V-01","Legal","Registered company name, GSTIN, CIN","Footer, Organization schema, Terms, PDFs","Merova","P0","Launch"),
 ("V-02","Contact","Phone, sales email, office & plant addresses, business hours","Contact page, footer, PDFs, schema","Merova","P0","Launch"),
 ("V-03","Contact","Official WhatsApp Business number","Persistent WhatsApp module","Merova","P0","WhatsApp"),
 ("V-04","Portfolio","Tick each product in the register: confirmed / supply route (in-house, partner) / remove","Every product page, flyer and Mira's knowledge","Merova","P0","Product pages"),
 ("V-05","Compliance","Legal basis for PET glasses, PP glasses, plastic trays and cling film in India (SUP prohibition from 1 July 2022)","Products flagged SUP are held","Merova + legal","P0","4 products"),
 ("V-06","Compliance","CPCB certificate numbers and IS/ISO 17088 (or EN 13432) certificates per compostable grade; industrial vs home","Every compostable claim and logo","Merova","P0","Compostable category"),
 ("V-07","Specs","Per-product ranges: GSM, micron, flute, BF/ECT, size limits, tolerances, MOQ, lead time","Spec tables and flyers (otherwise 'confirmed at quotation')","Merova","P1","Spec depth"),
 ("V-08","Compliance","Food-contact documentation per material (cups, containers, wraps, films)","Foodservice and film pages","Merova","P1","Food-contact statements"),
 ("V-09","Credibility","Certifications (ISO 9001, FSSC 22000, FSC, etc.): number, scope, validity","Quality page; logos only with evidence","Merova","P1","Quality page"),
 ("V-10","Credibility","Plant locations, machinery list, capacities, year established","Manufacturing & Infrastructure page, company profile","Merova","P1","Manufacturing page"),
 ("V-11","Imagery","Genuine facility photography and video (or permission to commission a shoot)","Hero film, manufacturing page","Merova","P1","Hero film"),
 ("V-12","Imagery","Existing genuine product photographs","Replace generated imagery where available","Merova","P1",""),
 ("V-13","Brand","Compact horizontal lockup and standalone wordmark (header use); ™ vs ® status","Header at 32–40 px height","Merova","P1","Header lockup"),
 ("V-14","Brand","Typeface used for the wordmark and brand sheet, and its licence","Optional self-hosted brand font","Merova","P2",""),
 ("V-15","People","Leadership names, roles, photographs (with consent)","Leadership page","Merova","P2","Leadership page"),
 ("V-16","Credibility","Client logos, testimonials, case studies with written permission","Trust sections","Merova","P2",""),
 ("V-17","Sustainability","Recycled-content %, waste data, any measured outcomes","Sustainability page","Merova","P1",""),
 ("V-18","Integrations","Enquiry channel: Resend API key + verified domain, or CRM webhook","RFQ, contact, basket","Merova","P0","Forms"),
 ("V-19","Integrations","Anthropic API key for Mira; usage budget","Mira AI mode","Merova","P0","Mira"),
 ("V-20","Integrations","GA4, GTM, Search Console access","Analytics","Merova","P1","Analytics"),
 ("V-21","Integrations","File storage for uploads (Vercel Blob or CRM)","RFQ uploads beyond email size limit","Merova + dev","P1",""),
 ("V-22","Domain","Production domain (e.g. merova.in / merovaprintpack.com) and DNS access","Canonicals, PDFs, QR codes","Merova","P0","Production launch"),
 ("V-23","Legal","Privacy Policy and Terms review (DPDP Act 2023)","Legal pages, consent","Legal","P0","Launch"),
 ("V-24","Content","Named technical reviewer for articles","Blog indexing","Merova","P1","Blog"),
 ("V-26","Imagery","Image source for 71 product visuals: approve a photo shoot, supply photographs, or provide an image-generation API (none is available in this build environment)","Every product page, flyer and brochure","Merova","P0","Product imagery"),
 ("V-25","Deployment","Which Vercel project is production: merova.vercel.app (other account) or merova-printpack.vercel.app","Deployment plan","Merova","P0","Deployment"),
]

DECISIONS = [
 ("D-01","Add Sweet Boxes, Cake & Bakery Boxes, Cup Carriers to Paper (status 3)","Approve / reject each"),
 ("D-02","Add PE Shrink, Stretch Film, Air Bubble Film, Courier Bags to Plastic (status 3)","Approve / reject each"),
 ("D-03","Hold SUP-flagged items (PET/PP glasses, plastic trays) until legal confirmation","Approve hold / supply legal basis"),
 ("D-04","Pizza boxes stay in Paper with a micro-flute variant","Approve / move to Corrugated"),
 ("D-05","Labels (incl. synthetic facestocks) stay in Paper Products","Approve"),
 ("D-06","URL scheme /products/{category}/{product}/ with no subcategory segment","Approve"),
 ("D-07","Industry operator pages only where 'page = Yes' (others become sections)","Approve"),
 ("D-08","Typeface pairing Sora (display) + Inter (body)","Approve / request brand font"),
 ("D-09","Header uses the supplied lockup until a compact lockup is supplied","Approve / supply lockup"),
 ("D-10","Generated product imagery labelled 'Representative image' until genuine photography exists","Approve"),
 ("D-11","Mira on Claude (Anthropic API) with retrieval over this register only","Approve + API key"),
 ("D-12","Production target: replace merova-printpack.vercel.app build; leave merova.vercel.app untouched","Approve"),
]

# ───────────────────────── Derivations ─────────────────────────
STATUS_LABEL = {1:"1 · Listed by Merova — confirm at sign-off", 2:"2 · Subject to confirmation (where available)", 3:"3 · Proposed — requires approval"}
pid = {p["id"]: p for p in PRODUCTS}

def validate():
    errs = []
    ids = [p["id"] for p in PRODUCTS]; slugs = [p["slug"] for p in PRODUCTS]
    for s in set(ids):
        if ids.count(s) > 1: errs.append(f"dup id {s}")
    for s in set(slugs):
        if slugs.count(s) > 1: errs.append(f"dup slug {s}")
    for p in PRODUCTS:
        for r in p["related"]:
            if r not in pid: errs.append(f"{p['id']} related {r} missing")
    for ind in INDUSTRIES:
        for o in ind["ops"]:
            both = o["primary"] + o["secondary"]
            for r in both:
                if r not in pid: errs.append(f"{o['id']} -> {r} missing")
            if len(set(both)) != len(both): errs.append(f"{o['id']} duplicate mapping")
    mapped = {x for ind in INDUSTRIES for o in ind["ops"] for x in o["primary"] + o["secondary"]}
    for p in PRODUCTS:
        if p["id"] not in mapped: errs.append(f"{p['id']} not mapped to any operator")
    return errs

def product_links():
    m = {p["id"]: dict(primary=[], secondary=[]) for p in PRODUCTS}
    for ind in INDUSTRIES:
        for o in ind["ops"]:
            for r in o["primary"]: m[r]["primary"].append((ind, o))
            for r in o["secondary"]: m[r]["secondary"].append((ind, o))
    return m

def url(p):
    return f"/products/{CATEGORIES[SUBCATS[p['sub']][0]]['slug']}/{p['slug']}/"

def build():
    errs = validate()
    if errs:
        print("\n".join(errs)); sys.exit(1)
    links = product_links()
    rows = []
    for p in PRODUCTS:
        cat, sub = SUBCATS[p["sub"]]
        L = links[p["id"]]
        inds = sorted({i["name"] for i, _ in L["primary"] + L["secondary"]})
        ops_p = [o["name"] for _, o in L["primary"]]
        ops_s = [o["name"] for _, o in L["secondary"]]
        rows.append(OrderedDict([
            ("Product ID", p["id"]), ("Master category", CATEGORIES[cat]["name"]), ("Subcategory", sub),
            ("Product name", p["name"]), ("Description", p["desc"]),
            ("Variants", "; ".join(p["variants"])), ("Applications", p["apps"]),
            ("Industries", "; ".join(inds)), ("Operators — primary", "; ".join(ops_p)), ("Operators — secondary", "; ".join(ops_s)),
            ("Technical attributes (configurable)", "; ".join(p["params"])), ("Customisation", "; ".join(p["custom"]) or "—"),
            ("Image brief", p["shot"]), ("Product URL", url(p)),
            ("Product flyer", f"/assets/downloads/flyers/merova-{p['slug']}.pdf"),
            ("Related products", "; ".join(f"{r} {pid[r]['name']}" for r in p["related"])),
            ("Quote fields", "; ".join(RFQ[p["rfq"]] + COMMON_RFQ)),
            ("Availability status", STATUS_LABEL[p["status"]]),
            ("Compliance flag", {"SUP":"SUP — hold", "SUP-partial":"SUP — restricted use"}.get(p["flags"], "")),
            ("Merged / replaces", p["merged"]), ("Notes", p["note"]),
            ("Merova approval (✓ / ✗ / edit)", ""),
        ]))
    # matrix
    matrix = []
    for ind in INDUSTRIES:
        for o in ind["ops"]:
            row = OrderedDict([("Industry", ind["name"]), ("Operator", o["name"]), ("Dedicated page", "Yes" if o["page"] else "Section"),
                               ("URL", f"/industries/{ind['slug']}/{o['slug']}/" if o["page"] else f"/industries/{ind['slug']}/#{o['slug']}")])
            for cat in CATEGORIES:
                pr = [pid[x]["name"] for x in o["primary"] if SUBCATS[pid[x]["sub"]][0] == cat]
                se = [pid[x]["name"] for x in o["secondary"] if SUBCATS[pid[x]["sub"]][0] == cat]
                row[CATEGORIES[cat]["name"]] = "; ".join([f"● {n}" for n in pr] + [f"○ {n}" for n in se]) or "—"
            row["Note"] = o["note"]
            matrix.append(row)
    # relationship grid
    ops_flat = [(ind, o) for ind in INDUSTRIES for o in ind["ops"]]
    rel = []
    for p in PRODUCTS:
        r = OrderedDict([("Product ID", p["id"]), ("Product", p["name"])])
        for ind, o in ops_flat:
            r[o["name"]] = "P" if p["id"] in o["primary"] else ("S" if p["id"] in o["secondary"] else "")
        r["Primary count"] = sum(1 for v in list(r.values())[2:] if v == "P")
        r["Secondary count"] = sum(1 for v in list(r.values())[2:-1] if v == "S")
        rel.append(r)
    return rows, matrix, rel, ops_flat, links

def sitemap(links):
    S = []
    add = lambda sec, title, u, parent, kind, idx="index": S.append(OrderedDict([("Section", sec), ("Page", title), ("URL", u), ("Parent", parent), ("Type", kind), ("Indexing", idx)]))
    add("Home","Home","/","—","Home")
    add("Products","All products","/products/","Home","Hub")
    for k, c in CATEGORIES.items():
        add("Products", c["name"], f"/products/{c['slug']}/", "/products/", "Category")
        for p in PRODUCTS:
            if SUBCATS[p["sub"]][0] == k:
                idx = "noindex (held)" if p["flags"] == "SUP" else ("noindex until approved" if p["status"] == 3 else "index")
                add("Products", p["name"], url(p), f"/products/{c['slug']}/", "Product", idx)
    add("Industries","All industries","/industries/","Home","Hub")
    for ind in INDUSTRIES:
        add("Industries", ind["name"], f"/industries/{ind['slug']}/", "/industries/", "Industry")
        for o in ind["ops"]:
            if o["page"]:
                add("Industries", o["name"], f"/industries/{ind['slug']}/{o['slug']}/", f"/industries/{ind['slug']}/", "Operator")
    about = [("Company Overview","/about/"),("Manufacturing & Infrastructure","/about/manufacturing/"),("Quality Assurance","/about/quality/"),
             ("Process Excellence","/about/process/"),("Client Servicing","/about/client-servicing/"),("Sustainability","/about/sustainability/"),
             ("Leadership & Team","/about/leadership/"),("Careers","/about/careers/"),("Business Partnerships","/about/partnerships/")]
    for t, u in about: add("About Merova", t, u, "/about/" if u != "/about/" else "Home", "Corporate", "noindex until content verified" if "leadership" in u else "index")
    res = [("Resources","/resources/"),("Download Centre","/resources/downloads/"),("Product Catalogue","/resources/downloads/#catalogue"),
           ("Category Brochures","/resources/downloads/#brochures"),("Product Flyers","/resources/downloads/#flyers"),("Company Profile","/resources/downloads/#profile"),
           ("Technical Resources","/resources/technical/"),("FAQs","/resources/faqs/"),("Insights","/insights/")]
    for t, u in res: add("Resources", t, u, "/resources/" if u != "/resources/" else "Home", "Resource", "—" if "#" in u else "index")
    for t, u in BLOG:
        add("Resources", t, f"/insights/{u}/", "/insights/", "Article", "noindex until reviewed")
    for t, u, i in [("Contact","/contact/","index"),("Request a Quote","/request-a-quote/","index"),("Quote basket","/request-a-quote/basket/","noindex"),
                    ("Custom Requirement","/custom-packaging/","index"),("Enquiry received","/enquiry-received/","noindex"),
                    ("Privacy Policy","/privacy-policy/","index"),("Terms","/terms/","index"),("Search","/search/","noindex")]:
        add("Contact & utility", t, u, "Home", "Utility", i)
    return S

BLOG = [
 ("How to Choose the Right Corrugated Box","how-to-choose-corrugated-box"),
 ("3-Ply vs 5-Ply vs 7-Ply Corrugated Boxes","3-ply-vs-5-ply-vs-7-ply"),
 ("Paperboard vs Corrugated Packaging","paperboard-vs-corrugated"),
 ("BOPP HST Rolls: A Buyer's Guide","bopp-hst-rolls-guide"),
 ("POF vs PVC Shrink Film","pof-vs-pvc-shrink-film"),
 ("Food Packaging for Restaurants: Choosing by Menu and Channel","restaurant-food-packaging"),
 ("Packaging for Sweet Shops: Counter, Festive and Delivery","sweet-shop-packaging"),
 ("Cinema Concession Packaging: A Complete Checklist","cinema-concession-packaging"),
 ("Compostable vs Recyclable vs Biodegradable: What Each Claim Means","compostable-vs-recyclable"),
 ("Packaging for E-commerce: Mailers, Shippers and Protection","ecommerce-packaging-guide"),
 ("Rigid Boxes vs Folding Cartons","rigid-boxes-vs-folding-cartons"),
 ("Selecting Labels: Facestock, Adhesive and Finish","selecting-product-labels"),
 ("QSR Foodservice Packaging Guide","qsr-packaging-guide"),
 ("India's Single-Use Plastic Rules: What Packaging Buyers Need to Know","india-sup-rules-packaging"),
 ("Butter Paper vs Greaseproof Paper","butter-paper-vs-greaseproof"),
]

REDIRECTS_SRC = "src/data (current build) → new URLs"

def redirects():
    # old vertical/product slugs in the current build → new URLs
    m = {
     "/corrugated-packaging":"/products/corrugated-fluted-products/","/paper-packaging":"/products/paper-products/",
     "/foodservice-packaging":"/products/paper-products/#foodservice-paper-packaging","/plastic-packaging":"/products/plastic-products-films/",
     "/custom-packaging":"/custom-packaging/","/company":"/about/","/manufacturing":"/about/manufacturing/","/quality":"/about/quality/",
     "/process":"/about/process/","/sustainability":"/about/sustainability/","/company/careers":"/about/careers/","/company/leadership":"/about/leadership/",
     "/company/partnerships":"/about/partnerships/","/company/client-service":"/about/client-servicing/","/blog":"/insights/","/custom-requirement":"/custom-packaging/",
     "/paper-packaging/pharmaceutical-cartons":"/products/paper-products/mono-cartons/","/paper-packaging/window-cartons":"/products/paper-products/folding-cartons/",
     "/paper-packaging/food-cartons":"/products/paper-products/folding-cartons/","/paper-packaging/sleeves":"/products/paper-products/folding-cartons/",
     "/paper-packaging/bakery-boxes":"/products/paper-products/cake-bakery-boxes/",
     "/industries/cinema-multiplex-packaging":"/industries/food-beverage/multiplex-cinema/","/industries/food-packaging":"/industries/food-beverage/",
     "/industries/pharmaceutical-packaging":"/industries/pharmaceuticals-healthcare/","/industries/retail-packaging":"/industries/retail-consumer-goods/",
     "/industries/ecommerce-packaging":"/industries/ecommerce-logistics/","/industries/automotive-packaging":"/industries/automotive-industrial/",
     "/industries/industrial-packaging":"/industries/automotive-industrial/","/industries/gift-packaging":"/industries/gifting-celebrations/",
     "/industries/electronics-packaging":"/industries/retail-consumer-goods/electronics-appliances/","/industries/fmcg-packaging":"/industries/food-beverage/food-manufacturers/",
    }
    return m

def write_outputs():
    rows, matrix, rel, ops_flat, links = build()
    S = sitemap(links)
    data = dict(categories=CATEGORIES, subcategories={k: dict(category=v[0], name=v[1]) for k, v in SUBCATS.items()},
                products=[dict(p, url=url(p), category=SUBCATS[p["sub"]][0], subcategory=SUBCATS[p["sub"]][1], rfq_fields=RFQ[p["rfq"]] + COMMON_RFQ) for p in PRODUCTS],
                industries=INDUSTRIES, dedup=DEDUP, excluded=EXCLUDED, verification=VERIFY, decisions=DECISIONS,
                sitemap=S, blog=BLOG, redirects=redirects())
    json.dump(data, open(f"{OUT}/register.json", "w"), indent=1, ensure_ascii=False)
    gen = os.path.join(OUT, "..", "..", "src", "data", "generated"); os.makedirs(gen, exist_ok=True)
    json.dump(data, open(os.path.join(gen, "register.json"), "w"), ensure_ascii=False)

    # ── XLSX
    from openpyxl import Workbook
    from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
    from openpyxl.utils import get_column_letter
    RED, CHAR, CLOUD = "D52B1E", "454040", "FFFAF3"
    wb = Workbook()
    def sheet(title, header, data_rows, widths=None, first=False, wrap=True, freeze="C2"):
        ws = wb.active if first else wb.create_sheet()
        ws.title = title
        ws.append(header)
        for r in data_rows: ws.append(list(r))
        for c in ws[1]:
            c.font = Font(bold=True, color="FFFFFF", name="Calibri"); c.fill = PatternFill("solid", fgColor=RED)
            c.alignment = Alignment(wrap_text=True, vertical="center")
        ws.row_dimensions[1].height = 34
        thin = Side(style="thin", color="E8E1D8")
        for row in ws.iter_rows(min_row=2):
            for c in row:
                c.alignment = Alignment(wrap_text=wrap, vertical="top"); c.border = Border(bottom=thin)
        for i, h in enumerate(header, 1):
            ws.column_dimensions[get_column_letter(i)].width = (widths or {}).get(h, 18 if len(str(h)) < 18 else 24)
        ws.freeze_panes = freeze
        ws.auto_filter.ref = ws.dimensions
        return ws
    # cover
    ws = wb.active; ws.title = "Read me"
    lines = [("Merova Printpack — Stage 1 Master Register", True), ("Single source of truth for products, industries, sitemap and open items. Generated from docs/stage-1/source/register.py.", False), ("", False),
             ("Status codes", True)] + [(v, False) for v in STATUS_LABEL.values()] + [("SUP flag: appears to fall within India's single-use plastic prohibition (in force 1 July 2022). Held from publication.", False), ("", False),
             ("How to approve", True), ("Product Register → column 'Merova approval': ✓ keep, ✗ remove, or write the correction. Return the file; Stage 2 imports it.", False), ("", False),
             ("Tabs", True), ("Product Register · Industry-Operator Matrix (● primary ○ secondary) · Product×Operator grid (P/S) · Dedup Register · Excluded · Sitemap · Redirects · Verification Register · Decisions", False), ("", False),
             (f"Totals: {len(PRODUCTS)} product types · {sum(1 for p in PRODUCTS if p['status']==1)} listed · {sum(1 for p in PRODUCTS if p['status']==2)} to confirm · {sum(1 for p in PRODUCTS if p['status']==3)} proposed · {sum(1 for p in PRODUCTS if p['flags']=='SUP')} held (SUP) · {len(INDUSTRIES)} industries · {len(ops_flat)} operators", True)]
    for t, b in lines:
        ws.append([t]); ws.cell(ws.max_row, 1).font = Font(bold=b, size=14 if ws.max_row == 1 else 11, color=RED if ws.max_row == 1 else CHAR)
    ws.column_dimensions["A"].width = 140
    W = {"Product ID":10,"Master category":18,"Subcategory":22,"Product name":26,"Description":48,"Variants":40,"Applications":32,"Industries":28,
         "Operators — primary":34,"Operators — secondary":34,"Technical attributes (configurable)":36,"Customisation":30,"Image brief":40,"Product URL":40,
         "Product flyer":36,"Related products":34,"Quote fields":48,"Availability status":24,"Compliance flag":14,"Merged / replaces":36,"Notes":40,"Merova approval (✓ / ✗ / edit)":20}
    sheet("Product Register", list(rows[0].keys()), [r.values() for r in rows], W)
    sheet("Industry-Operator Matrix", list(matrix[0].keys()), [r.values() for r in matrix],
          {"Industry":20,"Operator":30,"Dedicated page":10,"URL":40,"Paper Products":48,"Plastic Products & Films":40,"Compostable Products":40,"Corrugated & Fluted Products":40,"Note":36})
    ws = sheet("Product×Operator grid", list(rel[0].keys()), [r.values() for r in rel], {"Product":28}, wrap=False)
    for c in ws[1][2:]: c.alignment = Alignment(text_rotation=90, vertical="bottom", horizontal="center")
    ws.row_dimensions[1].height = 190
    for i in range(3, len(rel[0]) + 1): ws.column_dimensions[get_column_letter(i)].width = 4.5
    for row in ws.iter_rows(min_row=2, min_col=3):
        for c in row:
            c.alignment = Alignment(horizontal="center")
            if c.value == "P": c.fill = PatternFill("solid", fgColor=RED); c.font = Font(bold=True, color="FFFFFF")
            elif c.value == "S": c.fill = PatternFill("solid", fgColor="F6D5D1")
    sheet("Dedup Register", ["Items in brief","Issue","Resolution","Rationale"], DEDUP, {"Items in brief":50,"Issue":30,"Resolution":44,"Rationale":56}, freeze="B2")
    sheet("Excluded", ["Item","Reason"], EXCLUDED, {"Item":60,"Reason":70}, freeze="A2")
    sheet("Sitemap", list(S[0].keys()), [r.values() for r in S], {"Section":16,"Page":44,"URL":60,"Parent":40,"Type":12,"Indexing":24}, freeze="B2")
    sheet("Redirects", ["Current URL (merova-printpack.vercel.app)","New URL (301)"], redirects().items(), {"Current URL (merova-printpack.vercel.app)":50,"New URL (301)":60}, freeze="A2")
    sheet("Verification Register", ["ID","Area","Item required","Used for","Owner","Priority","Blocks"], VERIFY, {"ID":7,"Area":14,"Item required":60,"Used for":44,"Owner":14,"Priority":9,"Blocks":20}, freeze="C2")
    sheet("Decisions", ["ID","Decision","Response needed","Merova response"], [d + ("",) for d in DECISIONS], {"ID":7,"Decision":80,"Response needed":30,"Merova response":30}, freeze="B2")
    wb.save(f"{OUT}/merova-stage1-register.xlsx")

    # ── Markdown
    def md(header, data_rows):
        esc = lambda v: str(v).replace("|", "\\|").replace("\n", " ")
        return "\n".join(["| " + " | ".join(header) + " |", "|" + "---|" * len(header)] + ["| " + " | ".join(esc(v) for v in r) + " |" for r in data_rows])
    out = ["# Stage 1 registers (generated)\n", "> Generated by `docs/stage-1/source/register.py`. Edit the script, not this file. The spreadsheet `merova-stage1-register.xlsx` holds the full-width version with every column.\n"]
    out.append(f"**{len(PRODUCTS)} product types** · {sum(1 for p in PRODUCTS if p['status']==1)} listed by Merova · {sum(1 for p in PRODUCTS if p['status']==2)} subject to confirmation · {sum(1 for p in PRODUCTS if p['status']==3)} proposed · {sum(1 for p in PRODUCTS if p['flags']=='SUP')} held for SUP review · {len(INDUSTRIES)} industries · {len(ops_flat)} operators ({sum(1 for _,o in ops_flat if o['page'])} with dedicated pages)\n")
    out.append("## 1. Master product inventory\n")
    for k, c in CATEGORIES.items():
        out.append(f"### {c['name']} — `/products/{c['slug']}/`\n")
        for sk, (cat, sname) in SUBCATS.items():
            if cat != k: continue
            out.append(f"**{sname}**\n")
            out.append(md(["ID","Product","Variants","Status","Flag","URL"], [(p["id"], p["name"], "; ".join(p["variants"]), p["status"], p["flags"] or "", url(p).replace(f"/products/{c['slug']}/", "…/")) for p in PRODUCTS if p["sub"] == sk]) + "\n")
    out.append("## 2. Deduplication register\n")
    out.append(md(["Items in brief","Issue","Resolution","Rationale"], DEDUP) + "\n")
    out.append("### Excluded on purpose\n"); out.append(md(["Item","Reason"], EXCLUDED) + "\n")
    out.append("## 3. Industry → operator → product matrix\n\n● primary application · ○ secondary / optional\n")
    for ind in INDUSTRIES:
        out.append(f"### {ind['name']} — `/industries/{ind['slug']}/`\n")
        hdr = ["Operator"] + [c["name"] for c in CATEGORIES.values()]
        rr = []
        for o in ind["ops"]:
            cells = [f"**{o['name']}**" + ("" if o["page"] else " *(section)*")]
            for cat in CATEGORIES:
                pr = [pid[x]["name"] for x in o["primary"] if SUBCATS[pid[x]["sub"]][0] == cat]
                se = [pid[x]["name"] for x in o["secondary"] if SUBCATS[pid[x]["sub"]][0] == cat]
                cells.append("<br>".join([f"● {n}" for n in pr] + [f"○ {n}" for n in se]) or "—")
            rr.append(cells)
        out.append(md(hdr, rr) + "\n")
        for o in ind["ops"]:
            if o["note"]: out.append(f"> *{o['name']}:* {o['note']}\n")
    out.append("## 4. Product → industry relationships\n")
    out.append(md(["ID","Product","Primary for","Secondary for"], [(p["id"], p["name"], "; ".join(o["name"] for _, o in links[p["id"]]["primary"]) or "—", "; ".join(o["name"] for _, o in links[p["id"]]["secondary"]) or "—") for p in PRODUCTS]) + "\n")
    out.append("## 5. Sitemap\n")
    out.append(md(list(S[0].keys()), [r.values() for r in S]) + "\n")
    out.append("## 6. Redirects from the current build\n")
    out.append(md(["Current","New (301)"], redirects().items()) + "\n")
    out.append("## 7. Verification register\n")
    out.append(md(["ID","Area","Item required","Used for","Owner","Priority","Blocks"], VERIFY) + "\n")
    out.append("## 8. Decisions requested\n")
    out.append(md(["ID","Decision","Response needed"], DECISIONS) + "\n")
    open(f"{OUT}/REGISTERS.md", "w").write("\n".join(out))
    print(f"OK: {len(PRODUCTS)} products, {len(ops_flat)} operators, {len(S)} sitemap rows")

if __name__ == "__main__":
    write_outputs()
