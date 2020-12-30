/**
 * EmailsInput.
 * @constructor
 * @param {Element} container - The main container for EmailsInput.
 * @param {object} options - A set of options to customize EmailsInput.
 */
function EmailsInput(container, options) {
	for (var option in options) {
		if (options.hasOwnProperty(option)) {
			this.options[option] = options[option];
		}
	}

	this.state = [];
	this.container = container;

	container.classList.add(this.options.containerClass);
	this.itemInput = this.createItemInputElement();
	container.appendChild(this.itemInput);
	container.addEventListener(
		'click',
		function () {
			this.itemInput.focus();
		}.bind(this)
	);
}

/**
 * @options
 * @property {string}    containerClass             - The class name for the main container.
 * @property {string}    itemInputClassName         - The class name for the input.
 * @property {string}    itemClassName              - The class name for the item.
 * @property {string}    itemInvalidClassName       - The class name for the item if it's invalid.
 * @property {string}    placeholder                - The text for the placeholder.
 * @property {string[]}  confirmKeyCodes            - A set of confirm key codes.
 * @property {RegExp}    regexValidator             - A RegExp for validating the email value.
 */
EmailsInput.prototype.options = {
	containerClass: 'emails-input-main-container',
	itemInputClassName: 'emails-input-item-input',
	itemClassName: 'emails-input-item',
	itemInvalidClassName: 'emails-input-item-invalid',
	placeholder: 'add more people...',
	confirmKeyCodes: [13, 188],
	regexValidator: new RegExp(/^\S+@\S+\.\S+$/),
};

EmailsInput.prototype.createItemInputElement = function () {
	var itemInput = document.createElement('input');
	itemInput.classList.add(this.options.itemInputClassName);
	itemInput.type = 'email';
	itemInput.placeholder = this.options.placeholder;
	itemInput.addEventListener('keydown', this.onItemInputChange.bind(this));
	itemInput.addEventListener('blur', this.onItemInputBlur.bind(this));
	itemInput.addEventListener('paste', this.onItemInputPaste.bind(this));

	return itemInput;
};

/**
 * onItemInputChange.
 * @param {InputEvent} event - The event from input change.
 */
EmailsInput.prototype.onItemInputChange = function (event) {
	//
	if (this.options.confirmKeyCodes.indexOf(event.keyCode) === -1) {
		return;
	}

	if (!this.addItem(event.target.value)) {
		// @TODO add some feedback like adding an error class
		return;
	}

	this.clearItemInput();
	event.preventDefault();
};

/**
 * onItemInputBlur.
 * @param {InputEvent} event - The event from input blur.
 */
EmailsInput.prototype.onItemInputBlur = function (event) {
	this.addItem(event.target.value);
	this.clearItemInput();
};

/**
 * onItemInputPaste.
 * @param {InputEvent} event - The event from input paste.
 */
EmailsInput.prototype.onItemInputPaste = function (event) {
	setTimeout(
		function () {
			var pastedItems = event.target.value.split(/,/g);

			for (var i = 0; i < pastedItems.length; i++) {
				this.addItem(pastedItems[i].trim());
			}

			this.clearItemInput();
		}.bind(this)
	);
};

/**
 * addItem.
 * @param {string} value - The typed value as a string.
 */
EmailsInput.prototype.addItem = function (value) {
	if (value === '') {
		return false;
	}

	for (var i = 0; i < this.state.length; i++) {
		if (this.state[i].value === value) {
			return false;
		}
	}

	var isValid = this.options.regexValidator.test(value);
	this.container.insertBefore(this.createItemElement(value, isValid), this.itemInput);
	this.state.push({ value: value, isValid: isValid });

	return true;
};

/**
 * removeItem.
 * @param {string} item - The item as a Node element.
 * @param {string} value - The value of the added element.
 */
EmailsInput.prototype.removeItem = function (item, value) {
	for (var i = 0; i < this.state.length; i++) {
		if (this.state[i].value === value) {
			this.state.splice(i, 1);
			this.container.removeChild(item);
			return;
		}
	}
};

/**
 * createItemElement.
 * @param {string} value - The value used to create the new element as a string.
 * @param {string} isValid - Represents validity of the element using a RegExp.
 */
EmailsInput.prototype.createItemElement = function (value, isValid) {
	var item = document.createElement('div');
	item.innerHTML = value;
	item.classList.add(this.options.itemClassName);
	if (isValid === false) {
		item.classList.add(this.options.itemInvalidClassName);
	}

	var deleteButton = document.createElement('button');
	deleteButton.type = 'button';
	deleteButton.innerHTML = 'x';
	deleteButton.addEventListener('click', this.removeItem.bind(this, item, value));
	item.appendChild(deleteButton);

	return item;
};

EmailsInput.prototype.clearItemInput = function () {
	this.itemInput.value = '';
};
