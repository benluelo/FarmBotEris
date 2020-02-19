const allflags = {
  "🇦🇨": "ascension island",
  "🇦🇩": "andorra",
  "🇦🇪": "united arab emirates",
  "🇦🇫": "afghanistan",
  "🇦🇬": "antigua and barbuda",
  "🇦🇮": "anguilla",
  "🇦🇱": "albania",
  "🇦🇲": "armenia",
  "🇦🇴": "angola",
  "🇦🇶": "antarctica",
  "🇦🇷": "argentina",
  "🇦🇸": "american samoa",
  "🇦🇹": "austria",
  "🇦🇺": "australia",
  "🇦🇼": "aruba",
  "🇦🇽": "åland islands",
  "🇦🇿": "azerbaijan",
  "🇧🇦": "bosnia and herzegovina",
  "🇧🇧": "barbados",
  "🇧🇩": "bangladesh",
  "🇧🇪": "belgium",
  "🇧🇫": "burkina faso",
  "🇧🇬": "bulgaria",
  "🇧🇭": "bahrain",
  "🇧🇮": "burundi",
  "🇧🇯": "benin",
  "🇧🇱": "st. barthélemy",
  "🇧🇲": "bermuda",
  "🇧🇳": "brunei",
  "🇧🇴": "bolivia",
  "🇧🇶": "caribbean netherlands",
  "🇧🇷": "brazil",
  "🇧🇸": "bahamas",
  "🇧🇹": "bhutan",
  "🇧🇻": "bouvet island",
  "🇧🇼": "botswana",
  "🇧🇾": "belarus",
  "🇧🇿": "belize",
  "🇨🇦": "canada",
  "🇨🇨": "cocos (keeling) islands",
  "🇨🇩": "congo - kinshasa",
  "🇨🇫": "central african republic",
  "🇨🇬": "congo - brazzaville",
  "🇨🇭": "switzerland",
  "🇨🇮": "côte d’ivoire",
  "🇨🇰": "cook islands",
  "🇨🇱": "chile",
  "🇨🇲": "cameroon",
  "🇨🇳": "china",
  "🇨🇴": "colombia",
  "🇨🇵": "clipperton island",
  "🇨🇷": "costa rica",
  "🇨🇺": "cuba",
  "🇨🇻": "cape verde",
  "🇨🇼": "curaçao",
  "🇨🇽": "christmas island",
  "🇨🇾": "cyprus",
  "🇨🇿": "czechia",
  "🇩🇪": "germany",
  "🇩🇬": "diego garcia",
  "🇩🇯": "djibouti",
  "🇩🇰": "denmark",
  "🇩🇲": "dominica",
  "🇩🇴": "dominican republic",
  "🇩🇿": "algeria",
  "🇪🇦": "ceuta and melilla",
  "🇪🇨": "ecuador",
  "🇪🇪": "estonia",
  "🇪🇬": "egypt",
  "🇪🇭": "western sahara",
  "🇪🇷": "eritrea",
  "🇪🇸": "spain",
  "🇪🇹": "ethiopia",
  "🇪🇺": "european union",
  "🇫🇮": "finland",
  "🇫🇯": "fiji",
  "🇫🇰": "falkland islands",
  "🇫🇲": "micronesia",
  "🇫🇴": "faroe islands",
  "🇫🇷": "france",
  "🇬🇦": "gabon",
  "🇬🇧": "united kingdom",
  "🇬🇩": "grenada",
  "🇬🇪": "georgia",
  "🇬🇫": "french guiana",
  "🇬🇬": "guernsey",
  "🇬🇭": "ghana",
  "🇬🇮": "gibraltar",
  "🇬🇱": "greenland",
  "🇬🇲": "gambia",
  "🇬🇳": "guinea",
  "🇬🇵": "guadeloupe",
  "🇬🇶": "equatorial guinea",
  "🇬🇷": "greece",
  "🇬🇸": "south georgia and south sandwich islands",
  "🇬🇹": "guatemala",
  "🇬🇺": "guam",
  "🇬🇼": "guinea-bissau",
  "🇬🇾": "guyana",
  "🇭🇰": "hong kong sar china",
  "🇭🇲": "heard and mcdonald islands",
  "🇭🇳": "honduras",
  "🇭🇷": "croatia",
  "🇭🇹": "haiti",
  "🇭🇺": "hungary",
  "🇮🇨": "canary islands",
  "🇮🇩": "indonesia",
  "🇮🇪": "ireland",
  "🇮🇱": "israel",
  "🇮🇲": "isle of man",
  "🇮🇳": "india",
  "🇮🇴": "british indian ocean territory",
  "🇮🇶": "iraq",
  "🇮🇷": "iran",
  "🇮🇸": "iceland",
  "🇮🇹": "italy",
  "🇯🇪": "jersey",
  "🇯🇲": "jamaica",
  "🇯🇴": "jordan",
  "🇯🇵": "japan",
  "🇰🇪": "kenya",
  "🇰🇬": "kyrgyzstan",
  "🇰🇭": "cambodia",
  "🇰🇮": "kiribati",
  "🇰🇲": "comoros",
  "🇰🇳": "st. kitts and nevis",
  "🇰🇵": "north korea",
  "🇰🇷": "south korea",
  "🇰🇼": "kuwait",
  "🇰🇾": "cayman islands",
  "🇰🇿": "kazakhstan",
  "🇱🇦": "laos",
  "🇱🇧": "lebanon",
  "🇱🇨": "st. lucia",
  "🇱🇮": "liechtenstein",
  "🇱🇰": "sri lanka",
  "🇱🇷": "liberia",
  "🇱🇸": "lesotho",
  "🇱🇹": "lithuania",
  "🇱🇺": "luxembourg",
  "🇱🇻": "latvia",
  "🇱🇾": "libya",
  "🇲🇦": "morocco",
  "🇲🇨": "monaco",
  "🇲🇩": "moldova",
  "🇲🇪": "montenegro",
  "🇲🇫": "st. martin",
  "🇲🇬": "madagascar",
  "🇲🇭": "marshall islands",
  "🇲🇰": "north macedonia",
  "🇲🇱": "mali",
  "🇲🇲": "myanmar (burma)",
  "🇲🇳": "mongolia",
  "🇲🇴": "macao sar china",
  "🇲🇵": "northern mariana islands",
  "🇲🇶": "martinique",
  "🇲🇷": "mauritania",
  "🇲🇸": "montserrat",
  "🇲🇹": "malta",
  "🇲🇺": "mauritius",
  "🇲🇻": "maldives",
  "🇲🇼": "malawi",
  "🇲🇽": "mexico",
  "🇲🇾": "malaysia",
  "🇲🇿": "mozambique",
  "🇳🇦": "namibia",
  "🇳🇨": "new caledonia",
  "🇳🇪": "niger",
  "🇳🇫": "norfolk island",
  "🇳🇬": "nigeria",
  "🇳🇮": "nicaragua",
  "🇳🇱": "netherlands",
  "🇳🇴": "norway",
  "🇳🇵": "nepal",
  "🇳🇷": "nauru",
  "🇳🇺": "niue",
  "🇳🇿": "new zealand",
  "🇴🇲": "oman",
  "🇵🇦": "panama",
  "🇵🇪": "peru",
  "🇵🇫": "french polynesia",
  "🇵🇬": "papua new guinea",
  "🇵🇭": "philippines",
  "🇵🇰": "pakistan",
  "🇵🇱": "poland",
  "🇵🇲": "st. pierre and miquelon",
  "🇵🇳": "pitcairn islands",
  "🇵🇷": "puerto rico",
  "🇵🇸": "palestinian territories",
  "🇵🇹": "portugal",
  "🇵🇼": "palau",
  "🇵🇾": "paraguay",
  "🇶🇦": "qatar",
  "🇷🇪": "réunion",
  "🇷🇴": "romania",
  "🇷🇸": "serbia",
  "🇷🇺": "russia",
  "🇷🇼": "rwanda",
  "🇸🇦": "saudi arabia",
  "🇸🇧": "solomon islands",
  "🇸🇨": "seychelles",
  "🇸🇩": "sudan",
  "🇸🇪": "sweden",
  "🇸🇬": "singapore",
  "🇸🇭": "st. helena",
  "🇸🇮": "slovenia",
  "🇸🇯": "svalbard and jan mayen",
  "🇸🇰": "slovakia",
  "🇸🇱": "sierra leone",
  "🇸🇲": "san marino",
  "🇸🇳": "senegal",
  "🇸🇴": "somalia",
  "🇸🇷": "suriname",
  "🇸🇸": "south sudan",
  "🇸🇹": "são tomé and príncipe",
  "🇸🇻": "el salvador",
  "🇸🇽": "sint maarten",
  "🇸🇾": "syria",
  "🇸🇿": "eswatini",
  "🇹🇦": "tristan da cunha",
  "🇹🇨": "turks and caicos islands",
  "🇹🇩": "chad",
  "🇹🇫": "french southern territories",
  "🇹🇬": "togo",
  "🇹🇭": "thailand",
  "🇹🇯": "tajikistan",
  "🇹🇰": "tokelau",
  "🇹🇱": "timor-leste",
  "🇹🇲": "turkmenistan",
  "🇹🇳": "tunisia",
  "🇹🇴": "tonga",
  "🇹🇷": "turkey",
  "🇹🇹": "trinidad and tobago",
  "🇹🇻": "tuvalu",
  "🇹🇼": "taiwan",
  "🇹🇿": "tanzania",
  "🇺🇦": "ukraine",
  "🇺🇬": "uganda",
  "🇺🇲": "u.s. outlying islands",
  "🇺🇳": "united nations",
  "🇺🇸": "united states",
  "🇺🇾": "uruguay",
  "🇺🇿": "uzbekistan",
  "🇻🇦": "vatican city",
  "🇻🇨": "st. vincent and grenadines",
  "🇻🇪": "venezuela",
  "🇻🇬": "british virgin islands",
  "🇻🇮": "u.s. virgin islands",
  "🇻🇳": "vietnam",
  "🇻🇺": "vanuatu",
  "🇼🇫": "wallis and futuna",
  "🇼🇸": "samoa",
  "🇽🇰": "kosovo",
  "🇾🇪": "yemen",
  "🇾🇹": "mayotte",
  "🇿🇦": "south africa",
  "🇿🇲": "zambia",
  "🇿🇼": "zimbabwe"
}

const legalflags = [
  "albania",
  "argentina",
  "armenia",
  "australia",
  "austria",
  "azerbaijan",
  "bangladesh",
  "belgium",
  "bosnia and herzegovina",
  "brazil",
  "bulgaria",
  "canada",
  "china",
  "colombia",
  "costa rica",
  "croatia",
  "czech republic",
  "denmark",
  "egypt",
  "england",
  "estonia",
  "finland",
  "france",
  "georgia",
  "germany",
  "greece",
  "hungary",
  "india",
  "indonesia",
  "iran",
  "ireland",
  "israel",
  "italy",
  "japan",
  "korea",
  "kyrgyz republic",
  "mexico",
  "morocco",
  "nepal",
  "netherlands",
  "new zealand",
  "nigeria",
  "norway",
  "pakistan",
  "poland",
  "portugal",
  "romania",
  "russia",
  "saudi arabia",
  "slovakia",
  "slovenia",
  "spain",
  "sweden",
  "switzerland",
  "tunisia",
  "turkey",
  "ukraine",
  "united states",
  "vietnam",
]


let flagstowrite = {}

for (const flag in allflags){
  if (legalflags.includes(allflags[flag])){
    console.log(flag)
    flagstowrite[allflags[flag]] = flag
  }
}

require("fs").writeFileSync("./bot/lib/flags.json", JSON.stringify(flagstowrite, null, 4))