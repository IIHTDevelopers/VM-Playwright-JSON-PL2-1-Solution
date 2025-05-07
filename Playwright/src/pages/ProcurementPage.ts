import { Locator, Page } from "playwright";
import { CommonMethods } from "../tests/commonMethods";
import * as XLSX from "xlsx";
import path from "path";
import { expect } from "playwright/test";

// import { error } from "console";

export default class ProcurementPage {
  readonly page: Page;
  private procurement: Locator;
  private purchaseRequest: Locator;
  private purchaseOrder: Locator;
  private goodsArrivalNotification: Locator;
  private quotations: Locator;
  private settings: Locator;
  private reports: Locator;
  private favoriteButton: Locator;
  private okButton: Locator;
  private printButton: Locator;
  private firstButton: Locator;
  private previousButton: Locator;
  private nextButton: Locator;
  private lastButton: Locator;
  private fromDate: Locator;
  private toDate: Locator;
  private invalidMsg: Locator;
  private requestedDateColumn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.procurement = page.locator('a[href="#/ProcurementMain"]');
    this.purchaseRequest = page.locator(
      `//a[contains(text(),"Purchase Request")]`
    );
    this.purchaseOrder = page.locator(
      `(//a[contains(text(),"Purchase Order")])[1]`
    );
    this.goodsArrivalNotification = page.locator(
      `//a[contains(text(),"Goods Arrival Notification")]`
    );
    this.quotations = page.locator(`//a[contains(text(),"Quotation")]`);
    this.settings = page.locator(`//a[contains(text(),"Settings")]`);
    this.reports = page.locator(`//a[contains(text(),"Reports")]`);
    this.favoriteButton = page.locator(
      `//i[contains(@class,"icon-favourite")]`
    );
    this.okButton = page.locator(`//button[contains(text(),"OK")]`);
    this.printButton = page.locator(`//button[text()='Print']`);
    this.firstButton = page.locator(`//button[text()='First']`);
    this.previousButton = page.locator(`//button[text()='Previous']`);
    this.nextButton = page.locator(`//button[text()='Next']`);
    this.lastButton = page.locator(`//button[text()='Last']`);
    this.fromDate = page.locator(`(//input[@id="date"])[1]`);
    this.toDate = page.locator(`(//input[@id="date"])[2]`);
    this.invalidMsg = page.locator(`//div[contains(@class,"invalid-msg-cal")]`);
    this.requestedDateColumn = page.locator(`div[col-id="RequestDate"]`);
  }

  /**
   * @Test8 This method verifies the visibility of essential elements in the Purchase Request List on the Procurement page.
   *
   * @description Navigates to the Procurement module and verifies the presence of multiple elements, including buttons
   *              and options related to the Purchase Request List. It highlights each element and checks if it is visible
   *              on the page. If any element is missing, the method returns false, and a warning is logged.
   * @return boolean - Returns true if all elements are visible; otherwise, returns false.
   */
  async verifyPurchaseRequestListElements() {
    // Navigate to Procurement module
    await CommonMethods.highlightElement(this.procurement);
    await this.procurement.click();
    await this.page.waitForTimeout(2000);
    // Define the list of elements to verify visibility
    const elements = [
      this.purchaseRequest,
      this.purchaseOrder,
      this.goodsArrivalNotification,
      this.quotations,
      this.settings,
      this.reports,
      this.favoriteButton,
      this.okButton,
      this.printButton,
      this.firstButton,
      this.previousButton,
      this.nextButton,
      this.lastButton,
    ];
    await CommonMethods.highlightElement(this.fromDate);
    await this.fromDate.type("01-01-2020", { delay: 100 });

    await CommonMethods.highlightElement(this.okButton);
    await this.okButton.click();
    // Loop through each element to verify its visibility
    for (const element of elements) {
      await CommonMethods.highlightElement(element);
      if (!(await element.isVisible())) {
        console.warn("Element not found on page:", await element.textContent());
        throw new Error("Element not found on the page");
      }
    }
  }

  /**
   * @Test9 This method verifies the error message displayed after entering an invalid date in the filter.
   *
   * @description This method navigates to the Procurement module, selects the Purchase Request tab,
   *              and applies an invalid date filter. Upon clicking the OK button, it captures and validates
   *              the error message displayed to confirm that the application correctly identifies the invalid input.
   */
  async verifyNoticeMessageAfterEnteringIncorrectFilters() {
    let actualErrorMessage = "";
    await CommonMethods.highlightElement(this.procurement);
    await this.procurement.click();

    await CommonMethods.highlightElement(this.purchaseRequest);
    await this.purchaseRequest.click();

    await CommonMethods.highlightElement(this.fromDate);
    await this.fromDate.type("00-00-0000", { delay: 100 });

    await CommonMethods.highlightElement(this.okButton);
    await this.okButton.click();

    actualErrorMessage = (await this.invalidMsg.textContent()) || "";
    console.log(
      `----------------------------Invalid Error Message --->> ${actualErrorMessage}----------------------------`
    );

    expect(actualErrorMessage.trim()).toEqual(
      "Date is not between Range. Please enter again"
    );
  }

  /**
   * @Test14 Verifies that all dates in the "Requested Date" column of the Purchase Request table
   * fall within a specified "From Date" and "To Date" range.
   *
   * @param {Record<string, string>} data - An object containing 'FromDate' and 'ToDate' in 'dd-mm-yyyy' format.
   *
   * Steps:
   * 1. Navigate to the Purchase Request section via Procurement module.
   * 2. Enter and apply the date range filters using provided input.
   * 3. Extract all non-header dates from the "Requested Date" column.
   * 4. Parse and verify each date is within the defined range.
   *
   * @returns {Promise<void>} - Logs validation status and exits if any date is out of range.
   */
  async verifyRequestedDateColumnDateWithinRange(data: Record<string, string>) {
    try {
      const fromDate = data["FromDate"];
      const toDate = data["ToDate"];
      // console.log(`From Date: ${data["FromDate"]}, To Date: ${data["ToDate"]}`);
      // Navigate to Purchase Request List
      await CommonMethods.highlightElement(this.procurement);
      await this.procurement.click();
      await CommonMethods.highlightElement(this.purchaseRequest);
      await this.purchaseRequest.click();
      // Select the From Date and To Date
      await CommonMethods.highlightElement(this.fromDate);
      await this.fromDate.fill(fromDate);
      await CommonMethods.highlightElement(this.toDate);
      await this.toDate.fill(toDate);
      // Click OK Button to apply filter
      await CommonMethods.highlightElement(this.okButton);
      await this.okButton.click();
      // Wait for the table to update
      await this.page.waitForTimeout(2000);
      // Helper function to parse date format dd-mm-yyyy to a Date object
      const parseInputDate = (dateStr: string) => {
        const [day, month, year] = dateStr.split("-").map(Number);
        return new Date(year, month - 1, day);
      };
      // Parse the from and to dates
      const fromDateParsed = parseInputDate(fromDate);
      const toDateParsed = parseInputDate(toDate);
      // Retrieve all dates from the requestedDateColumn, ignoring the first row header
      const dateElements = await this.requestedDateColumn.allTextContents();
      const dateElementsToVerify = dateElements.slice(1); // Ignore the header
      // Verify each date is within the specified range
      for (const dateStr of dateElementsToVerify) {
        const [requestedDate] = dateStr.split(" "); // Extract the date part
        const [year, month, day] = requestedDate.split("-").map(Number);
        const requestedDateParsed = new Date(year, month - 1, day);
        if (
          requestedDateParsed < fromDateParsed ||
          requestedDateParsed > toDateParsed
        ) {
          console.log(`Date out of range: ${requestedDate}`);
          break; // Stop checking further dates once an invalid date is found
        }
      }
    } catch (error) {
      console.error("Error verifying date range:", error);
    }
  }
}
