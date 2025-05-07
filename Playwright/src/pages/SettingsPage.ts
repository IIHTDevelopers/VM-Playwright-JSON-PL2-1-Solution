import { expect, Locator, Page } from "@playwright/test";
import { CommonMethods } from "src/tests/commonMethods";

export class SettingsPage {
  readonly page: Page;
  private settingsLink: Locator;
  private radiologySubmodule: Locator;
  private addImagingTypeButton: Locator;
  private imagingItemNameField: Locator;
  private addButton: Locator;
  private searchBar: Locator;
  private adt: Locator;
  private manageBed: Locator;
  private occupiedEdit: Locator;
  private availableEdit: Locator;
  private helpDeskLink: Locator;
  private isActive: Locator;
  private update: Locator;
  private maleWard: Locator;
  private addBedButton: Locator;
  private wardSelectDropdown: Locator;
  private bedFeaturesDropdown: Locator;
  private saveButton: Locator;
  private bedNumberField: Locator;
  private lastpage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.settingsLink = page.locator('a[href="#/Settings"]');
    this.radiologySubmodule = page.locator(
      `//a[@href="#/Settings/RadiologyManage" and contains(text(),'Radiology')]`
    );
    this.addImagingTypeButton = page.locator(`//a[text()="Add Imaging Type"]`);
    this.imagingItemNameField = page.locator(`input#ImagingTypeName`);
    this.addButton = page.locator(`input#addBtn`);
    this.searchBar = page.locator(`input#quickFilterInput`);
    this.adt = page.locator('//a[contains(text(),"ADT")]');
    this.manageBed = page.locator('a[href="#/Settings/ADTManage/ManageBed"]');
    this.availableEdit = page
      .locator(
        '(//span[text()="Available"]/../..//a[contains(text(), "Edit")])[1] | (//span[text()="N/A"]/../..//a[contains(text(), "Edit")])[1]'
      )
      .first();
    this.occupiedEdit = page.locator(
      '(//span[text()="Occupied"]/../..//a[contains(text(), "Edit")])[1]'
    );
    this.helpDeskLink = page.locator('[href="#/Helpdesk"]');
    this.isActive = page.locator(
      '//label[@class="mt-checkbox mt-checkbox-outline"]//span'
    );
    this.update = page.locator('//input[@value="Update"]');
    this.maleWard = page.locator('//td[normalize-space()="10"]');
    this.addBedButton = page.locator('//a[text()="Add Bed"]');
    this.wardSelectDropdown = page.locator('[formcontrolname="WardId"]');
    this.bedFeaturesDropdown = page.locator(
      '[value-property-name="BedFeatureId"]'
    );
    this.saveButton = page.locator('[value="Add"]');
    this.bedNumberField = page.locator('[id="BedNumber"]');
    this.lastpage = page.locator('//button[normalize-space()="Last"]');
  }

  /**
   * @Test13 This method automates the process of creating a new imaging type in the Radiology section of the Settings module.
   *
   * @description This function performs the following actions:
   *              1. Navigates to the Settings module and clicks on the Radiology submodule.
   *              2. Clicks on the "Add Imaging Type" button to open the modal for adding a new imaging type.
   *              3. Fills the "Imaging Item Name" field with a random name (Test-{random4digitnumber}) and clicks "Add".
   *              4. Verifies that the newly added imaging type appears in the list of imaging types.
   */
  async addAndVerifyNewImagingType() {
    // Navigate to Settings module and click on Radiology submodule
    await CommonMethods.highlightElement(this.settingsLink);
    await this.settingsLink.click();

    await CommonMethods.highlightElement(this.radiologySubmodule);
    await this.radiologySubmodule.click();
    await this.page.waitForTimeout(2000);

    // Click on Add Imaging Type button to open the modal
    await CommonMethods.highlightElement(this.addImagingTypeButton);
    await this.addImagingTypeButton.click();

    // Generate a random Imaging Item Name (Test-{random4digitnumber})
    const randomImagingName = `Test-${Math.floor(1000 + Math.random() * 9000)}`;

    // Fill the Imaging Item Name field and click Add
    await CommonMethods.highlightElement(this.imagingItemNameField);
    await this.imagingItemNameField.fill(randomImagingName);

    await CommonMethods.highlightElement(this.addButton);
    await this.addButton.click();

    // Wait for the new imaging type to appear in the list
    await this.page.waitForTimeout(3000);

    await this.searchBar.fill(randomImagingName);
    await this.page.keyboard.press("Enter");
    await this.page.waitForTimeout(2000);

    // Verify the newly created Imaging Type is displayed in the list
    const isNewImagingTypeVisible = await this.page
      .locator(`//div[text()="${randomImagingName}"]`)
      .isVisible();
    expect(isNewImagingTypeVisible).toBeTruthy();
  }

  /**
   * @Test6 Adds a new bed with a random bed number in the ADT Manage Ward section and verifies if the "Is Active" status is set.
   *
   * @returns {Promise<number>} - Returns the randomly generated bed number after saving.
   *
   * Steps:
   * 1. Generate a random bed number.
   * 2. Navigate to the ADT Manage Ward section.
   * 3. Click 'Manage Bed' and then 'Add Bed'.
   * 4. Select a ward, fill in the bed number, and choose bed features using keyboard navigation.
   * 5. Enable 'Is Active' and save the bed.
   * 6. Retrieve and verify the 'Is Active' cell value using the generated bed number.
   */
  async captureInventoryRequisitionSection() {
    const randomBedNumber = Math.floor(Math.random() * 100000) + 1;
    await this.page.goto(
      "https://healthapp.yaksha.com/Home/Index#/Settings/ADTManage/ManageWard"
    );
    await this.manageBed.click();
    await this.addBedButton.click();
    await this.wardSelectDropdown.selectOption("1");
    await this.bedNumberField.fill(`${randomBedNumber}`);
    await this.bedFeaturesDropdown.click();
    await this.page.keyboard.press("ArrowDown");
    await this.page.keyboard.press("ArrowDown");
    await this.page.keyboard.press("Enter");
    await CommonMethods.highlightElement(this.isActive);
    await this.isActive.click();
    await this.saveButton.click();
    return randomBedNumber;
  }

  /**
   * @Test2 Verifies the functionality of navigating through the bed management settings and editing an occupied bed.
   *
   * @returns {Promise<void>} - Returns void; logs error if any step fails.
   *
   * Steps:
   * 1. Navigate to settings.
   * 2. Access ADT (Admission, Discharge, Transfer) module.
   * 3. Manage beds and select the bed to edit.
   */
  async verifyOccupiedBed() {
    await CommonMethods.highlightElement(this.settingsLink);
    await this.settingsLink.click();
    await CommonMethods.highlightElement(this.adt);
    await this.adt.click();
    await CommonMethods.highlightElement(this.manageBed);
    await this.manageBed.click();
    await CommonMethods.highlightElement(this.occupiedEdit);
    await this.occupiedEdit.click();
  }

  /**
   * @Test3 Verifies the Male Ward functionality by activating a bed through the ADT module and then checking the Male Ward listing.
   *
   * @returns {Promise<void>}
   *
   * Steps:
   * 1. Navigate to Help Desk (initial step, potentially to ensure user is on the correct landing page).
   * 2. Navigate to Settings → ADT → Manage Bed.
   * 3. Edit a bed record, activate it via checkbox, and update the record.
   * 4. Navigate back to Help Desk.
   * 5. Click on Male Ward to verify updated status.
   */
  async verifyMaleWard() {
    //Navigate to Settings Link
    await CommonMethods.highlightElement(this.settingsLink);
    await this.settingsLink.click();

    //Navigate to ADT submodule
    await CommonMethods.highlightElement(this.adt);
    await this.adt.click();

    await CommonMethods.highlightElement(this.manageBed);
    await this.manageBed.click();

    await CommonMethods.highlightElement(this.lastpage);
    await this.lastpage.click();

    //Click on edit
    await CommonMethods.highlightElement(this.availableEdit);
    await this.availableEdit.click();

    //Click the checkbox
    await CommonMethods.highlightElement(this.isActive);
    await this.isActive.click();

    //Click on Update
    await CommonMethods.highlightElement(this.update);
    await this.update.click();

    /*

    await CommonMethods.highlightElement(this.helpDeskLink);
    await this.helpDeskLink.click();

    await CommonMethods.highlightElement(this.maleWard);
    await this.maleWard.click();*/
  }
}
