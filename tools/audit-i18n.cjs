const fs = require('fs');
const pages = ['Home','About','Contact','News','Login','Alerts','Dashboard','Reporting','Transactions','MaritimeSurveillance','RevenueSupervision'];
pages.forEach(p => {
  const content = fs.readFileSync('client/src/pages/' + p + '.tsx', 'utf8');
  const tcalls = (content.match(/\bt\s*\(\s*['"]/g) || []).length;
  const hasHook = content.includes('useTranslation');
  console.log(p + ': useTranslation=' + hasHook + ', t() calls=' + tcalls);
});
