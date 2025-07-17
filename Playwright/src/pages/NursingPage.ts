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
    AddTriage: Locator;
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
        "//h3[text()='Chief Complaint:']/following-sibling::div/textarea"
      ),
      updateTriage: page.locator('//button[contains(text(),"Update Triage")]'),
      AddTriage: page.locator('//button[contains(text(),"Add Triage")]'),
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

      await CommonMethods.highlightElement(this.nursing.AddTriage);
      await this.nursing.AddTriage.click();
    } catch (e) {
      console.error("Error", e);
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
  async verifyNursingCheckinForOutPatient(hospitalNumber: string) {
    await this.page.goto(
      "https://healthapp.yaksha.com/Home/Index#/Nursing/OutPatient"
    );
    await this.page.locator('//div[@id="pending"]//input[contains(@placeholder,"Hospital")]').fill(hospitalNumber);
    await this.page
      .locator('(//input[@id="checkbox_outPatient_selectAllPatients"])[1]').click();
    await this.page.locator('//button[text()="Check In"]').click();
    await this.page.locator('[value="Save"]').click();
  }
}
