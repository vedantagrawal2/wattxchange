// ─────────────────────────────────────────────────────────────────────────────
// india_data.js — All 28 States + 8 Union Territories with DISCOMs & tariffs
// ─────────────────────────────────────────────────────────────────────────────

export const INDIA_DATA = {
  "Andhra Pradesh": {
    type: "state",
    cities: ["Visakhapatnam","Vijayawada","Guntur","Nellore","Kurnool","Tirupati","Kakinada","Rajahmundry"],
    discoms: [
      { name:"APEPDCL", fullName:"Eastern Power Distribution Company of AP Ltd.", buyRate:7.10, sellRate:3.00, wattxBuyRate:5.80, wattxSellRate:3.90 },
      { name:"APSPDCL", fullName:"Southern Power Distribution Company of AP Ltd.", buyRate:7.20, sellRate:3.05, wattxBuyRate:5.90, wattxSellRate:3.95 },
    ],
  },
  "Arunachal Pradesh": {
    type: "state",
    cities: ["Itanagar","Naharlagun","Pasighat","Namsai","Bomdila","Ziro","Along","Tezu"],
    discoms: [
      { name:"APECL", fullName:"Arunachal Pradesh Electricity Corporation Ltd.", buyRate:5.50, sellRate:2.40, wattxBuyRate:4.50, wattxSellRate:3.10 },
    ],
  },
  "Assam": {
    type: "state",
    cities: ["Guwahati","Silchar","Dibrugarh","Jorhat","Nagaon","Tinsukia","Tezpur","Bongaigaon"],
    discoms: [
      { name:"APDCL", fullName:"Assam Power Distribution Company Ltd.", buyRate:6.80, sellRate:2.80, wattxBuyRate:5.50, wattxSellRate:3.60 },
    ],
  },
  "Bihar": {
    type: "state",
    cities: ["Patna","Gaya","Bhagalpur","Muzaffarpur","Purnia","Darbhanga","Ara","Begusarai"],
    discoms: [
      { name:"NBPDCL", fullName:"North Bihar Power Distribution Company Ltd.", buyRate:6.90, sellRate:2.60, wattxBuyRate:5.60, wattxSellRate:3.40 },
      { name:"SBPDCL", fullName:"South Bihar Power Distribution Company Ltd.", buyRate:7.00, sellRate:2.65, wattxBuyRate:5.70, wattxSellRate:3.45 },
    ],
  },
  "Chhattisgarh": {
    type: "state",
    cities: ["Raipur","Bhilai","Bilaspur","Korba","Durg","Rajnandgaon","Jagdalpur","Raigarh"],
    discoms: [
      { name:"CSPDCL", fullName:"Chhattisgarh State Power Distribution Co. Ltd.", buyRate:6.20, sellRate:2.70, wattxBuyRate:5.10, wattxSellRate:3.50 },
    ],
  },
  "Goa": {
    type: "state",
    cities: ["Panaji","Margao","Vasco da Gama","Mapusa","Ponda","Bicholim","Curchorem","Canacona"],
    discoms: [
      { name:"GEDCL", fullName:"Goa Electricity Department", buyRate:4.50, sellRate:2.20, wattxBuyRate:3.80, wattxSellRate:2.90 },
    ],
  },
  "Gujarat": {
    type: "state",
    cities: ["Ahmedabad","Surat","Vadodara","Rajkot","Bhavnagar","Jamnagar","Gandhinagar","Anand"],
    discoms: [
      { name:"UGVCL", fullName:"Uttar Gujarat Vij Company Ltd.", buyRate:6.50, sellRate:2.90, wattxBuyRate:5.30, wattxSellRate:3.80 },
      { name:"MGVCL", fullName:"Madhya Gujarat Vij Company Ltd.", buyRate:6.60, sellRate:3.00, wattxBuyRate:5.40, wattxSellRate:3.90 },
      { name:"PGVCL", fullName:"Paschim Gujarat Vij Company Ltd.", buyRate:6.40, sellRate:2.85, wattxBuyRate:5.20, wattxSellRate:3.75 },
      { name:"DGVCL", fullName:"Dakshin Gujarat Vij Company Ltd.", buyRate:6.70, sellRate:3.05, wattxBuyRate:5.50, wattxSellRate:3.95 },
    ],
  },
  "Haryana": {
    type: "state",
    cities: ["Faridabad","Gurugram","Panipat","Ambala","Yamunanagar","Rohtak","Hisar","Karnal"],
    discoms: [
      { name:"UHBVNL", fullName:"Uttar Haryana Bijli Vitran Nigam Ltd.", buyRate:7.50, sellRate:3.30, wattxBuyRate:6.10, wattxSellRate:4.20 },
      { name:"DHBVNL", fullName:"Dakshin Haryana Bijli Vitran Nigam Ltd.", buyRate:7.60, sellRate:3.35, wattxBuyRate:6.20, wattxSellRate:4.25 },
    ],
  },
  "Himachal Pradesh": {
    type: "state",
    cities: ["Shimla","Dharamshala","Solan","Mandi","Kullu","Hamirpur","Una","Chamba"],
    discoms: [
      { name:"HPSEBL", fullName:"Himachal Pradesh State Electricity Board Ltd.", buyRate:4.20, sellRate:2.10, wattxBuyRate:3.60, wattxSellRate:2.80 },
    ],
  },
  "Jharkhand": {
    type: "state",
    cities: ["Ranchi","Jamshedpur","Dhanbad","Bokaro","Deoghar","Phusro","Hazaribagh","Giridih"],
    discoms: [
      { name:"JBVNL", fullName:"Jharkhand Bijli Vitran Nigam Ltd.", buyRate:6.80, sellRate:2.75, wattxBuyRate:5.50, wattxSellRate:3.55 },
    ],
  },
  "Karnataka": {
    type: "state",
    cities: ["Bengaluru","Mysuru","Hubli","Mangaluru","Belagavi","Davangere","Ballari","Tumkur"],
    discoms: [
      { name:"BESCOM", fullName:"Bangalore Electricity Supply Company", buyRate:7.20, sellRate:3.40, wattxBuyRate:5.90, wattxSellRate:4.30 },
      { name:"MESCOM", fullName:"Mangalore Electricity Supply Company", buyRate:6.80, sellRate:3.20, wattxBuyRate:5.60, wattxSellRate:4.10 },
      { name:"HESCOM", fullName:"Hubli Electricity Supply Company", buyRate:6.90, sellRate:3.10, wattxBuyRate:5.70, wattxSellRate:4.00 },
      { name:"GESCOM", fullName:"Gulbarga Electricity Supply Company", buyRate:6.70, sellRate:3.00, wattxBuyRate:5.50, wattxSellRate:3.90 },
      { name:"CESC-K", fullName:"Chamundeshwari Electricity Supply Corp.", buyRate:6.90, sellRate:3.15, wattxBuyRate:5.65, wattxSellRate:4.05 },
    ],
  },
  "Kerala": {
    type: "state",
    cities: ["Thiruvananthapuram","Kochi","Kozhikode","Thrissur","Kollam","Palakkad","Malappuram","Kannur"],
    discoms: [
      { name:"KSEB", fullName:"Kerala State Electricity Board Ltd.", buyRate:6.20, sellRate:3.10, wattxBuyRate:5.20, wattxSellRate:4.00 },
    ],
  },
  "Madhya Pradesh": {
    type: "state",
    cities: ["Bhopal","Indore","Jabalpur","Gwalior","Ujjain","Sagar","Dewas","Satna"],
    discoms: [
      { name:"MPEZ",   fullName:"MP Paschim Kshetra Vidyut Vitaran Co. Ltd.", buyRate:6.80, sellRate:2.80, wattxBuyRate:5.50, wattxSellRate:3.65 },
      { name:"MPMKV",  fullName:"MP Madhya Kshetra Vidyut Vitaran Co. Ltd.", buyRate:6.70, sellRate:2.75, wattxBuyRate:5.40, wattxSellRate:3.60 },
      { name:"MPPKV",  fullName:"MP Poorv Kshetra Vidyut Vitaran Co. Ltd.", buyRate:6.60, sellRate:2.70, wattxBuyRate:5.30, wattxSellRate:3.55 },
    ],
  },
  "Maharashtra": {
    type: "state",
    cities: ["Mumbai","Pune","Nagpur","Nashik","Aurangabad","Solapur","Kolhapur","Thane"],
    discoms: [
      { name:"MSEDCL",          fullName:"Maharashtra State Electricity Distribution Co. Ltd.", buyRate:7.80, sellRate:3.20, wattxBuyRate:6.40, wattxSellRate:4.10 },
      { name:"Adani Electricity",fullName:"Adani Electricity Mumbai Ltd.",                      buyRate:8.20, sellRate:3.50, wattxBuyRate:6.80, wattxSellRate:4.40 },
      { name:"BEST",             fullName:"Brihanmumbai Electric Supply & Transport",           buyRate:7.50, sellRate:3.10, wattxBuyRate:6.20, wattxSellRate:4.00 },
    ],
  },
  "Manipur": {
    type: "state",
    cities: ["Imphal","Thoubal","Bishnupur","Churachandpur","Kakching","Ukhrul","Senapati","Tamenglong"],
    discoms: [
      { name:"MSPDCL", fullName:"Manipur State Power Distribution Company Ltd.", buyRate:5.80, sellRate:2.30, wattxBuyRate:4.70, wattxSellRate:3.00 },
    ],
  },
  "Meghalaya": {
    type: "state",
    cities: ["Shillong","Tura","Jowai","Nongstoin","Baghmara","Williamnagar","Nongpoh","Resubelpara"],
    discoms: [
      { name:"MeECL", fullName:"Meghalaya Energy Corporation Ltd.", buyRate:5.90, sellRate:2.35, wattxBuyRate:4.80, wattxSellRate:3.05 },
    ],
  },
  "Mizoram": {
    type: "state",
    cities: ["Aizawl","Lunglei","Champhai","Kolasib","Serchhip","Lawngtlai","Mamit","Saiha"],
    discoms: [
      { name:"PUIL", fullName:"Power & Electricity Dept., Mizoram", buyRate:5.40, sellRate:2.20, wattxBuyRate:4.40, wattxSellRate:2.90 },
    ],
  },
  "Nagaland": {
    type: "state",
    cities: ["Kohima","Dimapur","Mokokchung","Tuensang","Wokha","Zunheboto","Phek","Mon"],
    discoms: [
      { name:"DoE Nagaland", fullName:"Department of Electricity, Nagaland", buyRate:5.60, sellRate:2.25, wattxBuyRate:4.55, wattxSellRate:2.95 },
    ],
  },
  "Odisha": {
    type: "state",
    cities: ["Bhubaneswar","Cuttack","Rourkela","Berhampur","Sambalpur","Puri","Balasore","Bhadrak"],
    discoms: [
      { name:"TPNODL", fullName:"TP Northern Odisha Distribution Ltd.", buyRate:6.50, sellRate:2.80, wattxBuyRate:5.30, wattxSellRate:3.60 },
      { name:"TPCODL", fullName:"TP Central Odisha Distribution Ltd.",  buyRate:6.60, sellRate:2.85, wattxBuyRate:5.40, wattxSellRate:3.65 },
      { name:"TPSODL", fullName:"TP Southern Odisha Distribution Ltd.", buyRate:6.40, sellRate:2.75, wattxBuyRate:5.20, wattxSellRate:3.55 },
      { name:"TPWODL", fullName:"TP Western Odisha Distribution Ltd.",  buyRate:6.30, sellRate:2.70, wattxBuyRate:5.10, wattxSellRate:3.50 },
    ],
  },
  "Punjab": {
    type: "state",
    cities: ["Ludhiana","Amritsar","Jalandhar","Patiala","Bathinda","Mohali","Hoshiarpur","Gurdaspur"],
    discoms: [
      { name:"PSPCL", fullName:"Punjab State Power Corporation Ltd.", buyRate:7.40, sellRate:3.20, wattxBuyRate:6.00, wattxSellRate:4.10 },
    ],
  },
  "Rajasthan": {
    type: "state",
    cities: ["Jaipur","Jodhpur","Udaipur","Kota","Ajmer","Bikaner","Alwar","Sikar"],
    discoms: [
      { name:"JVVNL",  fullName:"Jaipur Vidyut Vitran Nigam Ltd.",  buyRate:7.10, sellRate:3.15, wattxBuyRate:5.80, wattxSellRate:4.05 },
      { name:"AVVNL",  fullName:"Ajmer Vidyut Vitran Nigam Ltd.",   buyRate:6.95, sellRate:3.10, wattxBuyRate:5.65, wattxSellRate:4.00 },
      { name:"JdVVNL", fullName:"Jodhpur Vidyut Vitran Nigam Ltd.", buyRate:7.00, sellRate:3.12, wattxBuyRate:5.70, wattxSellRate:4.02 },
    ],
  },
  "Sikkim": {
    type: "state",
    cities: ["Gangtok","Namchi","Pelling","Mangan","Ravangla","Jorethang","Singtam","Rangpo"],
    discoms: [
      { name:"SPDCL", fullName:"Sikkim Power Development Corporation Ltd.", buyRate:4.80, sellRate:2.30, wattxBuyRate:4.00, wattxSellRate:3.00 },
    ],
  },
  "Tamil Nadu": {
    type: "state",
    cities: ["Chennai","Coimbatore","Madurai","Tiruchirappalli","Salem","Tirunelveli","Vellore","Erode"],
    discoms: [
      { name:"TANGEDCO", fullName:"Tamil Nadu Generation and Distribution Corporation", buyRate:6.90, sellRate:3.00, wattxBuyRate:5.70, wattxSellRate:3.90 },
    ],
  },
  "Telangana": {
    type: "state",
    cities: ["Hyderabad","Warangal","Nizamabad","Karimnagar","Khammam","Ramagundam","Mahbubnagar","Nalgonda"],
    discoms: [
      { name:"TSSPDCL", fullName:"Telangana State Southern Power Distribution Company Ltd.", buyRate:7.30, sellRate:3.25, wattxBuyRate:5.95, wattxSellRate:4.15 },
      { name:"TSNPDCL", fullName:"Telangana State Northern Power Distribution Company Ltd.", buyRate:7.10, sellRate:3.15, wattxBuyRate:5.80, wattxSellRate:4.05 },
    ],
  },
  "Tripura": {
    type: "state",
    cities: ["Agartala","Udaipur","Dharmanagar","Kailasahar","Ambassa","Belonia","Khowai","Sabroom"],
    discoms: [
      { name:"TSECL", fullName:"Tripura State Electricity Corporation Ltd.", buyRate:6.10, sellRate:2.50, wattxBuyRate:5.00, wattxSellRate:3.20 },
    ],
  },
  "Uttar Pradesh": {
    type: "state",
    cities: ["Lucknow","Kanpur","Agra","Varanasi","Prayagraj","Meerut","Ghaziabad","Noida"],
    discoms: [
      { name:"DVVNL",  fullName:"Dakshinanchal Vidyut Vitaran Nigam Ltd.",  buyRate:6.80, sellRate:2.75, wattxBuyRate:5.50, wattxSellRate:3.65 },
      { name:"PVVNL",  fullName:"Paschimanchal Vidyut Vitaran Nigam Ltd.",  buyRate:7.00, sellRate:2.85, wattxBuyRate:5.70, wattxSellRate:3.75 },
      { name:"MVVNL",  fullName:"Madhyanchal Vidyut Vitaran Nigam Ltd.",    buyRate:6.90, sellRate:2.80, wattxBuyRate:5.60, wattxSellRate:3.70 },
      { name:"PuVVNL", fullName:"Purvanchal Vidyut Vitaran Nigam Ltd.",     buyRate:6.70, sellRate:2.70, wattxBuyRate:5.40, wattxSellRate:3.60 },
      { name:"KESCO",  fullName:"Kanpur Electricity Supply Company",        buyRate:7.10, sellRate:2.90, wattxBuyRate:5.80, wattxSellRate:3.80 },
    ],
  },
  "Uttarakhand": {
    type: "state",
    cities: ["Dehradun","Haridwar","Roorkee","Haldwani","Rudrapur","Kashipur","Rishikesh","Nainital"],
    discoms: [
      { name:"UPCL", fullName:"Uttarakhand Power Corporation Ltd.", buyRate:6.50, sellRate:2.80, wattxBuyRate:5.30, wattxSellRate:3.65 },
    ],
  },
  "West Bengal": {
    type: "state",
    cities: ["Kolkata","Howrah","Durgapur","Asansol","Siliguri","Bardhaman","Malda","Kharagpur"],
    discoms: [
      { name:"CESC",     fullName:"Calcutta Electric Supply Corporation",                    buyRate:7.60, sellRate:3.30, wattxBuyRate:6.20, wattxSellRate:4.20 },
      { name:"WBSEDCL", fullName:"West Bengal State Electricity Distribution Co. Ltd.", buyRate:7.20, sellRate:3.10, wattxBuyRate:5.90, wattxSellRate:4.00 },
    ],
  },

  // ── UNION TERRITORIES ────────────────────────────────────────────────────────
  "Andaman & Nicobar Islands": {
    type: "ut",
    cities: ["Port Blair","Diglipur","Rangat","Mayabunder","Car Nicobar","Havelock Island","Neil Island","Baratang"],
    discoms: [
      { name:"ANIIDCO", fullName:"A&N Islands Integrated Dev. Corp.", buyRate:5.20, sellRate:2.10, wattxBuyRate:4.30, wattxSellRate:2.80 },
    ],
  },
  "Chandigarh": {
    type: "ut",
    cities: ["Chandigarh Sector 1-10","Sector 11-20","Sector 21-30","Sector 31-40","Sector 41-50","Manimajra","Industrial Area Phase I","Industrial Area Phase II"],
    discoms: [
      { name:"ED Chandigarh", fullName:"Electricity Department, Chandigarh Administration", buyRate:4.00, sellRate:2.50, wattxBuyRate:3.50, wattxSellRate:3.10 },
    ],
  },
  "Dadra & Nagar Haveli and Daman & Diu": {
    type: "ut",
    cities: ["Silvassa","Daman","Diu","Amli","Naroli","Vapi","Dadra","Khanvel"],
    discoms: [
      { name:"DNHPDCL", fullName:"Dadra & NH Power Distribution Corp. Ltd.", buyRate:4.10, sellRate:2.20, wattxBuyRate:3.50, wattxSellRate:2.90 },
    ],
  },
  "Delhi": {
    type: "ut",
    cities: ["New Delhi","Dwarka","Rohini","Shahdara","Saket","Lajpat Nagar","Janakpuri","Pitampura"],
    discoms: [
      { name:"BSES Rajdhani", fullName:"BSES Rajdhani Power Ltd.",           buyRate:8.50, sellRate:3.80, wattxBuyRate:7.00, wattxSellRate:4.80 },
      { name:"BSES Yamuna",   fullName:"BSES Yamuna Power Ltd.",             buyRate:8.30, sellRate:3.70, wattxBuyRate:6.90, wattxSellRate:4.70 },
      { name:"TPDDL",         fullName:"Tata Power Delhi Distribution Ltd.", buyRate:8.00, sellRate:3.60, wattxBuyRate:6.60, wattxSellRate:4.60 },
    ],
  },
  "Jammu & Kashmir": {
    type: "ut",
    cities: ["Srinagar","Jammu","Anantnag","Baramulla","Sopore","Kathua","Udhampur","Rajouri"],
    discoms: [
      { name:"JKPDD", fullName:"J&K Power Development Department", buyRate:3.90, sellRate:1.90, wattxBuyRate:3.30, wattxSellRate:2.55 },
    ],
  },
  "Ladakh": {
    type: "ut",
    cities: ["Leh","Kargil","Diskit","Padum","Nyoma","Khalsi","Sankoo","Turtuk"],
    discoms: [
      { name:"LPDCL", fullName:"Ladakh Power Development Dept.", buyRate:3.50, sellRate:1.80, wattxBuyRate:3.00, wattxSellRate:2.40 },
    ],
  },
  "Lakshadweep": {
    type: "ut",
    cities: ["Kavaratti","Agatti","Minicoy","Amini","Andrott","Kalpeni","Kadmat","Bangaram"],
    discoms: [
      { name:"ED Lakshadweep", fullName:"Electricity Department, Lakshadweep Administration", buyRate:4.60, sellRate:2.00, wattxBuyRate:3.90, wattxSellRate:2.70 },
    ],
  },
  "Puducherry": {
    type: "ut",
    cities: ["Pondicherry","Karaikal","Mahe","Yanam","Ozhukarai","Villianur","Ariyankuppam","Bahour"],
    discoms: [
      { name:"PEDC", fullName:"Puducherry Electricity Department", buyRate:5.80, sellRate:2.80, wattxBuyRate:4.80, wattxSellRate:3.60 },
    ],
  },
};

export const STATES = Object.keys(INDIA_DATA).sort();
export const STATE_TYPES = Object.fromEntries(
  Object.entries(INDIA_DATA).map(([k,v]) => [k, v.type])
);
