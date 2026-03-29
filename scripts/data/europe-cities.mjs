export const europeCountries = [
    {
        slug: 'united-kingdom', name: 'United Kingdom', code: 'UK', currency: 'GBP', unit: 'imperial',
        cities: ['London', 'Manchester', 'Edinburgh', 'Birmingham', 'Glasgow', 'Liverpool', 'Bristol', 'Leeds', 'Oxford', 'Cambridge', 'Southampton', 'Newcastle', 'Cardiff', 'Belfast', 'Aberdeen', 'Brighton', 'Nottingham', 'Sheffield', 'Leicester', 'York'],
        airports: [{ c: 'FAB', n: 'Farnborough Airport' }, { c: 'BQH', n: 'London Biggin Hill' }, { c: 'LTN', n: 'London Luton' }, { c: 'STN', n: 'London Stansted' }, { c: 'MAN', n: 'Manchester Airport' }, { c: 'EDI', n: 'Edinburgh Airport' }, { c: 'GLA', n: 'Glasgow Intl' }],
        pop: [8982000, 553000, 548000, 1149000, 635000, 496000, 467000, 792000, 152000, 129000, 250000, 300000, 362000, 340000, 198000, 290000, 330000, 584000, 368000, 210000],
        biz: ['finance', 'media', 'finance', 'manufacturing', 'shipping', 'culture', 'aerospace', 'finance', 'education', 'technology', 'shipping', 'energy', 'media', 'aerospace', 'energy', 'tourism', 'education', 'manufacturing', 'manufacturing', 'tourism'],
        region: 'coastal',
        attract: [['Shard'], ['Old Trafford'], ['Castle'], ['Bullring'], ['Kelvingrove'], ['The Docks'], ['Suspension Bridge'], ['Royal Armouries'], ['University'], ['University'], ['The Solent'], ['Tyne Bridge'], ['Castle'], ['Titanic Belfast'], ['Maritime Museum'], ['The Pier'], ['Sherwood Forest'], ['Peak District'], ['Space Centre'], ['Minster']]
    },
    {
        slug: 'france', name: 'France', code: 'FR', currency: 'EUR', unit: 'metric',
        cities: ['Paris', 'Nice', 'Cannes', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux', 'Lille', 'Strasbourg', 'Nantes', 'Montpellier', 'Rennes', 'Reims', 'Saint-Tropez', 'Monaco', 'Antibes', 'Avignon', 'Aix-en-Provence', 'Dijon', 'Grenoble'],
        airports: [{ c: 'LBG', n: 'Paris Le Bourget' }, { c: 'NCE', n: 'Nice Côte d\'Azur' }, { c: 'CEQ', n: 'Cannes Mandelieu' }, { c: 'LYN', n: 'Lyon Bron' }, { c: 'MRS', n: 'Marseille Provence' }],
        pop: [2161000, 340000, 75000, 513000, 861000, 471000, 249000, 232000, 277000, 303000, 277000, 215000, 182000, 4000, 39000, 75000, 92000, 142000, 156000, 160000],
        biz: ['luxury fashion', 'tourism', 'cinema', 'gastronomy', 'shipping', 'aerospace', 'wine', 'retail', 'politics', 'tech', 'education', 'tech', 'champagne', 'luxury tourism', 'finance', 'yachting', 'culture', 'education', 'gastronomy', 'research'],
        region: 'coastal',
        attract: [['Eiffel Tower'], ['Promenade des Anglais'], ['Croisette'], ['Old Lyon'], ['Old Port'], ['Space City'], ['Wine Museum'], ['Grand Place'], ['Petite France'], ['Castle of Dukes'], ['Place de la Comédie'], ['Parliament'], ['Cathedral'], ['Port'], ['Casino'], ['Old Town'], ['Palace of Popes'], ['Cours Mirabeau'], ['Owl Trail'], ['Bastille']]
    },
    {
        slug: 'germany', name: 'Germany', code: 'DE', currency: 'EUR', unit: 'metric',
        cities: ['Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Cologne', 'Dusseldorf', 'Stuttgart', 'Dortmund', 'Essen', 'Leipzig', 'Bremen', 'Dresden', 'Hanover', 'Nuremberg', 'Duisburg', 'Bochum', 'Wuppertal', 'Bielefeld', 'Bonn', 'Munster'],
        airports: [{ c: 'BER', n: 'Berlin Brandenburg' }, { c: 'MUC', n: 'Munich Intl' }, { c: 'FRA', n: 'Frankfurt Intl' }, { c: 'HAM', n: 'Hamburg Intl' }, { c: 'DUS', n: 'Dusseldorf Intl' }, { c: 'CGN', n: 'Cologne Bonn' }],
        pop: [3645000, 1472000, 753000, 1841000, 1086000, 619000, 635000, 587000, 583000, 587000, 569000, 555000, 538000, 518000, 498000, 364000, 354000, 333000, 327000, 314000],
        biz: ['tech startup', 'automotive', 'banking', 'shipping', 'media', 'fashion', 'automotive', 'tech', 'energy', 'logistics', 'shipping', 'tech', 'insurance', 'manufacturing', 'steel', 'mining', 'manufacturing', 'food', 'telecom', 'education'],
        region: 'inland',
        attract: [['Brandenburg Gate'], ['Marienplatz'], ['Römer'], ['Port of Hamburg'], ['Cathedral'], ['Königsallee'], ['Mercedes Museum'], ['Westfalenpark'], ['Zollverein'], ['Monument'], ['Town Musicians'], ['Frauenkirche'], ['Gardens'], ['Castle'], ['Landscape Park'], ['Mining Museum'], ['Suspension Railway'], ['Sparrenburg'], ['Beethoven House'], ['Cathedral']]
    },
    {
        slug: 'italy', name: 'Italy', code: 'IT', currency: 'EUR', unit: 'metric',
        cities: ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence', 'Bari', 'Catania', 'Venice', 'Verona', 'Messina', 'Padua', 'Trieste', 'Taranto', 'Brescia', 'Parma', 'Prato', 'Modena'],
        airports: [{ c: 'CIA', n: 'Rome Ciampino' }, { c: 'LIN', n: 'Milan Linate' }, { c: 'MXP', n: 'Milan Malpensa' }, { c: 'NAP', n: 'Naples Intl' }, { c: 'VCE', n: 'Venice Marco Polo' }, { c: 'FLR', n: 'Florence Airport' }],
        pop: [2873000, 1352000, 962000, 886000, 673000, 583000, 388000, 382000, 324000, 313000, 261000, 257000, 236000, 214000, 204000, 200000, 196000, 194000, 191000, 184000],
        biz: ['politics', 'fashion', 'tourism', 'automotive', 'shipping', 'shipping', 'manufacturing', 'luxury goods', 'shipping', 'tech', 'tourism', 'wine', 'shipping', 'education', 'insurance', 'steel', 'manufacturing', 'food', 'textiles', 'automotive'],
        region: 'coastal',
        attract: [['Colosseum'], ['Duomo'], ['Pompeii'], ['Mole Antonelliana'], ['Cathedral'], ['Aquarium'], ['Two Towers'], ['Uffizi'], ['Old Town'], ['Mount Etna'], ['Grand Canal'], ['Arena'], ['Bell Tower'], ['Basilica'], ['Miramare'], ['Castle'], ['Santa Giulia'], ['Cathedral'], ['Textile Museum'], ['Ferrari Museum']]
    },
    {
        slug: 'spain', name: 'Spain', code: 'ES', currency: 'EUR', unit: 'metric',
        cities: ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Malaga', 'Murcia', 'Palma', 'Las Palmas', 'Bilbao', 'Alicante', 'Cordoba', 'Valladolid', 'Vigo', 'Gijon', 'Hospitalet', 'Vitoria', 'La Coruna', 'Elche', 'Granada'],
        airports: [{ c: 'MAD', n: 'Adolfo Suárez Madrid-Barajas' }, { c: 'BCN', n: 'Josep Tarradellas Barcelona-El Prat' }, { c: 'VLC', n: 'Valencia Airport' }, { c: 'AGP', n: 'Málaga-Costa del Sol' }, { c: 'PMI', n: 'Palma de Mallorca' }, { c: 'IBZ', n: 'Ibiza Airport' }],
        pop: [3223000, 1620000, 791000, 688000, 666000, 571000, 447000, 409000, 379000, 345000, 331000, 325000, 298000, 292000, 271000, 261000, 249000, 244000, 230000, 232000],
        biz: ['finance', 'tech', 'shipping', 'aerospace', 'logistics', 'tourism', 'agriculture', 'tourism', 'shipping', 'finance', 'tourism', 'jewellery', 'automotive', 'fishing', 'steel', 'services', 'manufacturing', 'fashion', 'shoe manufacturing', 'tourism'],
        region: 'coastal',
        attract: [['Prado Museum'], ['Sagrada Familia'], ['City of Arts'], ['Alcazar'], ['Basilica'], ['Alcazaba'], ['Cathedral'], ['Cathedral'], ['Canteras Beach'], ['Guggenheim'], ['Castle'], ['Mosque-Cathedral'], ['Plaza Mayor'], ['Cies Islands'], ['San Lorenzo'], ['Bellvitge'], ['Old Town'], ['Tower of Hercules'], ['Palm Grove'], ['Alhambra']]
    },
    {
        slug: 'switzerland', name: 'Switzerland', code: 'CH', currency: 'CHF', unit: 'metric',
        cities: ['Zurich', 'Geneva', 'Basel', 'Lausanne', 'Bern', 'Winterthur', 'Lucerne', 'St. Gallen', 'Lugano', 'Biel', 'Thun', 'Koniz', 'La Chaux-de-Fonds', 'Fribourg', 'Schaffhausen', 'Chur', 'Vernier', 'Uster', 'Sion', 'Lancy'],
        airports: [{ c: 'ZRH', n: 'Zurich Airport' }, { c: 'GVA', n: 'Geneva Airport' }, { c: 'BSL', n: 'EuroAirport Basel' }, { c: 'SIR', n: 'Sion Airport' }, { c: 'SMV', n: 'Samedan Airport' }],
        pop: [415000, 201000, 172000, 139000, 133000, 111000, 81000, 75000, 63000, 55000, 43000, 41000, 38000, 38000, 36000, 35000, 34000, 34000, 34000, 32000],
        biz: ['banking', 'diplomacy', 'pharma', 'education', 'government', 'insurance', 'tourism', 'textiles', 'finance', 'watchmaking', 'tourism', 'services', 'watchmaking', 'education', 'manufacturing', 'tourism', 'industry', 'services', 'tourism', 'industry'],
        region: 'mountain',
        attract: [['Lake Zurich'], ['Jet d\'Eau'], ['Old Town'], ['Olympic Museum'], ['Clock Tower'], ['Technorama'], ['Chapel Bridge'], ['Abbey Library'], ['Lake Lugano'], ['Old Town'], ['Castle'], ['Gurten'], ['Watch Museum'], ['Cathedral'], ['Rhine Falls'], ['Old Town'], ['IKEA'], ['Castle'], ['Castles'], ['Stadium']]
    },
    {
        slug: 'portugal', name: 'Portugal', code: 'PT', currency: 'EUR', unit: 'metric',
        cities: ['Lisbon', 'Porto', 'Vila Nova de Gaia', 'Amadora', 'Braga', 'Funchal', 'Coimbra', 'Setubal', 'Almada', 'Agualva-Cacem', 'Queluz', 'Faro', 'Aveiro', 'Odivelas', 'Leiria', 'Portimao', 'Guimaraes', 'Rio Tinto', 'Barreiro', 'Viseu'],
        airports: [{ c: 'LIS', n: 'Humberto Delgado' }, { c: 'OPO', n: 'Francisco Sá Carneiro' }, { c: 'FAO', n: 'Faro Airport' }, { c: 'FNC', n: 'Cristiano Ronaldo Intl' }],
        pop: [504000, 214000, 178000, 175000, 136000, 111000, 105000, 98000, 96000, 81000, 78000, 64000, 55000, 59000, 50000, 55000, 47000, 50000, 42000, 57000],
        biz: ['tech', 'wine', 'wine', 'services', 'technology', 'tourism', 'education', 'shipping', 'services', 'residential', 'heritage', 'tourism', 'salt', 'residential', 'industry', 'tourism', 'textiles', 'residential', 'transport', 'wine'],
        region: 'coastal',
        attract: [['Belem Tower'], ['Ribeira'], ['Port Wine Cellars'], ['Dolce Vita'], ['Bom Jesus'], ['Botanical Garden'], ['University'], ['Arrabida'], ['Cristo Rei'], ['Parks'], ['Palace'], ['Ria Formosa'], ['Canals'], ['Monastery'], ['Castle'], ['Praia da Rocha'], ['Castle'], ['Church'], ['Riverside'], ['Cathedral']]
    }
];
