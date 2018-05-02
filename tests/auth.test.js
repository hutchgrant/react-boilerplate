const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  await page.close();
});

describe('When logged in', async () => {
  beforeEach(async () => {
    await page.loginAsUser();
  });

  test('can see user dashboard', async () => {
    const title = await page.getContentsOf('.content > h2');
    expect(title).toEqual('Dashboard');
  });

  test('cannot browse to admin dashboard', async () => {
    await page.goto('http://localhost:3000/admin/dashboard');
    await page.waitFor('.navbar-brand');
    const title = await page.getContentsOf('.navbar-brand');
    expect(title).toEqual('React Boilerplate');
  });

  test('cannot browse to home page via brand logo/title', async () => {
    await page.click('.navbar-brand');
    const url = await page.url();
    expect(url).toMatch(/\/user\/dashboard/);
  });

  test('cannot go to home page directly', async () => {
    await page.goto('http://localhost:3000');
    await page.waitFor('.navbar-brand');
    const url = await page.url();
    expect(url).toMatch(/\/user\/dashboard/);
  });
});

describe('When logged in as admin', async () => {
  beforeEach(async () => {
    await page.loginAsAdmin();
  });

  test('can see user dashboard', async () => {
    const title = await page.getContentsOf('.content > h2');
    expect(title).toEqual('Dashboard');
  });

  test('can browse to admin dashboard', async () => {
    await page.click('.dropdown-toggle');
    await page.click('.dropdown-menu a[href="/admin/dashboard"]');
    await page.waitFor('.navbar-brand');
    const title = await page.getContentsOf('.navbar-brand');
    expect(title).toEqual('Boilerplate Admin');
  });

  test('cannot browse to home page via brand logo/title', async () => {
    await page.click('.navbar-brand');
    const url = await page.url();
    expect(url).toMatch(/\/user\/dashboard/);
  });

  test('cannot go to home page directly', async () => {
    await page.goto('http://localhost:3000');
    await page.waitFor('.navbar-brand');
    const url = await page.url();
    expect(url).toMatch(/\/user\/dashboard/);
  });
});
