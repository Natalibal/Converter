 /*Створюємо змінну куди складаються дані отримані з API*/
 let data;

 fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
     .then(response => response.json())
     .then(json => data = json)

 const grid = document.querySelector('.grid');
 const headerDate = document.querySelector('.header__date');
 const currency_one = document.querySelector('#currency_one');
 const currency_two = document.querySelector('#currency_two');
 const reset = document.querySelector('#reset');
 var amountCurrency = document.querySelector('#amountCurrency');
 var result = document.querySelector('#result');
 var output = document.querySelector('.output');

 setTimeout(function() {
     data.forEach(function(el) {
         /*Прибираємо зайві валюти*/
         if (el.r030 !== 959 && el.r030 !== 962 && el.r030 !== 960 && el.r030 !== 961 && el.r030 !== 964) {
             let html = `
         <div class="grid__item">
             <div class="grid__itemName">${el.txt}</div>
             <div class="grid__itemRate">${el.rate}</div>
             <div class="grid__itemAbbrev">${el.cc}</div>                                      
             <div class="grid__itemCodeCurrency">${el.r030}</div>
         </div>`

             /* Сортуємо список валют за алфавитом (авторський варіант)*/
             data.sort(function(a, b) {
                 return a.txt.localeCompare(b.txt);
             });

             /*Створюємо таблицю валют*/
             grid.insertAdjacentHTML('beforeend', html);

             /*Створюємо селект із варінтами вибору валют */
             let option = document.createElement('option');
             option.innerHTML = el.txt;
             currency_one.appendChild(option);
         }
     });

     /*Додаємо у набір даних дані про актуальну дату*/
     headerDate.innerText += data[0].exchangedate;

     /* Сортуємо список валют в selector за алфавитом варіант*/
     var arr = [];
     for (i = 0; i < currency_one.options.length; i++) {
         console.log(currency_one.options[i].innerText);
         arr.push(currency_one.options[i].innerText);
     }
     arr.sort(function(a, b) {
         return a.localeCompare(b);
     });

     /*Перетворюємо псевдо масив currency_one.options в масив за допомогою метода .from*/
     let newArr = Array.from(currency_one.options);
     newArr.forEach(function(el, i) {
         el.innerText = arr[i];
     });

     var firstCurr = 1;
     var secondCurr = 1;
     var amountCurrencyValue;

     /* Функція для розрохунку співідношення валют*/
     function showResult() {
         let converter;
         amountCurrencyValue = amountCurrency.value;
         if (amountCurrencyValue < 0) {
             result.innerText = '0.00';
         } else {
             converter = amountCurrencyValue * (firstCurr / secondCurr);
             result.innerText = converter.toFixed(2);
         }
     }

     let newData;
     fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
         .then(response => response.json())
         .then(json => newData = json)

     setTimeout(function() {
         currency_one.addEventListener('change', function() {

             /*Додаємо значення rate = 1 українській гривні*/
             if (optionUA.innerText == 'Українська гривня') {
                 firstCurr = 1;
             }
             newData.forEach(function(el) {
                 if (el.txt === currency_one.options[currency_one.selectedIndex].text) {
                     firstCurr = el.rate;
                 }
             });
             showResult()
         });

         currency_two.addEventListener('change', function() {

             /*Додаємо значення rate = 1 українській гривні*/
             if (optionUA.innerText == 'Українська гривня') {
                 secondCurr = 1;
             }
             newData.forEach(function(el) {
                 if (el.txt === currency_two.options[currency_two.selectedIndex].text) {
                     secondCurr = el.rate;
                     console.log(secondCurr);
                 }
             });
             showResult();
         });
     }, 2000);

     amountCurrency.addEventListener('input', showResult);

     /*Скидання набраних значень в полях вводу тексту*/
     reset.addEventListener('click', function() {
         amountCurrency.value = 0;
         result.innerText = '0.00';
     });

     reset.addEventListener('touch', function() {
         amountCurrency.value = 0;
         result.innerText = '0.00';
     });

     /*Додаємо українську гривню в селект*/
     let optionUA = document.createElement('option');
     optionUA.innerText = 'Українська гривня';
     currency_one.insertAdjacentElement('afterbegin', optionUA);

     /*встановлюємо option  атрибут 'selected' значення 'selected'*/
     optionUA.setAttribute('selected', 'selected');

     /*Створюємо клон масиву currency_one*/
     let currency_two = currency_one.cloneNode(true);

     /*Додаєм унікальний ідентифікатор для currency_two*/
     currency_two.id = 'currency_two';

     /*Додаємо масив currency_two після елемента в розмітці з классом .output*/
     output.insertAdjacentElement('afterend', currency_two);
 }, 1000);