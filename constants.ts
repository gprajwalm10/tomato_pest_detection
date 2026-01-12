
import { FarmInsight, Language, FarmerTask, MarketPrice } from "./types";

export const SYSTEM_INSTRUCTION = (lang: Language = 'en') => `
You are an expert plant pathologist and agronomist specializing in Tomato crops. 
Your task is to analyze the provided image of a tomato plant (leaf, fruit, or stem).

If the image is not a tomato plant or is too blurry, indicate this.
Otherwise, identify if there is a pest, disease, or if the plant is healthy.

MANDATORY: You must return the output in the following language: ${getLanguageName(lang)}.

Common tomato pests: Aphids, Fruitworm, Whiteflies, Spider Mites, Hornworm, Stink Bugs, Leaf Miners.
Common diseases: Early Blight, Late Blight, Septoria, TYLCV.

Return a structured JSON object exactly as specified:
{
  "isHealthy": boolean,
  "name": "Common name",
  "scientificName": "Scientific name",
  "confidence": 0.0 to 1.0,
  "severity": "low", "medium", "high", or "none",
  "symptoms": ["list"],
  "immediateActions": ["step 1", "step 2"],
  "organicSolutions": ["list"],
  "chemicalSolutions": ["list"],
  "preventionTips": ["tip 1", "tip 2"]
}
`;

export const LIVE_SYSTEM_INSTRUCTION = (lang: Language = 'en', userName: string = 'Farmer') => `
You are AgriGuard Live, a real-time agricultural assistant for tomato farmers. 
A farmer named ${userName} is showing you their tomato plants via live video.
Speak in ${getLanguageName(lang)}. Keep your responses helpful, concise, and focused on what you see in the video frames.
If you see signs of pests or diseases, mention them immediately. If the plant looks healthy, reassure the farmer.
Be friendly and professional.
`;

function getLanguageName(lang: Language) {
  const names: Record<Language, string> = {
    en: 'English',
    kn: 'Kannada (ಕನ್ನಡ)',
    hi: 'Hindi (हिन्दी)',
    te: 'Telugu (తెలుగు)',
    ml: 'Malayalam (മലയാളം)',
    ta: 'Tamil (தமிழ்)'
  };
  return names[lang];
}

export const MOCK_MARKET_PRICES: MarketPrice[] = [
  { id: '1', mandi: 'Kolar, KA', price: '₹2,100/Q', trend: 'up', change: '+12%' },
  { id: '2', mandi: 'Azadpur, DL', price: '₹2,450/Q', trend: 'up', change: '+8%' },
  { id: '3', mandi: 'Mumbai, MH', price: '₹2,300/Q', trend: 'down', change: '-3%' },
  { id: '4', mandi: 'Chittoor, AP', price: '₹1,950/Q', trend: 'stable', change: '0%' }
];

export const CROP_TASKS: FarmerTask[] = [
  { id: 't1', title: 'Seedling Check', description: 'Monitor for damping-off in young seedlings.', category: 'pest', dayRange: [1, 15] },
  { id: 't2', title: 'Nitrogen Boost', description: 'Apply first round of N-rich fertilizer for vegetative growth.', category: 'fertilizer', dayRange: [15, 30] },
  { id: 't3', title: 'Staking/Trellising', description: 'Provide support to plants as they start to grow tall.', category: 'water', dayRange: [25, 45] },
  { id: 't4', title: 'Calcium Intake', description: 'Prevent blossom end rot with early calcium application.', category: 'fertilizer', dayRange: [40, 60] },
  { id: 't5', title: 'Pruning Suckers', description: 'Remove non-fruit bearing suckers to improve airflow.', category: 'water', dayRange: [30, 70] },
  { id: 't6', title: 'Fruit Thinning', description: 'Remove deformed fruits to focus energy on healthy clusters.', category: 'harvest', dayRange: [60, 100] }
];

export const UI_TRANSLATIONS: Record<Language, any> = {
  en: {
    home: "Home",
    history: "History",
    settings: "Settings",
    community: "Community",
    welcome: "Welcome",
    scan: "Scan Plant",
    upload: "Upload Photo",
    live_conditions: "Live Conditions",
    rain_alert: "Rain Alert",
    knowledge_hub: "Knowledge Hub & Updates",
    logout: "Logout",
    my_garden: "My Garden History",
    personal_space: "Personal Space",
    no_history: "No scan history",
    start_scan: "Start First Scan",
    got_it: "Got it, thanks!",
    pro_tip: "Pro Tip for Farmers",
    lang_select: "Select Language",
    farmer_info: "Farmer Information",
    username: "Username",
    full_name: "Full Name",
    version: "App Version",
    know_more_title: "What you need to know",
    live_mode: "Live Assistant",
    stop_live: "Stop Live",
    position_leaf: "POSITION LEAF IN FRAME",
    camera_error: "Camera access is required for scanning plants.",
    nearby_farmers: "Farmers Nearby",
    connect: "Connect",
    pending: "Pending",
    message: "Message",
    requests: "Requests",
    accept: "Accept",
    ignore: "Ignore",
    no_nearby: "Looking for farmers in your area...",
    distance: "away",
    mandi_prices: "Market Prices",
    daily_tasks: "Daily Tasks",
    regional_alerts: "Regional Pest Alerts",
    high_threat: "HIGH THREAT",
    view_all: "View All",
    todays_task: "Today's Task",
    days_since: "Days since planting"
  },
  kn: {
    home: "ಮನೆ",
    history: "ಇತಿಹಾಸ",
    settings: "ಸಂಯೋಜನೆಗಳು",
    community: "ಸಮುದಾಯ",
    welcome: "ಸ್ವಾಗತ",
    scan: "ಗಿಡವನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
    upload: "ಫೋಟೋ ಅಪ್ಲೋಡ್",
    live_conditions: "ಪ್ರಸ್ತುತ ಪರಿಸ್ಥಿತಿ",
    rain_alert: "ಮಳೆ ಮುನ್ಸೂಚನೆ",
    knowledge_hub: "ಜ್ಞಾನ ಕೇಂದ್ರ ಮತ್ತು ಅಪ್‌ಡೇಟ್‌ಗಳು",
    logout: "ಹೊರಬನ್ನಿ",
    my_garden: "ನನ್ನ ತೋಟದ ಇತಿಹಾಸ",
    personal_space: "ವೈಯಕ್ತಿಕ ಸ್ಥಳ",
    no_history: "ಯಾವುದೇ ಇತಿಹಾಸವಿಲ್ಲ",
    start_scan: "ಮೊದಲ ಸ್ಕ್ಯಾನ್ ಪ್ರಾರಂಭಿಸಿ",
    got_it: "ಅರ್ಥವಾಯಿತು, ಧನ್ಯವಾದಗಳು!",
    pro_tip: "ರೈತರಿಗಾಗಿ ಪ್ರಮುಖ ಸಲಹೆ",
    lang_select: "ಭಾಷೆಯನ್ನು ಆರಿಸಿ",
    farmer_info: "ರೈತರ ಮಾಹಿತಿ",
    username: "ಬಳಕೆದಾರರ ಹೆಸರು",
    full_name: "ಪೂರ್ಣ ಹೆಸರು",
    version: "ಆಪ್ ಆವೃತ್ತಿ",
    know_more_title: "ನೀವು ತಿಳಿದುಕೊಳ್ಳಬೇಕಾದ ವಿಷಯಗಳು",
    live_mode: "ಲೈವ್ ಸಹಾಯಕ",
    stop_live: "ನಿಲ್ಲಿಸಿ",
    position_leaf: "ಎಲೆಯನ್ನು ಸರಿಯಾಗಿ ಇರಿಸಿ",
    camera_error: "ಗಿಡಗಳನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಲು ಕ್ಯಾಮೆರಾ ಪ್ರವೇಶ ಅಗತ್ಯವಿದೆ.",
    nearby_farmers: "ಹತ್ತಿರದ ರೈತರು",
    connect: "ಸಂಪರ್ಕಿಸಿ",
    pending: "ಬಾಕಿ ಇದೆ",
    message: "ಸಂದೇಶ",
    requests: "ವಿನಂತಿಗಳು",
    accept: "ಒಪ್ಪಿಕೊಳ್ಳಿ",
    ignore: "ನಿರ್ಲಕ್ಷಿಸಿ",
    no_nearby: "ನಿಮ್ಮ ಪ್ರದೇಶದಲ್ಲಿ ರೈತರಿಗಾಗಿ ಹುಡುಕಲಾಗುತ್ತಿದೆ...",
    distance: "ದೂರ",
    mandi_prices: "ಮಾರುಕಟ್ಟೆ ದರ",
    daily_tasks: "ದೈನಂದಿನ ಕೆಲಸಗಳು",
    regional_alerts: "ಪ್ರಾದೇಶಿಕ ಕೀಟ ಮುನ್ಸೂಚನೆ",
    high_threat: "ಹೆಚ್ಚಿನ ಅಪಾಯ",
    view_all: "ಎಲ್ಲವನ್ನೂ ನೋಡಿ",
    todays_task: "ಇಂದಿನ ಕೆಲಸ",
    days_since: "ನಾಟಿ ಮಾಡಿದ ದಿನಗಳು"
  },
  hi: {
    home: "मुख्य पृष्ठ",
    history: "इतिहास",
    settings: "सेटिंग्स",
    community: "समुदाय",
    welcome: "स्वागत है",
    scan: "पौधे को स्कैन करें",
    upload: "फोटो अपलोड",
    live_conditions: "लाइव मौसम",
    rain_alert: "बारिश की चेतावनी",
    knowledge_hub: "ज्ञान केंद्र और अपडेट",
    logout: "लॉगआउट",
    my_garden: "मेरे बगीचे का इतिहास",
    personal_space: "व्यक्तिगत स्थान",
    no_history: "कोई इतिहास नहीं",
    start_scan: "पहला स्कैन शुरू करें",
    got_it: "समझ गया, धन्यवाद!",
    pro_tip: "किसानों के लिए प्रो टिप",
    lang_select: "भाषा चुनें",
    farmer_info: "किसान की जानकारी",
    username: "यूज़रनेम",
    full_name: "पूरा नाम",
    version: "ऐप संस्करण",
    know_more_title: "आपको क्या जानने की जरूरत है",
    live_mode: "लाइव सहायक",
    stop_live: "बंद करें",
    position_leaf: "पत्ती को फ्रेम में रखें",
    camera_error: "पौधों को स्कैन करने के लिए कैमरा एक्सेस आवश्यक हैा।",
    nearby_farmers: "आस-पास के किसान",
    connect: "जुड़ें",
    pending: "लंबित",
    message: "संदेश",
    requests: "अनुरोध",
    accept: "स्वीकार करें",
    ignore: "अनदेखा करें",
    no_nearby: "आपके क्षेत्र में किसानों की तलाश की जा रही है...",
    distance: "दूर",
    mandi_prices: "मंडी भाव",
    daily_tasks: "दैनिक कार्य",
    regional_alerts: "क्षेत्रीय कीट चेतावनी",
    high_threat: "उच्च खतरा",
    view_all: "सभी देखें",
    todays_task: "आज का कार्य",
    days_since: "बुवाई के बाद के दिन"
  },
  te: {
    home: "హోమ్",
    history: "చరిత్ర",
    settings: "సెట్టింగ్స్",
    community: "కమ్యూనిటీ",
    welcome: "స్వాగతం",
    scan: "మొక్కను స్కాన్ చేయండి",
    upload: "ఫోటో అప్‌లోడ్",
    live_conditions: "వాతావరణ పరిస్థితులు",
    rain_alert: "వర్షం హెచ్చరిక",
    knowledge_hub: "నాలెడ్జ్ హబ్ & అప్‌డేట్స్",
    logout: "లాగ్ అవుట్",
    my_garden: "నా తోట చరిత్ర",
    personal_space: "వ్యక్తిగత స్థలం",
    no_history: "చరిత్ర లేదు",
    start_scan: "మొదటి స్కాన్ ప్రారంభించండి",
    got_it: "అర్థమైంది, ధన్యవాదాలు!",
    pro_tip: "రైతుల కోసం చిట్కా",
    lang_select: "భాషను ఎంచుకోండి",
    farmer_info: "రైతు సమాచారం",
    username: "యూజర్ నేమ్",
    full_name: "పూర్తి పేరు",
    version: "యాప్ వెర్షన్",
    know_more_title: "మీరు తెలుసుకోవలసిన విషయాలు",
    live_mode: "లైవ్ అసిస్టెంట్",
    stop_live: "ఆపివేయి",
    position_leaf: "ఆకును ఫ్రేమ్ లో ఉంచండి",
    camera_error: "మొక్కలను స్కాన్ చేయడానికి కెమెరా యాక్సెస్ అవసరం.",
    nearby_farmers: "దగ్గరలో ఉన్న రైతులు",
    connect: "కనెక్ట్",
    pending: "పెండింగ్",
    message: "మెసేజ్",
    requests: "అభ్యర్థనలు",
    accept: "అంగీకరించు",
    ignore: "వదిలేయండి",
    no_nearby: "మీ ప్రాంతంలో రైతుల కోసం వెతుకుతోంది...",
    distance: "దూరంలో",
    mandi_prices: "మార్కెట్ ధరలు",
    daily_tasks: "రోజువారీ పనులు",
    regional_alerts: "ప్రాంతీయ తెగుళ్ల హెచ్చరికలు",
    high_threat: "అధిక ప్రమాదం",
    view_all: "అన్నీ చూడండి",
    todays_task: "నేటి పని",
    days_since: "నాటిన తర్వాత రోజులు"
  },
  ml: {
    home: "ഹോം",
    history: "ചരിത്രം",
    settings: "ക്രമീകരണങ്ങൾ",
    community: "കമ്മ്യൂണിറ്റി",
    welcome: "സ്വഗതം",
    scan: "ചെടി സ്കാൻ ചെയ്യുക",
    upload: "ഫോട്ടോ അപ്‌ലോഡ്",
    live_conditions: "കാലാവസ്ഥ",
    rain_alert: "മഴ മുന്നറിയിപ്പ്",
    knowledge_hub: "വിജ്ഞാന കേന്ദ്രം",
    logout: "ലോഗ് ഔട്ട്",
    my_garden: "ചരിത്രം",
    personal_space: "സ്വകാര്യ ഇടം",
    no_history: "ചരിത്രം ലഭ്യമല്ല",
    start_scan: "സ്കാൻ തുടങ്ങുക",
    got_it: "ശരി, നന്ദി!",
    pro_tip: "കർഷകർക്കുള്ള ടിപ്പ്",
    lang_select: "ഭാഷ തിരഞ്ഞെടുക്കുക",
    farmer_info: "കർഷകന്റെ വിവരങ്ങൾ",
    username: "ഉപയോക്താവ്",
    full_name: "മുഴുവൻ പേര്",
    version: "പതിപ്പ്",
    know_more_title: "നിങ്ങൾ അറിഞ്ഞിരിക്കേണ്ട കാര്യങ്ങൾ",
    live_mode: "ലൈവ് അസിസ്റ്റന്റ്",
    stop_live: "നിർത്തുക",
    position_leaf: "ഇല ഫ്രെയിമിൽ വെക്കുക",
    camera_error: "സ്കാൻ ചെയ്യുന്നതിനായി ക്യാമറ അനുമതി ആവശ്യമാണ്.",
    nearby_farmers: "സമീപത്തുള്ള കർഷകർ",
    connect: "ബന്ധപ്പെടുക",
    pending: "കാത്തിരിക്കുന്നു",
    message: "സന്ദേശം",
    requests: "അപേക്ഷകൾ",
    accept: "സ്വീകരിക്കുക",
    ignore: "അവഗണിക്കുക",
    no_nearby: "നിങ്ങളുടെ പ്രദേശത്തെ കർഷകർക്കായി തിരയുന്നു...",
    distance: "അകലെ",
    mandi_prices: "മാർക്കറ്റ് വില",
    daily_tasks: "ദിവസേനയുള്ള ജോലികൾ",
    regional_alerts: "മേഖലയിലെ കീട മുന്നറിയിപ്പുകൾ",
    high_threat: "ഉയർന്ന ഭീഷണി",
    view_all: "എല്ലാം കാണുക",
    todays_task: "ഇന്നത്തെ ജോലി",
    days_since: "നടീലിന് ശേഷമുള്ള ദിവസങ്ങൾ"
  },
  ta: {
    home: "முகப்பு",
    history: "வரலாறு",
    settings: "அமைப்புகள்",
    community: "சமூகம்",
    welcome: "வரவேற்கிறோம்",
    scan: "செடியை ஸ்கேன் செய்க",
    upload: "புகைப்படம் பதிவேற்றவும்",
    live_conditions: "தற்போதைய வானிலை",
    rain_alert: "மழை எச்சரிக்கை",
    knowledge_hub: "அறிவு மையம் & செய்திகள்",
    logout: "வெளியேறு",
    my_garden: "எனது தோட்ட வரலாறு",
    personal_space: "தனிப்பட்ட இடம்",
    no_history: "வரலாறு இல்லை",
    start_scan: "முதல் ஸ்கேன் தொடங்கவும்",
    got_it: "புரிந்தது, நன்றி!",
    pro_tip: "விவசாயிகளுக்கான குறிப்பு",
    lang_select: "மொழியைத் தேர்ந்தெடுக்கவும்",
    farmer_info: "விவசாயி தகவல்",
    username: "பயனர் பெயர்",
    full_name: "முழு பெயர்",
    version: "பயன்பாட்டு பதிப்பு",
    know_more_title: "நீங்கள் தெரிந்து கொள்ள வேண்டியவை",
    live_mode: "நேரடி உதவியாளர்",
    stop_live: "நிறுத்து",
    position_leaf: "இலையைச் சரியாக வைக்குக",
    camera_error: "செடிகளை ஸ்கேன் செய்ய கேமரா அனுமதி தேவை.",
    nearby_farmers: "அருகிலுள்ள விவசாயிகள்",
    connect: "இணை",
    pending: "காத்திருக்கிறது",
    message: "செய்தி",
    requests: "விண்ணப்பங்கள்",
    accept: "ஏற்றுக்கொள்",
    ignore: "தவிர்",
    no_nearby: "உங்கள் பகுதியில் விவசாயிகளைத் தேடுகிறது...",
    distance: "தொலைவில்",
    mandi_prices: "சந்தை விலை",
    daily_tasks: "தினசரி பணிகள்",
    regional_alerts: "பிராந்திய பூச்சி எச்சரிக்கைகள்",
    high_threat: "அதிதீவிரம்",
    view_all: "அனைத்தையும் காண்க",
    todays_task: "இன்றைய பணி",
    days_since: "நட்ட நாட்களின் எண்ணிக்கை"
  }
};

export const LOCALIZED_FARM_INSIGHTS: Record<Language, FarmInsight[]> = {
  en: [
    {
      id: "p1",
      title: "Precision Drip Irrigation",
      category: "Practice",
      description: "Modern drip systems in India reduce water usage by 40% and prevent fungal diseases.",
      details: [
        "Targeted Root Delivery: Delivers water directly to the root zone, minimizing evaporation.",
        "Disease Prevention: Keeps foliage dry, significantly reducing the risk of Late Blight and Septoria Leaf Spot.",
        "Fertigation Capability: Allows for precise application of liquid fertilizers directly through the water stream.",
        "Efficiency in India: Ideal for water-scarce regions like Maharashtra and Rajasthan."
      ],
      icon: "fa-faucet-drip",
      color: "bg-blue-600",
      isIndianContext: true
    },
    {
      id: "n1",
      title: "PM-KISAN Scheme Update",
      category: "News",
      description: "Check your 15th installment status. New digital verification is now mandatory.",
      details: [
        "Direct Benefit Transfer: Ensure your bank account is Aadhaar-seeded for smooth payments.",
        "e-KYC Mandatory: Farmers must complete e-KYC via the official PM-KISAN portal or CSC centers.",
        "Beneficiary Status: Use the 'Know Your Status' feature on the portal to check for any pending verification issues.",
        "Installment Timeline: The 15th installment is expected to be released across India by late October."
      ],
      icon: "fa-landmark",
      color: "bg-orange-600",
      isIndianContext: true
    },
    {
      id: "p2",
      title: "Nano-Urea Efficiency",
      category: "Practice",
      description: "Switch to Nano-Urea liquid for better foliar absorption and 50% less soil pollution.",
      details: [
        "Higher Absorption: Foliar spray ensures 80-90% nutrient uptake compared to 30-40% in traditional granular urea.",
        "Environmental Friendly: Reduces nitrogen leaching into groundwater and ammonia emissions.",
        "Storage & Cost: One 500ml bottle replaces a 45kg bag of conventional urea, making it easier to transport.",
        "Application Timing: Best applied during the vegetative and flowering stages for maximum tomato yield."
      ],
      icon: "fa-vial-circle-check",
      color: "bg-emerald-600",
      isIndianContext: true
    },
    {
      id: "y1",
      title: "Yield Booster: Trellising",
      category: "Yield",
      description: "Use vertical trellising to increase yield by 25% through better sunlight exposure.",
      details: [
        "Improved Airflow: Vertical growth prevents microclimates where diseases like humidity-loving fungus thrive.",
        "Fruit Quality: Keeps tomatoes off the ground, preventing soil-borne pests and rot.",
        "Easier Harvest: Reduces labor time during picking and makes pest scouting much more efficient.",
        "Sunlight Optimization: Ensures every leaf gets maximum photosynthesis energy."
      ],
      icon: "fa-up-long",
      color: "bg-purple-600"
    },
    {
      id: "n2",
      title: "Mandi Prices: Tomato Surge",
      category: "News",
      description: "Prices in major Indian mandis showing 15% increase due to off-season demand.",
      details: [
        "Azadpur & Kolar Trends: Major hubs reporting consistent upward price movement.",
        "Supply Gap: Heavy rainfall in Southern India has disrupted supply chains, causing localized shortages.",
        "Farmer Strategy: Consider staggered harvesting to take advantage of peak evening mandi rates.",
        "Export Potential: Increasing demand from neighboring countries is further stabilizing high domestic prices."
      ],
      icon: "fa-indian-rupee-sign",
      color: "bg-red-500",
      isIndianContext: true
    }
  ],
  kn: [
    {
      id: "p1",
      title: "ನಿಖರವಾದ ಹನಿ ನೀರಾವರಿ",
      category: "Practice",
      description: "ಭಾರತದ ಆಧುನಿಕ ಹನಿ ನೀರಾವರಿ ವ್ಯವಸ್ಥೆಗಳು ನೀರಿನ ಬಳಕೆಯನ್ನು 40% ರಷ್ಟು ಕಡಿಮೆ ಮಾಡುತ್ತವೆ.",
      details: [
        "ಬೇರುಗಳಿಗೆ ನೇರ ನೀರು: ನೀರನ್ನು ನೇರವಾಗಿ ಬೇರಿನ ವಲಯಕ್ಕೆ ತಲುಪಿಸುತ್ತದೆ, ಆವಿಯಾಗುವಿಕೆಯನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ.",
        "ರೋಗ ತಡೆಗಟ್ಟುವಿಕೆ: ಎಲೆಗಳನ್ನು ಒಣಗಿಸಿಡುತ್ತದೆ, ಇದರಿಂದ ಶಿಲೀಂಧ್ರ ರೋಗಗಳ ಹರಡುವಿಕೆ ಕಡಿಮೆಯಾಗುತ್ತದೆ.",
        "ಫರ್ಟಿಗೇಷನ್ ಸಾಮರ್ಥ್ಯ: ನೀರಿನ ಜೊತೆಗೆ ದ್ರವ ರೂಪದ ರಸಗೊಬ್ಬರಗಳನ್ನು ನಿಖರವಾಗಿ ನೀಡಬಹುದು.",
        "ಭಾರತದಲ್ಲಿ ದಕ್ಷತೆ: ಮಹಾರಾಷ್ಟ್ರ ಮತ್ತು ರಾಜಸ್ಥಾನದಂತಹ ನೀರಿನ ಕೊರತೆಯಿರುವ ಪ್ರದೇಶಗಳಿಗೆ ಸೂಕ್ತವಾಗಿದೆ."
      ],
      icon: "fa-faucet-drip",
      color: "bg-blue-600",
      isIndianContext: true
    },
    {
      id: "n1",
      title: "ಪಿಎಂ-ಕಿಸಾನ್ ಯೋಜನೆ ಅಪ್‌ಡೇಟ್",
      category: "News",
      description: "ನಿಮ್ಮ 15ನೇ ಕಂತಿನ ಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ. ಈಗ ಡಿಜಿಟಲ್ ಪರಿಶೀಲನೆ ಕಡ್ಡಾಯವಾಗಿದೆ.",
      details: [
        "ನೇರ ಲಾಭ ವರ್ಗಾವಣೆ: ಸುಗಮ ಪಾವತಿಗಾಗಿ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಆಧಾರ್ ಲಿಂಕ್ ಆಗಿರುವುದನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.",
        "ಇ-ಕೆವೈಸಿ ಕಡ್ಡಾಯ: ರೈತರು ಪಿಎಂ-ಕಿಸಾನ್ ಪೋರ್ಟಲ್ ಅಥವಾ ಸಿಎಸ್‌ಸಿ ಕೇಂದ್ರಗಳ ಮೂಲಕ ಇ-ಕೆವೈಸಿ ಪೂರ್ಣಗೊಳಿಸಬೇಕು.",
        "ಫಲಾನುಭವಿ ಸ್ಥಿತಿ: ಯಾವುದೇ ಬಾಕಿ ಇರುವ ಸಮಸ್ಯೆಗಳಿದ್ದರೆ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ 'ನಿಮ್ಮ ಸ್ಥಿತಿಯನ್ನು ತಿಳಿಯಿರಿ' ಆಯ್ಕೆಯನ್ನು ಬಳಸಿ.",
        "ಕಂತಿನ ಸಮಯ: 15ನೇ ಕಂತು ಅಕ್ಟೋಬರ್ ಅಂತ್ಯದ ವೇಳೆಗೆ ಬಿಡುಗಡೆಯಾಗುವ ನಿರೀಕ್ಷೆಯಿದೆ."
      ],
      icon: "fa-landmark",
      color: "bg-orange-600",
      isIndianContext: true
    },
    {
      id: "p2",
      title: "ನ್ಯಾನೋ ಯೂರಿಯಾ ದಕ್ಷತೆ",
      category: "Practice",
      description: "ಉತ್ತಮ ಹೀರಿಕೊಳ್ಳುವಿಕೆಗಾಗಿ ನ್ಯಾನೋ ಯೂರಿಯಾ ದ್ರವಕ್ಕೆ ಬದಲಾಗಿ, ಮಣ್ಣಿನ ಮಾಲಿನ್ಯವನ್ನು 50% ರಷ್ಟು ಕಡಿಮೆ ಮಾಡಿ.",
      details: [
        "ಹೆಚ್ಚಿನ ಹೀರಿಕೊಳ್ಳುವಿಕೆ: ಸಾಂಪ್ರದಾಯಿಕ ಯೂರಿಯಾಕ್ಕಿಂತ ಎಲೆಗಳ ಮೇಲೆ ಸಿಂಪಡಿಸುವುದರಿಂದ 80-90% ಪೋಷಕಾಂಶಗಳು ಸಸ್ಯಕ್ಕೆ ಸಿಗುತ್ತವೆ.",
        "ಪರಿಸರ ಸ್ನೇಹಿ: ಅಂತರ್ಜಲಕ್ಕೆ ಸಾರಜನಕ ಸೇರುವುದನ್ನು ಮತ್ತು ಅಮೋನಿಯಾ ಹೊರಸೂಸುವಿಕೆಯನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ.",
        "ಸಂಗ್ರಹಣೆ ಮತ್ತು ವೆಚ್ಚ: ಒಂದು 500 ಮಿಲಿ ಬಾಟಲಿಯು 45 ಕೆಜಿ ಯೂರಿಯಾ ಚೀಲಕ್ಕೆ ಸಮನಾಗಿರುತ್ತದೆ.",
        "ಸಿಂಪಡಿಸುವ ಸಮಯ: ಗರಿಷ್ಠ ಟೊಮೆಟೊ ಇಳುವರಿಗಾಗಿ ಸಸ್ಯದ ಬೆಳವಣಿಗೆಯ ಹಂತದಲ್ಲಿ ಸಿಂಪಡಿಸುವುದು ಉತ್ತಮ."
      ],
      icon: "fa-vial-circle-check",
      color: "bg-emerald-600",
      isIndianContext: true
    },
    {
      id: "y1",
      title: "ಇಳುವರಿ ಹೆಚ್ಚಳ: ಟ್ರೆಲ್ಲಿಸಿಂಗ್",
      category: "Yield",
      description: "ಉತ್ತಮ ಸೂರ್ಯನ ಬೆಳಕಿಗಾಗಿ ಲಂಬವಾದ ಟ್ರೆಲ್ಲಿಸಿಂಗ್ ಬಳಸಿ ಇಳುವರಿಯನ್ನು 25% ರಷ್ಟು ಹೆಚ್ಚಿಸಿ.",
      details: [
        "ಉತ್ತಮ ಗಾಳಿ ಸಂಚಾರ: ಲಂಬವಾದ ಬೆಳವಣಿಗೆಯು ರೋಗಗಳು ಹರಡುವುದನ್ನು ತಡೆಯುತ್ತದೆ.",
        "ಹಣ್ಣಿನ ಗುಣಮಟ್ಟ: ಟೊಮೆಟೊಗಳನ್ನು ಮಣ್ಣಿನಿಂದ ದೂರವಿಡುವುದರಿಂದ ಹಣ್ಣು ಕೊಳೆಯುವುದು ತಪ್ಪುತ್ತದೆ.",
        "ಸುಲಭ ಕಟಾವು: ಹಣ್ಣು ಬಿಡಿಸಲು ಮತ್ತು ಕೀಟಗಳ ಮೇಲೆ ನಿಗಾ ಇಡಲು ಇದು ಸುಲಭವಾದ ಮಾರ್ಗವಾಗಿದೆ.",
        "ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ: ಪ್ರತಿಯೊಂದು ಎಲೆಗೂ ಗರಿಷ್ಠ ಸೂರ್ಯನ ಬೆಳಕು ಸಿಗುವಂತೆ ಮಾಡುತ್ತದೆ."
      ],
      icon: "fa-up-long",
      color: "bg-purple-600"
    },
    {
      id: "n2",
      title: "ಮಾರುಕಟ್ಟೆ ದರ: ಟೊಮೆಟೊ ಬೆಲೆ ಏರಿಕೆ",
      category: "News",
      description: "ಬೇಡಿಕೆ ಹೆಚ್ಚಾಗಿರುವುದರಿಂದ ಪ್ರಮುಖ ಮಾರುಕಟ್ಟೆಗಳಲ್ಲಿ ಟೊಮೆಟೊ ಬೆಲೆ 15% ರಷ್ಟು ಏರಿಕೆಯಾಗಿದೆ.",
      details: [
        "ಆಜಾದ್‌ಪುರ ಮತ್ತು ಕೋಲಾರ ಮಾರುಕಟ್ಟೆ: ಬೆಲೆಗಳು ಸ್ಥಿರವಾಗಿ ಏರುತ್ತಿರುವ ಬಗ್ಗೆ ವರದಿಯಾಗಿದೆ.",
        "ಪೂರೈಕೆಯಲ್ಲಿ ಇಳಿಕೆ: ದಕ್ಷಿಣ ಭಾರತದಲ್ಲಿ ಸುರಿದ ಭಾರಿ ಮಳೆಯಿಂದ ಪೂರೈಕೆ ಮೇಲೆ ಪರಿಣಾಮ ಬೀರಿದೆ.",
        "ರೈತರ ತಂತ್ರ: ಸಂಜೆ ಸಮಯದಲ್ಲಿ ಹೆಚ್ಚಿನ ಬೆಲೆ ಇರುವುದರಿಂದ ಆ ಸಮಯದಲ್ಲಿ ಮಾರಾಟ ಮಾಡಲು ಪ್ರಯತ್ನಿಸಿ.",
        "ರಫ್ತು ಸಾಧ್ಯತೆ: ನೆರೆಯ ದೇಶಗಳಿಂದ ಬೇಡಿಕೆ ಹೆಚ್ಚುತ್ತಿರುವುದು ಬೆಲೆ ಸ್ಥಿರತೆಗೆ ಕಾರಣವಾಗಿದೆ."
      ],
      icon: "fa-indian-rupee-sign",
      color: "bg-red-500",
      isIndianContext: true
    }
  ],
  hi: [
    {
      id: "p1",
      title: "सटीक ड्रिप सिंचाई",
      category: "Practice",
      description: "भारत में आधुनिक ड्रिप सिस्टम पानी के उपयोग को 40% तक कम करते हैं और रोगों को रोकते हैं।",
      details: [
        "जड़ों तक सीधा पानी: पानी सीधे जड़ क्षेत्र में पहुँचाता है, जिससे वाष्पीकरण कम होता.।",
        "रोग की रोकथाम: पत्तियों को सूखा रखता है, जिससे फंगल रोगों का खतरा कम हो जाता है।",
        "फर्टीगेशन सुविधा: पानी के साथ तरल उर्वरकों के सटीक प्रयोग की अनुमति देता है।",
        "भारत में दक्षता: महाराष्ट्र और राजस्थान जैसे जल-अभाव वाले क्षेत्रों के लिए आदर्श।"
      ],
      icon: "fa-faucet-drip",
      color: "bg-blue-600",
      isIndianContext: true
    },
    {
      id: "n1",
      title: "पीएम-किसान योजना अपडेट",
      category: "News",
      description: "अपनी 15वीं किस्त की स्थिति जांचें। अब डिजिटल सत्यापन अनिवार्य है।",
      details: [
        "प्रत्यक्ष लाभ हस्तांतरण: सुचारू भुगतान के लिए सुनिश्चित करें कि आपका बैंक खाता आधार से जुड़ा है।",
        "ई-केवाईसी अनिवार्य: किसानों को पीएम-किसान पोर्टल या सीएससी केंद्रों के माध्यम से ई-केवाईसी पूरा करना होगा।",
        "लाभार्थी स्थिति: किसी भी लंबित सत्यापन समस्या की जांच के लिए पोर्टल पर 'अपनी स्थिति जानें' सुविधा का उपयोग करें।",
        "किस्त की समयसीमा: 15वीं किस्त अक्टूबर के अंत तक पूरे भारत में जारी होने की उम्मीद है।"
      ],
      icon: "fa-landmark",
      color: "bg-orange-600",
      isIndianContext: true
    },
    {
      id: "p2",
      title: "नैनो-यूरिया दक्षता",
      category: "Practice",
      description: "बेहतर अवशोषण के लिए नैनो-यूरिया तरल का उपयोग करें और मिट्टी के प्रदूषण को 50% कम करें।",
      details: [
        "उच्च अवशोषण: पत्तियों पर छिड़काव पारंपरिक यूरिया की तुलना में 80-90% पोषक तत्वों का अवशोषण सुनिश्चित करता है।",
        "पर्यावरण के अनुकूल: भूजल में नाइट्रोजन के रिसाव और अमोनिया उत्सर्जन को कम करता है।",
        "भंडारण और लागत: एक 500 मिलीलीटर की बोतल पारंपरिक यूरिया के 45 किलोग्राम बैग की जगह लेती है।",
        "उपयोग का समय: अधिकतम टमाटर की पैदावार के लिए वानस्पतिक और फूल आने की अवस्था के दौरान सबसे अच्छा।"
      ],
      icon: "fa-vial-circle-check",
      color: "bg-emerald-600",
      isIndianContext: true
    },
    {
      id: "y1",
      title: "पैदावार बूस्टर: ट्रेलिसिंग",
      category: "Yield",
      description: "बेहतर धूप और हवा के लिए वर्टिकल ट्रेलिसिंग का उपयोग करके पैदावार को 25% तक बढ़ाएं।",
      details: [
        "बेहतर वायु प्रवाह: ऊर्ध्वाधर विकास उन बीमारियों को रोकता है जो नमी पसंद करने वाले कवक के कारण होती हैं।",
        "फलों की गुणवत्ता: टमाटर को जमीन से ऊपर रखता है, जिससे मिट्टी से होने वाले कीटों और सड़न को रोका जा सकता है।",
        "आसान कटाई: फलों को तोड़ने में लगने वाले समय को कम करता है और कीटों की निगरानी आसान बनाता।",
        "प्रकाश संश्लेषण: सुनिश्चित करता है कि हर पत्ती को अधिकतम सौर ऊर्जा मिले।"
      ],
      icon: "fa-up-long",
      color: "bg-purple-600"
    },
    {
      id: "n2",
      title: "मंडी भाव: टमाटर में उछाल",
      category: "News",
      description: "बेमौसम मांग के कारण प्रमुख भारतीय मंडियों में कीमतों में 15% की वृद्धि देखी जा रही है।",
      details: [
        "आजादपुर और कोलार ट्रेंड्स: प्रमुख मंडियों में कीमतों में लगातार बढ़ोतरी दर्ज की जा रही है।",
        "आपूर्ति में कमी: दक्षिण भारत में भारी बारिश ने आपूर्ति श्रृंखला को बाधित कर दिया है।",
        "किसान रणनीति: शाम की मंडी दरों का लाभ उठाने के लिए चरणबद्ध तुड़ाई पर विचार करें।",
        "निर्यात क्षमता: पड़ोसी देशों से बढ़ती मांग घरेलू कीमतों को स्थिर कर रही है।"
      ],
      icon: "fa-indian-rupee-sign",
      color: "bg-red-500",
      isIndianContext: true
    }
  ],
  te: [
    {
      id: "p1",
      title: "ఖచ్చితమైన బిందు సేద్యం",
      category: "Practice",
      description: "భారతదేశంలో ఆధునిక బిందు సేద్యం నీటి వినియోగాన్ని 40% తగ్గిస్తుంది మరియు తెగుళ్లను నివారిస్తుంది.",
      details: [
        "వేర్లకు నేరుగా నీరు: నీటిని నేరుగా వేరు వ్యవస్థకు అందిస్తుంది, ఆవిరిని తగ్గిస్తుంది.",
        "తెగుళ్ల నివారణ: ఆకులను పొడిగా ఉంచుతుంది, తద్వారా ఫంగల్ వ్యాధుల ప్రమాదాన్ని తగ్గిస్తుంది.",
        "ఫెర్టిగేషన్: నీటితో పాటు ద్రవ ఎరువులను మొక్కకు నేరుగా అందించడానికి వీలు కల్పిస్తుంది.",
        "భారతదేశంలో సామర్థ్యం: మహారాష్ట్ర మరియు రాజస్థాన్ వంటి నీటి ఎద్దడి ఉన్న ప్రాంతాలకు అనువైనది."
      ],
      icon: "fa-faucet-drip",
      color: "bg-blue-600",
      isIndianContext: true
    },
    {
      id: "n1",
      title: "పీఎం-కిసాన్ పథకం అప్‌డేట్",
      category: "News",
      description: "మీ 15వ విడత స్థితిని తనిఖీ చేయండి. ఇప్పుడు డిజిటల్ వెరిఫికేషన్ తప్పనిసరి.",
      details: [
        "నేరుగా నగదు బదిలీ: చెల్లింపుల కోసం మీ బ్యాంకు ఖాతా ఆధార్‌తో లింక్ అయిందని నిర్ధారించుకోండి.",
        "ఈ-కేవైసీ తప్పనిసరి: రైతులు అధికారిక పోర్టల్ ద్వారా ఈ-కేవైసీని పూర్తి చేయాలి.",
        "లబ్ధిదారుల స్థితి: వెరిఫికేషన్ సమస్యల కోసం పోర్టల్‌లో 'నో యువర్ స్టేటస్' ఫీచర్‌ని ఉపయోగించండి.",
        "విడుదల సమయం: 15వ విడత అక్టోబర్ చివరి నాటికి విడుదలయ్యే అవకాశం ఉంది."
      ],
      icon: "fa-landmark",
      color: "bg-orange-600",
      isIndianContext: true
    },
    {
      id: "p2",
      title: "నానో-యూరియా సామర్థ్యం",
      category: "Practice",
      description: "మంచి పోషకాల కోసం నానో-యూరియా ద్రవాన్ని వాడండి మరియు కాలుష్యాన్ని 50% తగ్గించండి.",
      details: [
        "ఎక్కువ శోషణ: ఆకులపై స్ప్రే చేయడం వల్ల 80-90% పోషకాలు మొక్కకు అందుతాయి.",
        "పర్యావరణ అనుకూలం: నేల కాలుష్యాన్ని మరియు భూగర్భ జలాల కాలుష్యాన్ని తగ్గిస్తుంది.",
        "నిల్వ మరియు ఖర్చు: ఒక 500మి.లీ బాటిల్ 45 కిలోల యూరియా బస్తాకు సమానం.",
        "సమయం: టమోటా దిగుబడి పెరగడానికి మొక్క ఎదుగుదల దశలో వాడటం మంచిది."
      ],
      icon: "fa-vial-circle-check",
      color: "bg-emerald-600",
      isIndianContext: true
    },
    {
      id: "y1",
      title: "దిగుబడి పెంపు: ట్రెల్లిసింగ్",
      category: "Yield",
      description: "దిగుబడిని 25% పెంచడానికి నిలువు ట్రెల్లిసింగ్ పద్ధతిని ఉపయోగించండి.",
      details: [
        "గాలి వెలుతురు: మొక్కలు నిలువుగా పెరగడం వల్ల గాలి వెలుతురు బాగా అందుతుంది.",
        "పండ్ల నాణ్యత: పండ్లు నేలకు తగలకుండా ఉండటం వల్ల కుళ్లిపోకుండా ఉంటాయి.",
        "సులభమైన కోత: కాయలు కోయడం మరియు తెగుళ్లను గుర్తించడం సులభం అవుతుంది.",
        "కిరణజన్య సంయోగక్రియ: ప్రతి ఆకుకు సూర్యరశ్మి అందేలా చూస్తుంది."
      ],
      icon: "fa-up-long",
      color: "bg-purple-600"
    },
    {
      id: "n2",
      title: "మార్కెట్ ధరలు: టమోటా ధరల పెరుగుదల",
      category: "News",
      description: "డిమాండ్ పెరగడం వల్ల ప్రధాన మార్కెట్లలో టమోటా ధరలు 15% పెరిగాయి.",
      details: [
        "ప్రధాన మార్కెట్లు: ఆజాద్‌పూర్ మరియు కోలార్ మార్కెట్లలో ధరలు స్థిరంగా పెరుగుతున్నాయి.",
        "తగ్గిన సరఫరా: భారీ వర్షాల వల్ల సరఫరా తగ్గడం ధరల పెరుగుదలకు కారణం.",
        "రైతుల వ్యూహం: ధరలు ఎక్కువగా ఉండే సమయంలో పంటను మార్కెట్‌కు పంపండి.",
        "ఎగుమతి అవకాశాలు: ఇతర దేశాల నుండి డిమాండ్ ఉండటం వల్ల ధరలు స్థిరంగా ఉన్నాయి."
      ],
      icon: "fa-indian-rupee-sign",
      color: "bg-red-500",
      isIndianContext: true
    }
  ],
  ml: [
    {
      id: "p1",
      title: "കൃത്യതാ തുള്ളിനന",
      category: "Practice",
      description: "ആധുനിക തുള്ളിനന രീതികൾ ജലഉപയോഗം 40% കുറയ്ക്കാനും രോഗങ്ങൾ തടയാനും സഹായിക്കുന്നു.",
      details: [
        "വേരുകളിലേക്ക് നേരിട്ട്: വെള്ളം നേരിട്ട് വേരുകളിലേക്ക് എത്തിക്കുന്നു, ബാഷ്പീകരണം കുറയ്ക്കുന്നു.",
        "രോഗപ്രതിരോധം: ഇലകൾ ഉണങ്ങിയിരിക്കാൻ സഹായിക്കുന്നു, ഇത് ഫംഗസ് രോഗങ്ങൾ കുറയ്ക്കുന്നു.",
        "ഫെർട്ടിഗേഷൻ: വെള്ളത്തോടൊപ്പം ദ്രാവക വളങ്ങളും കൃത്യമായി നൽകാൻ സാധിക്കുന്നു.",
        "കേരളത്തിൽ: ജലക്ഷാമമുള്ള സമയങ്ങളിൽ കൃഷിക്ക് ഏറ്റവും അനുയോജ്യം."
      ],
      icon: "fa-faucet-drip",
      color: "bg-blue-600",
      isIndianContext: true
    },
    {
      id: "n1",
      title: "പിഎം-കിസാൻ പദ്ധതി അപ്‌ഡേറ്റ്",
      category: "News",
      description: "15-ാം ഗഡു പരിശോധിക്കുക. ഡിജിറ്റൽ വെരിഫിക്കേഷൻ ഇപ്പോൾ നിർബന്ധമാണ്.",
      details: [
        "നേരിട്ടുള്ള പണകൈമാറ്റം: ബാങ്ക് അക്കൗണ്ട് ആധാറുമായി ബന്ധിപ്പിച്ചിട്ടുണ്ടെന്ന് ഉറപ്പാക്കുക.",
        "ഇ-കെവൈസി നിർബന്ധം: പിഎം-കിസാൻ പോർട്ടൽ വഴി ഇ-കെവൈസി പൂർത്തിയാക്കുക.",
        "ഗുണഭോക്തൃ നില: പോർട്ടലിലെ 'നോ യുവർ സ്റ്റാറ്റസ്' വഴി വിവരങ്ങൾ പരിശോധിക്കാം.",
        "സമയക്രമം: 15-ാം ഗഡു ഒക്ടോബർ അവസാനത്തോടെ ലഭിക്കുമെന്ന് പ്രതീക്ഷിക്കുന്നു."
      ],
      icon: "fa-landmark",
      color: "bg-orange-600",
      isIndianContext: true
    },
    {
      id: "p2",
      title: "നാനോ-യൂറിയ കാര്യക്ഷമത",
      category: "Practice",
      description: "നാനോ-യൂറിയ ദ്രാവകം ഉപയോഗിച്ച് മണ്ണ് മലിനീകരണം 50% കുറയ്ക്കാം.",
      details: [
        "ഉയർന്ന ആഗിരണം: ഇലകളിൽ തളിക്കുന്നത് 80-90% പോഷകങ്ങളും ചെടിക്ക് ലഭ്യമാക്കുന്നു.",
        "പരിസ്ഥിതി സൗഹൃദം: നൈട്രജൻ മണ്ണിലേക്ക് ഊർന്നിറങ്ങുന്നത് കുറയ്ക്കുന്നു.",
        "സൗകര്യം: ഒരു 500 മില്ലി കുപ്പി 45 കിലോ യൂറിയക്ക് പകരമാണ്.",
        "പ്രയോഗം: തക്കാളി കൃഷിയിൽ ചെടി വളരുന്ന ഘട്ടത്തിൽ തളിക്കുന്നത് മികച്ച വിളവ് നൽകും."
      ],
      icon: "fa-vial-circle-check",
      color: "bg-emerald-600",
      isIndianContext: true
    },
    {
      id: "y1",
      title: "വിളവ് വർദ്ധിപ്പിക്കാൻ: ട്രെല്ലിസിംഗ്",
      category: "Yield",
      description: "ലംബമായി ചെടികൾ വളർത്തുന്നത് വിളവ് 25% വർദ്ധിപ്പിക്കാൻ സഹായിക്കും.",
      details: [
        "വായുസഞ്ചാരം: ചെടികൾ ഉയരത്തിൽ വളർത്തുന്നത് രോഗങ്ങൾ വരുന്നത് തടയുന്നു.",
        "ഗുണമേന്മ: തക്കാളികൾ മണ്ണിൽ തട്ടാതെ നിൽക്കുന്നത് ചീഞ്ഞുപോകുന്നത് ഒഴിവാക്കുന്നു.",
        "വിളവെടുപ്പ്: എളുപ്പത്തിൽ വിളവെടുക്കാനും കീടങ്ങളെ കണ്ടെത്താനും സാധിക്കുന്നു.",
        "സൂര്യപ്രകാശം: എല്ലാ ഇലകൾക്കും സൂര്യപ്രകാശം ലഭിക്കുന്നു എന്ന് ഉറപ്പാക്കുന്നു."
      ],
      icon: "fa-up-long",
      color: "bg-purple-600"
    },
    {
      id: "n2",
      title: "വിപണി വില: തക്കാളി വില വർദ്ധനവ്",
      category: "News",
      description: "ഡിമാൻഡ് വർദ്ധിച്ചതിനെ തുടർന്ന് വിപണിയിൽ തക്കാളി വില 15% വർദ്ധിച്ചു.",
      details: [
        "പ്രധാന മാർക്കറ്റുകൾ: വലിയ വിപണികളിൽ വില കൂടുന്നതായി റിപ്പോർട്ടുകൾ.",
        "വരവ് കുറഞ്ഞു: കനത്ത മഴ കാരണം തക്കാളിയുടെ വരവ് കുറഞ്ഞതാണ് വില കൂടാൻ കാരണം.",
        "കർഷകർ ശ്രദ്ധിക്കാൻ: വില കൂടുന്ന സമയങ്ങളിൽ വിളവെടുക്കാൻ ശ്രദ്ധിക്കുക.",
        "കയറ്റുമതി സാധ്യത: അയൽരാജ്യങ്ങളിലേക്കുള്ള കയറ്റുമതി വില വർദ്ധനവിന് കാരണമാകുന്നു."
      ],
      icon: "fa-indian-rupee-sign",
      color: "bg-red-500",
      isIndianContext: true
    }
  ],
  ta: [
    {
      id: "p1",
      title: "துல்லிய சொட்டு நீர் பாசனம்",
      category: "Practice",
      description: "நவீன சொட்டு நீர் பாசனம் மூலம் 40% நீர் சேமிப்பு மற்றும் நோய் தடுப்பு சாத்தியம்.",
      details: [
        "வேர்களுக்கு நேரடி நீர்: நீர் நேரடியாக வேர் பகுதிக்கு செல்வதால் வீணாவது குறைகிறது.",
        "நோய் தடுப்பு: இலைகள் நனையாமல் இருப்பதால் பூஞ்சை நோய்கள் கட்டுப்படுத்தப்படுகின்றன.",
        "ஊட்டச்சத்து மேலாண்மை: நீருடன் உரங்களையும் கலந்து துல்லியமாக வழங்கலாம்.",
        "தமிழகத்தில்: நீர் தட்டுப்பாடு உள்ள மாவட்டங்களுக்கு இது மிகவும் சிறந்தது."
      ],
      icon: "fa-faucet-drip",
      color: "bg-blue-600",
      isIndianContext: true
    },
    {
      id: "n1",
      title: "பிஎம்-கிசான் திட்ட அப்டேட்",
      category: "News",
      description: "உங்கள் 15வது தவணை நிலையை சரிபார்க்கவும். டிஜிட்டல் சரிபார்ப்பு இப்போது கட்டாயம்.",
      details: [
        "நேரடி பணப்பரிமாற்றம்: வங்கி கணக்குடன் ஆதார் இணைக்கப்பட்டுள்ளதா என்பதை உறுதி செய்யவும்.",
        "இ-கேஒய்சி கட்டாயம்: விவசாயிகள் அதிகாரப்பூர்வ போர்ட்டலில் இ-கேஒய்சி முடிக்க வேண்டும்.",
        "பயனாளி நிலை: போர்ட்டலில் உங்கள் நிலையை சரிபார்த்து சிக்கல்களைத் தவிர்க்கவும்.",
        "வெளியீட்டு காலம்: 15வது தவணை அக்டோபர் இறுதிக்குள் வெளியிடப்படலாம்."
      ],
      icon: "fa-landmark",
      color: "bg-orange-600",
      isIndianContext: true
    },
    {
      id: "p2",
      title: "நேனோ-யூரியா திறன்",
      category: "Practice",
      description: "நேனோ-யூரியா திரவத்தை பயன்படுத்தி மண் மாசடைவதை 50% குறைக்கவும்.",
      details: [
        "அதிக ஈர்ப்பு: இலைவழித் தெளிப்பு மூலம் 80-90% சத்துக்கள் செடிகளுக்குக் கிடைக்கின்றன.",
        "சுற்றுச்சூழல் நட்பு: நிலத்தடி நீர் பாதிப்பைக் குறைக்கிறது.",
        "சேமிப்பு மற்றும் செலவு: ஒரு 500மி.லி பாட்டில் ஒரு 45கி.கி யூரியா மூட்டைக்கு சமமானது.",
        "பயன்படுத்தும் நேரம்: தக்காளி பயிரின் வளர்ச்சி நிலைகளில் தெளிப்பது அதிக மகசூல் தரும்."
      ],
      icon: "fa-vial-circle-check",
      color: "bg-emerald-600",
      isIndianContext: true
    },
    {
      id: "y1",
      title: "மகசூல் அதிகரிப்பு: ட்ரெல்லிசிங்",
      category: "Yield",
      description: "செங்குத்து முறையில் செடிகளை வளர்ப்பதன் மூலம் 25% கூடுதல் மகசூல் பெறலாம்.",
      details: [
        "காற்று ஓட்டம்: செங்குத்து வளர்ப்பு நோய் பரவுவதைத் தடுக்கிறது.",
        "பழத் தரம்: பழங்கள் மண்ணில் படாமல் இருப்பதால் அழுகுவது தவிர்க்கப்படுகிறது.",
        "எளிதான அறுவடை: பழங்களைப் பறிப்பதும் பூச்சிகளைக் கண்டறிவதும் எளிதாகிறது.",
        "சூரிய ஒளி: ஒவ்வொரு இலையும் அதிகபட்ச சூரிய ஒளியைப் பெறுவதை உறுதி செய்கிறது."
      ],
      icon: "fa-up-long",
      color: "bg-purple-600"
    },
    {
      id: "n2",
      title: "சந்தை நிலவரம்: தக்காளி விலை உயர்வு",
      category: "News",
      description: "தேவை அதிகரிப்பால் சந்தையில் தக்காளி விலை 15% வரை உயர்ந்துள்ளது.",
      details: [
        "முக்கிய சந்தைகள்: கோயம்பேடு போன்ற சந்தைகளில் விலை ஏறுமுகமாக உள்ளது.",
        "வரத்து குறைவு: கனமழை காரணமாக வரத்து குறைந்தது விலை உயர்விற்கு காரணம்.",
        "விவசாயிகள் உத்தி: மாலை நேர சந்தை விலையைப் பார்த்து விற்பனை செய்வது சிறந்தது.",
        "ஏற்றுமதி வாய்ப்பு: வெளிநாடுகளுக்கான தேவை அதிகரிப்பது விலையை நிலைப்படுத்துகிறது."
      ],
      icon: "fa-indian-rupee-sign",
      color: "bg-red-500",
      isIndianContext: true
    }
  ]
};

export const LOADING_MESSAGES = [
  "Examining leaf patterns...",
  "Scanning for pest signatures...",
  "Analyzing chlorophyll levels...",
  "Consulting agricultural database...",
  "Evaluating plant health..."
];
