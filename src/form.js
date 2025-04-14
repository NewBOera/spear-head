class FormHandler {
    constructor(formSelector, options = {}) {
      this.form = document.querySelector(formSelector);
      
      if (!this.form) {
        console.error(`Formulario no encontrado: ${formSelector}`);
        return;
      }
  
      this.options = {
        onSuccess: options.onSuccess || this.defaultSuccessHandler,
        onError: options.onError || this.defaultErrorHandler,
        endpoint: options.endpoint || '',
        toastDuration: options.toastDuration || 3000,
        validations: options.validations || {}
      };
  
      this.initElements();
      this.setupValidation();
      this.setupCountrySelector();
      this.setupTermsToggle();
      this.setupEventListeners();
    }
  
    initElements() {
      this.nameInput = this.form.querySelector('input[name="name"]') || this.form.querySelector('#first-name');
      this.lastNameInput = this.form.querySelector('input[name="lastName"]') || this.form.querySelector('#last-name');
      this.emailInput = this.form.querySelector('input[name="email"]');
      this.phoneInput = this.form.querySelector('input[name="phone"]');
      this.countrySelect = this.form.querySelector('select[name="country"]');
      this.projectTypeSelect = this.form.querySelector('select[name="projectType"]') || this.form.querySelector('#project-type');
      this.termsCheckbox = this.form.querySelector('input[name="terms"]') || this.form.querySelector('#privacy-checkbox');
      this.submitButton = this.form.querySelector('button[type="submit"]');
      
      this.defaultButtonText = this.submitButton ? this.submitButton.innerHTML : 'Enviar';
      
      const formId = this.form.id || 'contact-form';
      this.formIndex = formId.replace('contactForm', '').replace('contact-form', '');
      
      this.errorContainers = {
        name: document.getElementById(`name-error-${this.formIndex}`),
        lastName: document.getElementById(`lastName-error-${this.formIndex}`),
        email: document.getElementById(`email-error-${this.formIndex}`),
        phone: document.getElementById(`phone-error-${this.formIndex}`),
        country: document.getElementById(`country-error-${this.formIndex}`),
        projectType: document.getElementById(`project-type-error-${this.formIndex}`)
      };
    }
  
    setupValidation() {
      this.validators = {
        name: this.validateName,
        lastName: this.validateName,
        email: this.validateEmail,
        phone: this.validatePhone,
        country: this.validateCountry,
        projectType: this.validateProjectType
      };
    }
  
    setupCountrySelector() {
      const mainCountries = [
        { code: 'mx', name: 'México', dialCode: '+52' },
        { code: 'us', name: 'Estados Unidos', dialCode: '+1' },
        { code: 'es', name: 'España', dialCode: '+34' },
        { code: 'ca', name: 'Canadá', dialCode: '+1' },
        { code: 'uk', name: 'Reino Unido', dialCode: '+44' },
        { code: 'nl', name: 'Países Bajos', dialCode: '+31' }
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
        { code: 've', name: 'Venezuela', dialCode: '+58' }
      ];
  
      this.countries = [...mainCountries, ...otherCountries];
      this.selectedCountry = mainCountries[0];
  
      this.countrySelector = this.form.querySelector('.country-selector');
      
      if (!this.countrySelector) return;
      
      this.selectedFlag = this.countrySelector.querySelector('.selected-flag');
      this.countryDropdown = this.form.querySelector('.country-dropdown');
  
      if (!this.countryDropdown || !this.selectedFlag) {
        console.log(`Elementos del selector de país no encontrados en el formulario ${this.form.id}`);
        return;
      }
  
      this.buildCountryDropdown();
    }
  
    buildCountryDropdown() {
      if (!this.countryDropdown) return;
      
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
  
    setupTermsToggle() {
      if (!this.termsCheckbox) return;
      
      const dotElement = this.termsCheckbox.parentElement?.querySelector('.dot');
      const checkIcon = dotElement?.querySelector('svg');
      
      if (!dotElement || !checkIcon) return;
      
      if (this.termsCheckbox.checked) {
        dotElement.classList.add('translate-x-6');
        checkIcon.classList.remove('opacity-0');
        checkIcon.classList.add('opacity-100');
      } else {
        dotElement.classList.remove('translate-x-6');
        checkIcon.classList.add('opacity-0');
        checkIcon.classList.remove('opacity-100');
      }
    }

    setupEventListeners() {
      if (!this.form) return;
  
      if (this.nameInput) {
        this.nameInput.addEventListener('input', () => 
          this.validateField(this.nameInput, 'name', this.errorContainers.name));
      }
      
      if (this.lastNameInput) {
        this.lastNameInput.addEventListener('input', () => 
          this.validateField(this.lastNameInput, 'lastName', this.errorContainers.lastName));
      }
      
      if (this.emailInput) {
        this.emailInput.addEventListener('input', () => 
          this.validateField(this.emailInput, 'email', this.errorContainers.email));
      }
      
      if (this.phoneInput) {
        this.phoneInput.addEventListener('input', () => 
          this.validateField(this.phoneInput, 'phone', this.errorContainers.phone));
      }
      
      if (this.countrySelect) {
        this.countrySelect.addEventListener('change', () => {
          this.validateField(this.countrySelect, 'country', this.errorContainers.country);
          
          const selectedCode = this.countrySelect.value;
          if (selectedCode) {
            this.syncCountrySelectors(selectedCode, false);
          }
        });
      }
      
      if (this.projectTypeSelect) {
        this.projectTypeSelect.addEventListener('change', () => 
          this.validateField(this.projectTypeSelect, 'projectType', this.errorContainers.projectType));
      }
  
      if (this.countrySelector) {
        this.countrySelector.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          this.toggleDropdown();
        });
  
        document.addEventListener('click', event => {
          if (this.countryDropdown && 
              !this.countryDropdown.classList.contains('hidden') && 
              !this.countrySelector.contains(event.target) && 
              !this.countryDropdown.contains(event.target)) {
            this.toggleDropdown(false);
          }
        });
      }
  
      if (this.termsCheckbox) {
        this.termsCheckbox.addEventListener('change', () => {
          const dotElement = this.termsCheckbox.parentElement?.querySelector('.dot');
          const checkIcon = dotElement?.querySelector('svg');
          
          if (!dotElement || !checkIcon) return;
  
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
  
      this.form.addEventListener('submit', e => this.handleSubmit(e));
    }
  
    validateField(element, fieldName, errorContainer) {
      if (!element) return { isValid: true };
      
      const validationFn = this.validators[fieldName];
      if (!validationFn) return { isValid: true };
      
      const result = validationFn.call(this, element.value, fieldName);
      
      if (result.isValid) {
        this.hideError(element, errorContainer);
      } else {
        this.showError(element, errorContainer, result.message);
      }
      
      return result.isValid;
    }
  
    validateName(value, fieldName = 'name') {
      const fieldLabel = fieldName === 'lastName' ? 'Apellido' : 'Nombre';
      
      if (!value.trim()) {
        return {
          isValid: false,
          message: `Se requiere el ${fieldLabel}`,
        };
      }
      
      if (value.trim().length < 2) {
        return {
          isValid: false,
          message: `El ${fieldLabel} debe tener al menos 2 caracteres`,
        };
      }
      
      if (value.trim().length > 50) {
        return {
          isValid: false,
          message: `El ${fieldLabel} debe tener menos de 50 caracteres`,
        };
      }
      
      const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
      if (!nameRegex.test(value)) {
        return {
          isValid: false,
          message: `El ${fieldLabel} contiene caracteres no válidos`,
        };
      }
      
      return { isValid: true };
    }
  
    validateEmail(value) {
      if (!value.trim()) {
        return {
          isValid: false,
          message: 'Por favor, introduce tu correo electrónico',
        };
      }
      
      if (value.trim().length > 100) {
        return {
          isValid: false,
          message: 'El correo debe tener menos de 100 caracteres',
        };
      }
      
      
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (!emailRegex.test(value)) {
        return {
          isValid: false,
          message: 'Por favor, introduce un correo electrónico válido',
        };
      }
      
      return { isValid: true };
    }
  
    validatePhone(value) {
      if (!value.trim()) {
        return {
          isValid: false,
          message: 'Por favor, introduce tu número de teléfono',
        };
      }
      
      if (value.trim().length < 8) {
        return {
          isValid: false,
          message: 'El número de teléfono debe tener al menos 8 dígitos',
        };
      }
      
      return { isValid: true };
    }
  
    validateCountry(value) {
      if (!value) {
        return {
          isValid: false,
          message: 'Por favor, selecciona tu país',
        };
      }
      
      return { isValid: true };
    }
  
    validateProjectType(value) {
      if (!value) {
        return {
          isValid: false,
          message: 'Por favor, selecciona un tipo de proyecto',
        };
      }
      
      return { isValid: true };
    }
  
    showError(element, errorContainer, message) {
      if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.classList.remove('hidden');
      } else {
        
        this.showToast(message, 'error');
      }
      
      element.classList.add('border-red-500');
    }
  
    hideError(element, errorContainer) {
      if (errorContainer) {
        errorContainer.classList.add('hidden');
      }
      
      element.classList.remove('border-red-500');
    }
  
    
    showToast(message, type = 'error') {
      const toast = document.createElement('div');
      toast.className = `fixed bottom-4 right-4 py-2 px-10 lg:px-16 lg:py-3 rounded-lg text-white shadow-lg z-50 lg:text-base text-sm font-medium ${type === 'error' ? 'bg-red-700' : 'bg-green-600'}`;
      toast.textContent = message;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.remove();
      }, this.options.toastDuration);
    }
  
    
    selectCountry(country) {
      this.selectedCountry = country;
      
      if (this.selectedFlag) {
        this.selectedFlag.src = `https://flagcdn.com/16x12/${country.code}.webp`;
        this.selectedFlag.alt = country.name;
      }
      
      this.syncCountrySelectors(country.code, true);
    }
  
    toggleDropdown(show) {
      if (!this.countryDropdown) return;
      
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
        if (country && this.selectedFlag) {
          this.selectedCountry = country;
          this.selectedFlag.src = `https://flagcdn.com/16x12/${country.code}.webp`;
          this.selectedFlag.alt = country.name;
        }
      }
    }
  
    
    setLoading(isLoading) {
      if (!this.submitButton) return;
      
      if (isLoading) {
        this.submitButton.disabled = true;
        this.submitButton.innerHTML = `
          <div class="flex items-center justify-center">
            <svg class="animate-spin h-5 w-5 mx-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg> Enviando...
          </div>
        `;
      } else {
        this.submitButton.disabled = false;
        this.submitButton.innerHTML = this.defaultButtonText;
      }
    }
  
    
    defaultSuccessHandler(formData) {
      console.log('Formulario enviado correctamente:', formData);
      this.showToast('¡Tu mensaje ha sido enviado correctamente!', 'success');
    }
  
    defaultErrorHandler(error) {
      console.error('Error al enviar el formulario:', error);
      this.showToast('Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.');
    }
  
    
    collectFormData() {
      const formData = new FormData();
      
      if (this.nameInput) {
        formData.append('firstName', this.nameInput.value.trim());
      }
      
      if (this.lastNameInput) {
        formData.append('lastName', this.lastNameInput.value.trim());
      }
      
      if (this.emailInput) {
        formData.append('email', this.emailInput.value.trim());
      }
      
      if (this.phoneInput) {
        const phoneValue = this.phoneInput.value.trim();
        const formattedPhone = this.selectedCountry ? 
          `${this.selectedCountry.dialCode}${phoneValue}` : 
          phoneValue;
        
        formData.append('phone', formattedPhone);
      }
      
      if (this.countrySelect) {
        formData.append('country', this.countrySelect.value);
      }
      
      if (this.projectTypeSelect) {
        formData.append('projectType', this.projectTypeSelect.value);
      }
      
      return formData;
    }
  
    
    validateAllFields() {
      let isValid = true;
      
      
      if (this.nameInput) {
        const nameValid = this.validateField(
          this.nameInput, 
          'name', 
          this.errorContainers.name
        );
        isValid = isValid && nameValid;
      }
      
      
      if (this.lastNameInput) {
        const lastNameValid = this.validateField(
          this.lastNameInput, 
          'lastName', 
          this.errorContainers.lastName
        );
        isValid = isValid && lastNameValid;
      }
      
      
      if (this.emailInput) {
        const emailValid = this.validateField(
          this.emailInput, 
          'email', 
          this.errorContainers.email
        );
        isValid = isValid && emailValid;
      }
      
      
      if (this.phoneInput) {
        const phoneValid = this.validateField(
          this.phoneInput, 
          'phone', 
          this.errorContainers.phone
        );
        isValid = isValid && phoneValid;
      }
      
      
      if (this.countrySelect) {
        const countryValid = this.validateField(
          this.countrySelect, 
          'country', 
          this.errorContainers.country
        );
        isValid = isValid && countryValid;
      }
      
      
      if (this.projectTypeSelect) {
        const projectTypeValid = this.validateField(
          this.projectTypeSelect, 
          'projectType', 
          this.errorContainers.projectType
        );
        isValid = isValid && projectTypeValid;
      }
      
      
      if (this.termsCheckbox && !this.termsCheckbox.checked) {
        this.showToast('Por favor, acepta la Política de Privacidad');
        isValid = false;
      }
      
      return isValid;
    }
  
    // Form submit
    async handleSubmit(e) {
      e.preventDefault();
      
      
      const isValid = this.validateAllFields();
      
      if (!isValid) return;
      
      
      this.setLoading(true);
      
      try {
        const formData = this.collectFormData();
        
        if (this.options.endpoint) {
          const response = await fetch(
            this.options.endpoint,
            {
              method: 'POST',
              mode: 'no-cors',
              body: formData,
            }
          );
          
          
          this.options.onSuccess.call(this, Object.fromEntries(formData));
        } else {
        
          await new Promise(resolve => setTimeout(resolve, 1000));
          this.options.onSuccess.call(this, Object.fromEntries(formData));
        }
        
        
        this.form.reset();
        
        if (this.termsCheckbox) {
          const dotElement = this.termsCheckbox.parentElement?.querySelector('.dot');
          const checkIcon = dotElement?.querySelector('svg');
          
          if (dotElement && checkIcon) {
            dotElement.classList.remove('translate-x-6');
            checkIcon.classList.add('opacity-0');
            checkIcon.classList.remove('opacity-100');
          }
        }
      } catch (error) {
        this.options.onError.call(this, error);
      } finally {
        
        this.setLoading(false);
      }
    }
  }
  
  
  document.addEventListener('DOMContentLoaded', () => {
  
    const onSuccess = function(formData) {
      console.log('Formulario enviado correctamente:', formData);
      this.showToast('¡Tu mensaje ha sido enviado correctamente!', 'success');
    };
  
    const onError = function(error) {
      console.error('Error al enviar el formulario:', error);
      this.showToast('Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.');
    };
  
    
    const contactForms = document.querySelectorAll('.contact-form, #contact-form');
    
    contactForms.forEach((formElement, index) => {
      
      if (!formElement.id) {
        formElement.id = `contact-form-${index}`;
      }
      
      new FormHandler(`#${formElement.id}`, {
        onSuccess,
        onError,
        endpoint: 'GOOGLE_SHEETS_ENDPOINT',
        toastDuration: 3000
      });
    });
  });