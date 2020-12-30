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

	container.classList.add(this.options.containerClass);
	this.itemsContainer = this.createItemsContainerElement();
	this.itemInput = this.createItemInputElement();
	container.appendChild(this.itemsContainer);
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
 * @property {string}    itemsContainerClassName    - The class name for the items container.
 * @property {string}    itemInputClassName         - The class name for the input.
 * @property {string}    itemClassName              - The class name for the item.
 * @property {string}    itemInvalidClassName       - The class name for the item if it's invalid.
 * @property {string}    placeholder                - The text for the placeholder.
 * @property {string[]}  confirmKeyCodes            - A set of confirm key codes.
 * @property {RegExp}    regexValidator             - A RegExp for validating the email value.
 */
EmailsInput.prototype.options = {
	containerClass: 'emails-input-main-container',
	itemsContainerClassName: 'emails-input-items-container',
	itemInputClassName: 'emails-input-item-input',
	itemClassName: 'emails-input-item',
	itemInvalidClassName: 'emails-input-item-invalid',
	placeholder: 'add more people...',
	confirmKeyCodes: [13, 188],
	regexValidator: new RegExp(/^\S+@\S+\.\S+$/),
};

EmailsInput.prototype.createItemsContainerElement = function () {
	var itemsContainer = document.createElement('div');
	itemsContainer.classList.add(this.options.itemsContainerClassName);

	return itemsContainer;
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

EmailsInput.prototype.onItemInputBlur = function (event) {
	this.addItem(event.target.value);
	this.clearItemInput();
};

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
	this.itemsContainer.appendChild(this.createItemElement(value, isValid));
	this.state.push({ value: value, isValid: isValid });

	return true;
};

EmailsInput.prototype.removeItem = function (item, value) {
	for (var i = 0; i < this.state.length; i++) {
		if (this.state[i].value === value) {
			this.state.splice(i, 1);
			this.itemsContainer.removeChild(item);
			return;
		}
	}
};

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
