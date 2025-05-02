import { Page, Locator } from "playwright";
import { CommonMethods } from "../tests/commonMethods";
import { expect } from "playwright/test";

export default class LaboratoryPage {
  private page: Page;
  private laboratoryLink: Locator;
  private laboratoryDashboard: Locator;
  private settingsSubModule: Locator;
  private addNewLabTest: Locator;
  private addButton: Locator;
  private closeButton: Locator;
  private starIcon: Locator;
  private errorMessageLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.laboratoryLink = page.locator('a[href="#/Lab"]');
    this.laboratoryDashboard = page.locator('a[href="#/Lab/Dashboard"]');
    this.settingsSubModule = page.locator('(//a[@href="#/Lab/Settings"])[2]');
    this.addNewLabTest = page.locator(
      '//a[contains(text(),"Add New Lab Test")]'
    );
    this.addButton = page.locator('//button[contains(text(),"Add")]');
    this.closeButton = page.locator('//button[contains(text(),"Close")]');
    this.starIcon = page.locator('i[title="Remember this Date"]');
    this.errorMessageLocator = page.locator(
      `//p[contains(text(),"error")]/../p[contains(text(),"Lab Test Code Required.")]`
    );
  }

  /**
   * @Test7 This method verifies the error message when attempting to add a new lab test without entering required values.
   *
   * @description Navigates to Laboratory > Settings, selects "Add New Lab Test," and clicks the Add button without
   *              providing any input. Captures and returns the displayed error message.
   * @Note Do not close "Add Lab Test" Modal
   */
  async verifyErrorMessage() {
    let errorMessageText = "";
    // Navigate to Laboratory > Settings
    await CommonMethods.highlightElement(this.laboratoryLink);
    await this.laboratoryLink.click();

    await CommonMethods.highlightElement(this.settingsSubModule);
    await this.settingsSubModule.click();

    // Click on Add New Lab Test
    await CommonMethods.highlightElement(this.addNewLabTest);
    await this.addNewLabTest.click();

    // Click on Add button without entering any values
    await CommonMethods.highlightElement(this.addButton);
    await this.addButton.click();

    // Capture the error message text
    const errorLocator = this.errorMessageLocator;
    await expect(errorLocator).toBeVisible();
    errorMessageText = (await errorLocator.textContent()) || "";
    console.log(`Error message text: ${errorMessageText}`);
  }

  /**
   * @Test12 Verifies that the tooltip associated with the star icon in the Laboratory Dashboard
   * appears on hover and logs the tooltip text.
   *
   * Steps:
   * 1. Navigates to the Laboratory module and opens the Dashboard.
   * 2. Hovers over the star icon to trigger the tooltip.
   * 3. Verifies the icon is visible.
   * 4. Retrieves and logs the tooltip text from the `title` attribute.
   *
   * @returns {Promise<void>} - This method logs tooltip visibility and text but does not return a value.
   */
  async verifyStarTooltip() {
    try {
      let tooltipText = "";
      await CommonMethods.highlightElement(this.laboratoryLink);
      await this.laboratoryLink.click();
      await CommonMethods.highlightElement(this.laboratoryDashboard);
      await this.laboratoryDashboard.click();
      await this.starIcon.hover();
      // Wait for the tooltip to appear and verify its visibility
      await expect(this.starIcon).toBeVisible();
      // Get the tooltip text
      tooltipText = (await this.starIcon.getAttribute("title")) || "";
      console.log(`Tooltip text: ${tooltipText}`);
      return true; // Ensure a value is returned
    } catch (e) {
      console.error("Error", e);
      return false;
    }
  }
}
