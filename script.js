'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
};

const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};

const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// DISPLAYINNG MOVEMENTS
const displayMovements = function (movements, sort = false) {
    containerMovements.innerHTML = '';

    const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

    movs.forEach(function (mov, i) {
        const type = mov > 0 ? 'deposit' : 'withdrawal';

        const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
            i + 1
        } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;

        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
};
// CREATING USERNAME
const createUsername = function (accs) {
    accs.forEach(function (acc) {
        acc.username = acc.owner
            .toLowerCase()
            .split(' ')
            .map((mov) => mov[0])
            .join('');
    });
};
createUsername(accounts);
console.log(accounts);

// DISPLAYING TOTAL BALANCE
const calcDisplayBalance = function (acc) {
    acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);
    labelBalance.textContent = `${acc.balance}€`;
};

// DISPLAYING SUMMAY STATISTICS
const calcDisplaySummary = function (acc) {
    const income = acc.movements
        .filter((mov) => mov > 0)
        .reduce((acc, mov) => acc + mov);
    const outcome = acc.movements
        .filter((mov) => mov < 0)
        .reduce((acc, mov) => acc + mov);
    const interest = acc.movements
        .filter((mov) => mov > 0)
        .map((deposits) => (deposits * acc.interestRate) / 100)
        .filter((mov) => mov >= 1)
        .reduce((acc, curr) => acc + curr);
    labelSumIn.textContent = `${income}€`;
    labelSumOut.textContent = `${Math.abs(outcome)}€`;
    labelSumInterest.textContent = `${interest}€`;
};

// Diplay Functions

const displayUi = function (acc) {
    // display balance
    calcDisplayBalance(acc);
    // display movements
    displayMovements(acc.movements);
    // display summary
    calcDisplaySummary(acc);
};

// IMPLEMENTING LOGIN
let currentUser;
btnLogin.addEventListener('click', function (e) {
    e.preventDefault();
    currentUser = accounts.find(
        (acc) => inputLoginUsername.value === acc.username
    );

    if (Number(inputLoginPin?.value) === currentUser.pin) {
        // display UI and Welcome message
        labelWelcome.textContent = `Welcome back ${
            currentUser.owner.split(' ')[0]
        }`;
        inputLoginUsername.value = inputLoginPin.value = '';
        inputLoginPin.blur();

        containerApp.style.opacity = 100;
        displayUi(currentUser);
    }
});

// IMPLEMENTING TRANSFER
btnTransfer.addEventListener('click', function (e) {
    e.preventDefault();
    const amount = Number(inputTransferAmount.value);
    const reciverAcc = accounts.find(
        (acc) => inputTransferTo.value === acc.username
    );
    inputTransferAmount.value = inputTransferTo.value = '';
    if (
        amount > 0 &&
        currentUser.balance >= amount &&
        reciverAcc &&
        reciverAcc?.username !== currentUser.username
    ) {
        currentUser.movements.push(-amount);
        reciverAcc.movements.push(amount);
        displayUi(currentUser);
    }
});

// IMPLEMENTING REQUEST LOAN
btnLoan.addEventListener('click', function (e) {
    e.preventDefault();
    const amountLoan = Number(inputLoanAmount.value);
    if (
        amountLoan > 0 &&
        currentUser.movements.some((mov) => mov >= amountLoan * 0.1)
    ) {
        currentUser.movements.push(amountLoan);
        displayUi(currentUser);
    }
    inputLoanAmount.value = '';
});

// DELETING/CLOSING ACCOUNT
btnClose.addEventListener('click', function (e) {
    e.preventDefault();
    if (
        inputCloseUsername.value === currentUser.username &&
        Number(inputClosePin.value) === currentUser.pin
    ) {
        const index = accounts.findIndex(
            (acc) => acc.username === currentUser.username
        );
        accounts.splice(index, 1);
        containerApp.style.opacity = 0;
    }
    inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
    e.preventDefault();
    displayMovements(currentUser.movements, !sorted);
    sorted = !sorted;
});

// /////////////////////////////////////////////////
// /////////////////////////////////////////////////
// // LECTURES

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// /////////////////////////////////////////////////

// for (const [i, mov] of movements.entries()) {
//   if (mov > 0) {
//     console.log(`Movement ${i + 1}:You deposited ${mov}`);
//   } else {
//     console.log(`Movement ${i + 1}:You withdraw ${Math.abs(mov)}`);
//   }
// }

// console.log('--FOR EACH--');
// movements.forEach(function (mov, i, arr) {
//   if (mov > 0) {
//     console.log(`Movement ${i + 1}:You deposited ${mov}`);
//   } else {
//     console.log(`Movement ${i + 1}:You withdraw ${Math.abs(mov)}`);
//   }
// });

// // MAPS
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value} `);
// });

// // SET
// const uniqueCurrencies = new Set(['USD', 'PHP', 'EUR', 'USD', 'PHP']);
// console.log(uniqueCurrencies);
// uniqueCurrencies.forEach(function (value, _, map) {
//   console.log(`${_}: ${value}`);
// });

// ///////////////////////////////////////////////////
// // map METHOD
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const euroToUSD = 1.1;
// // const movementsUSD = movements.map(function (mov) {
// //   return mov * euroToUSD;
// // });
// const movementsUSD = movements.map(mov => mov * euroToUSD);

// console.log(movements);
// console.log(movementsUSD);

// const movementDescription = movements.map(
//   (mov, i) =>
//     `Movement ${i + 1}:You ${mov > 0 ? 'deposited' : 'withdrawed'} ${mov}`
// );

// console.log(movementDescription);

// ///////////////////////////////////////////////////
// // filter METHOD
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const deposits = movements.filter(mov => mov > 0);
// console.log(deposits);

// const withdrawals = movements.filter(mov => mov < 0);
// console.log(withdrawals);

///////////////////////////////////////////////////
// reduce METHOD
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const balance = movements.reduce(function (acc, curr, i, arr) {
//   console.log(`iteration: ${i} ${acc}`);
//   return acc + curr;
// }, 0);

// console.log(balance);

// // max value
// const max = function (movements) {
//   const maxValue = movements.reduce(function (acc, curr) {
//     if (acc > curr) {
//       return acc;
//     } else {
//       return curr;
//     }
//   }, movements[0]);
//   console.log(maxValue);
// };

// max(movements);

///////////////////////////////////////////////////
// challenge #2
// const arr1 = [5, 2, 4, 1, 15, 8, 3];
// const arr2 = [16, 6, 10, 5, 6, 1, 4];

// const calcAverageHumanAge = function (ages) {
//   const humanAge = ages.map(age => {
//     if (age <= 2) {
//       return 2 * age;
//     } else {
//       return 16 + age * 4;
//     }
//   });

//   const matureDog = humanAge.filter(age => age >= 18);

//   const aveAge =
//     matureDog.reduce((acc, curr) => acc + curr, 0) / matureDog.length;

//   console.log(humanAge);
//   console.log(matureDog);
//   console.log(aveAge);
// };

// calcAverageHumanAge(arr1);

// pipeline
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const eurToUsd = 1.1;

// const totalDepositUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * eurToUsd)
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(totalDepositUSD);

///////////////////////////////////////////////////
// SOME AND EVERY METHOD
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// console.log(movements);
// console.log(movements.includes(-130));
// // SOME:CONDITION
// console.log(movements.some(mov => mov === -130));
// const anyDeposits = movements.some(mov => mov > 0);
// console.log(anyDeposits);
// // EVERY:CONDITION
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));
// // SEPARATE CALLBACK useful for DRY principle
// const deposit = mov => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

///////////////////////////////////////////////////
// FLAT AND FLATMAP METHOD
// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());
// const arrDeep = [[1, [2, 3]], [[4, 5], 6], 7, 8];
// console.log(arrDeep.flat(2));

// // flat
// const accountMovements = accounts.map(mov => mov.movements);
// console.log(accountMovements.flat().reduce((acc, mov) => acc + mov, 0));

// // flatmap
// const accountMovements2 = accounts
//   .flatMap(mov => mov.movements)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(accountMovements2);

///////////////////////////////////////////////////
// CREATING AND FILLING ARRAYS
// const arr = [1, 2, 3, 4, 5, 6, 7];
// console.log(new Array(1, 2, 3, 4, 5, 6, 7));
// // empty arrays + fill method
// const x = new Array(7);
// x.fill(1, 3, 5);
// console.log(x);
// arr.fill(23, 4, 6);
// console.log(arr);

// // Array.from()
// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);
// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('€', ''))
//   );
//   console.log(movementsUI);
// });

// ///////////////////////////////////////////////////
// // ARRAY METHODS PRACTICE
// // 1
// const bankDepositSum = accounts.flatMap(mov => mov.movements).filter(mov => mov > 0).reduce((sum, mov) => sum + mov,0);
// console.log(bankDepositSum)
// // 2.
// // const numDeposits1000 = accounts.flatMap(acc => acc.movements).filter(mov => mov >= 1000).length;
// const numDeposits1000 = accounts.flatMap(acc => acc.movements).reduce((count, cur) => (cur >= 1000 ? ++count : count),0)
// console.log(numDeposits1000);

// // 3.
// const {deposits, withdrawals} = accounts.flatMap(acc => acc.movements).reduce((sums, curr) => {
//   // curr > 0 ? sums.deposits += curr : sums.withdrawals += curr;
//   sums[curr > 0 ? 'deposits' :'withdrawals'] += curr;
//   return sums
// } ,{deposits: 0, withdrawals:0})
// console.log(deposits, withdrawals);

// // 4.
// // this is a nice title -> This Is a Nice Title
// const converTitleCase = function(title){
//   const exception = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'with']
//   const capitalize = str => str[0].toUpperCase() + str.slice(1);
//   const titleCase = title.toLowerCase().split(' ').map(word => exception.includes(word) ? word : capitalize(word)).join(' ');
//   return capitalize(titleCase);
// }

// console.log(converTitleCase('this is a nice title'));
// console.log(converTitleCase('this is a LONG title BUT not Too long'));
// console.log(converTitleCase('and here is another title with an EXAMPLE'));

///////////////////////////////////////
// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

GOOD LUCK 😀
*/

// TEST DATA:
const dogs = [
    { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
    { weight: 8, curFood: 200, owners: ['Matilda'] },
    { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
    { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
dogs.forEach((dog) => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));
console.log(dogs);

// 2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
const dogSarah = dogs.find((dog) => dog.owners.includes('Sarah'));
console.log(dogSarah);
console.log(
    `Sarah's dog is eating too ${
        dogSarah.curFood > dogSarah.recFood ? 'much' : 'little'
    }`
);

// 3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
const ownersEatTooMuch = dogs
    .filter((dog) => dog.curFood > dog.recFood)
    .flatMap((dog) => dog.owners);
const ownersEatTooLittle = dogs
    .filter((dog) => dog.curFood < dog.recFood)
    .flatMap((dog) => dog.owners);
console.log(ownersEatTooMuch);
console.log(ownersEatTooLittle);

// 4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
console.log(`${ownersEatTooMuch.join(' and ')}'s eat too much!`);
console.log(`${ownersEatTooLittle.join(' and ')}'s eat too litte!`);

// 5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
console.log(dogs.some((dog) => dog.recFood === dog.curFood));

// 6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
// current > (recommended * 0.90) && current < (recommended * 1.10)
console.log(
    dogs.some(
        (dog) =>
            dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1
    )
);

// 7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
const dogsEatingOkay = dogs.filter(
    (dog) => dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1
);
console.log(dogsEatingOkay);

// 8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)
const dogsSorted = dogs.slice().sort((a, b) => a.recFood - b.recFood);
console.log(dogsSorted);
