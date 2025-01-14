import { crawlerConfig as config } from '../constants';
import * as puppeteer from 'puppeteer';
import { evaluatePage } from './evaluate-page';
import {
  getAggregatedConsumedTagNames,
  getAggregatedConsumedTagNamesForVersionsAndPrefixes,
  getConsumedPrefixesForVersions,
  getRawDataWithoutVersionsAndPrefixes,
} from './helpers/convert-data-helper';
import { writeGeneralReport, writeWebsiteReport } from './helpers/fs-helper';
import { TagNameData } from './types';
import { stringifyObject } from './utils';

export const crawlWebsite = async (browser: puppeteer.Browser, websiteUrl: string): Promise<TagNameData[]> => {
  const page = await browser.newPage();
  // at least porsche finder seems to check the headers to block scrapers, setting the UA solves this
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
  );
  await page.goto(websiteUrl, {
    waitUntil: 'networkidle0',
  });

  console.log('Crawling page ' + websiteUrl);
  // getting raw data
  const pdsCrawlerRawData = await evaluatePage(page);

  // raw data in another format - without versions and prefixes
  const pdsCrawlerRawDataWithoutVersionsAndPrefixes = getRawDataWithoutVersionsAndPrefixes(pdsCrawlerRawData);
  console.log('Aggregating data for ' + page.url());
  // info about used versions and prefixes
  const consumedPdsVersionsWithPrefixes = getConsumedPrefixesForVersions(pdsCrawlerRawData);

  // aggregated data
  const aggregatedConsumedTagNamesForVersionsAndPrefixes =
    getAggregatedConsumedTagNamesForVersionsAndPrefixes(pdsCrawlerRawData);
  // aggregated data without versions and prefixes
  const aggregatedConsumedTagNames = getAggregatedConsumedTagNames(pdsCrawlerRawDataWithoutVersionsAndPrefixes);

  writeWebsiteReport(
    websiteUrl,
    stringifyObject({
      url: websiteUrl,
      consumedPdsVersionsWithPrefixes,
      consumedTagNamesForVersionsAndPrefixes: pdsCrawlerRawData,
    }),
    stringifyObject({
      url: websiteUrl,
      consumedPdsVersionsWithPrefixes,
      aggregatedConsumedTagNames,
      aggregatedConsumedTagNamesForVersionsAndPrefixes,
    })
  );

  await page.close();

  return pdsCrawlerRawDataWithoutVersionsAndPrefixes;
};
export const crawlWebsites = async (browser: puppeteer.Browser, customerWebsites: string[]): Promise<void> => {
  // data for all websites
  let generalRawData = [] as TagNameData[];

  for (const websiteUrl of customerWebsites) {
    const pdsCrawlerRawDataWithoutVersionsAndPrefixes = await crawlWebsite(browser, websiteUrl);
    // collecting data for general report (over all websites)
    generalRawData = generalRawData.concat(pdsCrawlerRawDataWithoutVersionsAndPrefixes);
  }

  console.log('Aggregating general data..');
  // creating general report (over all websites)
  const aggregatedConsumedTagNamesAllWebsites = getAggregatedConsumedTagNames(generalRawData);

  writeGeneralReport(
    stringifyObject({
      crawledWebsites: customerWebsites,
      aggregatedConsumedTagNames: aggregatedConsumedTagNamesAllWebsites,
    })
  );
};
