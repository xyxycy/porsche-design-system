import type { ElementHandle, Page } from 'puppeteer';
import { baseURL, getConsoleErrorsAmount, initConsoleObserver } from '../helpers';
import { config as STOREFRONT_CONFIG } from '../../../storefront.config';
import { paramCase } from 'change-case';
import * as path from 'path';
import * as fs from 'fs';

const console = require('console'); // workaround for nicer logs
let browserPage: Page;

// style overrides for css variables
const styleOverrides = fs.readFileSync(
  path.resolve(require.resolve('@porsche-design-system/shared'), '../css/styles.css'),
  'utf8'
);
const [, rootStyles] = /(:root {[\s\S]+?})/.exec(styleOverrides) || [];

beforeEach(async () => {
  browserPage = await browser.newPage();
  initConsoleObserver(browserPage);

  await browserPage.goto(baseURL);
  await injectCSSOverrides();
  await browserPage.evaluate(() => (window as any).componentsReady());
});
afterEach(async () => await browserPage.close());

const injectCSSOverrides = async () => {
  // inject style overrides for css variables to override transition duration of accordion
  await page.evaluate((styles) => {
    const styleEl = document.createElement('style');
    styleEl.innerText = styles;
    document.head.append(styleEl);
  }, rootStyles);
};

const isTabActive = (element: ElementHandle<HTMLElement> | null): Promise<boolean> => {
  return element.evaluate((el) => el.className.includes('router-link-active'));
};

const isLinkActive = (element: ElementHandle<HTMLElement> | null): Promise<boolean> => {
  return element.evaluate((el) => el.active);
};

const waitForHeading = async (page: Page): Promise<ElementHandle<HTMLElement>> => {
  const headingElementHandle = (await page.waitForSelector('main .vmark > h1')) as ElementHandle<HTMLElement>;
  // NOTE: sometimes h1 or p-heading is rendered empty for whatever reason 🤷‍
  await page.waitForFunction((headingEl) => headingEl.innerText !== '', undefined, headingElementHandle);
  return headingElementHandle;
};

const getHeadingText = async (page: Page): Promise<string> => {
  const headingElementHandle = await waitForHeading(page);
  return headingElementHandle.evaluate((headingEl) => headingEl.innerText);
};

const hasPageObjectObject = (page: Page): Promise<boolean> => {
  return page.evaluate(() => document.body.innerText.includes('[object Object]'));
};

// transform STOREFRONT_CONFIG into tuple array with structure [category, page, tab, isFirst][]
const cases: [string, string, string | undefined, boolean][] = Object.entries(STOREFRONT_CONFIG)
  // .filter((_, i) => i < 2) // NOTE: for easier debugging and testing
  .map(([category, pages]) =>
    Object.entries(pages)
      .map<[string, string, string | undefined, boolean][]>(([page, tabs]) =>
        typeof tabs === 'object' && !Array.isArray(tabs)
          ? Object.keys(tabs).map((tab, i) => [category, page, tab, i === 0])
          : [[category, page, undefined, false]]
      )
      .flat()
  )
  .flat();

it.each<[string, string, string, string | undefined, boolean]>(
  cases.map((segments) => [segments.filter((segment) => typeof segment === 'string').join(' > '), ...segments])
  // .filter((_, i) => i < 20) // NOTE: for easier debugging and testing
)('should navigate to "%s" and have correct heading', async (_, category, page, tab, isFirst) => {
  const caseIndex = cases.findIndex(
    ([itemCategory, itemPage, itemTab]) => itemCategory === category && itemPage === page && itemTab === tab
  );
  const humanCaseIndex = caseIndex + 1;
  const counter = `${Array.from(Array(cases.length.toString().length - humanCaseIndex.toString().length))
    .map(() => ' ') // add leading spaces if needed for nice formatting
    .join('')}${humanCaseIndex}/${cases.length}`;
  console.log(`${counter}: ${[category, page, tab].filter(Boolean).join(' > ')}`);

  const [accordionElement] = (await browserPage.$x(
    `//div[contains(@class, 'menu-desktop')]//nav/p-accordion[@heading='${category}']`
  )) as ElementHandle<HTMLElement>[];
  await accordionElement.click();
  await browserPage.waitForFunction(
    (el) => getComputedStyle(el.shadowRoot.querySelector('.collapsible')).visibility === 'visible',
    undefined,
    accordionElement
  );

  // reconstruct href of p-link-pure in sidebar
  // for first tab it is correct
  // for other tabs we need to use first tab
  // for everything else there is no tab url
  const firstOrNoTab =
    tab &&
    (isFirst
      ? tab
      : cases.find(([itemCategory, itemPage, itemTab]) => itemCategory === category && itemPage === page)[2]);
  const linkPureHref = `/${[category, page, firstOrNoTab]
    .filter(Boolean)
    .map((part) => paramCase(part))
    .join('/')}`;
  const [linkPureElement] = (await browserPage.$x(
    `//div[contains(@class, 'menu-desktop')]//nav//p-link-pure/a[contains(., '${page}')][@href='${linkPureHref}']/parent::p-link-pure`
  )) as ElementHandle<HTMLElement>[];
  expect(await isLinkActive(linkPureElement), 'sidebar link should not be active initially').toBe(false);

  // NOTE: very flaky and potential timeout here 🤷‍
  await Promise.all([browserPage.waitForNavigation(), linkPureElement.click()]);

  // wait for p-heading and p-tabs-bar to be ready
  const mainElementHandle = await browserPage.$('main');
  await mainElementHandle.evaluate((el) => (window as any).componentsReady(el));

  await waitForHeading(browserPage);
  await browserPage.waitForFunction((el) => el.active, undefined, linkPureElement);
  expect(await isLinkActive(linkPureElement), 'sidebar link should be active after click').toBe(true);

  const headingRegEx = new RegExp(`^${page}( 🚫| 🧪)?$`); // to cover deprecated and experimental icon
  expect(await getHeadingText(browserPage), 'should show correct main title for page').toMatch(headingRegEx);
  expect(await hasPageObjectObject(browserPage), 'should not contain [object Object] on page').toBe(false);
  expect(getConsoleErrorsAmount(), `Errors on ${category}/${page}`).toBe(0);

  if (tab) {
    const tabHref = `\/${paramCase(category)}\/${paramCase(page)}\/${paramCase(tab)}`;
    const [tabElement] = (await browserPage.$x(
      `//p-tabs-bar//a[contains(., '${tab}')][@href='${tabHref}']`
    )) as ElementHandle<HTMLElement>[];

    const isTabElementActiveInitially = await isTabActive(tabElement);
    if (isFirst) {
      expect(isTabElementActiveInitially, 'should have first tab active initially').toBe(true);
      // heading of first is already checked before
    } else {
      expect(isTabElementActiveInitially, 'should not have tab active initially').toBe(false);
      // we need to switch tabs, e.g. to "Usage" or "Props" for components

      await Promise.all([browserPage.waitForNavigation(), tabElement.click()]);

      expect(await isTabActive(tabElement), 'should have tab active after click').toBe(true);
      expect(await isLinkActive(linkPureElement), 'sidebar link should still be active after click').toBe(true);

      await waitForHeading(browserPage);
      expect(await getHeadingText(browserPage), 'should show correct main title for tab page').toMatch(headingRegEx);
      expect(await hasPageObjectObject(browserPage), 'should not contain [object Object] on tab page').toBe(false);
      expect(getConsoleErrorsAmount(), `Errors on ${category}/${page} in tab ${tab}`).toBe(0);
    }
  }
});
