// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Product {
  static #list = []

  static #count = 0

  constructor(img, title, description, category, price, amount = 0, ) {
    this.id = ++Product.#count
    this.img = img
    this.title = title
    this.description = description
    this.category = category
    this.price = price
    this.amount = amount
  }

  static add = (...data) => {
    const newProduct = new Product(...data)

    this.#list.push(newProduct)
  }

  static getList = () => {
    return this.#list
  }

  static getById = (id) => {
    return this.#list.find((product) => product.id === id)
  }

  static getRandomList = (id) => {
    //Фільтруємо товари щоб вилучити той з яким порівнюємо id
    const filterList = this.#list.filter(
      (product) => product.id !== id,
    )
    //Відсортуємо за допомогою Math.random() та перемішаємо масив
    const shuffledList = filterList.sort(
      () => Math.random() - 0.5,
    )
    //Повертаємо перші 3 елементи з перемішаного масива
    return shuffledList.slice(0, 3)
  }
}

Product.add(
  'https://picsum.photos/200/300',
  `Комп'ютер Artline Gaming (X43v31)`,
  `AMD Ryzen 5 3600 / Gigabyte B450M S2H / 16ГБ DDR4 / MSI GeForce RTX 3050 AERO 8G OC / SSD 480ГБ + HDD 1ТБ / 600W GPS-600A`,
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  20000,
  10,
)
Product.add(
  'https://picsum.photos/200/300',
  `Комп'ютер COBRA Advanced `,
  `Комп'ютер COBRA Advanced (A55.16.H1S4.36.16983) AMD Ryzen 5 5500/ DDR4 16ГБ / HDD 1ТБ + SSD 480ГБ / nVidia GeForce RTX 3060 12ГБ`,
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  40000,
  10,
)
Product.add(
  'https://picsum.photos/200/300',
  `Комп'ютер ARTLINE Gaming X77 v39 `,
  `Комп'ютер ARTLINE Gaming X77 v39 (X77v39) Intel Core i7-10700F / RAM 32ГБ / SSD 1ТБ / nVidia GeForce RTX 3070 8ГБ`,
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  75000,
  10,
)
Product.add(
  'https://picsum.photos/200/300',
  `Комп'ютер ARTLINE Gaming X37`,
  `Комп'ютер ARTLINE Gaming X37 v41 (X37v41) Intel Core i5-10400F / RAM 16ГБ / SSD 1ТБ / nVidia GeForce RTX 3050 8ГБ`,
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  45000,
  10,
)

class Purchase {
  static DELIVERY_PRICE = 150
  static #BONUS_FACTOR = 0.1

  static #count = 0
  static #list = []

  static #bonusAccount = new Map()

  static getBonusBalance = (email) => {
    return Purchase.#bonusAccount.get(email) || 0
  }

  static calcBonusAmount = (value) => {
    return value * Purchase.#BONUS_FACTOR
  }

  static updateBonusBalance = (
    email,
    price,
    bonusUse = 0,
  ) => {
    const amount = this.calcBonusAmount(price)
    const currentBalance = Purchase.getBonusBalance(email)
    const updatedBalace = currentBalance + amount - bonusUse

    Purchase.#bonusAccount.set(email, updatedBalace)
    console.log(email, updatedBalace)
    return amount
  }
  constructor(data, product) {
    this.id = ++Purchase.#count

    this.firstname = data.firstname
    this.lastname = data.lastname

    this.phone = data.phone
    this.email = data.email

    this.comment = data.comment || null
    this.bonus = data.bonus || 0

    this.promocode = data.promocode || null

    this.totalPrice = data.totalPrice
    this.productPrice = data.productPrice
    this.deliveryPrice = data.deliveryPrice
    this.amount = data.amount
    this.product = product
  }

  static add = (...arg) => {
    const newPurchase = new Purchase(...arg)
    this.#list.push(newPurchase)

    return newPurchase
  }

  static getList = () => {
    return Purchase.#list.reverse()   
  }

  static getById = (id) => {
    return this.#list.find((item) => item.id === id)
  }

  static updateById = (id, data) => {
    const purchase = Purchase.getById(id)

    if (purchase) {
      if (data.firstname) {
        purchase.firstname = data.firstname
      }
      if (data.lastname) {
        purchase.lastname = data.lastname
      }
      if (data.phone) {
        purchase.phone = data.phone
      }
      if (data.email) {
        purchase.email = data.email
      }
      return true
    } else {
      return false
    }
  }
}

class Promocode {
  static #list = []

  constructor(name, factor) {
    this.name = name
    this.factor = factor
  }

  static add = (name, factor) => {
    const newPromoCode = new Promocode(name, factor)
    Promocode.#list.push(newPromoCode)
    return newPromoCode
  }

  static getByName = (name) => {
    return this.#list.find((promo) => promo.name === name)
  }

  static calc = (promo, price) => {
    return price * promo.factor
  }
}

Promocode.add('SUMMER23', 0.9)
Promocode.add('DISCOUNT50', 0.5)
Promocode.add('SALE25', 0.75)


// ================================================================

// ================================================================

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-index',

    data: {
      list: Product.getList(),
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================
router.get('/purchase-product', function (req, res) {
  // res.render генерує нам HTML сторінку
  const id = Number(req.query.id)
  
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-product', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-product',

    data: {
      list: Product.getRandomList(id),
      product: Product.getById(id),
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================
router.post('/purchase-create', function (req, res) {
  // res.render генерує нам HTML сторінку
  const id = Number(req.query.id)
  const amount = Number(req.body.amount)

  if(amount < 1) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Некоректна квлькість товару',
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  const product = Product.getById(id);

  if(product.amount < 1) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Такої кількісті товару нема в наявності',
        link: `/purchase-product?id=${id}`,
      },
    })
  }
  
  console.log(product, amount)

  const productPrice = product.price * amount
  const totalPrice = productPrice + Purchase.DELIVERY_PRICE
  const bonus = Purchase.calcBonusAmount(totalPrice)

  res.render('purchase-create', {
   
    style: 'purchase-create',

    data: {
      id: product.id,

      cart: [
        {
          text: `${product.title} (${amount})шт)`,
          price: productPrice,
        },
        {
          text: `Доставка`,
          price: Purchase.DELIVERY_PRICE,
        },
      ],
      totalPrice,
      productPrice,
      deliveryPrice: Purchase.DELIVERY_PRICE,
      amount: amount,
      bonus,
    },
  })
})
// ================================================================

router.post('/purshase-submit', function (req, res) {
  console.log(req.query)
  console.log(req.body)

  const id = Number(req.query.id)
  let = {
    firstname,
    lastname,
    phone,
    email,
    comment,

    bonus,

    totalPrice,
    productPrice,
    deliveryPrice,
    amount,
    promocode,
  } = req.body

  const product = Product.getById(id)

  if (!product) {
    return res.render('alert', {
      style: 'alert',
      title: 'Помилка',
      info: 'Товар не знайдено',
      href: `/purchase-product`,
      textButton: 'Повернутись назад',
    })
  }

  if (product.amount < amount) {
    return res.render('alert', {
      style: 'alert',
      title: 'Помилка',
      info: 'Товару немає в потрібній кількості',
      href: `/purchase-edit`,
      textButton: 'Повернутись назад',
    })
  }

  totalPrice = Number(totalPrice)
  productPrice = Number(productPrice)
  deliveryPrice = Number(deliveryPrice)
  amount = Number(amount)
  bonus = Number(bonus)

  if (
    isNaN(totalPrice) ||
    isNaN(productPrice) ||
    isNaN(deliveryPrice) ||
    isNaN(amount) ||
    isNaN(bonus)
  ) {
    return res.render('alert', {
      style: 'alert',
      title: 'Помилка',
      info: 'Некоректні дані',
      href: `/purchase-product?id=${id}`,
      textButton: 'Повернутись назад',
    })
  }

  if (!firstname || !lastname || !phone || !email) {
    return res.render('alert', {
      style: 'alert',

      title: "Заповніть обов'язкові поля",
      info: 'Некоректні дані',
      href: `/purchase-product?id=${id}`,
      textButton: 'Повернутись назад',
    })
  }

  if (bonus || bonus > 0) {
    const bonusAmount = Purchase.getBonusBalance(email)

    console.log(bonusAmount)

    if (bonus > bonusAmount) {
      bonus = bonusAmount
    }

    Purchase.updateBonusBalance(email, totalPrice, bonus)

    totalPrice -= bonus
  } else {
    Purchase.updateBonusBalance(email, totalPrice, 0)
  }

  if (promocode) {
    promocode = Promocode.getByName(promocode)
    if (promocode) {
      totalPrice = Promocode.calc(promocode, totalPrice)
    }
  }

  if (totalPrice < 0) totalPrice = 0

  const purchase = Purchase.add(
    {
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,
      bonus,

      firstname,
      lastname,
      phone,
      email,
      promocode,
      comment,
    },
    product,
  )
  console.log(purchase)
  res.render('alert', {
    style: 'alert',
    title: 'Успішно',
    info: 'Замовлення створено',
    href: `/purchase-list`,
    textButton: 'Далі',
  })
})


//=================================================================

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/alert', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('alert', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'alert',

    data: {
      message: 'Операція успішна',
      info: 'Товар створений',
      link: '/test-path',
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================
router.get('/purchase-list', function (req, res) {
  const list = Purchase.getList()

  // console.log('=========>', list)

  res.render('purchase-list', {
    style: 'purchase-list',
    data: {
      list: list,
    },
  })
})

// ================================================================
router.post('/purchase-list', function (req, res) {
  const id = Number(req.query.id)
  const list = Purchase.getById(id)

  // console.log('=========>', list, id)

  res.render('purchase-info', {
    style: 'purchase-info',
    data: {
      list: list,
    },
  })
})

// ================================================================
router.post('/purchase-edit', function (req, res) {
  const id = Number(req.query.id)
  const list = Purchase.getById(id)

  // console.log('=========>', list, id)

  res.render('purchase-edit', {
    style: 'purchase-edit',
    data: {
      list: list,
    },
  })
})

// ================================================================
router.post('/purshase-success', function (req, res) {
  const id = Number(req.query.id)
  const list = req.body

  const data = Purchase.updateByID(id, list)

  // const updatedList = Purchase.getById(id)
  // console.log('=========>', data, id, updatedList)

  if (
    list.firstname.length < 1 ||
    list.lastname.length < 1 ||
    list.email.length < 1 ||
    list.phone.length < 1
  ) {
    return res.render('alert', {
      style: 'alert',
      title: 'Помилка',
      info: 'Поля не повинні бути пустими',
      href: `/purchase-list`,
      textButton: 'Повернутись назад',
    })
  }

  if (!data) {
    return res.render('alert', {
      style: 'alert',
      title: 'Помилка',
      info: 'Не вдалося відредагувати данні',
      href: `/purchase-list`,
      textButton: 'Повернутись назад',
    })
  }

  res.render('alert', {
    style: 'alert',
    title: 'Успішне виконання дії',
    info: 'Данні відредаговано',
    href: `/purchase-list`,
    textButton: 'Повернутись назад',
  })
})


// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router