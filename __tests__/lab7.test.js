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
  // We use .skip() here because this test has a TODO that has not been completed yet.
  // Make sure to remove the .skip after you finish the TODO. 
  it.skip('Make sure <product-item> elements are populated', async () => {
    console.log('Checking to make sure <product-item> elements are populated...');

    // Start as true, if any don't have data, swap to false
    let allArePopulated = true;

    // Query select all of the <product-item> elements
    const prodItemsData = await page.$$eval('product-item', prodItems => {
      return prodItems.map(item => {
        // Grab all of the json data stored inside
        return data = item.data;
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

    /**
    **** TODO - STEP 1 ****
    * Right now this function is only checking the first <product-item> it found, make it so that
      it checks every <product-item> it found
    * Remove the .skip from this it once you are finished writing this test.
    */

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
    console.log('Checking number of items in cart on screen...');

    // Get all product items
    const productItems = await page.$$('product-item');
    
    // Click "Add to Cart" on each item
    for (const item of productItems) {
      const shadowRoot = await item.getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      await button.click();
    }
    
    // Check cart count
    const cartCount = await page.$eval('#cart-count', el => el.innerText);
    expect(cartCount).toBe('20');
  }, 10000);

  // Check to make sure that after you reload the page it remembers all of the items in your cart
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');

    // Reload the page
    await page.reload();
    
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
  }, 10000);

  // Check to make sure that the cart in localStorage is what you expect
  it('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking the localStorage...');

    // Check localStorage cart contents
    const cartContents = await page.evaluate(() => {
      return localStorage.getItem('cart');
    });
    expect(cartContents).toBe('[]');
  });

  // Checking to make sure that if you remove all of the items from the cart that the cart
  // number in the top right of the screen is 0
  it('Checking number of items in cart on screen after removing from cart', async () => {
    console.log('Checking number of items in cart on screen...');

    // Get all product items
    const productItems = await page.$$('product-item');
    
    // Click "Remove from Cart" on each item
    for (const item of productItems) {
      const shadowRoot = await item.getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      await button.click();
    }
    
    // Check cart count
    const cartCount = await page.$eval('#cart-count', el => el.innerText);
    expect(cartCount).toBe('0');
  }, 10000);

  // Checking to make sure that it remembers us removing everything from the cart
  // after we refresh the page
  it.skip('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');

    /**
     **** TODO - STEP 7 **** 
     * Reload the page once more, then go through each <product-item> to make sure that it has remembered nothing
       is in the cart - do this by checking the text on the buttons so that they should say "Add to Cart".
     * Also check to make sure that #cart-count is still 0
     * Remember to remove the .skip from this it once you are finished writing this test.
     */

  }, 10000);

  // Checking to make sure that localStorage for the cart is as we'd expect for the
  // cart being empty
  it.skip('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking the localStorage...');

    /**
     **** TODO - STEP 8 **** 
     * At this point he item 'cart' in localStorage should be '[]', check to make sure it is
     * Remember to remove the .skip from this it once you are finished writing this test.
     */

  });
});
