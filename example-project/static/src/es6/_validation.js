import { sendRequest, waitResponse, Request } from './_requests';
import { getCookie } from './_getcookie';


export function handleErrors(response) {
  Request.stop();
  if (!response.ok) throw Error(response.statusText);
  return response;
}

window.formData = {};

export class Field {
    constructor(el, stepField) {
        this.stepField = stepField;
        this.fld = this.isElement(el) ? el : document.querySelector(el);
        this.isValid = false;
        window.formData[this.stepField] = this;

        this.fld.addEventListener('input', e => {
            this.isValid = false;
            e.target.parentNode.classList.remove('ok');
            e.target.parentNode.classList.remove('error');
        });
        this.fld.addEventListener('focus', e => {
            e.target.parentNode.classList.add('focus-filled');
            e.target.parentNode.classList.remove('error');
        });
        this.fld.addEventListener('blur', e => {
            if (!e.target.value) {
                e.target.parentNode.classList.remove('focus-filled');
            }
        });
    }
    getValue() {
        return this.fld.value && this.fld.value.trim();
    }
    getFieldName() {
        return this.fld.name;
    }
    isElement(obj) {
        try {
            //Using W3 DOM2 (works for FF, Opera and Chrome)
            return obj instanceof HTMLElement;
        }
        catch (e) {
            //Browsers not supporting W3 DOM2 don't have HTMLElement and
            //an exception is thrown and we end up here. Testing some
            //properties that all elements have (works on IE7)
            return (typeof obj === "object") &&
                (obj.nodeType === 1) && (typeof obj.style === "object") &&
                (typeof obj.ownerDocument === "object");
        }
    }
    setCookie() {
        document.cookie = `${this.fld.name} = ${this.getValue()}`;
    }
    errorHandler() {
        if (this.isValid) {
            this.fld.parentNode.classList.remove('error');
            this.fld.parentNode.classList.add('ok');
        } else {
            this.fld.parentNode.classList.add('error');
            this.fld.parentNode.classList.remove('ok');
        }

        if (!this.fld.value) {
            this.fld.parentNode.classList.remove('focus-filled');
        }
    }
    scrollToElementOnFocus(selector) {
        const el = document.querySelector(selector);
        this.fld.addEventListener('focus', () => {
            if (window.innerWidth < 1024) {
                el.scrollIntoView();
            }
        })
    }
}

export class RadioField {
    constructor(elems, stepField) {
        this.stepField = stepField;
        this.flds = elems;
        this.isValid = false;
        window.formData[this.stepField] = this;
        this.init();
    }
    init() {
        this.check();
        this.flds.forEach(fld => {
            fld.addEventListener('change', () => {
                this.flds[0].closest('section').classList.remove('error');
                this.check();
            });
        })
    }
    check() {
        this.isValid = Array.from(this.flds).some(el => el.checked);
    }
    getFieldName() {
        const checkedElement = Array.from(this.flds).find(el => el.checked);
        return checkedElement.name;
    }
    getValue () {
        const checkedElement = Array.from(this.flds).find(el => el.checked);
        return checkedElement.value;
    }
    errorHandler() {
        if (this.isValid) {
            this.flds[0].closest('section').classList.remove('error');
        } else {
            this.flds[0].closest('section').classList.add('error');
        }
    }
}

export class SelectField extends Field {
    constructor(el, stepField) {
        super(el, stepField);
        this.isCustomSelect = this.fld.tagName !== 'SELECT';
        this.init();
    }
    init() {
        this.check();

        if (this.isCustomSelect) {
           this.fld.addEventListener('click', () => this.check());
       } else {
           this.fld.addEventListener('change', () => this.check());
       }
    }
    check() {
        this.isValid = this.isCustomSelect
            ? !!this.fld.querySelector('select').value
            : !!this.fld.value;
    }
}

export class NameField extends Field {
    constructor(el, stepField, isCamelcase = false) {
        super(el, stepField);
        this.isCamelcase = isCamelcase;
        this.init();
    }
    init() {
        const initialValue = getCookie(this.fld.name);
        if (initialValue) {
            this.fld.value = initialValue;
            this.fld.parentNode.classList.add('focus-filled');
            this.check();
            if (this.isValid) {
                this.fld.parentNode.classList.add('ok');
            }
        }

        this.fld.addEventListener('input', e => {
            this.nameKeyDownChecking(e);
            this.setCookie();
            this.isValid = this.check();
            if (this.isValid) {
                e.target.parentNode.classList.add('ok');
            } else {
                e.target.parentNode.classList.remove('ok');
            }
        });
        this.fld.addEventListener('blur', () => this.errorHandler());
    }
    check() {
        this.isValid = !!this.fld.value && this.fld.value.length >= 2;
        return this.isValid;
    }
    nameKeyDownChecking(e) {
        const value = e.target.value.replace(/\d/, '');
        e.target.value = value;

        if (value.length > 0 && this.isCamelcase) {
            const nameArr = value.split('').map((item, index) => {
                return index === 0 ? item.toUpperCase() : item;
            });
            e.target.value = nameArr.join('');
        }
    }
}

export class EmailField extends Field {
    constructor(el, stepField) {
        super(el, stepField);
        this.init();
    }
    init() {
        const initialValue = getCookie(this.fld.name);
        if (initialValue) {
            this.fld.value = initialValue;
            this.fld.parentNode.classList.add('focus-filled');
            this.check();
            if (this.isValid) {
                this.fld.parentNode.classList.add('ok');
            }
        }
        this.fld.addEventListener('input', e => {
            this.setCookie();
            this.check();
            if (this.isValid) {
                e.target.parentNode.classList.add('ok');
            } else {
                e.target.parentNode.classList.remove('ok');
            }
        });

        this.fld.addEventListener('blur', () => this.errorHandler());
    }
    check() {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.isValid = re.test(String(this.fld.value).toLowerCase());
        return this.isValid;
    }
}

export class PhoneField extends Field {
    constructor(el, stepField) {
        super(el, stepField);
        this.tcpa = document.querySelector('.tcpa');
        this.check();
        this.init();
    }
    init() {
        const initialValue = getCookie(this.fld.name);
        if (initialValue) {
            this.fld.value = initialValue;
            this.fld.parentNode.classList.add('focus-filled');
            this.check();
        }
        this.fld.addEventListener("input", (e) => {
            e.target.parentNode.classList.remove('ok');
            this.tcpa.classList.remove('active');
            this.setCookie();
            this.check();
        });
        this.fld.addEventListener("blur", () => {
            waitResponse(() => this.errorHandler());
        });
    }
    check() {
        const { phone, isCorrectPhone, range } = this.checkPhoneFormat(this.fld);
        this.fld.value = phone;
        if (range !== 1) {
            this.fld.setSelectionRange(range, range);
        }
        if (isCorrectPhone) {
            this.validationPhoneBE(phone);
        }
    }
    getFormattedPhone() {
        return this.getValue().split('').filter(elem => !isNaN(elem) && elem !== ' ').join('');
    }
    validationPhoneBE() {
        return sendRequest(`${window.site_domain_url}/generic/phone-type/?phone_number=${this.getFormattedPhone()}`)
            .then(response => response.json())
            .then((res) => {
                Request.stop();
                this.isValid = res ? true : false;

                if (res && res.content.tcpa) {
                    this.tcpa.innerHTML = res.content.tcpa;
                    this.tcpa.classList.add('active');
                } else {
                    this.tcpa.innerHTML = '';
                }
                this.errorHandler();
            })
            .catch(() => {
                Request.stop()
                this.isValid = false;
                this.errorHandler();
            });
    }
    checkPhoneFormat() {
        const value = this.fld.value;
        const verificationRegExp = /\(\d{3}\) \d{3}-\d{4}/g;
        if (value.match(verificationRegExp)) {
            return {
                isCorrectPhone: true,
                phone: value.match(verificationRegExp)[0],
                range: 14,
                checkedValue: value.match(verificationRegExp)[0].replace(/\D/g, '')
            };
        }
        let phone = value.replace(/\D/g, '');
        let digitsQuantity = phone.length;
        let currentValue;
        let currentPosition;
        let isCorrectPhone = false;
        switch (digitsQuantity) {
            case 0: {
                currentValue = '';
                currentPosition = 1;
                break;
            }
            case 1: {
                currentValue = `(${phone[digitsQuantity - 1]}`;
                currentPosition = 2;
                break;
            }
            case 2: {
                currentValue = `(${phone[digitsQuantity - 2]}${phone[digitsQuantity - 1]}`;
                currentPosition = 3;
                break;
            }
            case 3: {
                currentValue =
                    `(${phone[digitsQuantity - 3]}${phone[digitsQuantity - 2]}${phone[digitsQuantity - 1]}`;
                currentPosition = 4;
                break;
            }
            case 4: {
                currentValue =
                    `(${phone[digitsQuantity - 4]}${phone[digitsQuantity - 3]}${phone[digitsQuantity - 2]}) ${phone[digitsQuantity - 1]}`;
                currentPosition = 7;
                break;
            }
            case 5: {
                currentValue =
                    `(${phone[digitsQuantity - 5]}${phone[digitsQuantity - 4]}${phone[digitsQuantity - 3]}) ${phone[digitsQuantity - 2]}${phone[digitsQuantity - 1]}`;
                currentPosition = 8;
                break;
            }
            case 6: {
                currentValue =
                    `(${phone[digitsQuantity - 6]}${phone[digitsQuantity - 5]}${phone[digitsQuantity - 4]}) ${phone[digitsQuantity - 3]}${phone[digitsQuantity - 2]}${phone[digitsQuantity - 1]}`;
                currentPosition = 9;
                break;
            }
            case 7: {
                currentValue =
                    `(${phone[digitsQuantity - 7]}${phone[digitsQuantity - 6]}${phone[digitsQuantity - 5]}) ${phone[digitsQuantity - 4]}${phone[digitsQuantity - 3]}${phone[digitsQuantity - 2]}-${phone[digitsQuantity - 1]}`;
                currentPosition = 11;
                break;
            }
            case 8: {
                currentValue =
                    `(${phone[digitsQuantity - 8]}${phone[digitsQuantity - 7]}${phone[digitsQuantity - 6]}) ${phone[digitsQuantity - 5]}${phone[digitsQuantity - 4]}${phone[digitsQuantity - 3]}-${phone[digitsQuantity - 2]}${phone[digitsQuantity - 1]}`;
                currentPosition = 12;
                break;
            }
            case 9: {
                currentValue =
                    `(${phone[digitsQuantity - 9]}${phone[digitsQuantity - 8]}${phone[digitsQuantity - 7]}) ${phone[digitsQuantity - 6]}${phone[digitsQuantity - 5]}${phone[digitsQuantity - 4]}-${phone[digitsQuantity - 3]}${phone[digitsQuantity - 2]}${phone[digitsQuantity - 1]}`;
                currentPosition = 13;
                break;
            }
            case 10: {
                currentValue =
                    `(${phone[digitsQuantity - 10]}${phone[digitsQuantity - 9]}${phone[digitsQuantity - 8]}) ${phone[digitsQuantity - 7]}${phone[digitsQuantity - 6]}${phone[digitsQuantity - 5]}-${phone[digitsQuantity - 4]}${phone[digitsQuantity - 3]}${phone[digitsQuantity - 2]}${phone[digitsQuantity - 1]}`;
                currentPosition = 14;
                isCorrectPhone = true;
                break;
            }
            default:
                phone = phone.slice(-10);
                digitsQuantity = 10;
                currentValue =
                    `(${phone[digitsQuantity - 10]}${phone[digitsQuantity - 9]}${phone[digitsQuantity - 8]}) ${phone[digitsQuantity - 7]}${phone[digitsQuantity - 6]}${phone[digitsQuantity - 5]}-${phone[digitsQuantity - 4]}${phone[digitsQuantity - 3]}${phone[digitsQuantity - 2]}${phone[digitsQuantity - 1]}`;
                currentPosition = 14;
                isCorrectPhone = true;
        }
        return {
            range: currentPosition,
            phone: currentValue,
            isCorrectPhone
        };
    };
}

export class AddressField extends Field {
    constructor(el, stepField) {
        super(el, stepField);
        this.isValid = false;
        this.init();
    }
    init() {
        const initialValue = getCookie(this.fld.name);
        if (initialValue) {
            this.fld.value = initialValue;
            this.fld.parentNode.classList.add('focus-filled');
            this.check();
            if (this.isValid) {
                this.fld.parentNode.classList.add('ok');
            }
        }
        this.fld.addEventListener('change', () => {
            this.errorHandler();
        });
        this.fld.addEventListener('input', () => {
            this.isValid = false;
            this.fld.parentNode.classList.remove('ok');
            this.setCookie();
            this.check();
        });
        this.fld.addEventListener('blur', () => {
            waitResponse(() => this.errorHandler());
        });
    }
    check() {
        const valuesArray = this.getValue().split(' ');
        const regExp = /^[a-zA-Z0-9\,]+$/;
        const isValidItems = valuesArray && valuesArray.every(value => value.match(regExp) !== null);
        this.isValid = valuesArray.length >= 2 && isValidItems;
        return this.isValid;
    }
}