class FormHandler {
    constructor(formElement, options = {}) {
      this.form = formElement;
      this.formId = this.form.id;
      this.options = {
        onSuccess: options.onSuccess || (() => {}),
        onError: options.onError || (() => {}),
      };
  
      if (!this.form) {
        console.error(`Form element is not valid`);
        return;
      }
  
      this.formIndex = this.formId.replace('contactForm', '');
  
      this.setupValidation();
      this.setupCountrySelector();
      this.setupTermsCheckbox();
    }
  
    setupValidation() {
      this.nameInput = this.form.querySelector('input[name="name"]');
      this.emailInput = this.form.querySelector('input[name="email"]');
      this.phoneInput = this.form.querySelector('input[name="phone"]');
      this.phoneContainer = document.getElementById(`phone-container-${this.formIndex}`);
      this.countrySelect = this.form.querySelector('select[name="country"]');
      this.termsCheckbox = this.form.querySelector('input[name="terms"]');
      this.submitButton = this.form.querySelector('button[type="submit"]');
  
      this.nameErrorContainer = document.getElementById(`name-error-${this.formIndex}`);
      this.emailErrorContainer = document.getElementById(`email-error-${this.formIndex}`);
      this.phoneErrorContainer = document.getElementById(`phone-error-${this.formIndex}`);
      this.countryErrorContainer = document.getElementById(`country-error-${this.formIndex}`);
  
      this.nameInput.addEventListener('input', () => this.validateField(this.nameInput, this.validateName, this.nameErrorContainer));
      this.emailInput.addEventListener('input', () => this.validateField(this.emailInput, this.validateEmail, this.emailErrorContainer));
      this.phoneInput.addEventListener('input', () => this.validateField(this.phoneInput, this.validatePhone, this.phoneErrorContainer));
      this.countrySelect.addEventListener('change', () => this.validateField(this.countrySelect, this.validateCountry, this.countryErrorContainer));
  
      // Form submit handler
      this.form.addEventListener('submit', e => this.handleSubmit(e));
    }
  
    setupCountrySelector() {
      // Lista de países principal y otros
      const mainCountries = [
        { code: 'mx', name: 'México', dialCode: '+52' },
        { code: 'us', name: 'Estados Unidos', dialCode: '+1' },
        { code: 'es', name: 'España', dialCode: '+34' },
        { code: 'ca', name: 'Canadá', dialCode: '+1' },
      ];
  
      const otherCountries = [
        { code: 'ar', name: 'Argentina', dialCode: '+54' },
        { code: 'co', name: 'Colombia', dialCode: '+57' },
        { code: 'cl', name: 'Chile', dialCode: '+56' },
        { code: 'pe', name: 'Perú', dialCode: '+51' },
        { code: 'br', name: 'Brasil', dialCode: '+55' },
        { code: 'uy', name: 'Uruguay', dialCode: '+598' },
        { code: 'py', name: 'Paraguay', dialCode: '+595' },
        { code: 'bo', name: 'Bolivia', dialCode: '+591' },
        { code: 'ec', name: 'Ecuador', dialCode: '+593' },
        { code: 've', name: 'Venezuela', dialCode: '+58' },
        // ... otros países
      ];
  
      this.countries = [...mainCountries, ...otherCountries];
      this.selectedCountry = mainCountries[0];
  
      // Elementos del selector de país
      this.countrySelector = this.form.querySelector('.country-selector');
      this.selectedFlag = this.form.querySelector('.selected-flag');
      this.countryDropdown = this.form.querySelector('.country-dropdown');
  
      if (!this.countrySelector || !this.countryDropdown || !this.selectedFlag) {
        console.error(`Country selector elements not found in form ${this.formId}`);
        return;
      }
  
      this.buildDropdown();
  
      this.countrySelector.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleDropdown();
      });
  
      document.addEventListener('click', event => {
        if (this.countryDropdown && !this.countryDropdown.classList.contains('hidden') && !this.countrySelector.contains(event.target) && !this.countryDropdown.contains(event.target)) {
          this.toggleDropdown(false);
        }
      });
  
      if (this.countrySelect) {
        this.countrySelect.addEventListener('change', () => {
          const selectedCode = this.countrySelect.value;
          if (selectedCode) {
            this.syncCountrySelectors(selectedCode, false);
          }
        });
      }
    }
  
    buildDropdown() {
      this.countryDropdown.innerHTML = '';
  
      this.countries.forEach(country => {
        const countryItem = document.createElement('div');
        countryItem.className = 'flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 cursor-pointer';
        countryItem.innerHTML = `
          <img src="https://flagcdn.com/16x12/${country.code}.webp" alt="${country.name}" class="w-4 h-3 object-cover rounded-sm">
          <span class="text-sm">${country.name}</span>
          <span class="text-xs text-gray-500 ml-auto">${country.dialCode}</span>
        `;
  
        countryItem.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          this.selectCountry(country);
          this.toggleDropdown(false);
        });
  
        this.countryDropdown.appendChild(countryItem);
      });
    }
  
    selectCountry(country) {
      this.selectedCountry = country;
      this.selectedFlag.src = `https://flagcdn.com/16x12/${country.code}.webp`;
      this.selectedFlag.alt = country.name;
      this.syncCountrySelectors(country.code, true);
    }
  
    toggleDropdown(show) {
      if (show === undefined) {
        this.countryDropdown.classList.toggle('hidden');
      } else if (show) {
        this.countryDropdown.classList.remove('hidden');
      } else {
        this.countryDropdown.classList.add('hidden');
      }
    }
  
    syncCountrySelectors(countryCode, fromDropdown = false) {
      if (fromDropdown) {
        if (this.countrySelect) {
          this.countrySelect.value = countryCode;
        }
      } else {
        const country = this.countries.find(c => c.code === countryCode);
        if (country) {
          this.selectedCountry = country;
          this.selectedFlag.src = `https://flagcdn.com/16x12/${country.code}.webp`;
          this.selectedFlag.alt = country.name;
        }
      }
    }
  
    setupTermsCheckbox() {
      if (this.termsCheckbox) {
        this.termsCheckbox.addEventListener('change', () => {
          const dotElement = this.termsCheckbox.parentElement.querySelector('.dot');
          const checkIcon = dotElement.querySelector('svg');
  
          if (this.termsCheckbox.checked) {
            dotElement.classList.add('translate-x-6');
            checkIcon.classList.remove('opacity-0');
            checkIcon.classList.add('opacity-100');
          } else {
            dotElement.classList.remove('translate-x-6');
            checkIcon.classList.add('opacity-0');
            checkIcon.classList.remove('opacity-100');
          }
        });
      }
    }
  
    validateField(element, validationFn, errorContainer) {
      const result = validationFn(element.value);
      if (result.isValid) {
        this.hideError(element, errorContainer);
      } else {
        this.showError(element, errorContainer, result.message);
      }
      return result.isValid;
    }
  
    showError(element, errorContainer, message) {
      if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.classList.remove('hidden');
      }
      element.classList.add('border-red-500');
    }
  
    hideError(element, errorContainer) {
      if (errorContainer) {
        errorContainer.classList.add('hidden');
      }
      element.classList.remove('border-red-500');
    }
  
    validateName = value => {
      if (!value.trim()) {
        return {
          isValid: false,
          message: 'Se requiere el nombre completo',
        };
      }
      if (value.trim().length < 3) {
        return {
          isValid: false,
          message: 'El nombre debe tener al menos 3 caracteres',
        };
      }
      return { isValid: true };
    };
  
    validateEmail = value => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) {
        return {
          isValid: false,
          message: '¿Ha introducido el email correctamente? Inténtelo de nuevo.',
        };
      }
      if (!emailRegex.test(value)) {
        return {
          isValid: false,
          message: 'Por favor, introduce un email válido',
        };
      }
      return { isValid: true };
    };
  
    validatePhone = value => {
      if (!value.trim()) {
        return {
          isValid: false,
          message: 'No te olvides de proporcionar un número de teléfono válido.',
        };
      }
      if (value.trim().length < 8) {
        return {
          isValid: false,
          message: 'El número de teléfono debe tener al menos 8 dígitos',
        };
      }
      return { isValid: true };
    };
  
    validateCountry = value => {
      if (!value) {
        return {
          isValid: false,
          message: 'Por favor, selecciona tu país',
        };
      }
      return { isValid: true };
    };
  
    setLoading(isLoading) {
      if (isLoading) {
        this.submitButton.disabled = true;
        this.submitButton.innerHTML = `
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Enviando...
        `;
      } else {
        this.submitButton.disabled = false;
        this.submitButton.innerHTML = 'Aprenda a negociar en línea';
      }
    }
  
    async handleSubmit(e) {
      e.preventDefault();
  
      // Validate all fields
      const isNameValid = this.validateField(this.nameInput, this.validateName, this.nameErrorContainer);
      const isEmailValid = this.validateField(this.emailInput, this.validateEmail, this.emailErrorContainer);
      const isPhoneValid = this.validateField(this.phoneInput, this.validatePhone, this.phoneErrorContainer);
      const isCountryValid = this.validateField(this.countrySelect, this.validateCountry, this.countryErrorContainer);
      const isTermsAccepted = this.termsCheckbox.checked;
  
      if (!isTermsAccepted) {
        alert('Debes aceptar los términos y condiciones para continuar');
        return;
      }
  
      if (isNameValid && isEmailValid && isPhoneValid && isCountryValid && isTermsAccepted) {
        this.setLoading(true);
  
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 2000));
  
          const formData = {
            name: this.nameInput.value,
            email: this.emailInput.value,
            phone: `${this.selectedCountry.dialCode}${this.phoneInput.value}`,
            country: this.countrySelect.value,
            terms: isTermsAccepted,
          };
  
          this.options.onSuccess(formData);
          this.form.reset();
  
          const dotElement = this.termsCheckbox.parentElement.querySelector('.dot');
          const checkIcon = dotElement.querySelector('svg');
          dotElement.classList.remove('translate-x-6');
          checkIcon.classList.add('opacity-0');
          checkIcon.classList.remove('opacity-100');
        } catch (error) {
          this.options.onError(error);
        } finally {
          this.setLoading(false);
        }
      }
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    // Common success and error handlers
    const onSuccess = formData => {
      console.log('Form submitted successfully:', formData);
      alert('¡Formulario enviado correctamente!');
    };
  
    const onError = error => {
      console.error('Error submitting form:', error);
      alert('Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.');
    };
  
    const formElements = document.querySelectorAll('.contact-form');
  
    formElements.forEach(formElement => {
      new FormHandler(formElement, { onSuccess, onError });
    });
  });
  