/**
 * OG Image generator — run once with: node scripts/generate-og.mjs
 * Requires puppeteer: npm install --save-dev puppeteer
 */
import puppeteer from 'puppeteer'
import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outPath = resolve(__dirname, '../public/og-image.jpg')

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@700;900&family=Space+Grotesk:wght@400;500&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  body{
    width:1200px;height:630px;overflow:hidden;
    background:#050505;
    font-family:'Archivo',sans-serif;
    display:flex;align-items:center;justify-content:center;
    position:relative;
  }
  .bg{
    position:absolute;inset:0;
    background: radial-gradient(ellipse 700px 500px at 30% 50%, rgba(0,212,255,0.12) 0%, transparent 65%),
                radial-gradient(ellipse 600px 400px at 75% 30%, rgba(99,102,241,0.10) 0%, transparent 60%),
                #050505;
  }
  .grid{
    position:absolute;inset:0;
    background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 60px 60px;
  }
  .card{
    position:relative;z-index:2;
    background:rgba(255,255,255,0.04);
    border:1px solid rgba(255,255,255,0.08);
    border-radius:24px;
    padding:64px 72px;
    width:1080px;
    backdrop-filter:blur(20px);
  }
  .label{
    font-family:'Space Grotesk',sans-serif;
    font-size:14px;font-weight:500;letter-spacing:0.12em;
    color:rgba(0,212,255,0.8);text-transform:uppercase;
    margin-bottom:20px;
  }
  h1{
    font-size:62px;font-weight:900;
    color:#ffffff;line-height:1.1;
    letter-spacing:-0.02em;
    margin-bottom:24px;
  }
  h1 span{color:rgba(0,212,255,0.9);}
  p{
    font-family:'Space Grotesk',sans-serif;
    font-size:20px;color:rgba(255,255,255,0.55);
    line-height:1.5;max-width:680px;
    margin-bottom:40px;
  }
  .chips{display:flex;gap:10px;flex-wrap:wrap;}
  .chip{
    font-family:'Space Grotesk',sans-serif;
    font-size:13px;font-weight:500;
    background:rgba(255,255,255,0.06);
    border:1px solid rgba(255,255,255,0.1);
    color:rgba(255,255,255,0.6);
    padding:6px 14px;border-radius:100px;
  }
  .url{
    position:absolute;bottom:32px;right:48px;z-index:2;
    font-family:'Space Grotesk',sans-serif;
    font-size:15px;color:rgba(255,255,255,0.25);
    letter-spacing:0.02em;
  }
</style>
</head>
<body>
  <div class="bg"></div>
  <div class="grid"></div>
  <div class="card">
    <div class="label">Senior Data Engineer · Systems Thinker · Founder</div>
    <h1>Shivam<br/><span>Chaudhary</span></h1>
    <p>8+ years building cloud-native data platforms, analytics engineering, and applied ML — from enterprise BFSI to founder-led consumer product.</p>
    <div class="chips">
      <span class="chip">GCP · BigQuery · PySpark</span>
      <span class="chip">AWS · Lambda · CDK</span>
      <span class="chip">Python · dbt · Airflow</span>
      <span class="chip">ML · Fraud · Credit Risk</span>
    </div>
  </div>
  <div class="url">shivamchaudhary.dev</div>
</body>
</html>`

const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 })
await page.setContent(html, { waitUntil: 'networkidle0' })
const buf = await page.screenshot({ type: 'jpeg', quality: 92 })
await browser.close()

writeFileSync(outPath, buf)
console.log(`✓ OG image saved → ${outPath}`)
