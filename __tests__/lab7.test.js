describe('Basic user flow for Website', () => {
  // First, visit the lab 7 website
  beforeAll(async () => {
    await page.goto('https://cse110-sp25.github.io/CSE110-Shop/');
  });

  // Each it() call is a separate test
  // Here, we check to make sure that all 20 <product-item> elements have loaded
  it('Initial Home Page - Check for 20 product items', async () => {
    console.log('Checking for 20 product items...');

    // Query select all of the <product-item> elements and return the length of that array
    const numProducts = await page.$$eval('product-item', (prodItems) => {
      return prodItems.length;
    });

    // Expect there that array from earlier to be of length 20, meaning 20 <product-item> elements where found
    expect(numProducts).toBe(20);
  });

  // Check to make sure that all 20 <product-item> elements have data in them
  it('Make sure <product-item> elements are populated', async () => {
    console.log('Checking to make sure <product-item> elements are populated...');

    // Start as true, if any don't have data, swap to false
    let allArePopulated = true;

    // Query select all of the <product-item> elements
    const prodItemsData = await page.$$eval('product-item', prodItems => {
      return prodItems.map(item => {
        // Grab all of the json data stored inside
        return item.data;              
      });
    });

    // Make sure the title, price, and image are populated in the JSON
    for (let i = 0; i < prodItemsData.length; i++) {
      console.log(`Checking product item ${i + 1}/${prodItemsData.length}`);
      const item = prodItemsData[i];
      if (item.title.length == 0) { allArePopulated = false; }
      if (item.price.length == 0) { allArePopulated = false; }
      if (item.image.length == 0) { allArePopulated = false; }
    }

    // Expect allArePopulated to still be true
    expect(allArePopulated).toBe(true);
  }, 10000);

  // Check to make sure that when you click "Add to Cart" on the first <product-item> that
  // the button swaps to "Remove from Cart"
  it('Clicking the "Add to Cart" button should change button text', async () => {
    console.log('Checking the "Add to Cart" button...');

    // Get the first product item
    const productItem = await page.$('product-item');
    const shadowRoot = await productItem.getProperty('shadowRoot');
    const button = await shadowRoot.$('button');
    
    // Get initial text
    const initialText = await button.getProperty('innerText');
    const initialTextValue = await initialText.jsonValue();
    expect(initialTextValue).toBe('Add to Cart');
    
    // Click the button
    await button.click();
    
    // Get new text
    const newText = await button.getProperty('innerText');
    const newTextValue = await newText.jsonValue();
    expect(newTextValue).toBe('Remove from Cart');
  }, 2500);

  // Check to make sure that after clicking "Add to Cart" on every <product-item> that the Cart
  // number in the top right has been correctly updated
  it('Checking number of items in cart on screen', async () => {

    await page.reload({ waitUntil: 'networkidle0' });

    console.log('Checking number of items in cart on screen...');

    // Get all product items
    const productItems = await page.$$('product-item');
    
    // Click "Add to Cart" on each item (skip ones already in cart – makes test idempotent)
    for (const item of productItems) {
      const shadowRoot = await item.getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      const txtHandle = await button.getProperty('innerText');
      const txt = await txtHandle.jsonValue();
      if (txt === 'Add to Cart') await button.click();
    }
    
    // Check cart count
    const cartCount = await page.$eval('#cart-count', el => el.innerText);
    expect(cartCount).toBe('20');
  }, 20000);   

  // Check to make sure that after you reload the page it remembers all of the items in your cart
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');

    // Reload the page
    await page.reload({ waitUntil: 'networkidle0' });
    
    // Get all product items
    const productItems = await page.$$('product-item');
    
    // Check each button text
    for (const item of productItems) {
      const shadowRoot = await item.getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      const buttonText = await button.getProperty('innerText');
      const textValue = await buttonText.jsonValue();
      expect(textValue).toBe('Remove from Cart');
    }
    
    // Check cart count
    const cartCount = await page.$eval('#cart-count', el => el.innerText);
    expect(cartCount).toBe('20');
  }, 20000);

  // Check to make sure that the cart in localStorage is what you expect
  it('Checking the localStorage to make sure cart is correct', async () => {
    // Check localStorage cart contents
    const cartContents = await page.evaluate(() => {
      return localStorage.getItem('cart');
    });
    expect(cartContents).toBe('[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]');
  });

  // Checking to make sure that if you remove all of the items from the cart that the cart
  // number in the top right of the screen is 0
  it('Checking number of items in cart on screen after removing from cart', async () => {
    console.log('Checking number of items in cart on screen...');

    // Get all product items
    const productItems = await page.$$('product-item');
    
    // Click "Remove from Cart" on each item (skip if already removed)
    for (const item of productItems) {
      const shadowRoot = await item.getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      const txtHandle = await button.getProperty('innerText');
      const txt = await txtHandle.jsonValue();
      if (txt === 'Remove from Cart') await button.click();
    }
    
    // Check cart count
    const cartCount = await page.$eval('#cart-count', el => el.innerText);
    expect(cartCount).toBe('0');
  }, 20000);   

  // Checking to make sure that it remembers us removing everything from the cart
  // after we refresh the page
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');

    // Reload the page
    await page.reload({ waitUntil: 'networkidle0' });
    
    // Get all product items
    const productItems = await page.$$('product-item');
    
    // Check each button text
    for (const item of productItems) {
      const shadowRoot = await item.getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      const buttonText = await button.getProperty('innerText');
      const textValue = await buttonText.jsonValue();
      expect(textValue).toBe('Add to Cart');
    }
    
    // Check cart count
    const cartCount = await page.$eval('#cart-count', el => el.innerText);
    expect(cartCount).toBe('0');
  }, 20000);

  // Checking to make sure that localStorage for the cart is as we'd expect for the
  // cart being empty
  it('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking the localStorage...');

    // Check localStorage cart contents
    const cartContents = await page.evaluate(() => {
      return localStorage.getItem('cart');
    });
    expect(cartContents).toBe('[]');
  });
});
