import { Page, expect, Locator } from "@playwright/test";
import { CommonMethods } from "../tests/commonMethods";

export default class AccountingPage {
  readonly page: Page;
  public accounting: {
    accountingLink: Locator;
    reports: Locator;
    dailyTransaction: Locator;
    fiscalYear: Locator;
    load: Locator;
    settings: Locator;
    searchBar: Locator;
    activate: Locator;
    deactivate: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.accounting = {
      accountingLink: page.locator('a[href="#/Accounting"]'),
      reports: page.locator('//a[contains(text(),"Reports")]'),
      dailyTransaction: page.locator(
        'a[href="#/Accounting/Reports/DailyTransactionReport"]'
      ),
      fiscalYear: page.locator("//select"),
      load: page.locator('//button[@type="button"]'),
      settings: page.locator('//a[contains(text(),"Settings")]'),
      searchBar: page.locator('//input[@id="quickFilterInput"]'),
      activate: page.locator('//a[text()="Activate"]'),
      deactivate: page.locator("//a[text() ='Deactivate']"),
    };
  }

  /**
   * @Test7 Verifies the daily transaction report table by navigating through the accounting module and loading the report for a specified fiscal year.
   *
   * @param {Record<string, string>} data - The input data containing the fiscal year to be used for loading the report.
   * @returns {Promise<void>} - Returns void; logs error if any step fails.
   *
   * Steps:
   * 1. Navigate to the Accounting module.
   * 2. Open the Reports section and select the Daily Transaction report.
   * 3. Set the Fiscal Year field to the specified year and load the report.
   */
  async verifyTable() {
    try {
      const data = { FiscalYear: "2023" };
      await CommonMethods.highlightElement(this.accounting.accountingLink);
      await this.accounting.accountingLink.click();
      await this.page.waitForLoadState("load");
      await this.page.waitForTimeout(2000);
      await CommonMethods.highlightElement(this.accounting.reports);
      await this.accounting.reports.click();
      await this.page.waitForLoadState("load");
      await this.page.waitForTimeout(2000);
      await CommonMethods.highlightElement(this.accounting.dailyTransaction);
      await this.accounting.dailyTransaction.click();
      await CommonMethods.highlightElement(this.accounting.fiscalYear);
      await this.accounting.fiscalYear.click();
      await this.accounting.fiscalYear.type(data["FiscalYear"], { delay: 100 });
      await this.page.waitForLoadState("load");
      await this.page.waitForTimeout(2000);
      await CommonMethods.highlightElement(this.accounting.load);
      await this.accounting.load.click();
    } catch (e) {
      console.error("Error", e);
    }
  }
}
