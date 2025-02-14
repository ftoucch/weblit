import { chromium } from 'playwright';

const fetchSemanticScholar = async (query, maxResults = 10, startYear, endYear) => {
  const results = [];
  let currentPage = 1;

  while (results.length < maxResults) {
    let browser;
    let page;

    try {
      console.log(`\n=== Fetching Page ${currentPage} ===`);

      // Launch a new browser instance for each page
      browser = await chromium.launch({ headless: true });
      page = await browser.newPage();

      await page.setExtraHTTPHeaders({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      });

      const url = `https://www.semanticscholar.org/search?year%5B0%5D=${startYear}&year%5B1%5D=${endYear}&q=${encodeURIComponent(query)}&sort=relevance&page=${currentPage}`;
      
      console.log("Navigating to:", url);
      await page.goto(url, { waitUntil: 'networkidle' });

      // Wait for content to load with retry mechanism
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          await page.waitForFunction(() => {
            return document.querySelectorAll('.cl-paper-row').length > 0;
          }, { timeout: 60000 }); // 60 seconds timeout
          break;
        } catch (error) {
          attempts++;
          console.error(`Attempt ${attempts} failed: ${error.message}`);
          if (attempts >= maxAttempts) throw new Error('Max retry attempts reached.');
          await page.reload({ waitUntil: 'networkidle' }); // Reload the page and try again
        }
      }

      const pageResults = await page.evaluate(() => {
        const papers = [];
        document.querySelectorAll('.cl-paper-row').forEach((element) => {
          const title = element.querySelector('.cl-paper-title')?.textContent.trim() || 'No Title';
          const linkElement = element.querySelector('.link-button--show-visited');
          const url = linkElement ? 'https://www.semanticscholar.org' + linkElement.getAttribute('href') : null;
          const authors = Array.from(element.querySelectorAll('.cl-paper-authors a')).map(authorElement => ({
            authorId: authorElement.getAttribute('href')?.split('/').pop() || null,
            name: authorElement.textContent.trim() || 'Unknown Author'
          }));
          const yearTag = element.querySelector('.cl-paper-pubdates')?.textContent.trim() || 'No Year';
          const year = yearTag.match(/\d{4}/) ? parseInt(yearTag.match(/\d{4}/)[0]) : null;
          const abstractElement = element.querySelector('.tldr-abstract-replacement');
          const abstract = abstractElement ? abstractElement.textContent.trim() : 'No Abstract';
          const referenceCountElement = element.querySelector('.cl-paper-stats__item .cl-paper-stats__citation-pdp-link');
          const referenceCount = referenceCountElement ? parseInt(referenceCountElement.textContent.trim(), 10) || 0 : null;

          const citationCountElement = element.querySelector('.cl-paper-stats__item .cl-paper-stats__citation-pdp-link');
          const citationCount = citationCountElement ? parseInt(citationCountElement.textContent.trim(), 10) || 0 : null;

          const openAccessPdfElement = element.querySelector('.cl-paper-action__button-container .cl-paper-view-paper');
          const openAccessPdf = openAccessPdfElement ? { url: openAccessPdfElement.getAttribute('href') } : null;

          papers.push({ title, abstract, url, authors, year });
          papers.push({
            title,
            abstract,
            url,
            authors,
            referenceCount,
            citationCount,
            year,
            openAccessPdf,
          });
        });

        return papers;
      });

      results.push(...pageResults);

      console.log(`Fetched ${pageResults.length} results from Page ${currentPage}`);

      // Close the browser
      await browser.close();
      console.log("Browser closed. Waiting 5 seconds before fetching the next page...\n");

      // Wait 5 seconds before opening a new browser for the next page
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Exit if max results are collected
      if (results.length >= maxResults || pageResults.length === 0) break;

      // Move to the next page
      currentPage++;
    } catch (error) {
      console.error('Error occurred:', error);
      if (browser) await browser.close();
      break; // Exit loop on failure
    }
  }

  return results.slice(0, maxResults);
};

export default fetchSemanticScholar;
