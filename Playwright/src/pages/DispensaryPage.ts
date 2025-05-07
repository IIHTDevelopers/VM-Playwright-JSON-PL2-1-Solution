import { Page, expect, Locator } from "@playwright/test";
import { CommonMethods } from "../tests/commonMethods";

export default class DispensaryPage {
  readonly page: Page;
  private maxRetries = 3;
  private timeoutDuration = 5000;

  public dispensary: {
    dispensaryLink: Locator;
    activateCounter: Locator;
    counterSelection: Locator;
    counterName: Locator;
    activatedCounterInfo: Locator;
    deactivateCounterButton: Locator;
    titleName: Locator;
    name: Locator;
    prescription: Locator;
    reports: Locator;
    fromDate: Locator;
    showReportButton: Locator;
    userCollectionReport: Locator;
    counterDropdown: Locator;
    counterNameFromTable: Locator;
    morningCounter: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.dispensary = {
      dispensaryLink: page.locator('a[href="#/Dispensary"]'),
      activateCounter: page.locator("//a[contains(text(),'Counter')]"),
      counterSelection: page.locator('//div[@class="counter-item"]'),
      counterName: page.locator('//div[@class="counter-item"]//h5'),
      activatedCounterInfo: page.locator(`div.mt-comment-info`),
      deactivateCounterButton: page.locator(
        `//button[contains(text(),'Deactivate Counter')]`
      ),
      titleName: page.locator('//span[@class="caption-subject"]'),
      name: page.locator('(//div[@class="col-sm-4 col-md-3"]//label//span)[1]'),
      prescription: page.locator("//a[contains(text(),' Prescription ')]"),
      reports: page.locator(`//a[contains(text(),'Reports')]`),
      fromDate: page.locator(`(//input[@id="date"])[1]`),
      showReportButton: page.locator(`//span[text()="Show Report"]`),
      userCollectionReport: page.locator(`//i[text()="User Collection"]`),
      counterDropdown: page.locator(`select#ddlCounter`),
      counterNameFromTable: page.locator(`div[col-id="CounterName"]`),
      morningCounter: page.locator('(//div[@class="counter-item"])[1]'),
    };
  }

  /**
   * @Test11 Generates the Morning Counter report in the Dispensary module by applying the "From Date"
   * filter and verifying the report contains only "Morning Counter" entries.
   *
   * Steps:
   * 1. Navigates to the Dispensary module.
   * 2. Accesses the Reports → User Collection Report section.
   * 3. Sets the "From Date" and selects "Morning Counter" from the dropdown.
   * 4. Clicks the Show Report button and waits for the report to load.
   * 5. Verifies that each row in the report corresponds to "Morning Counter".
   *
   * @param {Record<string, string>} data - An object containing key-value pairs for test data.
   *                                        Expected to include a 'FromDate' key.
   * @returns {Promise<void>} - This method performs validations but does not return a value.
   */
  async generateMorningCounterReport(data: Record<string, string>) {
    const fromDate = data["FromDate"];
    await CommonMethods.highlightElement(this.dispensary.dispensaryLink);
    await this.dispensary.dispensaryLink.click();
    await this.page.waitForTimeout(2000);
    await CommonMethods.highlightElement(this.dispensary.reports);
    await this.dispensary.reports.click();
    await CommonMethods.highlightElement(this.dispensary.userCollectionReport);
    await this.dispensary.userCollectionReport.click();
    await CommonMethods.highlightElement(this.dispensary.fromDate);
    await this.dispensary.fromDate.fill(data["FromDate"]);
    // Select 'Morning Counter' from the dropdown
    await this.dispensary.counterDropdown.selectOption({
      label: "Morning Counter",
    });
    await CommonMethods.highlightElement(this.dispensary.showReportButton);
    await this.dispensary.showReportButton.click();
    await this.page.waitForTimeout(2000);
    const counterColumn = this.dispensary.counterNameFromTable;
    for (let i = 1; i < (await counterColumn.count()); i++) {
      expect(await counterColumn.nth(i).textContent()).toEqual(
        "Morning Counter"
      );
    }
  }

  /**
   * @Test4 Adds a new patient using the keyboard shortcut (Alt + N) after navigating through the dispensary module.
   *
   * @returns {Promise<void>} - Returns void; logs error if any step fails.
   *
   * Steps:
   * 1. Navigate to the Dispensary module.
   * 2. Activate the counter for morning shift.
   * 3. Use the Alt + N keyboard shortcut to open the New Visit page for adding a new patient.
   */
  async addNewPatientUsingShortcut() {
    await CommonMethods.highlightElement(this.dispensary.dispensaryLink);
    await this.dispensary.dispensaryLink.click();
    await CommonMethods.highlightElement(this.dispensary.activateCounter);
    await this.dispensary.activateCounter.click();
    await CommonMethods.highlightElement(this.dispensary.morningCounter);
    await this.dispensary.morningCounter.click();
    await this.page.waitForTimeout(3000);
    // Trigger Alt + Enter keyboard shortcut to open the New Visit page
    await this.page.keyboard.down("Alt");
    await this.page.keyboard.press("N");
    await this.page.keyboard.up("Alt");
  }
}
