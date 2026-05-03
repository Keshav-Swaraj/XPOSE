// Leaderboard data – well-known Indian financial websites
const LEADERBOARD_DATA = [
  {
    rank: 1,
    name: "Paytm Money",
    url: "paytmmoney.com",
    category: "investment",
    emoji: "💚",
    score: 18,
    verdict: "Trustworthy",
    verdictClass: "safe",
    trend: "improving",
    trendVal: -3,
    patterns: 2,
    hiddenFees: "₹0",
    complaints: 12,
    violations: [
      { type: "Minor", title: "Slow withdrawal UI", desc: "Withdrawal confirmation takes 4 clicks – mildly friction-heavy.", reg: "SEBI Circular MIRSD/2011" }
    ]
  },
  {
    rank: 2,
    name: "Groww",
    url: "groww.in",
    category: "investment",
    emoji: "💚",
    score: 22,
    verdict: "Trustworthy",
    verdictClass: "safe",
    trend: "stable",
    trendVal: 0,
    patterns: 3,
    hiddenFees: "₹0",
    complaints: 18,
    violations: [
      { type: "Minor", title: "Nudge marketing", desc: "Push notifications for 'trending' stocks create mild FOMO.", reg: "SEBI IA Reg 2013" }
    ]
  },
  {
    rank: 3,
    name: "Zerodha",
    url: "zerodha.com",
    category: "investment",
    emoji: "💚",
    score: 25,
    verdict: "Trustworthy",
    verdictClass: "safe",
    trend: "improving",
    trendVal: -5,
    patterns: 3,
    hiddenFees: "₹20/order",
    complaints: 24,
    violations: [
      { type: "Minor", title: "Fee disclosure", desc: "₹20/order brokerage prominently shown but options fees less visible.", reg: "SEBI LODR 2015" }
    ]
  },
  {
    rank: 4,
    name: "CRED",
    url: "cred.club",
    category: "payments",
    emoji: "🟡",
    score: 41,
    verdict: "Attention",
    verdictClass: "attention",
    trend: "worsening",
    trendVal: +6,
    patterns: 7,
    hiddenFees: "₹499/yr",
    complaints: 156,
    violations: [
      { type: "High", title: "Hidden CRED Cash interest", desc: "CRED Cash interest rates buried in T&Cs, not on main offer screen.", reg: "RBI Fair Practices Code" },
      { type: "Medium", title: "Reward devaluation", desc: "CRED coins expire and are devalued without prominent notice.", reg: "Consumer Protection Act 2019" }
    ]
  },
  {
    rank: 5,
    name: "Amazon Pay Later",
    url: "amazon.in",
    category: "loans",
    emoji: "🟡",
    score: 48,
    verdict: "Attention",
    verdictClass: "attention",
    trend: "stable",
    trendVal: +1,
    patterns: 9,
    hiddenFees: "₹249/mo",
    complaints: 203,
    violations: [
      { type: "High", title: "Pre-ticked EMI option", desc: "Amazon Pay Later is often pre-selected during checkout without explicit consent.", reg: "RBI Digital Lending Guidelines 2022" },
      { type: "Medium", title: "Late fee obscured", desc: "₹500 late fee mentioned only in PDF T&Cs, not on payment page.", reg: "Consumer Protection Act 2019" }
    ]
  },
  {
    rank: 6,
    name: "Bajaj Finserv",
    url: "bajajfinserv.in",
    category: "loans",
    emoji: "🟠",
    score: 62,
    verdict: "Risky",
    verdictClass: "risky",
    trend: "worsening",
    trendVal: +8,
    patterns: 14,
    hiddenFees: "₹3,499",
    complaints: 412,
    violations: [
      { type: "Critical", title: "Processing fee not upfront", desc: "₹3,499 processing fee shown only at final checkout after extensive form-filling.", reg: "RBI Fair Practices Code 2012" },
      { type: "High", title: "Insurance auto-add", desc: "PFBF insurance plan pre-selected on all EMI cards by default.", reg: "IRDAI Circular IRDA/BRK/CIR/MISC/042/2013" },
      { type: "Medium", title: "Urgency language", desc: "Countdown timers on loan offers to pressure faster decisions.", reg: "Consumer Protection Act 2019" }
    ]
  },
  {
    rank: 7,
    name: "PolicyBazaar",
    url: "policybazaar.com",
    category: "insurance",
    emoji: "🔴",
    score: 71,
    verdict: "Risky",
    verdictClass: "risky",
    trend: "worsening",
    trendVal: +11,
    patterns: 18,
    hiddenFees: "₹1,200+",
    complaints: 678,
    violations: [
      { type: "Critical", title: "Misleading 'lowest price' claims", desc: "Plans labeled 'lowest price' exclude GST and riders; real cost 30-45% higher.", reg: "IRDAI Circular dated 20/01/2020" },
      { type: "High", title: "Fake urgency timers", desc: "Countdown timers on insurance offers with no actual expiry.", reg: "Consumer Protection Act 2019" },
      { type: "High", title: "Comparison manipulation", desc: "Sponsored plans ranked higher in 'best match' algorithm without disclosure.", reg: "SEBI PFUTP Regulations 2003" }
    ]
  },
  {
    rank: 8,
    name: "Paisa Bazaar",
    url: "paisabazaar.com",
    category: "loans",
    emoji: "🔴",
    score: 74,
    verdict: "Risky",
    verdictClass: "risky",
    trend: "stable",
    trendVal: +2,
    patterns: 16,
    hiddenFees: "₹2,499",
    complaints: 589,
    violations: [
      { type: "Critical", title: "Credit score scare tactics", desc: "Displays inflated 'risk' warnings to push users toward premium paid plans.", reg: "RBI Credit Information Guidelines" },
      { type: "High", title: "Pre-filled loan amounts", desc: "Loan applications pre-filled with maximum eligible amount, not user-selected.", reg: "RBI Digital Lending Guidelines 2022" }
    ]
  },
  {
    rank: 9,
    name: "PhonePe Loans",
    url: "phonepe.com",
    category: "loans",
    emoji: "🔴",
    score: 78,
    verdict: "Risky",
    verdictClass: "risky",
    trend: "worsening",
    trendVal: +14,
    patterns: 21,
    hiddenFees: "₹1,999",
    complaints: 731,
    violations: [
      { type: "Critical", title: "Forced consent bundling", desc: "Marketing consent bundled with loan application consent.", reg: "PDPB 2023 Draft & IT Act" },
      { type: "Critical", title: "Pre-approved loan spam", desc: "Persistent 'Pre-approved' banners for loans users never applied for.", reg: "RBI Digital Lending Guidelines 2022" },
      { type: "High", title: "Hidden processing fees", desc: "2% processing fee shown after interest calculation in separate screen.", reg: "RBI Fair Practices Code 2012" }
    ]
  },
  {
    rank: 10,
    name: "Flipkart Pay Later",
    url: "flipkart.com",
    category: "payments",
    emoji: "🔴",
    score: 82,
    verdict: "Critical",
    verdictClass: "critical",
    trend: "worsening",
    trendVal: +19,
    patterns: 26,
    hiddenFees: "₹4,200/yr",
    complaints: 1024,
    violations: [
      { type: "Critical", title: "Auto-enrolled Pay Later", desc: "Users auto-enrolled into Flipkart Pay Later credit without explicit opt-in.", reg: "RBI Digital Lending Guidelines 2022" },
      { type: "Critical", title: "Penalty obfuscation", desc: "₹500 late fee shown in grey on grey background below fold.", reg: "Consumer Protection Act 2019" },
      { type: "High", title: "Checkout dark pattern", desc: "Pay Later set as default payment option even when other methods selected.", reg: "SEBI PFUTP Regulations 2003" },
      { type: "High", title: "Annual fee buried", desc: "₹4,200 annual fee mentioned only in email confirmation, not checkout.", reg: "RBI Fair Practices Code 2012" }
    ]
  }
];
