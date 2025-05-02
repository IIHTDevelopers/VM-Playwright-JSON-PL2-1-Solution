import { Page, expect, Locator } from "@playwright/test";
import { CommonMethods } from "../tests/commonMethods";

export default class SubStorePage {
  readonly page: Page;
  public subStore: {
    subStoreLink: Locator;
    accounts: Locator;
    pharmacy: Locator;
    inventory: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.subStore = {
      subStoreLink: page.locator('a[href="#/WardSupply"]'),
      accounts: page.locator('//i[normalize-space()="Accounts"]'),
      pharmacy: page.locator('//a[contains(text(),"Pharmacy")]'),
      inventory: page.locator('(//a[contains(text(),"Inventory")])[1]'),
    };
  }

  /**
   * @Test2 Navigates through the Substore module by sequentially clicking through its sections:
   * Substore, Accounts, Inventory, and Pharmacy.
   *
   * Steps:
   * 1. Highlights and clicks the Substore link.
   * 2. Highlights and clicks the Accounts submodule.
   * 3. Highlights and clicks the Inventory tab.
   * 4. Highlights and clicks the Pharmacy tab.
   *
   * @returns {Promise<void>} - This method does not return any value.
   */
  async verifySubstoreModule() {
    // // Navigate to Substore Module
    // await CommonMethods.highlightElement(this.subStore.subStoreLink);
    // await this.subStore.subStoreLink.click();
    // // Navigate to Account Submodule
    // await CommonMethods.highlightElement(this.subStore.accounts);
    // await this.subStore.accounts.click();
    // // Navigate to Inventory tab
    // await CommonMethods.highlightElement(this.subStore.inventory);
    // await this.subStore.inventory.click();
    // // Navigate to Pharmacy tab
    // await CommonMethods.highlightElement(this.subStore.pharmacy);
    // await this.subStore.pharmacy.click();
  }
}
