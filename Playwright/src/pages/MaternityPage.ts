import { Page, expect, Locator } from "@playwright/test";
import { CommonMethods } from "../tests/commonMethods";
import testData from "../Data/testData.json";

export default class MaternityPage {
  readonly page: Page;
  public maternity: {
    maternityLink: Locator;
    reports: Locator;
    maternityallowance: Locator;
    fromDate: Locator;
    showreport: Locator;
    viewdetails: Locator;
    star_button: Locator;
    star_button_tooltip: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.maternity = {
      maternityLink: page.locator('a[href="#/Maternity"]'),
      reports: page.locator('//a[contains(text(),"Reports")]'),
      maternityallowance: page.locator(
        'a[href="#/Maternity/Reports/MaternityAllowance"]'
      ),
      fromDate: page.locator('(//input[@id="date"])[1]'),
      showreport: page.locator('//button[@type="button"]'),
      viewdetails: page.locator('//a[contains(text(),"View Details")]'),
      star_button: page.locator('//i[@title="Remember this Date"]'),
      star_button_tooltip: page.locator("i[title='Remember this Date']"),
    };
  }

  /**
   * @Test1 Verifies the functionality of the Receipt Modal in the Maternity module by navigating through the required steps and applying filters.
   *
   * @param {Record<string, string>} data - Contains 'FromDate' to filter the report.
   *
   * Steps:
   * 1. Navigate to Maternity module and access reports.
   * 2. Filter the report based on the provided "FromDate."
   * 3. Generate the report and view details.
   *
   * @returns {Promise<void>} - Returns void; logs error if any step fails.
   */
  async verifyReceiptModal() {
    try {
      // From Date
      const fromDate = testData.DateRange[0].FromDate as string;
      await CommonMethods.highlightElement(this.maternity.maternityLink);
      await this.maternity.maternityLink.click();
      await CommonMethods.highlightElement(this.maternity.reports);
      await this.maternity.reports.click();
      await CommonMethods.highlightElement(this.maternity.maternityallowance);
      await this.maternity.maternityallowance.click();
      await CommonMethods.highlightElement(this.maternity.fromDate);
      await this.maternity.fromDate.fill(fromDate);
      await CommonMethods.highlightElement(this.maternity.showreport);
      await this.maternity.showreport.click();
      await CommonMethods.highlightElement(this.maternity.viewdetails);
      await this.maternity.viewdetails.click();
    } catch (e) {
      console.error("Error", e);
    }
  }

}
