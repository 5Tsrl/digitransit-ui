module.exports = {
  tags: ['stops', 'search'],
  'Search for 1240 (Kamppi) and verify that the title is correct': (browser) => {
    browser.url(browser.launch_url);

    browser.page.searchFields().setSearch('1240');

    browser.page.stopCard().expectCardHeader('Fredrikinkatu 65');
    browser.page.stopCard().waitForDepartureVisible();

    browser.end();
  },
};
