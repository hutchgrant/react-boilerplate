const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  await page.close();
});

test('the header has the correct text', async () => {
  const text = await page.getContentsOf('a.navbar-brand');
  expect(text).toEqual('React Boilerplate');
});

test('clicking login start oauth flow', async () => {
  await page.click('a[href="/user/login"');
  await page.waitFor('a[href="/auth/google"]');
  await page.click('a[href="/auth/google"');

  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
});

test('When signed in as user, shows user menu', async () => {
  await page.loginAsUser();

  const text = await page.getContentsOf(
    '.dropdown-menu a[href="/user/dashboard"]'
  );
  expect(text).toEqual('Dashboard');
});

test('When signed in as Admin, shows admin menu option', async () => {
  await page.loginAsAdmin();

  const text = await page.getContentsOf(
    '.dropdown-menu a[href="/admin/dashboard"]'
  );
  expect(text).toEqual('Admin');
});
