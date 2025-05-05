import { Page, Locator } from "@playwright/test";
import { CommonMethods } from "../tests/commonMethods";

export default class PharmacyPage {
  readonly page: Page;
  public pharmacy: {
    pharmacyLink: Locator;
    order: Locator;
    export: Locator;
    search: Locator;
    itemList: Locator;
    confirmButton: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.pharmacy = {
      pharmacyLink: page.locator('a[href="#/Pharmacy"]'),
      order: page.locator('(//a[contains(text(),"Order")])[1]'),
      export: page.locator('//button[@title="Export To Excel"]'),
      search: page.locator('//input[@id="searchInput"]'),
      itemList: page.locator('//div[@class="item-list"]'),
      confirmButton: page.locator('//button[contains(text(),"Confirm")]'),
    };
  }

  /**
   * @Test1 Exports pharmacy order data by navigating through the Pharmacy and Order section,
   * then triggering a download of the export file.
   *
   * Steps:
   * 1. Highlights and clicks the Pharmacy link.
   * 2. Waits for the page to load.
   * 3. Highlights and clicks the Order link.
   * 4. Initiates the export process and waits for the file to download.
   * 5. Logs the downloaded filename.
   *
   * @returns {Promise<Download | null>} - Returns the Download object if successful, or null if an error occurs.
   */
  async exportOrderData() {
    // try {
    //   await CommonMethods.highlightElement(this.pharmacy.pharmacyLink);
    //   await this.pharmacy.pharmacyLink.click();
    //   await this.page.waitForLoadState("load");

    //   await CommonMethods.highlightElement(this.pharmacy.order);
    //   await this.pharmacy.order.click();

    //   const [download] = await Promise.all([
    //     this.page.waitForEvent("download"),
    //     this.pharmacy.export.click(),
    //   ]);

    //   console.log("Download filename: ", download.suggestedFilename());
    //   return download;
    // } catch (e) {
    //   console.error("Error during export:", e);
    return null; // Ensure a value is returned in case of an error
    // }
  }
}
