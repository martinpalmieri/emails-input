### emails-input

#### demo / [https://martinpalmieri.github.io/miro-assignment.github.io/](https://martinpalmieri.github.io/miro-assignment.github.io/)

#### How to use

##### Add script:

```html
<script src="{path}/emails-input.min.js"></script>
```

##### Add styles:

```html
<link href="{path}/emails-input.min.css" rel="stylesheet">
```

##### Create component:

```js
var emailsInput = new EmailsInput(document.querySelector('#emails-input'));
```

##### Options
 - Extend or override the component's options
```js
options = {
  containerClass:  // string / class name for the main container
  itemInputClassName: // string / class name for the input
  itemClassName: // string/ class name for the item
  itemInvalidClassName: // string / class name for the item if it's invalid
  placeholder: // string / text for the placeholder
  confirmKeyCodes: // array / confirm key codes
  regexValidator: // RegExp / validation for the email/item value
};
```
##### Options extend example.
 - Add a new confirm key code (arrow down).
```js
var emailsInput = new EmailsInput(document.querySelector('#emails-input'), {
  confirmKeyCodes: [...EmailsInput.prototype.options.confirmKeyCodes, 40],
  });
  ```
  
##### State
 - Items are added as an object (`{ value: string, isValid: boolean }` to the state prop (array).
  
##### Get items example.
```js
var emailsInput = new EmailsInput(document.querySelector('#emails-input'));
emailsInput.state; // will be an array of added items.
```

##### addItem
 - Method to add an item from outside emails input component
##### Example
```js
var emailsInput = new EmailsInput(document.querySelector('#emails-input'));
emailsInput.addItem(value: string); // value prop should be a string.
```

