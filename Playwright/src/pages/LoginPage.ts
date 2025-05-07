import { expect, Locator, Page } from "@playwright/test";
import { CommonMethods } from "../tests/commonMethods";

export class LoginPage {
  readonly page: Page;
  private usernameInput: Locator;
  private passwordInput: Locator;
  private loginButton: Locator;
  private loginErrorMessage: Locator;
  private admin: Locator;
  private logOut: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator(`#username_id`);
    this.passwordInput = page.locator(`#password`);
    this.loginButton = page.locator(`#login`);
    this.loginErrorMessage = page.locator(
      `//div[contains(text(),"Invalid credentials !")]`
    );
    this.admin = page.locator('//li[@class="dropdown dropdown-user"]');
    this.logOut = page.locator("//a[text() = ' Log Out ']");
  }

  /**
   * @Test1 This method logs in the user with valid credentials.
   *
   * @description This method performs the login operation using the provided valid credentials. It highlights the input
   *              fields for better visibility during interaction and fills the username and password fields. After submitting
   *              the login form by clicking the login button, it validates the success of the login process. The login is
   *              considered successful if there are no errors.
   *
   * @param {Record<string, string>} loginData - An object containing the login credentials. It includes:
   *                                             - `ValidUserName`: The username used for login.
   *                                             - `ValidPassword`: The password used for login.
   */

  async performLogin(loginData: Record<string, string>) {
    try {
      // Highlight and fill the username field
      await CommonMethods.highlightElement(this.usernameInput);
      await this.usernameInput.fill(loginData["ValidUserName"]);

      // Highlight and fill the password field
      await CommonMethods.highlightElement(this.passwordInput);
      await this.passwordInput.fill(loginData["ValidPassword"]);

      // Highlight and click the login button
      await CommonMethods.highlightElement(this.loginButton);
      await this.loginButton.click();

      // Verify successful login by checking if 'admin' element is visible
      await this.admin.waitFor({ state: "visible", timeout: 20000 });
      expect(await this.admin.isVisible()).toBeTruthy();
    } catch (e) {
      console.error("Error during login:", e);
    }
  }

  /**
   * @Test15 Verifies the logout functionality by clicking on the user dropdown and selecting the logout option.
   *
   * @returns {Promise<void>}
   *
   * Steps:
   * 1. Click on the user dropdown to reveal the logout option.
   * 2. Click the logout (key) icon to log out the user.
   */
  async verifyLogoutFunctionality() {
    await this.page.locator('//li[contains(@class,"dropdown-user")]').click();
    await this.page.locator('//i[@class="icon-key"]/..').click();
  }
}
