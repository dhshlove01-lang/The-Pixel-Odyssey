// HTML 보고서 → PDF (헤드리스 크로뮴).  node docs/balance/pdf.js <in.html> <out.pdf>
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [inp, out] = process.argv.slice(2);
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + path.resolve(inp)); await p.waitForTimeout(300);
  await p.pdf({ path: out, format: 'A4', landscape: true, printBackground: true, preferCSSPageSize: true });
  await b.close(); console.log('wrote', out);
})();
