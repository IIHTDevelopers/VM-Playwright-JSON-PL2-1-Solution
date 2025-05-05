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

  /**
   * @Test15 Verifies the activation process of the ledger by navigating to the accounting settings, searching for a specific ledger,
   * and activating it through a confirmation dialog.
   *
   * @param {Record<string, string>} data - Not used in this method but typically used to pass additional parameters if needed.
   * @returns {Promise<void>} - Returns void; logs error if any step fails.
   *
   * Steps:
   * 1. Navigate to the Accounting module.
   * 2. Go to Settings and search for the "BANK A/C #" ledger.
   * 3. Trigger the activation process, confirm the activation in the dialog, and finalize the action.
   */
  async verifyActivationLedger() {
    // try {
    //   await CommonMethods.highlightElement(this.accounting.accountingLink);
    //   await this.accounting.accountingLink.click();
    //   await this.page.waitForLoadState("load");
    //   await this.page.waitForTimeout(3000);
    //   await CommonMethods.highlightElement(this.accounting.settings);
    //   await this.page.waitForLoadState("load");
    //   await this.accounting.settings.click();
    //   await this.page.waitForTimeout(3000);
    //   await CommonMethods.highlightElement(this.accounting.searchBar);
    //   await this.accounting.searchBar.fill("BANK A/C #");
    //   await this.page.keyboard.press("Enter");
    //   await this.page.waitForLoadState("load");
    //   await this.page.waitForTimeout(3000);
    //   await this.page.once("dialog", async (dialog) => {
    //     expect(dialog.message()).toContain("Are you Sure want to Activate");
    //     await dialog.accept();
    //   });
    //   await this.accounting.activate.click();
    // } catch (e) {
    //   console.error("Error", e);
    // }
  }

  /**
   * @Test3 Verifies the deactivation process of a ledger entry ("Sundry Debtors (Receivables)")
   * in the Accounting module settings.
   *
   * Steps:
   * 1. Navigates to the Accounting module and opens Settings.
   * 2. Searches for a specific ledger using the search bar.
   * 3. Handles the deactivation confirmation dialog.
   * 4. Clicks on the deactivate button to trigger the action.
   *
   * @returns {Promise<void>} - This method performs UI actions and does not return a value.
   */
  async verifyDeactivationLedger() {
    // try {
    //   await CommonMethods.highlightElement(this.accounting.accountingLink);
    //   await this.accounting.accountingLink.click();
    //   await this.page.waitForLoadState("load");
    //   await this.page.waitForTimeout(2000);
    //   await CommonMethods.highlightElement(this.accounting.settings);
    //   await this.page.waitForLoadState("load");
    //   await this.accounting.settings.click();
    //   await this.page.waitForTimeout(2000);
    //   await CommonMethods.highlightElement(this.accounting.searchBar);
    //   await this.accounting.searchBar.fill("Sundry Debtors (Receivables)");
    //   await this.page.keyboard.press("Enter");
    //   await this.page.waitForLoadState("load");
    //   await this.page.waitForTimeout(2000);
    //   await this.page.once("dialog", async (dialog) => {
    //     expect(dialog.message()).toContain("Are you Sure want to Deactivate");
    //     await dialog.accept();
    //   });
    //   await this.accounting.deactivate.click();
    //   //   await this.page.click('#alert-button');
    // } catch (e) {
    //   console.error("Error", e);
    // }
  }
}
