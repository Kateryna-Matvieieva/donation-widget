document.addEventListener('DOMContentLoaded', function() {
  const customAmountInput = document.getElementById('custom-amount');
  const donateOptionButtons = document.querySelectorAll('.donate-option-button');

  function updateInputValue(amount) {
    customAmountInput.value = amount.replace(/[^0-9.,]/g, '').replace(',', '.');
    removeActiveClass();
  }

  function removeActiveClass() {
    donateOptionButtons.forEach(button => {
      button.classList.remove('donate-option-button-active');
    });
  }

  function addActiveClass(button) {
    removeActiveClass();
    button.classList.add('donate-option-button-active');
  }

  donateOptionButtons.forEach(button => {
    button.addEventListener('click', function() {
      updateInputValue(this.dataset.amount);
      addActiveClass(this);
    });
  });

  customAmountInput.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9.,]/g, '').replace(/(,|\.)(?=.*\1)/g, '');
    removeActiveClass();
  });

  document.getElementById('donate-button').addEventListener('click', async function() {
    const donateButton = this;
    let amount = customAmountInput.value.replace(/[^0-9,.]/g, '').replace(',', '.');
    amount = Math.round(parseFloat(amount) * 100);
    if (isNaN(amount) || amount <= 0) {
      alert('Введіть коректну суму донату');
      return;
    }

    donateButton.disabled = true;
    donateButton.textContent = 'Генеруємо посилання для оплати...';

    try {
      const response = await fetch(`https://umbrellaua.charity/api/transactions/generate-mono-link?amount=${amount}&destination=XIT_FM`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const {pageUrl} = await response.json();

      window.open(pageUrl, '_blank');
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
      alert('Проблема з генерацією посилання для оплати.');
    } finally {
      donateButton.disabled = false;
      donateButton.textContent = 'Допомогти';
    }
  });

  updateInputValue('200');
});
