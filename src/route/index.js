// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router();

// ================================================================

class User {
  static #list = []
  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  verifyPassword = (password) => this.password === password

  static add = (user) => {
    this.#list.push(user)
  }

  static getList = () =>  this.#list
 
  static getById = (id) => 
    this.#list.find((user) => user.id === id)

    static deleteById = (id) => {
      const index = this.#list.findIndex(
        (user) => user.id === id,
      )

      if(index !== -1) {
        this.#list.splice(index, 1)
        return true
      } else {
        return false
      }
    }

  static updateById = (id, data) => {
    const user = this.getById(id)

    if(user) {
      this.update(user, data)

      return true
    } else {
      return false
    }
  }

  static update = (user, { email }) => {
    if(email) {
      user.email = email
    }
  }
}

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = User.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',

    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.post('/user-create', function (req, res) {
  const {email, login, password} = req.body;

  const user = new User(email, login, password);

  User.add(user)

  console.log(User.getList())

  res.render('success-info', {
    style: 'success-info',
    info: 'Користувач створений'
  })
})

// ================================================================

router.get('/user-delete', function (req, res) {
  const { id } = req.query

   User.deleteById(Number(id))

  res.render('success-info', {
    style: 'success-info',
    info: 'Користувач видалений',
  })
})

// ================================================================

router.post('/user-update', function (req, res) {
  const { email, password, id} = req.body
  let result = false

  const user = User.getById(Number(id))

  if(user.verifyPassword(password)) {
    User.update(user, { email })
    result = true
  }

  res.render('success-info', {
    style: 'success-info',
    info: result 
    ? 'Email пошта оновлена' 
    : 'Сталася помилка',
  })
})

// ================================================================

class Product {
  static #list = [
    {
      id: 1111,
      name: 'One Plus 11',
      price: 500,
      description: 'Колір корпусу Чорний Зелений',
      createDate: new Date(),
    },
    {
      id: 2222,
      name: 'Vivo 90 pro+',
      price: 900,
      description:
        'Колір корпусу Чорний Зелений',
      createDate: new Date(),
    },
    {
      id: 3333,
      name: 'HUAWEI P60 Pro',
      price: 1300,
      description: 'Смартфон SIM + SIM або картка пам`яті екран: 6,67" OLED 2700х1220 вбудована пам`ять: 256ГБ оперативна пам`ять: 8ГБ процесор: Qualcomm Snapdragon 8+ Gen 1  ОС: HarmonyOS  акумулятор: 4815 мАг(незнімний) камера: 48 (f/1.4-4.0) + 13 (f/2.2, надширококутна) + 48 (f/2.1, телеоб`єктив) Мп',
      createDate: new Date(),
    },
  ]
  id = Product.getId()

  constructor(name, price, description) {
    this.name = name
    this.price = price
    this.description = description
    this.createDate = new Date()
  }

  static getId = () => {
    let res = ''
    for (let i = 0; i < 5; i++) {
      res += Math.round(Math.random() * 9)
    }
    return Number(res)
  }

  static getList = () => {
    return this.#list
  }

  static add = (product) => {
    this.#list.push(product)
  }

  static getById = (id) => {
    return this.#list.find((product) => product.id === id)
  }

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, data) => {
    const product = Product.getById(Number(id))

    if (product) {
      Product.update(product, data)
      return true
    } else {
      return false
    }
  }
  static update = (
    product,
    { name, price, description },
  ) => {
    if (name) {
      product.name = name
    }
    if (price) {
      product.price = price
    }
    if (description) {
      product.description = description
    }
  }
}
// ===============================================================
// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/product-list', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = Product.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-list', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-list',

    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/product-create', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-create',
  })
  // ↑↑ сюди вводимо JSON дані
})


// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body
  const product = new Product(name, price, description)
  if (
    product.name.length > 0 &&
    product.price.length > 0 &&
    product.description.length > 0
  ) {
    Product.add(product)

    res.render('alert', {
      style: 'alert',
      info: 'Успішне виконання дії',
      alert: 'Товар успішно додано',
    })
  } else {
    res.render('alert', {
      style: 'alert',
      info: 'Помилка',
      alert: 'Всі дані повинні бути введені',
    })
  }
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/product-edit', function (req, res) {
  const { id } = req.query;
  const product = Product.getById(Number(id));

  if (product) {
    res.render('product-edit', {
      style: 'product-edit',
      product: product,
    });
  } else {
    res.render('alert', {
      style: 'alert',
      info: 'Помилка',
      alert: 'Товар з таким ID не знайдено',
    });
  }
});

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/product-edit', function (req, res) {
  const product = req.body
  const result = Product.updateById(
    Number(product.id),
    product,
  )

  if (result) {
    res.render('alert', {
      style: 'alert',
      info: 'Успішне виконання дії',
      alert: 'Товар успішно оновлено',
    })
  } else {
    res.render('alert', {
      style: 'alert',
      info: 'Помилка',
      alert: 'Товар з таким ID не знайдено',
    })
  }
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/product-delete', function (req, res) {
  const { id } = req.query;

  const result = Product.deleteById(Number(id));
  if (result) {
    res.render('alert', {
      style: 'alert',
      info: 'Успішне виконання дії',
      alert: 'Товар успішно видалено',
    })
  } else {
    res.render('alert', {
      style: 'alert',
      info: 'Помилка',
      alert: 'Товар з таким ID не знайдено',
    });
  }
});


// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router