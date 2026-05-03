const fs = require('fs');
let content = fs.readFileSync('extension/src/contents/explainPanel.tsx', 'utf8');

content = content.replace(
  'import logo from "data-base64:~../assets/icon.png"',
  'import logo from "data-base64:~../assets/icon.png"\nimport { TRANSLATIONS } from "./translations"'
);

content = content.replace(
  'const darkPatternsCount = explanation?.dark_patterns_count || explanation?.risks?.length || 0;',
  'const darkPatternsCount = explanation?.dark_patterns_count || explanation?.risks?.length || 0;\n  const t = TRANSLATIONS[language] || TRANSLATIONS["English"];'
);

content = content.replace(
  'explanation.status === "Safe" ? "Safe to proceed" : explanation.status === "Attention" ? "Moderate manipulation risk" : "High manipulation risk"',
  'explanation.status === "Safe" ? t.safe_to_proceed : explanation.status === "Attention" ? t.mod_risk : t.high_risk'
);

content = content.replace('Found on <strong>', '{t.found_on} <strong>');
content = content.replace('{darkPatternsCount} dark patterns · ', '{darkPatternsCount} {t.dark_patterns} · ');
content = content.replace('} risky clauses</div>', '} {t.risky_clauses}</div>');

content = content.replace('{explanation.est_cost_label || "Est. yearly impact"}', '{explanation.est_cost_label || t.est_impact}');
content = content.replace('<div className="metric-label">Dark patterns</div>', '<div className="metric-label">{t.dark_patterns_title}</div>');
content = content.replace('<div className="metric-label">Regulation at risk</div>', '<div className="metric-label">{t.reg_at_risk}</div>');

content = content.replace('Decode\\n              </div>', '{t.decode}\\n              </div>');
content = content.replace('Shield\\n              </div>', '{t.shield}\\n              </div>');
content = content.replace('Expose\\n              </div>', '{t.expose}\\n              </div>');

content = content.replace('XPOSE AI Summary\\n                      </div>', '{t.ai_summary}\\n                      </div>');

content = content.replace('<div className="msg ai animate-pulse">Typing...</div>', '<div className="msg ai animate-pulse">{t.typing}</div>');

content = content.replace('placeholder="Ask about anything on this page..."', 'placeholder={t.ask_anything}');

content = content.replace('<div className="tc-label">Calculated true cost</div>', '<div className="tc-label">{t.calc_true_cost}</div>');

content = content.replace('<div className="risk-section-label">Threats detected</div>', '<div className="risk-section-label">{t.threats_detected}</div>');
content = content.replace('<div className="threat-title">Identified Risk</div>', '<div className="threat-title">{t.identified_risk}</div>');

content = content.replace('<div className="clause-label">Key clauses</div>', '<div className="clause-label">{t.key_clauses}</div>');

content = content.replace(
  `<strong>{explanation.violations?.length || 0} violations found on this page</strong>
                      These practices likely violate regulations. You have the right to report them.`,
  `<strong>{explanation.violations?.length || 0} {t.violations_found}</strong>
                      <br/>{t.practices_violate}`
);

content = content.replace('<div className="law-badge">Regulation</div>', '<div className="law-badge">{t.regulation}</div>');

content = content.replace(
  `Report to SEBI / IRDAI
                    </button>`,
  `{t.report_sebi}
                    </button>`
);

content = content.replace(
  `<div className="report-note">XPOSE will auto-fill the complaint with this page's screenshot, URL, and the exact regulation violated.</div>`,
  `<div className="report-note">{t.auto_fill_note}</div>`
);

content = content.replace('{loading ? "Scanning..." : "Re-scan"}', '{loading ? t.scanning : t.rescan}');
content = content.replace('{speaking ? "Stop" : "Listen"}', '{speaking ? t.stop : t.listen}');

content = content.replace(
  '<p className="text-gray-500 font-medium text-sm">Scanning the fine print...</p>',
  '<p className="text-gray-500 font-medium text-sm">{t.scanning_fine_print}</p>'
);

content = content.replace(
  '<h3 className="text-lg font-bold text-gray-900">AI Financial Guardian</h3>',
  '<h3 className="text-lg font-bold text-gray-900">{t.ai_guardian}</h3>'
);
content = content.replace(
  '<p className="text-gray-500 text-sm mt-1">Automatically detect hidden fees, dark patterns, and risky fine print.</p>',
  '<p className="text-gray-500 text-sm mt-1">{t.auto_detect}</p>'
);
content = content.replace(
  `Scan &amp; Explain Page
                </button>`,
  `{t.scan_explain}
                </button>`
);

content = content.replace(
  '<h3 className="text-lg font-bold text-gray-900">Report to SEBI</h3>',
  '<h3 className="text-lg font-bold text-gray-900">{t.report_sebi_title}</h3>'
);
content = content.replace(
  '<p className="text-gray-600 text-sm leading-relaxed">This mock integration simulates logging a complaint with SCORES using auto-extracted violations.</p>',
  '<p className="text-gray-600 text-sm leading-relaxed">{t.mock_integration}</p>'
);
content = content.replace(
  '<p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Payload Details</p>',
  '<p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">{t.payload_details}</p>'
);
content = content.replace(
  '<span className="text-gray-500">URL:</span>',
  '<span className="text-gray-500">{t.url}</span>'
);

content = content.replace('placeholder="Full Legal Name"', 'placeholder={t.full_name}');

content = content.replace('Cancel</button>', '{t.cancel}</button>');
content = content.replace('Submit Report</button>', '{t.submit_report}</button>');

content = content.replace(
  '<h3 className="font-bold text-gray-900 text-xl tracking-tight">Complaint Logged</h3>',
  '<h3 className="font-bold text-gray-900 text-xl tracking-tight">{t.complaint_logged}</h3>'
);
content = content.replace(
  '<p className="text-gray-600 text-sm leading-relaxed max-w-[280px] mx-auto">Your report has been successfully drafted. In production, this syncs with SEBI SCORES.</p>',
  '<p className="text-gray-600 text-sm leading-relaxed max-w-[280px] mx-auto">{t.success_drafted}</p>'
);
content = content.replace('Close Window</button>', '{t.close_window}</button>');

fs.writeFileSync('extension/src/contents/explainPanel.tsx', content);
