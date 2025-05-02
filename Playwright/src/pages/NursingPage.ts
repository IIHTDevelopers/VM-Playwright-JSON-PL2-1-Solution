import { Page, expect, Locator } from "@playwright/test";
import { CommonMethods } from "../tests/commonMethods";

export default class NursingPage {
  readonly page: Page;
  public nursing: {
    nursingLink: Locator;
    pastDays: Locator;
    fromDate: Locator;
    ok: Locator;
    editTriage: Locator;
    chiefComplaint: Locator;
    updateTriage: Locator;
    search_field: Locator;
    overview_button: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.nursing = {
      nursingLink: page.locator('a[href="#/Nursing"]'),
      pastDays: page.locator('//a[contains(text(),"Past Days")]'),
      fromDate: page.locator('(//input[@id="date"])[1]'),
      ok: page.locator('//button[@class="btn green btn-success"]'),
      editTriage: page.locator('(//a[contains(text(),"Add Triage")])[1]'),
      chiefComplaint: page.locator(
        "/html/body/my-app/div/div/div[3]/div[2]/div/div/my-app/div[2]/nursing-outpatient/div[3]/div/div/div/div[2]/div/opd-triage/div/div[2]/div[1]/div[2]/div[1]/textarea"
      ),
      updateTriage: page.locator('//button[contains(text(),"Update Triage")]'),
      overview_button: page.locator('//div//i[@title="overview"])[1]'),
      search_field: page.locator('//input[@id="quickFilterInput"]'),
    };
  }

  /**
   * @Test9 Verifies the process of adding a triage entry to the Nursing module.
   *
   * @returns {Promise<void>}
   *
   * Steps:
   * 1. Navigate to the Nursing module and select the "Past Days" option.
   * 2. Set the "From Date" field to a predefined value.
   * 3. Click the "OK" button to confirm.
   * 4. Edit a triage entry by filling in the "Chief Complaint" field with a temporary value.
   * 5. Click the "Update Triage" button to save the changes.
   */
  async verifyAddingTriage() {
    try {
      // From Date
      const data = { FromDate: "01-01-2020" };
      const fromDate = data["FromDate"];

      // Navigate to Nursing Module
      await CommonMethods.highlightElement(this.nursing.nursingLink);
      await this.nursing.nursingLink.click();

      await CommonMethods.highlightElement(this.nursing.pastDays);
      await this.nursing.pastDays.click();

      await CommonMethods.highlightElement(this.nursing.fromDate);
      await this.nursing.fromDate.type(data["FromDate"]);

      await CommonMethods.highlightElement(this.nursing.ok);
      await this.nursing.ok.click();

      await CommonMethods.highlightElement(this.nursing.editTriage);
      await this.nursing.editTriage.click();
      await this.page.waitForTimeout(2000);

      await CommonMethods.highlightElement(this.nursing.chiefComplaint);
      await this.nursing.chiefComplaint.click();
      await this.nursing.chiefComplaint.fill("Temp Value");

      await CommonMethods.highlightElement(this.nursing.updateTriage);
      await this.nursing.updateTriage.click();
    } catch (e) {
      console.error("Error", e);
    }
  }

  async overviewPastRecord() {
    try {
      await this.nursing.nursingLink.click();
      await this.nursing.pastDays.click();
      // await this.from_date.click();
      const data = { FromDate: "01-01-2020" };
      const fromDate = data["FromDate"];
      await CommonMethods.highlightElement(this.nursing.fromDate);
      await this.nursing.fromDate.type(data["FromDate"]);
      await this.page.keyboard.press("Enter"); // If there's an OK or Enter key required
      await this.nursing.search_field.fill("deepika rani");
      await this.nursing.overview_button.click();
      await this.page.waitForURL(
        "**/Nursing/PatientOverviewMain/PatientOverview"
      );
      expect(this.page.url()).toContain(
        "/Nursing/PatientOverviewMain/PatientOverview"
      );
    } catch (error) {
      console.error("Error during overview past record:", error);
      throw error;
    }
  }

  /**
   * @Test10 Verifies the process of checking in an outpatient in the Nursing module.
   *
   * @returns {Promise<void>}
   *
   * Steps:
   * 1. Navigate to the "OutPatient" section in the Nursing module.
   * 2. Select all patients using the checkbox.
   * 3. Click the "Check In" button to initiate the check-in process.
   * 4. Confirm the check-in by clicking the "Save" button.
   */
  async verifyNursingCheckinForOutPatient() {
    await this.page.goto(
      "https://healthapp.yaksha.com/Home/Index#/Nursing/OutPatient"
    );
    await this.page
      .locator('(//input[@id="checkbox_outPatient_selectAllPatients"])[1]')
      .click();
    await this.page.locator('//button[text()="Check In"]').click();
    await this.page.locator('[value="Save"]').click();
  }
}
