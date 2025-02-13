import axios from 'axios';
import * as cheerio from 'cheerio';  // Correct import for cheerio

// Fetch and parse Semantic Scholar results
const fetchSemanticScholar = async (query, maxResults = 10) => {
  const url = `https://www.semanticscholar.org/search?q=${encodeURIComponent(query)}`;
  
  try {
    // Send GET request
    const response = await axios.get(url);

    if (response.status !== 200) {
      return { error: `Failed to retrieve page, status code ${response.status}` };
    }

    // Parse HTML with Cheerio
    const $ = cheerio.load(response.data);
    const results = [];

    // Select the paper elements and extract relevant details
    $('.cl-paper-row').slice(0, maxResults).each((index, element) => {
      const title = $(element).find('.cl-paper-title').text().trim() || "No Title";
      const link = 'https://www.semanticscholar.org' + $(element).find('.link-button--show-visited').attr('href') || "No Link";
      const abstract = $(element).find('.cl-paper-abstract').text().trim() || "No Abstract";
      const authors = $(element).find('.cl-paper-authors').text().trim() || "No Authors";
      const citationCount = $(element).find('.cl-paper-stats__item .cl-paper-stats__citation-pdp-link').text().trim() || "No Citation Count";
      const year = $(element).find('.cl-paper-pubdates').text().trim() || "No Year";
      const openAccessPdf = $(element).find('.cl-paper-action__button-container .cl-paper-view-paper').attr('href') || "No PDF Link";

      results.push({
        title,
        link,
        abstract,
        authors,
        citationCount,
        year,
        openAccessPdf
      });
    });

    if (results.length === 0) {
      return { error: "No results found for the query." };
    }

    return results;

  } catch (error) {
    console.error(error);
    return { error: 'Error occurred while fetching data.' };
  }
};

export default fetchSemanticScholar;
