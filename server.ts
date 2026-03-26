import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import * as cheerio from "cheerio";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.post("/api/analyze", async (req, res) => {
    try {
      const { companyName, batch } = req.body;
      
      if (!companyName || !batch) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // 비동기 크롤링 (Node.js의 fetch + cheerio 사용, Python의 httpx + BeautifulSoup과 동일한 역할)
      const crawlPromises = batch.map(async (coach: any) => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000); // 15초 타임아웃
          
          const response = await fetch(coach.url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
              'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
            },
            signal: controller.signal
          });
          clearTimeout(timeoutId);

          if (!response.ok) {
            return null;
          }

          const html = await response.text();
          const $ = cheerio.load(html);

          // 불필요한 요소 제거 (스크립트, 스타일 등)
          $('script, style, noscript, iframe, img, svg, video, audio').remove();

          // 텍스트 추출 및 공백 정규화
          const text = $('body').text().replace(/\s+/g, ' ');

          // 정확히 일치하는 기업명이 있는지 확인 (할루시네이션 원천 차단)
          if (text.includes(companyName)) {
            return `[${coach.name}] ${coach.url}\n지역: ${coach.region}`;
          }
          
          return null;
        } catch (error) {
          console.warn(`Crawling failed for ${coach.url}:`, error);
          return null;
        }
      });

      const crawlResults = await Promise.all(crawlPromises);
      const validCoaches = crawlResults.filter(Boolean);

      if (validCoaches.length === 0) {
        return res.json({ result: "PASS" });
      }

      res.json({ result: validCoaches.join('\n\n') });
    } catch (error: any) {
      console.error("Server API Error:", error);
      res.status(500).json({ error: error.message || String(error) });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
