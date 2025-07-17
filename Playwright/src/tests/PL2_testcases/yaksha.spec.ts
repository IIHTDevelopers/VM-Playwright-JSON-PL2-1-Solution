import { expect, test, Page } from "playwright/test";
import AppointmentPage from "../../pages/AppointmentPage";
import DispensaryPage from "../../pages/DispensaryPage";
import { LoginPage } from "../../pages/LoginPage";
import ProcurementPage from "../../pages/ProcurementPage";
import LaboratoryPage from "../../pages/LaboratoryPage";
import testData from "../../Data/testData.json";
import { SettingsPage } from "src/pages/SettingsPage";
import MaternityPage from "../../pages/MaternityPage";

// import path from "path";
import NursingPage from "../../pages/NursingPage";
import OperationTheatrePage from "src/pages/OperationTheatrePage";
import AccountingPage from "src/pages/AccountingPage";

test.describe("Yaksha", () => {
  let appointmentPage: AppointmentPage;
  let dispensaryPage: DispensaryPage;
  let procurementPage: ProcurementPage;
  let loginPage: LoginPage;
  let laboratoryPage: LaboratoryPage;
  let settingsPage: SettingsPage;
  let maternityPage: MaternityPage;
  let operationTheatrePage: OperationTheatrePage;
  let accountingPage: AccountingPage;
  let nursingPage: NursingPage;

  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(baseURL as string);

    // Initialize page objects
    loginPage = new LoginPage(page);
    appointmentPage = new AppointmentPage(page);
    dispensaryPage = new DispensaryPage(page);
    procurementPage = new ProcurementPage(page);
    laboratoryPage = new LaboratoryPage(page);
    settingsPage = new SettingsPage(page);
    maternityPage = new MaternityPage(page);
    operationTheatrePage = new OperationTheatrePage(page);
    accountingPage = new AccountingPage(page);
    nursingPage = new NursingPage(page);

    // Login before each test
    const validLoginData = {
      ValidUserName: testData.ValidLogin[0].ValidUserName as string,
      ValidPassword: testData.ValidLogin[1].ValidPassword as string,
    };
    await loginPage.performLogin(validLoginData);

    // Verify login was successful
    await verifyUserIsLoggedin(page);
  });

  // Individual test cases

  test("TS-1 Verify Maternity Allowance Payment Receipt Modal", async ({
    page,
  }) => {
    await maternityPage.verifyReceiptModal();
    await verifyPaymentReceiptVisiblity(page);
  });

  test("TS-2 Verify Error Message When Editing an Occupied Bed", async ({
    page,
  }) => {
    await settingsPage.verifyOccupiedBed();
    await verifyErrorMessage(page);
  });

  test("TS-3 Verify Male Ward Bed Count Updates After Deactivating a Bed", async ({
    page,
  }) => {
    await settingsPage.verifyMaleWard();
    await verifyBedStatusUpdated(page);
  });

  test("TS-4 Verify Add New Patient modal opens with Alt + Enter keyboard shortcut", async ({
    page,
  }) => {
    await dispensaryPage.addNewPatientUsingShortcut();
    await verifyAddNewPatient(page);
  });

  test("TS-5 Verify Remarks text field placeholder value", async ({ page }) => {
    await operationTheatrePage.verifyRemarksPlaceholder();
    await verifyPlaceholderText(page);
  });

  test("TS-6 Capture screenshot of Inventory Requisition section", async ({
    page,
  }) => {
    const bedNumber = await settingsPage.captureInventoryRequisitionSection();
    console.log(bedNumber);
    await verifyBedIsNotActive(page, bedNumber);
  });

  test("TS-7 Verify Daily Transactions Report for Fiscal Year 2023", async ({
    page,
  }) => {
    await accountingPage.verifyTable();
    await verifyTableVisibility(page);
  });

  test("TS-8 Verify Appointment Status Change After Check-in and Invoice print", async ({
    page,
  }) => {
    const hospitalNumber =
      await appointmentPage.verifyAppointmentStatusChangeAfterInvoicePrint();
    await verifyPatientExistWithHospitalNumber(page, hospitalNumber);
  });

  test("TS-9 Verify Adding Triage for an Outpatient", async ({ page }) => {
    await nursingPage.verifyAddingTriage();
    await verifyTriageUpdated(page);
  });

  test("TS-10 Verify Nursing Check-in for an Outpatient", async ({ page }) => {
    const hospitalNumber =
      await appointmentPage.verifyAppointmentStatusChangeAfterInvoicePrint();
    await nursingPage.verifyNursingCheckinForOutPatient(hospitalNumber || "");
    await verifyNursingCheckinAddedSuccessfully(page);
  });

  test("TS-11 Verify 'Morning Counter' selection and report generation for the specified date", async ({
    page,
  }) => {
    const data = {
      FromDate: testData.DateRange[0].FromDate as string,
    };
    await dispensaryPage.generateMorningCounterReport(data);
    await verifyReportGenereation(page);
  });

  test("TS-12 Verify the tooltip text on hover of Star icon in Laboratory", async ({
    page,
  }) => {
    const gotTooltip = await laboratoryPage.verifyStarTooltip();
    expect(gotTooltip).toBe(true);
  });

  test("TS-13 Add and Verify New Imaging Type in Radiology ", async ({
    page,
  }) => {
    await settingsPage.addAndVerifyNewImagingType();
    await verifyImagingTypeAdded(page);
  });

  test("TS-14 Verify Web Element Handling for Dropdowns in Purchase Request", async ({
    page,
  }) => {
    const data = {
      FromDate: testData.DateRange[0].FromDate as string,
      ToDate: testData.DateRange[1].ToDate as string,
    };
    await procurementPage.verifyRequestedDateColumnDateWithinRange(data);
    await verifyPurchaseReqDataIsPresent(page);
  });

  test("TS-15 Verify logout functionality from Admin dropdown", async ({
    page,
  }) => {
    await loginPage.verifyLogoutFunctionality();
    await verifyTheUserIsLoggedOut(page);
  });
});

// --------------------------------------------------------------------------------------------------------------------------

interface Download {
  suggestedFilename(): string;
  path(): Promise<string | null>;
}

async function verifyFileDownloaded(download: Download): Promise<void> {
  const fileName = download.suggestedFilename();
  if (!fileName.endsWith(".xls")) {
    throw new Error(`Expected .xls file but got ${fileName}`);
  }

  const filePath = await download.path();
  if (!filePath) {
    throw new Error(
      "Download path is undefined. File may not have downloaded correctly."
    );
  }

  console.log(`Verified .xls download: ${fileName}`);
}

async function verifyUserIsLoggedin(page: Page) {
  // Verify successful login by checking if 'admin' element is visible
  await page
    .locator('//li[@class="dropdown dropdown-user"]')
    .waitFor({ state: "visible", timeout: 20000 });
  expect(
    await page.locator('//li[@class="dropdown dropdown-user"]').isVisible()
  );
}

async function verifyReportGenereation(page: Page) {
  const tableLength = (await page.$$(`div[col-id="CounterName"]`)).length;
  expect(tableLength).toBeGreaterThan(1);
}

async function verifyPurchaseReqDataIsPresent(page: Page) {
  const tableData = await page.$$(
    `div[ref="eCenterContainer"] div[col-id="RequestDate"]`
  );
  expect(tableData.length).toBeGreaterThanOrEqual(1);
}

async function verifyTheUserIsLoggedOut(page: Page) {
  expect(page.url()).toContain("Account/Logout");
}

async function verifyUserIsNotLoggedin(page: Page) {
  expect(
    await page
      .locator('//div[contains(text(),"Invalid credentials !")]')
      .isVisible()
  ).toBeTruthy();
}

async function verifyVisitPageOpens(page: Page) {
  const visitPage = page.locator('//h3[contains(@class,"heading")]');
  expect(await visitPage.isVisible()).toBeTruthy();
}

async function verifyPaymentReceiptVisiblity(page: Page) {
  const receiptWindow = page.locator("//div[@id='patientprintpage']");
  expect(await receiptWindow.isVisible()).toBeTruthy();
}

async function verifyErrorMessage(page: Page) {
  const errorMessage = page.locator("//p[@class='msg-status']");
  expect(await errorMessage.isVisible()).toBeTruthy();
}

async function verifyAddNewPatient(page: Page) {
  const addNewPatient = page.locator("//div[@class='caption lb-caption']//h3");
  expect(await addNewPatient.isVisible()).toBeTruthy();
}

async function verifyPlaceholderText(page: Page) {
  const placeHolder = page.locator("//textarea[@placeholder='Remarks']");
  expect(await placeHolder.isVisible()).toBeTruthy();
}

async function verifyTableVisibility(page: Page) {
  const table = page.locator("//div[@role='grid']");
  await expect(table).toBeVisible({ timeout: 5000 });
}

async function verifyInventorySubModule(page: Page) {
  const inventory = page.locator('(//a[contains(text(),"Inventory")])[1]');
  expect(await inventory.isVisible()).toBeTruthy();
}

async function verifyPharmacySubModule(page: Page) {
  const pharmacy = page.locator('//a[contains(text(),"Pharmacy")]');
  expect(await pharmacy.isVisible()).toBeTruthy();
}

async function verifyAlert(page: Page) {
  const alert = page.locator('//p[@class="msg-status"]');
  expect(await alert.isVisible()).toBeTruthy();
}

async function verifyImagingTypeAdded(page: Page) {
  expect(page.url()).toContain("Settings/RadiologyManage/ManageImagingType");
}

async function verifyBedIsNotActive(page: Page, bedNumber: number) {
  console.log(bedNumber);

  await page
    .locator("//input[@id='quickFilterInput']")
    .fill(bedNumber.toString());
  // await page.keyboard.down('Enter');
  await page.keyboard.press("Enter");

  const isActiveCell = await page.locator(
    `//div[@col-id="BedNumber" and text()='${bedNumber}']/../div[@col-id="IsActive"]`
  );
  const isActiveValue = await isActiveCell.textContent();
  console.log(`This is the isActive Value ${isActiveValue}`);
  expect(isActiveValue).toBe("false");
}

async function verifyPatientExistWithHospitalNumber(
  page: Page,
  hospitalNumber: any
) {
  if (!hospitalNumber || typeof hospitalNumber !== "string") {
    throw new Error("Invalid or missing hospitalNumber");
  }

  await page.locator('(//a[@href="#/Appointment/PatientSearch"])[2]').click();
  await page
    .locator('[id="id_input_search_using_hospital_no"]')
    .fill(hospitalNumber);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(1000);
  const actualHospitalNumberRaw = await page
    .locator('//div[@col-id="PatientCode" and @role="gridcell"]')
    .textContent();
  const actualHospitalNumber = await actualHospitalNumberRaw?.trim();
  expect(hospitalNumber).toBe(actualHospitalNumber);
}

async function verifyNursingCheckinAddedSuccessfully(page: Page) {
  const successMessage = await page
    .locator('[class="main-message"]')
    .textContent();
  expect(successMessage).toBe("Nursing CheckIn Added Successfully");
}

async function verifyBedStatusUpdated(page: Page) {
  const successMessage = await page.locator(
    '(//p[@class="main-message" and contains(text(),"Updated")])[1]'
  );
  await expect(successMessage).toBeVisible();
}

async function verifyTriageUpdated(page: Page) {
  const successMessage = await page
    .locator('(//p[@class="msg-status"]/../p)[1]')
    .textContent();
  expect(successMessage).toContain(" success ");
}
