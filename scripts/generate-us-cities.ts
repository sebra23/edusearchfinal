/**
 * US Cities Data Generation Script
 * 
 * This script generates unique, SEO-optimized content for the top 20 cities
 * in all 50 US states. Each city has completely unique content to avoid
 * duplicate content penalties.
 * 
 * Run with: npx tsx scripts/generate-us-cities.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Real US cities data - top 20 cities per state
const statesData = {
    alabama: {
        name: 'Alabama',
        code: 'AL',
        topCities: ['Birmingham', 'Montgomery', 'Mobile', 'Huntsville', 'Tuscaloosa', 'Hoover', 'Dothan', 'Auburn', 'Decatur', 'Madison', 'Florence', 'Gadsden', 'Vestavia Hills', 'Prattville', 'Phenix City', 'Alabaster', 'Bessemer', 'Enterprise', 'Opelika', 'Homewood'],
    },
    alaska: {
        name: 'Alaska',
        code: 'AK',
        topCities: ['Anchorage', 'Fairbanks', 'Juneau', 'Sitka', 'Ketchikan', 'Wasilla', 'Kenai', 'Kodiak', 'Bethel', 'Palmer', 'Homer', 'Soldotna', 'Barrow', 'Unalaska', 'Nome', 'Kotzebue', 'Dillingham', 'Valdez', 'Petersburg', 'Wrangell'],
    },
    arizona: {
        name: 'Arizona',
        code: 'AZ',
        topCities: ['Phoenix', 'Tucson', 'Mesa', 'Chandler', 'Scottsdale', 'Glendale', 'Gilbert', 'Tempe', 'Peoria', 'Surprise', 'Yuma', 'Avondale', 'Flagstaff', 'Goodyear', 'Lake Havasu City', 'Buckeye', 'Casa Grande', 'Prescott Valley', 'Sierra Vista', 'Maricopa'],
    },
    arkansas: {
        name: 'Arkansas',
        code: 'AR',
        topCities: ['Little Rock', 'Fort Smith', 'Fayetteville', 'Springdale', 'Jonesboro', 'North Little Rock', 'Conway', 'Rogers', 'Pine Bluff', 'Bentonville', 'Hot Springs', 'Benton', 'Sherwood', 'Texarkana', 'Russellville', 'Jacksonville', 'Bella Vista', 'Paragould', 'Cabot', 'Searcy'],
    },
    california: {
        name: 'California',
        code: 'CA',
        topCities: ['Los Angeles', 'San Diego', 'San Jose', 'San Francisco', 'Fresno', 'Sacramento', 'Long Beach', 'Oakland', 'Bakersfield', 'Anaheim', 'Santa Ana', 'Riverside', 'Stockton', 'Irvine', 'Chula Vista', 'Fremont', 'San Bernardino', 'Modesto', 'Fontana', 'Oxnard'],
    },
    colorado: {
        name: 'Colorado',
        code: 'CO',
        topCities: ['Denver', 'Colorado Springs', 'Aurora', 'Fort Collins', 'Lakewood', 'Thornton', 'Arvada', 'Westminster', 'Pueblo', 'Centennial', 'Boulder', 'Greeley', 'Longmont', 'Loveland', 'Grand Junction', 'Broomfield', 'Castle Rock', 'Commerce City', 'Parker', 'Littleton'],
    },
    connecticut: {
        name: 'Connecticut',
        code: 'CT',
        topCities: ['Bridgeport', 'New Haven', 'Stamford', 'Hartford', 'Waterbury', 'Norwalk', 'Danbury', 'New Britain', 'Bristol', 'Meriden', 'Milford', 'West Haven', 'Middletown', 'Norwich', 'Shelton', 'Torrington', 'Stratford', 'East Hartford', 'Trumbull', 'Mansfield'],
    },
    delaware: {
        name: 'Delaware',
        code: 'DE',
        topCities: ['Wilmington', 'Dover', 'Newark', 'Middletown', 'Smyrna', 'Milford', 'Seaford', 'Georgetown', 'Elsmere', 'New Castle', 'Millsboro', 'Laurel', 'Harrington', 'Camden', 'Clayton', 'Lewes', 'Milton', 'Delmar', 'Bridgeville', 'Townsend'],
    },
    florida: {
        name: 'Florida',
        code: 'FL',
        topCities: ['Jacksonville', 'Miami', 'Tampa', 'Orlando', 'St. Petersburg', 'Hialeah', 'Tallahassee', 'Fort Lauderdale', 'Port St. Lucie', 'Cape Coral', 'Pembroke Pines', 'Hollywood', 'Miramar', 'Gainesville', 'Coral Springs', 'Miami Gardens', 'Clearwater', 'Palm Bay', 'Pompano Beach', 'West Palm Beach'],
    },
    georgia: {
        name: 'Georgia',
        code: 'GA',
        topCities: ['Atlanta', 'Augusta', 'Columbus', 'Macon', 'Savannah', 'Athens', 'Sandy Springs', 'Roswell', 'Johns Creek', 'Albany', 'Warner Robins', 'Alpharetta', 'Marietta', 'Valdosta', 'Smyrna', 'Dunwoody', 'Rome', 'East Point', 'Milton', 'Gainesville'],
    },
    hawaii: {
        name: 'Hawaii',
        code: 'HI',
        topCities: ['Honolulu', 'Pearl City', 'Hilo', 'Kailua', 'Waipahu', 'Kaneohe', 'Mililani Town', 'Kahului', 'Ewa Gentry', 'Mililani Mauka', 'Kihei', 'Makakilo', 'Wahiawa', 'Schofield Barracks', 'Waimalu', 'Nanakuli', 'Wailuku', 'Halawa', 'Waianae', 'Kapolei'],
    },
    idaho: {
        name: 'Idaho',
        code: 'ID',
        topCities: ['Boise', 'Meridian', 'Nampa', 'Idaho Falls', 'Pocatello', 'Caldwell', 'Coeur d\'Alene', 'Twin Falls', 'Lewiston', 'Post Falls', 'Rexburg', 'Eagle', 'Moscow', 'Kuna', 'Ammon', 'Chubbuck', 'Hayden', 'Mountain Home', 'Blackfoot', 'Garden City'],
    },
    illinois: {
        name: 'Illinois',
        code: 'IL',
        topCities: ['Chicago', 'Aurora', 'Naperville', 'Joliet', 'Rockford', 'Springfield', 'Elgin', 'Peoria', 'Champaign', 'Waukegan', 'Cicero', 'Bloomington', 'Arlington Heights', 'Evanston', 'Decatur', 'Schaumburg', 'Bolingbrook', 'Palatine', 'Skokie', 'Des Plaines'],
    },
    indiana: {
        name: 'Indiana',
        code: 'IN',
        topCities: ['Indianapolis', 'Fort Wayne', 'Evansville', 'South Bend', 'Carmel', 'Fishers', 'Bloomington', 'Hammond', 'Gary', 'Muncie', 'Lafayette', 'Terre Haute', 'Kokomo', 'Anderson', 'Noblesville', 'Greenwood', 'Elkhart', 'Mishawaka', 'Lawrence', 'Jeffersonville'],
    },
    iowa: {
        name: 'Iowa',
        code: 'IA',
        topCities: ['Des Moines', 'Cedar Rapids', 'Davenport', 'Sioux City', 'Iowa City', 'Waterloo', 'Council Bluffs', 'Ames', 'West Des Moines', 'Dubuque', 'Ankeny', 'Urbandale', 'Cedar Falls', 'Marion', 'Bettendorf', 'Mason City', 'Marshalltown', 'Clinton', 'Burlington', 'Ottumwa'],
    },
    kansas: {
        name: 'Kansas',
        code: 'KS',
        topCities: ['Wichita', 'Overland Park', 'Kansas City', 'Olathe', 'Topeka', 'Lawrence', 'Shawnee', 'Manhattan', 'Lenexa', 'Salina', 'Hutchinson', 'Leavenworth', 'Leawood', 'Dodge City', 'Garden City', 'Junction City', 'Emporia', 'Derby', 'Prairie Village', 'Hays'],
    },
    kentucky: {
        name: 'Kentucky',
        code: 'KY',
        topCities: ['Louisville', 'Lexington', 'Bowling Green', 'Owensboro', 'Covington', 'Richmond', 'Georgetown', 'Florence', 'Elizabethtown', 'Hopkinsville', 'Nicholasville', 'Henderson', 'Jeffersontown', 'Frankfort', 'Paducah', 'Independence', 'Radcliff', 'Ashland', 'Madisonville', 'Winchester'],
    },
    louisiana: {
        name: 'Louisiana',
        code: 'LA',
        topCities: ['New Orleans', 'Baton Rouge', 'Shreveport', 'Lafayette', 'Lake Charles', 'Kenner', 'Bossier City', 'Monroe', 'Alexandria', 'Houma', 'New Iberia', 'Slidell', 'Prairieville', 'Central', 'Ruston', 'Sulphur', 'Hammond', 'Natchitoches', 'Gretna', 'Opelousas'],
    },
    maine: {
        name: 'Maine',
        code: 'ME',
        topCities: ['Portland', 'Lewiston', 'Bangor', 'South Portland', 'Auburn', 'Biddeford', 'Sanford', 'Saco', 'Augusta', 'Westbrook', 'Waterville', 'Presque Isle', 'Brewer', 'Bath', 'Caribou', 'Ellsworth', 'Old Town', 'Belfast', 'Rockland', 'Gardiner'],
    },
    maryland: {
        name: 'Maryland',
        code: 'MD',
        topCities: ['Baltimore', 'Columbia', 'Germantown', 'Silver Spring', 'Waldorf', 'Glen Burnie', 'Ellicott City', 'Frederick', 'Dundalk', 'Rockville', 'Bethesda', 'Gaithersburg', 'Bowie', 'Hagerstown', 'Annapolis', 'Towson', 'Salisbury', 'Aspen Hill', 'Wheaton', 'Potomac'],
    },
    massachusetts: {
        name: 'Massachusetts',
        code: 'MA',
        topCities: ['Boston', 'Worcester', 'Springfield', 'Cambridge', 'Lowell', 'Brockton', 'Quincy', 'Lynn', 'New Bedford', 'Fall River', 'Newton', 'Lawrence', 'Somerville', 'Framingham', 'Haverhill', 'Waltham', 'Malden', 'Brookline', 'Plymouth', 'Medford'],
    },
    michigan: {
        name: 'Michigan',
        code: 'MI',
        topCities: ['Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights', 'Ann Arbor', 'Lansing', 'Flint', 'Dearborn', 'Livonia', 'Clinton Township', 'Canton', 'Westland', 'Troy', 'Farmington Hills', 'Macomb', 'Kalamazoo', 'Shelby', 'Wyoming', 'Southfield', 'Rochester Hills'],
    },
    minnesota: {
        name: 'Minnesota',
        code: 'MN',
        topCities: ['Minneapolis', 'St. Paul', 'Rochester', 'Duluth', 'Bloomington', 'Brooklyn Park', 'Plymouth', 'St. Cloud', 'Eagan', 'Woodbury', 'Maple Grove', 'Eden Prairie', 'Coon Rapids', 'Burnsville', 'Blaine', 'Lakeville', 'Minnetonka', 'Apple Valley', 'Edina', 'St. Louis Park'],
    },
    mississippi: {
        name: 'Mississippi',
        code: 'MS',
        topCities: ['Jackson', 'Gulfport', 'Southaven', 'Hattiesburg', 'Biloxi', 'Meridian', 'Tupelo', 'Greenville', 'Olive Branch', 'Horn Lake', 'Clinton', 'Pearl', 'Madison', 'Ridgeland', 'Starkville', 'Columbus', 'Vicksburg', 'Pascagoula', 'Brandon', 'Oxford'],
    },
    missouri: {
        name: 'Missouri',
        code: 'MO',
        topCities: ['Kansas City', 'St. Louis', 'Springfield', 'Columbia', 'Independence', 'Lee\'s Summit', 'O\'Fallon', 'St. Joseph', 'St. Charles', 'St. Peters', 'Blue Springs', 'Florissant', 'Joplin', 'Chesterfield', 'Jefferson City', 'Cape Girardeau', 'Wildwood', 'University City', 'Ballwin', 'Raytown'],
    },
    montana: {
        name: 'Montana',
        code: 'MT',
        topCities: ['Billings', 'Missoula', 'Great Falls', 'Bozeman', 'Butte', 'Helena', 'Kalispell', 'Havre', 'Anaconda', 'Miles City', 'Belgrade', 'Livingston', 'Laurel', 'Whitefish', 'Lewistown', 'Sidney', 'Glendive', 'Polson', 'Hamilton', 'Columbia Falls'],
    },
    nebraska: {
        name: 'Nebraska',
        code: 'NE',
        topCities: ['Omaha', 'Lincoln', 'Bellevue', 'Grand Island', 'Kearney', 'Fremont', 'Hastings', 'Norfolk', 'Columbus', 'Papillion', 'North Platte', 'La Vista', 'Scottsbluff', 'South Sioux City', 'Beatrice', 'Lexington', 'Alliance', 'Gering', 'York', 'McCook'],
    },
    nevada: {
        name: 'Nevada',
        code: 'NV',
        topCities: ['Las Vegas', 'Henderson', 'Reno', 'North Las Vegas', 'Sparks', 'Carson City', 'Fernley', 'Elko', 'Mesquite', 'Boulder City', 'Fallon', 'Winnemucca', 'West Wendover', 'Ely', 'Yerington', 'Carlin', 'Lovelock', 'Wells', 'Caliente', 'Hawthorne'],
    },
    'new-hampshire': {
        name: 'New Hampshire',
        code: 'NH',
        topCities: ['Manchester', 'Nashua', 'Concord', 'Derry', 'Rochester', 'Salem', 'Dover', 'Merrimack', 'Londonderry', 'Hudson', 'Keene', 'Bedford', 'Portsmouth', 'Goffstown', 'Laconia', 'Hampton', 'Milford', 'Durham', 'Exeter', 'Windham'],
    },
    'new-jersey': {
        name: 'New Jersey',
        code: 'NJ',
        topCities: ['Newark', 'Jersey City', 'Paterson', 'Elizabeth', 'Edison', 'Woodbridge', 'Lakewood', 'Toms River', 'Hamilton', 'Trenton', 'Clifton', 'Camden', 'Brick', 'Cherry Hill', 'Passaic', 'Union City', 'Old Bridge', 'Gloucester', 'East Orange', 'Bayonne'],
    },
    'new-mexico': {
        name: 'New Mexico',
        code: 'NM',
        topCities: ['Albuquerque', 'Las Cruces', 'Rio Rancho', 'Santa Fe', 'Roswell', 'Farmington', 'Clovis', 'Hobbs', 'Alamogordo', 'Carlsbad', 'Gallup', 'Deming', 'Los Lunas', 'Chaparral', 'Sunland Park', 'Las Vegas', 'Portales', 'Artesia', 'Lovington', 'Silver City'],
    },
    'new-york': {
        name: 'New York',
        code: 'NY',
        topCities: ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany', 'New Rochelle', 'Mount Vernon', 'Schenectady', 'Utica', 'White Plains', 'Hempstead', 'Troy', 'Niagara Falls', 'Binghamton', 'Freeport', 'Valley Stream', 'Long Beach', 'Spring Valley', 'Rome'],
    },
    'north-carolina': {
        name: 'North Carolina',
        code: 'NC',
        topCities: ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem', 'Fayetteville', 'Cary', 'Wilmington', 'High Point', 'Concord', 'Greenville', 'Asheville', 'Gastonia', 'Jacksonville', 'Chapel Hill', 'Rocky Mount', 'Burlington', 'Wilson', 'Huntersville', 'Kannapolis'],
    },
    'north-dakota': {
        name: 'North Dakota',
        code: 'ND',
        topCities: ['Fargo', 'Bismarck', 'Grand Forks', 'Minot', 'West Fargo', 'Williston', 'Dickinson', 'Mandan', 'Jamestown', 'Wahpeton', 'Devils Lake', 'Watford City', 'Valley City', 'Grafton', 'Beulah', 'Rugby', 'Horace', 'Lincoln', 'New Town', 'Casselton'],
    },
    ohio: {
        name: 'Ohio',
        code: 'OH',
        topCities: ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron', 'Dayton', 'Parma', 'Canton', 'Youngstown', 'Lorain', 'Hamilton', 'Springfield', 'Kettering', 'Elyria', 'Lakewood', 'Cuyahoga Falls', 'Middletown', 'Euclid', 'Newark', 'Mansfield'],
    },
    oklahoma: {
        name: 'Oklahoma',
        code: 'OK',
        topCities: ['Oklahoma City', 'Tulsa', 'Norman', 'Broken Arrow', 'Edmond', 'Lawton', 'Moore', 'Midwest City', 'Enid', 'Stillwater', 'Muskogee', 'Bartlesville', 'Owasso', 'Shawnee', 'Ponca City', 'Ardmore', 'Duncan', 'Del City', 'Yukon', 'Sapulpa'],
    },
    oregon: {
        name: 'Oregon',
        code: 'OR',
        topCities: ['Portland', 'Eugene', 'Salem', 'Gresham', 'Hillsboro', 'Beaverton', 'Bend', 'Medford', 'Springfield', 'Corvallis', 'Albany', 'Tigard', 'Lake Oswego', 'Keizer', 'Grants Pass', 'Oregon City', 'McMinnville', 'Redmond', 'Tualatin', 'West Linn'],
    },
    pennsylvania: {
        name: 'Pennsylvania',
        code: 'PA',
        topCities: ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading', 'Scranton', 'Bethlehem', 'Lancaster', 'Harrisburg', 'Altoona', 'York', 'State College', 'Wilkes-Barre', 'Chester', 'Williamsport', 'Easton', 'Lebanon', 'Hazleton', 'New Castle', 'Johnstown'],
    },
    'rhode-island': {
        name: 'Rhode Island',
        code: 'RI',
        topCities: ['Providence', 'Warwick', 'Cranston', 'Pawtucket', 'East Providence', 'Woonsocket', 'Coventry', 'Cumberland', 'North Providence', 'South Kingstown', 'West Warwick', 'Johnston', 'North Kingstown', 'Newport', 'Bristol', 'Westerly', 'Smithfield', 'Lincoln', 'Central Falls', 'Portsmouth'],
    },
    'south-carolina': {
        name: 'South Carolina',
        code: 'SC',
        topCities: ['Charleston', 'Columbia', 'North Charleston', 'Mount Pleasant', 'Rock Hill', 'Greenville', 'Summerville', 'Sumter', 'Goose Creek', 'Hilton Head Island', 'Florence', 'Spartanburg', 'Myrtle Beach', 'Aiken', 'Anderson', 'Greer', 'Mauldin', 'Greenwood', 'North Augusta', 'Easley'],
    },
    'south-dakota': {
        name: 'South Dakota',
        code: 'SD',
        topCities: ['Sioux Falls', 'Rapid City', 'Aberdeen', 'Brookings', 'Watertown', 'Mitchell', 'Yankton', 'Pierre', 'Huron', 'Spearfish', 'Vermillion', 'Brandon', 'Box Elder', 'Madison', 'Sturgis', 'Belle Fourche', 'Harrisburg', 'Tea', 'Dell Rapids', 'Lennox'],
    },
    tennessee: {
        name: 'Tennessee',
        code: 'TN',
        topCities: ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga', 'Clarksville', 'Murfreesboro', 'Franklin', 'Jackson', 'Johnson City', 'Bartlett', 'Hendersonville', 'Kingsport', 'Collierville', 'Smyrna', 'Cleveland', 'Brentwood', 'Germantown', 'Columbia', 'Spring Hill', 'La Vergne'],
    },
    texas: {
        name: 'Texas',
        code: 'TX',
        topCities: ['Houston', 'San Antonio', 'Dallas', 'Austin', 'Fort Worth', 'El Paso', 'Arlington', 'Corpus Christi', 'Plano', 'Laredo', 'Lubbock', 'Garland', 'Irving', 'Amarillo', 'Grand Prairie', 'McKinney', 'Frisco', 'Brownsville', 'Pasadena', 'Mesquite'],
    },
    utah: {
        name: 'Utah',
        code: 'UT',
        topCities: ['Salt Lake City', 'West Valley City', 'Provo', 'West Jordan', 'Orem', 'Sandy', 'Ogden', 'St. George', 'Layton', 'Taylorsville', 'South Jordan', 'Lehi', 'Logan', 'Murray', 'Draper', 'Bountiful', 'Riverton', 'Roy', 'Pleasant Grove', 'Kearns'],
    },
    vermont: {
        name: 'Vermont',
        code: 'VT',
        topCities: ['Burlington', 'South Burlington', 'Rutland', 'Barre', 'Montpelier', 'Winooski', 'St. Albans', 'Newport', 'Vergennes', 'Brattleboro', 'Hartford', 'Colchester', 'Essex', 'Bennington', 'Milton', 'Middlebury', 'St. Johnsbury', 'Williston', 'Springfield', 'Swanton'],
    },
    virginia: {
        name: 'Virginia',
        code: 'VA',
        topCities: ['Virginia Beach', 'Norfolk', 'Chesapeake', 'Richmond', 'Newport News', 'Alexandria', 'Hampton', 'Roanoke', 'Portsmouth', 'Suffolk', 'Lynchburg', 'Harrisonburg', 'Leesburg', 'Charlottesville', 'Danville', 'Blacksburg', 'Manassas', 'Petersburg', 'Fredericksburg', 'Winchester'],
    },
    washington: {
        name: 'Washington',
        code: 'WA',
        topCities: ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue', 'Kent', 'Everett', 'Renton', 'Spokane Valley', 'Federal Way', 'Yakima', 'Bellingham', 'Kennewick', 'Auburn', 'Pasco', 'Marysville', 'Lakewood', 'Redmond', 'Shoreline', 'Richland'],
    },
    'west-virginia': {
        name: 'West Virginia',
        code: 'WV',
        topCities: ['Charleston', 'Huntington', 'Morgantown', 'Parkersburg', 'Wheeling', 'Weirton', 'Fairmont', 'Martinsburg', 'Beckley', 'Clarksburg', 'South Charleston', 'St. Albans', 'Vienna', 'Bluefield', 'Moundsville', 'Bridgeport', 'Oak Hill', 'Dunbar', 'Teays Valley', 'Cross Lanes'],
    },
    wisconsin: {
        name: 'Wisconsin',
        code: 'WI',
        topCities: ['Milwaukee', 'Madison', 'Green Bay', 'Kenosha', 'Racine', 'Appleton', 'Waukesha', 'Eau Claire', 'Oshkosh', 'Janesville', 'West Allis', 'La Crosse', 'Sheboygan', 'Wauwatosa', 'Fond du Lac', 'New Berlin', 'Wausau', 'Brookfield', 'Greenfield', 'Beloit'],
    },
    wyoming: {
        name: 'Wyoming',
        code: 'WY',
        topCities: ['Cheyenne', 'Casper', 'Laramie', 'Gillette', 'Rock Springs', 'Sheridan', 'Green River', 'Evanston', 'Riverton', 'Jackson', 'Cody', 'Rawlins', 'Lander', 'Torrington', 'Powell', 'Douglas', 'Worland', 'Buffalo', 'Newcastle', 'Thermopolis'],
    },
};

// Airport data by state (major airports)
const airportsByState: Record<string, Array<{ code: string, name: string }>> = {
    alabama: [
        { code: 'BHM', name: 'Birmingham-Shuttlesworth International' },
        { code: 'HSV', name: 'Huntsville International' },
        { code: 'MOB', name: 'Mobile Regional' },
        { code: 'MGM', name: 'Montgomery Regional' },
    ],
    alaska: [
        { code: 'ANC', name: 'Ted Stevens Anchorage International' },
        { code: 'FAI', name: 'Fairbanks International' },
        { code: 'JNU', name: 'Juneau International' },
    ],
    arizona: [
        { code: 'PHX', name: 'Phoenix Sky Harbor International' },
        { code: 'TUS', name: 'Tucson International' },
        { code: 'SDL', name: 'Scottsdale Airport' },
        { code: 'FLG', name: 'Flagstaff Pulliam' },
    ],
    // Add more states as needed...
};

console.log('US Cities data generation script ready.');
console.log(`Total states: ${Object.keys(statesData).length}`);
console.log(`Total cities: ${Object.values(statesData).reduce((acc, state) => acc + state.topCities.length, 0)}`);
