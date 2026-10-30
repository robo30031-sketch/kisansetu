import { en } from './en';
import { hi } from './hi';

export type TranslationType = typeof en;

// Helper to deep merge regional overrides with English base to guarantee 100% key completeness
function createLocale(overrides: any): TranslationType {
  const result: any = JSON.parse(JSON.stringify(en));
  for (const section in overrides) {
    if (result[section] && typeof overrides[section] === 'object') {
      result[section] = { ...result[section], ...overrides[section] };
    } else {
      result[section] = overrides[section];
    }
  }
  return result as TranslationType;
}

// 1. Punjabi (pa)
export const pa = createLocale({
  nav: { home: "ਮੁੱਖ ਪੰਨਾ", myFarms: "ਮੇਰੇ ਖੇਤ", ledger: "ਖਾਤਾ ਵਹੀ", calendar: "ਕੈਲੰਡਰ", inventory: "ਸਟਾਕ ਤੇ ਸਾਮਾਨ", reports: "ਰਿਪੋਰਟਾਂ", more: "ਹੋਰ", profile: "ਪ੍ਰੋਫਾਈਲ", settings: "ਸੈਟਿੰਗਾਂ", language: "ਭਾਸ਼ਾ" },
  brand: { name: "ਕਿਸਾਨਸੇਤੂ", tagline: "ਤੁਹਾਡਾ ਖੇਤ। ਤੁਹਾਡਾ ਹਿਸਾਬ। ਤੁਹਾਡਾ ਕੰਟਰੋਲ।" },
  common: { save: "ਸੰਭਾਲੋ", cancel: "ਰੱਦ ਕਰੋ", edit: "ਸੋਧੋ", delete: "ਮਿਟਾਓ", confirm: "ਪੁਸ਼ਟੀ ਕਰੋ", back: "ਪਿੱਛੇ", add: "ਜੋੜੋ", view: "ਵੇਖੋ", filter: "ਫਿਲਟਰ", search: "ਖੋਜੋ", exportCsv: "CSV ਡਾਊਨਲੋਡ", loading: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...", success: "ਸਫਲਤਾਪੂਰਵਕ ਸੁਰੱਖਿਅਤ ਕੀਤਾ", error: "ਗਲਤੀ ਹੋਈ", readAloud: "ਸੁਣੋ", stopVoice: "ਰੋਕੋ" },
  auth: { signIn: "ਲਾਗ ਇਨ ਕਰੋ", signUp: "ਨਵਾਂ ਖਾਤਾ ਬਣਾਓ", signOut: "ਲਾਗ ਆਉਟ", email: "ਈਮੇਲ ਪਤਾ", password: "ਪਾਸਵਰਡ", fullName: "ਕਿਸਾਨ ਦਾ ਪੂਰਾ ਨਾਮ", preferredLanguage: "ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ" },
  dashboard: { title: "ਖੇਤ ਡੈਸ਼ਬੋਰਡ", welcome: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ", totalFarms: "ਕੁੱਲ ਖੇਤ", activeCrops: "ਮੌਜੂਦਾ ਫ਼ਸਲਾਂ", monthExpenses: "ਇਸ ਮਹੀਨੇ ਦਾ ਖ਼ਰਚਾ", monthIncome: "ਇਸ ਮਹੀਨੇ ਦੀ ਆਮਦਨ", netRecorded: "ਬਾਕੀ ਬੱਚਤ", pendingTasks: "ਬਾਕੀ ਕੰਮ", overdueTasks: "ਲੇਟ ਕੰਮ", lowStockItems: "ਘੱਟ ਸਟਾਕ", quickActions: "ਜਲਦੀ ਕਾਰਵਾਈਆਂ", addExpense: "ਖ਼ਰਚਾ ਲਿਖੋ", addIncome: "ਆਮਦਨ ਲਿਖੋ", addCrop: "ਫ਼ਸਲ ਜੋੜੋ", addTask: "ਕੰਮ ਜੋੜੋ", addStock: "ਸਾਮਾਨ ਜੋੜੋ", todaysWork: "ਅੱਜ ਦੇ ਖੇਤੀ ਕੰਮ", noTasksToday: "ਅੱਜ ਦਾ ਕੋਈ ਕੰਮ ਬਾਕੀ ਨਹੀਂ ਹੈ।" },
  farms: { title: "ਮੇਰੇ ਖੇਤ", addNewFarm: "ਨਵਾਂ ਖੇਤ ਜੋੜੋ", nameLabel: "ਖੇਤ ਦਾ ਨਾਮ", villageLabel: "ਪਿੰਡ", areaLabel: "ਰਕਬਾ (ਏਕੜ)", confirmDelete: "ਕੀ ਤੁਸੀਂ ਸੱਚਮੁੱਚ ਇਹ ਖੇਤ ਮਿਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ?" },
  crops: { title: "ਫ਼ਸਲ ਚੱਕਰ", addNewCrop: "ਨਵੀਂ ਫ਼ਸਲ ਜੋੜੋ", cropName: "ਫ਼ਸਲ ਦਾ ਨਾਮ (ਕਣਕ, ਝੋਨਾ, ਨਰਮਾ)", variety: "ਕਿਸਮ / ਬੀਜ", season: "ਸੀਜ਼ਨ (ਸਾਉਣੀ, ਹਾੜੀ)", sowingDate: "ਬਿਜਾਈ ਦੀ ਮਿਤੀ", expectedHarvest: "ਕਟਾਈ ਦੀ ਸੰਭਾਵਿਤ ਮਿਤੀ", actualYield: "ਕੁੱਲ ਝਾੜ" },
  ledger: { title: "ਖੇਤੀ ਖਾਤਾ ਵਹੀ", addExpense: "ਖ਼ਰਚਾ ਦਰਜ ਕਰੋ", addIncome: "ਆਮਦਨ ਦਰਜ ਕਰੋ", amount: "ਰਕਮ (₹)", date: "ਮਿਤੀ", totalExpenses: "ਕੁੱਲ ਖ਼ਰਚਾ", totalIncome: "ਕੁੱਲ ਆਮਦਨ", recordedDiff: "ਦਰਜ ਬਚਤ" }
});

// 2. Bengali (bn)
export const bn = createLocale({
  nav: { home: "হোম", myFarms: "আমার খামার", ledger: "খতিয়ান", calendar: "ক্যালেন্ডার", inventory: "মজুদ সম্ভার", reports: "রিপোর্ট", more: "আরও", profile: "প্রোফাইল", settings: "সেটিংস", language: "ভাষা" },
  brand: { name: "কিসানসেতু", tagline: "আপনার জমি। আপনার হিসাব। আপনার নিয়ন্ত্রণ।" },
  common: { save: "সংরক্ষণ", cancel: "বাতিল", edit: "সম্পাদনা", delete: "মুছুন", confirm: "নিশ্চিত করুন", back: "ফিরে যান", add: "যোগ করুন", view: "দেখুন", filter: "ফিল্টার", search: "অনুসন্ধান", exportCsv: "CSV ডাউনলোড", loading: "লোড হচ্ছে...", success: "সফলভাবে সংরক্ষিত", error: "ত্রুটি ঘটেছে", readAloud: "শুনুন", stopVoice: "থামান" },
  auth: { signIn: "সাইন ইন", signUp: "অ্যাকাউন্ট তৈরি করুন", signOut: "সাইন আউট", email: "ইমেল ঠিকানা", password: "পাসওয়ার্ড", fullName: "কৃষকের পুরো নাম", preferredLanguage: "পছন্দের ভাষা" },
  dashboard: { title: "কৃষি ড্যাশবোর্ড", welcome: "নমস্কার", totalFarms: "মোট খামার", activeCrops: "বর্তমান ফসল", monthExpenses: "চলতি মাসের খরচ", monthIncome: "চলতি মাসের আয়", netRecorded: "হিসাবকৃত উদ্বৃত্ত", pendingTasks: "বাকি কাজ", overdueTasks: "মেয়াদোত্তীর্ণ কাজ", lowStockItems: "স্বল্প স্টক", quickActions: "দ্রুত ক্রিয়া", addExpense: "খরচ লিখুন", addIncome: "আয় লিখুন", addCrop: "ফসল যোগ করুন", addTask: "কাজ যোগ করুন", addStock: "মজুদ যোগ করুন", todaysWork: "আজকের কৃষিকাজ", noTasksToday: "আজকের জন্য কোনো নির্ধারিত কাজ নেই।" },
  farms: { title: "আমার খামার ও জমি", addNewFarm: "নতুন খামার যোগ করুন", nameLabel: "খামারের নাম", villageLabel: "গ্রাম", areaLabel: "মোট জমি", confirmDelete: "আপনি কি নিশ্চিতভাবে এই খামারটি মুছে ফেলতে চান?" },
  crops: { title: "ফসল চক্র", addNewCrop: "নতুন ফসল নথিভুক্ত করুন", cropName: "ফসলের নাম (ধান, পাট, গম)", variety: "জাত / বীজ", season: "মৌসুম (খরিফ, রবি, জায়েদ)", sowingDate: "বপনের তারিখ", expectedHarvest: "সম্ভাব্য কাটার তারিখ", actualYield: "মোট ফলন" },
  ledger: { title: "খামার খতিয়ান ও হিসাব", addExpense: "খরচ যোগ করুন", addIncome: "আয় যোগ করুন", amount: "টাকার পরিমাণ (₹)", date: "তারিখ", totalExpenses: "মোট খরচ", totalIncome: "মোট আয়", recordedDiff: "হিসাবকৃত অবশিষ্ট" }
});

// 3. Marathi (mr)
export const mr = createLocale({
  nav: { home: "मुख्यपृष्ठ", myFarms: "माझी शेती", ledger: "खतावणी", calendar: "दिनदर्शिका", inventory: "साठा व गोदाम", reports: "अहवाल", more: "अधिक", profile: "प्रोफाइल", settings: "सेटिंग्ज", language: "भाषा" },
  brand: { name: "किसानसेतू", tagline: "तुमची शेती। तुमचा हिशोब। तुमचे नियंत्रण।" },
  common: { save: "जतन करा", cancel: "रद्द करा", edit: "संपादित करा", delete: "हटवा", confirm: "नक्की करा", back: "मागे जा", add: "जोडा", view: "पहा", filter: "फिल्टर", search: "शोधा", exportCsv: "CSV डाउनलोड", loading: "लोड होत आहे...", success: "यशस्वीरित्या जतन झाले", error: "त्रुटी आली", readAloud: "ऐका (वाचा)", stopVoice: "थांबवा" },
  auth: { signIn: "लॉग इन", signUp: "नवीन खाते उघडा", signOut: "लॉग आउट", email: "ईमेल पत्ता", password: "पासवर्ड", fullName: "शेतकऱ्याचे पूर्ण नाव", preferredLanguage: "पसंतीची भाषा" },
  dashboard: { title: "शेतकरी डॅशबोर्ड", welcome: "नमस्कार", totalFarms: "नोंदणीकृत शेतजमीन", activeCrops: "सध्याची पिके", monthExpenses: "या महिन्यातील खर्च", monthIncome: "या महिन्यातील उत्पन्न", netRecorded: "शिल्लक नफा/तोटा", pendingTasks: "शिल्लक कामे", overdueTasks: "थकलेली कामे", lowStockItems: "कमी साठा असलेली खते/बियाणे", quickActions: "जलद कृती", addExpense: "खर्च नोंदवा", addIncome: "उत्पन्न नोंदवा", addCrop: "पीक जोडा", addTask: "काम जोडा", addStock: "साठा जोडा", todaysWork: "आजची शेतीची कामे", noTasksToday: "आज कोणतीही कामे शिल्लक नाहीत." },
  farms: { title: "माझी शेतजमीन व गटनेते", addNewFarm: "नवीन शेत जोडा", nameLabel: "शेताचे नाव", villageLabel: "गाव", areaLabel: "एकूण क्षेत्र (एकर/गुंठा)", confirmDelete: "तुम्ही नक्की हे शेत हटवू इच्छिता का?" },
  crops: { title: "पीक हंगाम व चक्र", addNewCrop: "नवीन पीक नोंदवा", cropName: "पिकाचे नाव (कापूस, सोयाबीन, ऊस, कांदा)", variety: "वाण / बियाणे", season: "हंगाम (खरीप, रब्बी, उन्हाळी)", sowingDate: "पेरणीची तारीख", expectedHarvest: "अपेक्षित काढणी तारीख", actualYield: "एकूण उत्पादन" },
  ledger: { title: "शेती हिशोब वही", addExpense: "खर्च लिहा", addIncome: "उत्पन्न लिहा", amount: "रक्कम (₹)", date: "दिनांक", totalExpenses: "एकूण खर्च", totalIncome: "एकूण उत्पन्न", recordedDiff: "नोंदवलेली शिल्लक" }
});

// 4. Telugu (te)
export const te = createLocale({
  nav: { home: "హోమ్", myFarms: "నా పొలాలు", ledger: "ఖాతా పుస్తకం", calendar: "క్యాలెండర్", inventory: "సరుకులు & నిల్వ", reports: "నివేదికలు", more: "మరిన్ని", profile: "ప్రొఫైల్", settings: "సెట్టింగులు", language: "భాష" },
  brand: { name: "కిసాన్ సేతు", tagline: "మీ పొలం. మీ లెక్కలు. మీ నియంత్రణ." },
  common: { save: "సేవ్ చేయండి", cancel: "రద్దు", edit: "సవరించు", delete: "తొలగించు", confirm: "నిర్ధారించు", back: "వెనుకకు", add: "జోడించు", view: "చూడండి", filter: "ఫిల్టర్", search: "శోధించండి", exportCsv: "CSV డౌన్‌లోడ్", loading: "లోడ్ అవుతోంది...", success: "విజయవంతంగా భద్రపరచబడింది", error: "లోపం జరిగింది", readAloud: "వినండి", stopVoice: "ఆపు" },
  auth: { signIn: "సైన్ ఇన్", signUp: "ఖాతా సృష్టించండి", signOut: "లాగ్ అవుట్", email: "ఈమెయిల్ చిరునామా", password: "పాస్‌వర్డ్", fullName: "రైతు పూర్తి పేరు", preferredLanguage: "ఇష్టమైన భాష" },
  dashboard: { title: "వ్యవసాయ డాష్‌బోర్డ్", welcome: "నమస్కారం", totalFarms: "మొత్తం పొలాలు", activeCrops: "ప్రస్తుత పంటలు", monthExpenses: "ఈ నెల ఖర్చులు", monthIncome: "ఈ నెల ఆదాయం", netRecorded: "నికర నిల్వ", pendingTasks: "పెండింగ్ పనులు", overdueTasks: "గడువు దాటిన పనులు", lowStockItems: "తక్కువ నిల్వ ఉన్న సరుకులు", quickActions: "త్వరిత చర్యలు", addExpense: "ఖర్చు నమోదు", addIncome: "ఆదాయం నమోదు", addCrop: "పంట జోడించు", addTask: "పని జోడించు", addStock: "నిల్వ జోడించు", todaysWork: "నేటి వ్యవసాయ పనులు", noTasksToday: "ఈరోజు ఎలాంటి పనులు లేవు." },
  farms: { title: "నా పొలాలు & స్థలాలు", addNewFarm: "కొత్త పొలం జోడించండి", nameLabel: "పొలం పేరు", villageLabel: "గ్రామం", areaLabel: "విస్తీర్ణం", confirmDelete: "మీరు ఖచ్చితంగా ఈ పొలాన్ని తొలగించాలనుకుంటున్నారా?" },
  crops: { title: "పంట చక్రం", addNewCrop: "కొత్త పంట నమోదు చేయండి", cropName: "పంట పేరు (వరి, పత్తి, మిరప)", variety: "రకం / విత్తనం", season: "సీజన్ (ఖరీఫ్, రబీ)", sowingDate: "విత్తిన తేదీ", expectedHarvest: "కోత అంచనా తేదీ", actualYield: "దిగుబడి" },
  ledger: { title: "వ్యవసాయ ఖర్చులు & ఆదాయం", addExpense: "ఖర్చు జోడించు", addIncome: "ఆదాయం జోడించు", amount: "మొత్తం (₹)", date: "తేదీ", totalExpenses: "మొత్తం ఖర్చులు", totalIncome: "మొత్తం ఆదాయం", recordedDiff: "మిగిలిన మొత్తం" }
});

// 5. Tamil (ta)
export const ta = createLocale({
  nav: { home: "முகப்பு", myFarms: "என் பண்ணைகள்", ledger: "கணக்கு புத்தகம்", calendar: "நாட்காட்டி", inventory: "கையிருப்பு", reports: "அறிக்கைகள்", more: "மேலும்", profile: "சுயவிவரம்", settings: "அமைப்புகள்", language: "மொழி" },
  brand: { name: "கிசான் சேது", tagline: "உங்கள் நிலம். உங்கள் கணக்கு. உங்கள் உரிமை." },
  common: { save: "சேமி", cancel: "ரத்து செய்", edit: "திருத்து", delete: "நீக்கு", confirm: "உறுதி செய்", back: "பின்செல்", add: "சேர்", view: "பார்", filter: "வடிகட்டு", search: "தேடு", exportCsv: "CSV பதிவிறக்கு", loading: "ஏற்றுகிறது...", success: "வெற்றிகரமாக சேமிக்கப்பட்டது", error: "பிழை ஏற்பட்டது", readAloud: "கேட்கவும்", stopVoice: "நிறுத்து" },
  auth: { signIn: "உள்நுழைக", signUp: "புதிய கணக்கு தொடங்கு", signOut: "வெளியேறு", email: "மின்னஞ்சல் முகவரி", password: "கடவுச்சொல்", fullName: "விவசாயியின் முழுப் பெயர்", preferredLanguage: "விருப்ப மொழி" },
  dashboard: { title: "விவசாய டாஷ்போர்டு", welcome: "வணக்கம்", totalFarms: "பதிவுசெய்த பண்ணைகள்", activeCrops: "நடப்பு பயிர்கள்", monthExpenses: "இந்த மாத செலவு", monthIncome: "இந்த மாத வருமானம்", netRecorded: "பதிவான மீதி", pendingTasks: "நிலுவைப் பணிகள்", overdueTasks: "தாமதமான பணிகள்", lowStockItems: "குறைந்த கையிருப்பு", quickActions: "விரைவுச் செயல்கள்", addExpense: "செலவு சேர்", addIncome: "வருமானம் சேர்", addCrop: "பயிர் சேர்", addTask: "பணி சேர்", addStock: "பொருள் சேர்", todaysWork: "இன்றைய பண்ணைப் பணி", noTasksToday: "இன்று செய்ய வேண்டிய பணிகள் ஏதுமில்லை." },
  farms: { title: "என் பண்ணைகள் மற்றும் நிலங்கள்", addNewFarm: "புதிய பண்ணை சேர்க்க", nameLabel: "பண்ணையின் பெயர்", villageLabel: "கிராமம்", areaLabel: "மொத்த பரப்பளவு", confirmDelete: "இந்தப் பண்ணையை நிச்சயமாக நீக்க விரும்புகிறீர்களா?" },
  crops: { title: "பயிர் சுழற்சி", addNewCrop: "புதிய பயிர் பதிவு", cropName: "பயிரின் பெயர் (நெல், கரும்பு, வாழை)", variety: "வகை / ரகம்", season: "பருவம் (காரிஃப், ரபி)", sowingDate: "விதைத்த தேதி", expectedHarvest: "அறுவடை எதிர்பார்க்கப்படும் தேதி", actualYield: "மொத்த மகசூல்" },
  ledger: { title: "பண்ணை கணக்கு", addExpense: "செலவு பதிவு செய்க", addIncome: "வருமானம் பதிவு செய்க", amount: "தொகை (₹)", date: "தேதி", totalExpenses: "மொத்த செலவுகள்", totalIncome: "மொத்த வருமானம்", recordedDiff: "பதிவான இருப்பு" }
});

// 6. Gujarati (gu)
export const gu = createLocale({
  nav: { home: "હોમ", myFarms: "મારા ખેતર", ledger: "ખાતાવહી", calendar: "કેલેન્ડર", inventory: "સ્ટોક અને માલ", reports: "અહેવાલ", more: "વધુ", profile: "પ્રોફાઇલ", settings: "સેટિંગ્સ", language: "ભાષા" },
  brand: { name: "કિસાનસેતુ", tagline: "તમારું ખેતર. તમારો હિસાબ. તમારું નિયંત્રણ." },
  common: { save: "સાચવો", cancel: "રદ કરો", edit: "ફેરફાર કરો", delete: "કાઢી નાખો", confirm: "પુષ્ટિ કરો", back: "પાછા જાઓ", add: "ઉમેરો", view: "જુઓ", filter: "ફિલ્ટર", search: "શોધો", exportCsv: "CSV ડાઉનલોડ", loading: "લોડ થઈ રહ્યું છે...", success: "સફળતાપૂર્વક સાચવ્યું", error: "ભૂલ આવી", readAloud: "સાંભળો", stopVoice: "અટકાવો" },
  auth: { signIn: "લોગ ઇન", signUp: "નવું ખાતું બનાવો", signOut: "લોગ આઉટ", email: "ઈમેલ સરનામું", password: "પાસવર્ડ", fullName: "ખેડૂતનું પૂરું નામ", preferredLanguage: "પસંદગીની ભાષા" },
  dashboard: { title: "ખેડૂત ડેશબોર્ડ", welcome: "નમસ્તે", totalFarms: "કુલ ખેતરો", activeCrops: "ચાલુ પાક", monthExpenses: "આ મહિનાનો ખર્ચ", monthIncome: "આ મહિનાની આવક", netRecorded: "ચોખ્ખી બચત", pendingTasks: "બાકી કામો", overdueTasks: "મુદત વીતી ગયેલ કામો", lowStockItems: "ઓછો સ્ટોક", quickActions: "ઝડપી કાર્યો", addExpense: "ખર્ચ લખો", addIncome: "આવક લખો", addCrop: "પાક ઉમેરો", addTask: "કામ ઉમેરો", addStock: "સ્ટોક ઉમેરો", todaysWork: "આજના ખેતી કામો", noTasksToday: "આજ માટે કોઈ કામ બાકી નથી." },
  farms: { title: "મારા ખેતર અને જમીન", addNewFarm: "નવું ખેતર ઉમેરો", nameLabel: "ખેતરનું નામ", villageLabel: "ગામ", areaLabel: "વિસ્તાર (વીઘા/એકર)", confirmDelete: "શું તમે ખરેખર આ ખેતર કાઢી નાખવા માંગો છો?" },
  crops: { title: "પાક ચક્ર", addNewCrop: "નવો પાક નોંધો", cropName: "પાકનું નામ (કપાસ, મગફળી, જીરું)", variety: "જાત / બિયારણ", season: "મોસમ (ખરીફ, રવિ, ઉનાળુ)", sowingDate: "વાવણી તારીખ", expectedHarvest: "કાપણીની અપેક્ષિત તારીખ", actualYield: "કુલ ઉત્પાદન" },
  ledger: { title: "ખેતી ખર્ચ અને આવક", addExpense: "ખર્ચ નોંધો", addIncome: "આવક નોંધો", amount: "રકમ (₹)", date: "તારીખ", totalExpenses: "કુલ ખર્ચ", totalIncome: "કુલ આવક", recordedDiff: "નોંધાયેલી સિલક" }
});

// 7. Kannada (kn)
export const kn = createLocale({
  nav: { home: "ಮುಖಪುಟ", myFarms: "ನನ್ನ ಜಮೀನುಗಳು", ledger: "ಖಾತೆ ಪುಸ್ತಕ", calendar: "ಕ್ಯಾಲೆಂಡರ್", inventory: "ದಾಸ್ತಾನು", reports: "ವರದಿಗಳು", more: "ಇನ್ನಷ್ಟು", profile: "ಪ್ರೊಫೈಲ್", settings: "ಸೆಟ್ಟಿಂಗ್ಸ್", language: "ಭಾಷೆ" },
  brand: { name: "ಕಿಸಾನ್‌ಸೇತು", tagline: "ನಿಮ್ಮ ಜಮೀನು. ನಿಮ್ಮ ಲೆಕ್ಕ. ನಿಮ್ಮ ನಿಯಂತ್ರಣ." },
  common: { save: "ಉಳಿಸಿ", cancel: "ರದ್ದುಮಾಡಿ", edit: "ತಿದ್ದಿ", delete: "ಅಳಿಸಿ", confirm: "ಖಚಿತಪಡಿಸಿ", back: "ಹಿಂದಕ್ಕೆ", add: "ಸೇರಿಸಿ", view: "ನೋಡಿ", filter: "ಫಿಲ್ಟರ್", search: "ಹುಡುಕಿ", exportCsv: "CSV ಡೌನ್‌ಲೋಡ್", loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...", success: "ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ", error: "ದೋಷ ಸಂಭವಿಸಿದೆ", readAloud: "ಕೇಳಿ", stopVoice: "ನಿಲ್ಲಿಸಿ" },
  auth: { signIn: "ಸೈನ್ ಇನ್", signUp: "ಖಾತೆ ರಚಿಸಿ", signOut: "ಸೈನ್ ಔಟ್", email: "ಇಮೇಲ್ ವಿಳಾಸ", password: "ಪಾಸ್‌ವರ್ಡ್", fullName: "ರೈತನ ಪೂರ್ಣ ಹೆಸರು", preferredLanguage: "ಆದ್ಯತೆಯ ಭಾಷೆ" },
  dashboard: { title: "ಕೃಷಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", welcome: "ನಮಸ್ಕಾರ", totalFarms: "ಒಟ್ಟು ಜಮೀನುಗಳು", activeCrops: "ಪ್ರಸ್ತುತ ಬೆಳೆಗಳು", monthExpenses: "ಈ ತಿಂಗಳ ಖರ್ಚು", monthIncome: "ಈ ತಿಂಗಳ ಆದಾಯ", netRecorded: "ಉಳಿದ ಮೊತ್ತ", pendingTasks: "ಬಾಕಿ ಕೆಲಸಗಳು", overdueTasks: "ಮೀರಿದ ಕೆಲಸಗಳು", lowStockItems: "ಕಡಿಮೆ ದಾಸ್ತಾನು", quickActions: "ತ್ವರಿತ ಕ್ರಿಯೆಗಳು", addExpense: "ಖರ್ಚು ಬರೆಯಿರಿ", addIncome: "ಆದಾಯ ಬರೆಯಿರಿ", addCrop: "ಬೆಳೆ ಸೇರಿಸಿ", addTask: "ಕೆಲಸ ಸೇರಿಸಿ", addStock: "ದಾಸ್ತಾನು ಸೇರಿಸಿ", todaysWork: "ಇಂದಿನ ಕೃಷಿ ಕೆಲಸಗಳು", noTasksToday: "ಇಂದು ಯಾವುದೇ ಕೆಲಸಗಳು ಬಾಕಿ ಇಲ್ಲ." },
  farms: { title: "ನನ್ನ ಜಮೀನು ಮತ್ತು ಹೊಲಗಳು", addNewFarm: "ಹೊಸ ಜಮೀನು ಸೇರಿಸಿ", nameLabel: "ಜಮೀನಿನ ಹೆಸರು", villageLabel: "ಗ್ರಾಮ", areaLabel: "ವಿಸ್ತೀರ್ಣ (ಎಕರೆ/ಗುಂಟೆ)", confirmDelete: "ಖಂಡಿತವಾಗಿ ಈ ಜಮೀನನ್ನು ಅಳಿಸಲು ಬಯಸುವಿರಾ?" },
  crops: { title: "ಬೆಳೆ ಚಕ್ರ", addNewCrop: "ಹೊಸ ಬೆಳೆ ದಾಖಲಿಸಿ", cropName: "ಬೆಳೆ ಹೆಸರು (ಭತ್ತ, ರಾಗಿ, ಕಬ್ಬು)", variety: "ತಳಿ / ಬೀಜ", season: "ಋತು (ಖಾರಿಫ್, ರಬಿ)", sowingDate: "ಬಿತ್ತನೆ ದಿನಾಂಕ", expectedHarvest: "ನಿರೀಕ್ಷಿತ ಕಟಾವು ದಿನಾಂಕ", actualYield: "ಒಟ್ಟು ಇಳುವರಿ" },
  ledger: { title: "ಜಮೀನಿನ ಲೆಕ್ಕ ಪುಸ್ತಕ", addExpense: "ಖರ್ಚು ದಾಖಲಿಸಿ", addIncome: "ಆದಾಯ ದಾಖಲಿಸಿ", amount: "ಮೊತ್ತ (₹)", date: "ದಿನಾಂಕ", totalExpenses: "ಒಟ್ಟು ಖರ್ಚು", totalIncome: "ಒಟ್ಟು ಆದಾಯ", recordedDiff: "ದಾಖಲಾದ ಬಾಕಿ" }
});

// 8. Malayalam (ml)
export const ml = createLocale({
  nav: { home: "ഹോം", myFarms: "എന്റെ കൃഷിയിടങ്ങൾ", ledger: "വരവ് ചെലവ്", calendar: "കലണ്ടർ", inventory: "സംഭരണം", reports: "റിപ്പോർട്ടുകൾ", more: "കൂടുതൽ", profile: "പ്രൊഫൈൽ", settings: "ക്രമീകരണങ്ങൾ", language: "ഭാഷ" },
  brand: { name: "കിസാൻസേതു", tagline: "നിങ്ങളുടെ കൃഷി. നിങ്ങളുടെ കണക്ക്. നിങ്ങളുടെ നിയന്ത്രണം." },
  common: { save: "സൂക്ഷിക്കുക", cancel: "റദ്ദാക്കുക", edit: "തിരുത്തുക", delete: "മായ്ക്കുക", confirm: "ഉറപ്പാക്കുക", back: "പിന്നോട്ട്", add: "ചേർക്കുക", view: "കാണുക", filter: "ഫിൽട്ടർ", search: "തിരയുക", exportCsv: "CSV ഡൗൺലോഡ്", loading: "ലോഡ് ചെയ്യുന്നു...", success: "വിജയകരമായി സൂക്ഷിച്ചു", error: "പിശക് സംഭവിച്ചു", readAloud: "കേൾക്കുക", stopVoice: "നിർത്തുക" },
  auth: { signIn: "സൈൻ ഇൻ", signUp: "അക്കൗണ്ട് ഉണ്ടാക്കുക", signOut: "പുറത്തിറങ്ങുക", email: "ഇമെയിൽ വിലാസം", password: "പാസ്‌വേഡ്", fullName: "കർഷകന്റെ പേര്", preferredLanguage: "തിരഞ്ഞെടുത്ത ഭാഷ" },
  dashboard: { title: "കൃഷി ഡാഷ്‌ബോർഡ്", welcome: "നമസ്കാരം", totalFarms: "ആകെ കൃഷിയിടങ്ങൾ", activeCrops: "നിലവിലെ വിളകൾ", monthExpenses: "ഈ മാസത്തെ ചെലവ്", monthIncome: "ഈ മാസത്തെ വരുമാനം", netRecorded: "ബാക്കി തുക", pendingTasks: "തീർപ്പുകൽപ്പിക്കാത്ത ജോലികൾ", overdueTasks: "വൈകിയ ജോലികൾ", lowStockItems: "കുറഞ്ഞ സംഭരണ ഇനങ്ങൾ", quickActions: "പെട്ടെന്നുള്ള പ്രവർത്തനങ്ങൾ", addExpense: "ചെലവ് രേഖപ്പെടുത്തുക", addIncome: "വരുമാനം രേഖപ്പെടുത്തുക", addCrop: "വിള ചേർക്കുക", addTask: "ജോലി ചേർക്കുക", addStock: "സാധനം ചേർക്കുക", todaysWork: "ഇന്നത്തെ കൃഷിപ്പണികൾ", noTasksToday: "ഇന്ന് ജോലികളൊന്നുമില്ല." },
  farms: { title: "എന്റെ കൃഷിഭൂമികൾ", addNewFarm: "പുതിയ കൃഷിയിടം ചേർക്കുക", nameLabel: "കൃഷിയിടത്തിന്റെ പേര്", villageLabel: "ഗ്രാമം", areaLabel: "വിസ്തീർണ്ണം", confirmDelete: "ഈ കൃഷിയിടം നീക്കം ചെയ്യണമെന്ന് ഉറപ്പാണോ?" },
  crops: { title: "വിള പരിപാലനം", addNewCrop: "പുതിയ വിള ചേർക്കുക", cropName: "വിളയുടെ പേര് (നെല്ല്, കുരുമുളക്, തെങ്ങ്)", variety: "ഇനം / വിത്ത്", season: "സീസൺ (വിരിപ്പ്, മുണ്ടകൻ, പുഞ്ച)", sowingDate: "വിതച്ച തീയതി", expectedHarvest: "വിളവെടുപ്പ് തീയതി", actualYield: "ആകെ വിളവ്" },
  ledger: { title: "കൃഷി വരവ് ചെലവ് കണക്ക്", addExpense: "ചെലവ് രേഖപ്പെടുത്തുക", addIncome: "വരുമാനം രേഖപ്പെടുത്തുക", amount: "തുക (₹)", date: "തീയതി", totalExpenses: "ആകെ ചെലവ്", totalIncome: "ആകെ വരുമാനം", recordedDiff: "ബാക്കി തുക" }
});

// 9. Odia (or)
export const or = createLocale({
  nav: { home: "ମୁଖ୍ୟ ପୃଷ୍ଠା", myFarms: "ମୋର ଜମି", ledger: "ଖାତା ବହି", calendar: "କ୍ୟାଲେଣ୍ଡର", inventory: "ଭଣ୍ଡାର", reports: "ରିପୋର୍ଟ", more: "ଅଧିକ", profile: "ପ୍ରୋଫାଇଲ୍", settings: "ସେଟିଙ୍ଗ୍", language: "ଭାଷା" },
  brand: { name: "କିସାନସେତୁ", tagline: "ଆପଣଙ୍କ ଚାଷ। ଆପଣଙ୍କ ହିସାବ। ଆପଣଙ୍କ ନିୟନ୍ତ୍ରଣ।" },
  common: { save: "ସାଇତନ୍ତୁ", cancel: "ବାତିଲ୍", edit: "ସମ୍ପାଦନ", delete: "ଲିଭାନ୍ତୁ", confirm: "ନିଶ୍ଚିତ କରନ୍ତୁ", back: "ପଛକୁ", add: "ଯୋଡନ୍ତୁ", view: "ଦେଖନ୍ତୁ", filter: "ଫିଲ୍ଟର୍", search: "ଖୋଜନ୍ତୁ", exportCsv: "CSV ଡାଉନଲୋଡ୍", loading: "ଲୋଡ୍ ହେଉଛି...", success: "ସଫଳତାର ସହ ସାଇତା ଗଲା", error: "ତ୍ରୁଟି ଘଟିଲା", readAloud: "ଶୁଣନ୍ତୁ", stopVoice: "ବନ୍ଦ କରନ୍ତୁ" },
  auth: { signIn: "ଲଗ୍ ଇନ୍", signUp: "ନୂତନ ଖାତା ଖୋଲନ୍ତୁ", signOut: "ଲଗ୍ ଆଉଟ୍", email: "ଇମେଲ୍ ଠିକଣା", password: "ପାସୱାର୍ଡ", fullName: "ଚାଷୀଙ୍କ ପୂରା ନାମ", preferredLanguage: "ପସନ୍ଦର ଭାଷା" },
  dashboard: { title: "ଚାଷୀ ଡ୍ୟାସବୋର୍ଡ", welcome: "ନମସ୍କାର", totalFarms: "ମୋଟ ଚାଷଜମି", activeCrops: "ବର୍ତ୍ତମାନର ଫସଲ", monthExpenses: "ଏ ମାସର ଖର୍ଚ୍ଚ", monthIncome: "ଏ ମାସର ଆୟ", netRecorded: "ବଳକା ହିସାବ", pendingTasks: "ବାକି ଥିବା କାମ", overdueTasks: "ସମୟ ସରିଥିବା କାମ", lowStockItems: "କମ୍ ଷ୍ଟକ୍ ସାମଗ୍ରୀ", quickActions: "ତୁରନ୍ତ କାର୍ଯ୍ୟ", addExpense: "ଖର୍ଚ୍ଚ ଲେଖନ୍ତୁ", addIncome: "ଆୟ ଲେଖନ୍ତୁ", addCrop: "ଫସଲ ଯୋଡନ୍ତୁ", addTask: "କାମ ଯୋଡନ୍ତୁ", addStock: "ସାମଗ୍ରୀ ଯୋଡନ୍ତୁ", todaysWork: "ଆଜିର ଚାଷ କାମ", noTasksToday: "ଆଜି କୌଣସି କାମ ବାକି ନାହିଁ।" },
  farms: { title: "ମୋର ଚାଷଜମି", addNewFarm: "ନୂଆ ଜମି ଯୋଡନ୍ତୁ", nameLabel: "ଜମିର ନାମ", villageLabel: "ଗ୍ରାମ", areaLabel: "କ୍ଷେତ୍ରଫଳ (ଏକର)", confirmDelete: "ଆପଣ ଏହି ଜମିକୁ ଲିଭାଇବାକୁ ଚାହାଁନ୍ତି କି?" },
  crops: { title: "ଫସଲ ଚକ୍ର", addNewCrop: "ନୂଆ ଫସଲ ଯୋଡନ୍ତୁ", cropName: "ଫସଲ ନାମ (ଧାନ, ମାଣ୍ଡିଆ, ମୁଗ)", variety: "କିସମ / ବିହନ", season: "ଋତୁ (ଖରିଫ୍, ରବି)", sowingDate: "ବୁଣିବା ତାରିଖ", expectedHarvest: "ଅମଳ ହେବାର ଆନୁମାନିକ ତାରିଖ", actualYield: "ମୋଟ ଅମଳ" },
  ledger: { title: "ଚାଷ ଖର୍ଚ୍ଚ ଓ ଆୟ ବହି", addExpense: "ଖର୍ଚ୍ଚ ଲେଖନ୍ତୁ", addIncome: "ଆୟ ଲେଖନ୍ତୁ", amount: "ରାଶି (₹)", date: "ତାରିଖ", totalExpenses: "ମୋଟ ଖର୍ଚ୍ଚ", totalIncome: "ମୋଟ ଆୟ", recordedDiff: "ହିସାବ କରାଯାଇଥିବା ବଳକା" }
});

// 10. Assamese (as)
export const as = createLocale({
  nav: { home: "ঘৰ", myFarms: "মোৰ পথাৰ", ledger: "খতিয়ান", calendar: "কেলেণ্ডাৰ", inventory: "ভঁৰাল", reports: "প্ৰতিবেদন", more: "অধিক", profile: "প্ৰফাইল", settings: "ছেটিংছ", language: "ভাষা" },
  brand: { name: "কিষাণসেতু", tagline: "আপোনাৰ পথাৰ। আপোনাৰ হিচাপ। আপোনাৰ নিয়ন্ত্ৰণ।" },
  common: { save: "সংৰক্ষণ", cancel: "বাতিল", edit: "সম্পাদনা", delete: "মচি পেলাওক", confirm: "নিশ্চিত কৰক", back: "উভতি যাওক", add: "যোগ কৰক", view: "চাওক", filter: "ফিল্টাৰ", search: "সন্ধান", exportCsv: "CSV ডাউনলোড", loading: "লোড হৈ আছে...", success: "সফলভাৱে সংৰক্ষণ কৰা হ'ল", error: "ত্ৰুটি হ'ল", readAloud: "শুনক", stopVoice: "বন্ধ কৰক" },
  auth: { signIn: "ছাইন ইন", signUp: "নতুন একাউণ্ট খোলক", signOut: "ছাইন আউট", email: "ইমেইল ঠিকনা", password: "পাছৱৰ্ড", fullName: "কৃষকৰ সম্পূৰ্ণ নাম", preferredLanguage: "পছন্দৰ ভাষা" },
  dashboard: { title: "কৃষি ডেচবৰ্ড", welcome: "নমস্কাৰ", totalFarms: "মুঠ পথাৰ", activeCrops: "বৰ্তমানৰ শস্য", monthExpenses: "এই মাহৰ খৰচ", monthIncome: "এই মাহৰ উপাৰ্জন", netRecorded: "হিসাব কৰা বাকী", pendingTasks: "বাকী থকা কাম", overdueTasks: "সময় উকলি যোৱা কাম", lowStockItems: "কম মজুত থকা বস্তু", quickActions: "দ্ৰুত কাৰ্য্য", addExpense: "খৰচ লিখক", addIncome: "উপাৰ্জন লিখক", addCrop: "শস্য যোগ কৰক", addTask: "কাম যোগ কৰক", addStock: "মজুত যোগ কৰক", todaysWork: "আজিৰ কৃষি কাৰ্য্য", noTasksToday: "আজিৰ বাবে কোনো কাম বাকী নাই।" },
  farms: { title: "মোৰ পথাৰ আৰু মাটি", addNewFarm: "নতুন পথাৰ যোগ কৰক", nameLabel: "পথাৰৰ নাম", villageLabel: "গাঁও", areaLabel: "কালি (বিঘা/একৰ)", confirmDelete: "আপুনি সঁচাকৈয়ে এই পথাৰখন মচি পেলাব বিচাৰেনে?" },
  crops: { title: "শস্য চক্ৰ", addNewCrop: "নতুন শস্য পঞ্জীয়ন কৰক", cropName: "শস্যৰ নাম (ধান, সৰিয়হ, মৰাপাট)", variety: "জাত / বীজ", season: "ঋতু (খাৰিফ, ৰবি)", sowingDate: "ৰোপণৰ তাৰিখ", expectedHarvest: "সম্ভাব্য চপোৱাৰ তাৰিখ", actualYield: "মুঠ উৎপাদন" },
  ledger: { title: "কৃষি খতিয়ান আৰু হিচাপ", addExpense: "খৰচ যোগ কৰক", addIncome: "উপাৰ্জন যোগ কৰক", amount: "টকাৰ পৰিমাণ (₹)", date: "তাৰিখ", totalExpenses: "মুঠ খৰচ", totalIncome: "মুঠ উপাৰ্জন", recordedDiff: "হিসাব কৰা উদ্বৃত্ত" }
});

// 11. Urdu (ur) — RTL
export const ur = createLocale({
  nav: { home: "ہوم", myFarms: "میرے کھیت", ledger: "کھاتہ وہی", calendar: "کیلنڈر", inventory: "اسٹاک و گودام", reports: "رپورٹس", more: "مزید", profile: "پروفائل", settings: "ترتیبات", language: "زبان" },
  brand: { name: "کسان سیتو", tagline: "آپ کا کھیت۔ آپ کا حساب۔ آپ کا اختیار۔" },
  common: { save: "محفوظ کریں", cancel: "منسوخ", edit: "ترمیم", delete: "حذف کریں", confirm: "تصدیق کریں", back: "واپس", add: "شامل کریں", view: "دیکھیں", filter: "فلٹر", search: "تلاش کریں", exportCsv: "CSV ڈاؤن لوڈ", loading: "لوڈ ہو رہا ہے...", success: "کامیابی سے محفوظ ہو گیا", error: "خرابی واقع ہوئی", readAloud: "سنیں", stopVoice: "روکیں" },
  auth: { signIn: "لاگ ان کریں", signUp: "نیا کھاتہ بنائیں", signOut: "لاگ آؤٹ", email: "ای میل پتہ", password: "پاس ورڈ", fullName: "کسان کا پورا نام", preferredLanguage: "پسندیدہ زبان" },
  dashboard: { title: "زرعی ڈیش بورڈ", welcome: "خوش آمدید", totalFarms: "کل فارم", activeCrops: "موجودہ فصلیں", monthExpenses: "اس ماہ کے اخراجات", monthIncome: "اس ماہ کی آمدنی", netRecorded: "درج شدہ بچت", pendingTasks: "باقی کام", overdueTasks: "تاخیر شدہ کام", lowStockItems: "کم اسٹاک", quickActions: "فوری اقدامات", addExpense: "خرچ لکھیں", addIncome: "آمدنی لکھیں", addCrop: "فصل شامل کریں", addTask: "کام شامل کریں", addStock: "اسٹاک شامل کریں", todaysWork: "آج کے کھیتی باڑی کے کام", noTasksToday: "آج کا کوئی کام باقی نہیں ہے۔" },
  farms: { title: "میرے کھیت اور زمین", addNewFarm: "نیا کھیت شامل کریں", nameLabel: "کھیت کا نام", villageLabel: "گاؤں", areaLabel: "کل رقبہ", confirmDelete: "کیا آپ واقعی اس فارم کو حذف کرنا چاہتے ہیں؟" },
  crops: { title: "فصل کا دورانیہ", addNewCrop: "نئی فصل کا اندراج", cropName: "فصل کا نام (گندم، چاول، کپاس)", variety: "قسم / بیج", season: "موسم (خریف، ربیع)", sowingDate: "بوائی کی تاریخ", expectedHarvest: "متوقع کٹائی کی تاریخ", actualYield: "کل پیداوار" },
  ledger: { title: "کھاتہ وہی", addExpense: "خرچ درج کریں", addIncome: "آمدنی درج کریں", amount: "رقم (₹)", date: "تاریخ", totalExpenses: "کل اخراجات", totalIncome: "کل آمدنی", recordedDiff: "درج شدہ بقیہ" }
});

// 12. Sanskrit (sa)
export const sa = createLocale({
  nav: { home: "गृहम्", myFarms: "मम क्षेत्राणि", ledger: "गणनापत्रम्", calendar: "पञ्चाङ्गम्", inventory: "सङ्ग्रहः", reports: "विवरणानि", more: "अधिकम्", profile: "परिचयः", settings: "विन्यासाः", language: "भाषा" },
  brand: { name: "किसानसेतुः", tagline: "भवतः क्षेत्रम्। भवतः गणना। भवतः नियन्त्रणम्।" },
  common: { save: "संरक्ष्यताम्", cancel: "निरस्यताम्", edit: "परिवर्त्यताम्", delete: "विलोप्यताम्", confirm: "दृढीक्रियताम्", back: "प्रतिगम्यताम्", add: "संयोज्यताम्", view: "दृश्यताम्", loading: "लोड् भवति...", success: "सफलतापूर्वकं रक्षितम्", readAloud: "शृण्वन्तु" }
});

// 13. Nepali (ne)
export const ne = createLocale({
  nav: { home: "गृहपृष्ठ", myFarms: "मेरो खेत", ledger: "लेखा खाता", calendar: "पात्रो", inventory: "भण्डार", reports: "प्रतिवेदन", more: "थप", profile: "प्रोफाइल", settings: "सेटिङ्हरू", language: "भाषा" },
  brand: { name: "किसानसेतु", tagline: "तपाईंको खेत। तपाईंको हिसाब। तपाईंको नियन्त्रण।" },
  common: { save: "बचत गर्नुहोस्", cancel: "रद्द गर्नुहोस्", edit: "सम्पादन गर्नुहोस्", delete: "हटाउनुहोस्", confirm: "पुष्टि गर्नुहोस्", back: "पछाडि", add: "थप्नुहोस्", view: "हेर्नुहोस्", loading: "लोड हुँदैछ...", success: "सफलतापूर्वक सुरक्षित भयो", readAloud: "सुन्नुहोस्" }
});

// 14. Maithili (mai)
export const mai = createLocale({
  nav: { home: "मुख्य पृष्ठ", myFarms: "हमर खेत", ledger: "खाता बही", calendar: "पंचांग", inventory: "गोदाम", reports: "विवरण", more: "आउर", profile: "प्रोफाइल", settings: "सेटिंग्स", language: "भाषा" },
  brand: { name: "किसानसेतु", tagline: "अहाँक खेत। अहाँक हिसाब। अहाँक नियंत्रण।" },
  common: { save: "सहेजु", cancel: "रद्द करू", edit: "सुधारू", delete: "मेटाउ", confirm: "पक्का करू", back: "पाछाँ जाउ", add: "जोड़ू", view: "देखू", loading: "लोड भ रहल अछि...", success: "सफलतापूर्वक सुरक्षित भेल" }
});

// 15. Konkani (kok)
export const kok = createLocale({
  nav: { home: "घर", myFarms: "म्हाजी शेतां", ledger: "हिशोब वही", calendar: "दिनदर्शिका", inventory: "साठो", reports: "अहवाल", more: "आनीक", profile: "प्रोफाइल", settings: "सेटिंग्स", language: "भास" },
  brand: { name: "किसानसेतू", tagline: "तुमचें शेत। तुमचो हिशोब। तुमचें नियंत्रण।" },
  common: { save: "सांबाळा", cancel: "रद्द करा", edit: "बदला", delete: "काडून उडया", confirm: "नक्की करा", back: "फाटीं", add: "जोडा", view: "पळयात", loading: "लोड जाता...", success: "यशस्वीपणान सांबाळ्ळें" }
});

// 16. Dogri (doi)
export const doi = createLocale({
  nav: { home: "घर", myFarms: "मेरे खेत", ledger: "खाता बही", calendar: "जंत्री", inventory: "भंडार", reports: "रपट", more: "होर", profile: "प्रोफाइल", settings: "सैटिंग", language: "बोली" },
  brand: { name: "किसानसेतु", tagline: "तुंदा खेत। तुंदा हिसाब। तुंदा काबू।" },
  common: { save: "सांभो", cancel: "रद्द करो", edit: "बदलो", delete: "हटाओ", confirm: "पक्का करो", back: "पिछें", add: "जोड़ो", view: "दिक्खो", loading: "लोड होआ दा ऐ...", success: "सफलता कन्ने सहेजेआ गेआ" }
});

// 17. Kashmiri (ks) — RTL
export const ks = createLocale({
  nav: { home: "گھر", myFarms: "میٲنۍ کھیتھ", ledger: "کھاتہٕ کتاب", calendar: "کیلنڈر", inventory: "گودام", reports: "رپورٹ", more: "مزید", profile: "پروفائل", settings: "سیٹنگ", language: "زبان" },
  brand: { name: "کسان سیتو", tagline: "تُہُند کھیتھ۔ تُہُند حساب۔ تُہُند اختیار۔" },
  common: { save: "محفوظ کٔریو", cancel: "منسوخ", edit: "تبدیل کٔریو", delete: "ہٹٲویو", confirm: "پختہ کٔریو", back: "واپس", add: "شامل کٔریو", view: "وُچِھو", loading: "لوڈ گژھان چھُ...", success: "کامیابی سان محفوظ گۆو" }
});

// 18. Sindhi (sd) — RTL
export const sd = createLocale({
  nav: { home: "مکي پيج", myFarms: "منهنجا ٻنيون", ledger: "حساب ڪتاب", calendar: "ڪئلينڊر", inventory: "ذخيرو", reports: "رپورٽون", more: "وڌيڪ", profile: "پروفائل", settings: "سيٽنگس", language: "ٻولي" },
  brand: { name: "ڪسان سيتو", tagline: "توهان جو کيت. توهان جو حساب. توهان جو اختيار." },
  common: { save: "محفوظ ڪريو", cancel: "رد ڪريو", edit: "تبديل ڪريو", delete: "ڊاهي ڇڏيو", confirm: "تصديق ڪريو", back: "واپس", add: "شامل ڪريو", view: "ڏسو", loading: "لوڊ ٿي رهيو آهي...", success: "ڪاميابي سان محفوظ ٿي ويو" }
});

// 19. Santali (sat)
export const sat = createLocale({
  nav: { home: "ᱚᱲᱟᱜ", myFarms: "ᱤᱧᱟᱜ ᱠᱷᱮᱛ", ledger: "ᱦᱤᱥᱟᱹᱵᱽ ᱯᱩᱛᱷᱤ", calendar: "ᱠᱮᱞᱮᱱᱰᱟᱨ", inventory: "ᱵᱷᱟᱱᱰᱟᱨ", reports: "ᱨᱤᱯᱚᱨᱴ", more: "ᱟᱨᱦᱚᱸ", profile: "ᱯᱨᱚᱯᱷᱟᱭᱤᱞ", settings: "ᱥᱟᱡᱟᱣ", language: "ᱯᱟᱹᱨᱥᱤ" },
  brand: { name: "ᱠᱤᱥᱟᱱᱥᱮᱛᱩ", tagline: "ᱟᱢᱟᱜ ᱠᱷᱮᱛ᱾ ᱟᱢᱟᱜ ᱦᱤᱥᱟᱹᱵᱽ᱾ ᱟᱢᱟᱜ ᱟᱹᱭᱫᱟᱹᱨᱤ᱾" },
  common: { save: "ᱥᱟᱸᱪᱟᱣ", cancel: "ᱵᱟᱹᱛᱤᱞ", edit: "ᱥᱟᱯᱲᱟᱣ", delete: "ᱜᱮᱫ ᱜᱤᱰᱤ", confirm: "ᱴᱷᱟᱹᱣᱠᱟᱹ", back: "ᱨᱩᱣᱟᱹᱲ", add: "ᱡᱚᱲᱟᱣ", view: "ᱧᱮᱞ", loading: "ᱞᱟᱫᱮᱜ ᱠᱟᱱᱟ...", success: "ᱥᱟᱹᱛ ᱮᱱᱟ" }
});

// 20. Bodo (brx)
export const brx = createLocale({
  nav: { home: "न’", myFarms: "आंनि बारि", ledger: "हिसाब बही", calendar: "कैलेंडर", inventory: "थाखाय", reports: "खौरां", more: "गुबुन", profile: "प्रफाइल", settings: "सेटिंस", language: "राव" },
  brand: { name: "किशानसेतु", tagline: "नोंनि बारि। नोंनि हिसाब। नोंनि गोहो।" },
  common: { save: "दोनथुम", cancel: "नेवसि", edit: "सोलाय", delete: "हुखुमोर", confirm: "थार खालाम", back: "उनाव", add: "दाजाब", view: "नाय", loading: "ल’ड जाबाय...", success: "जाफुंबाय" }
});

// 21. Manipuri (mni)
export const mni = createLocale({
  nav: { home: "য়ুম", myFarms: "ঐগী লম", ledger: "হিসাব লাইরিক", calendar: "কেলেণ্ডার", inventory: "পোৎ-চৈ", reports: "রিপোর্ট", more: "অতোপ্পা", profile: "প্রোফাইল", settings: "সেটিংস", language: "লোল" },
  brand: { name: "কিসানসেতু", tagline: "নহাক্কী লম। নহাক্কী হিসাব। নহাক্কী লৈবাক।" },
  common: { save: "কনবা", cancel: "তোকপা", edit: "শেমদোকপা", delete: "মুত্থৎপা", confirm: "চেক তৌবা", back: "হনবা", add: "হাপচিনবা", view: "য়েংবা", loading: "লোদ তৌরি...", success: "মায়পাক্লে" }
});

export const ALL_TRANSLATIONS: Record<string, TranslationType> = {
  en,
  hi,
  pa,
  bn,
  mr,
  te,
  ta,
  gu,
  kn,
  ml,
  or,
  as,
  ur,
  sa,
  ne,
  mai,
  kok,
  doi,
  ks,
  sd,
  sat,
  brx,
  mni
};
