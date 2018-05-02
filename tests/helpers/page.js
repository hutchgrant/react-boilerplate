const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');
const jwtFactory = require('../factories/jwtFactory');
const storage = require('node-persist');

class CustomPage {
  static async build() {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    const customPage = new CustomPage(page);

    return new Proxy(customPage, {
      get: function(target, property) {
        return customPage[property] || browser[property] || page[property];
      }
    });
  }

  constructor(page) {
    this.page = page;
  }

  async loginAsAdmin() {
    return this.login({
      admin: true,
      verified: true,
      enabled: true
    });
  }

  async loginAsUser() {
    return this.login({
      admin: false,
      verified: true,
      enabled: true
    });
  }

  async loginAsNewUser() {
    return this.login({
      admin: false,
      verified: false,
      enabled: true
    });
  }

  async loginAsDisabled() {
    return this.login({
      admin: false,
      verified: true,
      enabled: false
    });
  }

  async login(options) {
    const user = await userFactory({
      admin: options.admin,
      verified: options.verified,
      enabled: options.enabled
    });
    const { session, sig } = sessionFactory(user);
    const jwt = jwtFactory(user);

    storage.init();
    var data = {
      token: jwt,
      username: user.username
    };
    await this.page.evaluate(data => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
    }, data);
    await this.page.setCookie({ name: 'session', value: session });
    await this.page.setCookie({ name: 'session.sig', value: sig });
    await this.page.goto('http://localhost:3000/user/dashboard');
    await this.page.waitFor('a[href="/user/dashboard"]');
  }

  async getContentsOf(selector) {
    return this.page.$eval(selector, el => el.innerHTML);
  }

  get(path) {
    return this.page.evaluate(_path => {
      return fetch(_path, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json());
    }, path);
  }

  post(path, data) {
    return this.page.evaluate(
      (_path, _data) => {
        return fetch(_path, {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(_data)
        }).then(res => res.json());
      },
      path,
      data
    );
  }

  execRequests(actions) {
    return Promise.all(
      actions.map(({ method, path, data }) => {
        return this[method](path, data);
      })
    );
  }
}

module.exports = CustomPage;
