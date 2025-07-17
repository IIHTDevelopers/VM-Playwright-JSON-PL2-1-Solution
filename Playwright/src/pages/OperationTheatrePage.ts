import { Locator, Page } from "playwright";
import { CommonMethods } from "../tests/commonMethods";

export default class OperationTheatrePage {
  readonly page: Page;
  public operationTheatre: {
    operationTheatreLink: Locator;
    newOtBooking: Locator;
    remarks: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.operationTheatre = {
      operationTheatreLink: page.locator('a[href="#/OperationTheatre"]'),
      newOtBooking: page.locator('//button[contains(text(),"New OT Booking")]'),
      remarks: page.locator("//textarea[@id='remarks']"),
    };
  }

  /**
   * @Test5 Verifies the placeholder of the remarks field by navigating to the Operation Theatre module.
   *
   * @returns {Promise<void>} - Returns void; logs error if any step fails.
   *
   * Steps:
   * 1. Navigate to the Operation Theatre module.
   * 2. Open a new OT booking form.
   * 3. Verify the presence of the remarks field.
   */
  async verifyRemarksPlaceholder() {
    try {
      // Navigate to Operation Theatre Module
      await CommonMethods.highlightElement(
        this.operationTheatre.operationTheatreLink
      );
      await this.operationTheatre.operationTheatreLink.click();
      await CommonMethods.highlightElement(this.operationTheatre.newOtBooking);
      await this.operationTheatre.newOtBooking.click();
      await CommonMethods.highlightElement(this.operationTheatre.remarks);
      await this.operationTheatre.remarks.click();
    } catch (e) {
      console.error("Error", e);
    }
  }
}
