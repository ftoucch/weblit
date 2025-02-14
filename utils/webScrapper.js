import { chromium } from 'playwright';

const fetchSemanticScholar = async (query, maxResults = 10, startYear, endYear, page=1) => {
  const url = `https://www.semanticscholar.org/search?year%5B0%5D=${startYear}&year%5B1%5D=${endYear}&q=${encodeURIComponent(query)}&sort=relevance&page=${page}`;

  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    });

    console.log("Navigating to:", url);
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.cl-paper-row', { timeout: 60000 });

    const results = await page.evaluate((maxResults) => {
      const papers = [];

      document.querySelectorAll('.cl-paper-row').forEach((element, index) => {
        if (index >= maxResults) return;

        const title = element.querySelector('.cl-paper-title')?.textContent.trim() || 'No Title';
        const linkElement = element.querySelector('.link-button--show-visited');
        const url = linkElement ? 'https://www.semanticscholar.org' + linkElement.getAttribute('href') : null;

        const authors = Array.from(element.querySelectorAll('.cl-paper-authors a')).map(authorElement => ({
          authorId: authorElement.getAttribute('href')?.split('/').pop() || null,
          name: authorElement.textContent.trim() || 'Unknown Author'
        }));

        const referenceCountElement = element.querySelector('.cl-paper-stats__item .cl-paper-stats__citation-pdp-link');
        const referenceCount = referenceCountElement ? parseInt(referenceCountElement.textContent.trim(), 10) || 0 : null;

        const citationCountElement = element.querySelector('.cl-paper-stats__item .cl-paper-stats__citation-pdp-link');
        const citationCount = citationCountElement ? parseInt(citationCountElement.textContent.trim(), 10) || 0 : null;

        const yearTag = element.querySelector('.cl-paper-pubdates')?.textContent.trim() || 'No Year';
        const year = yearTag.match(/\d{4}/) ? parseInt(yearTag.match(/\d{4}/)[0]) : null;

        const openAccessPdfElement = element.querySelector('.cl-paper-action__button-container .cl-paper-view-paper');
        const openAccessPdf = openAccessPdfElement ? { url: openAccessPdfElement.getAttribute('href') } : null;

        const expandButton = element.querySelector('.more-toggle');
        if (expandButton) expandButton.click();

        const abstractElement = element.querySelector('.tldr-abstract-replacement');
        const abstract = abstractElement ? abstractElement.textContent.trim() : 'No Abstract';

        papers.push({
          title,
          abstract,
          url,
          authors,
          referenceCount,
          citationCount,
          year,
          openAccessPdf,
          filterQuery: [],
          systematicReviewId: null,
          user: null,
        });
      });

      return papers;
    }, maxResults);

    await browser.close();
    return results.length > 0 ? results : { error: 'No results found for the query.' };
  } catch (error) {
    console.error('Error occurred:', error);
    return { error: 'Error occurred while fetching data.' };
  }
};

export default fetchSemanticScholar;
