// 미션 3: 빈칸 채우기
function createAccount(initialBalance, secretPassword) {
  // 1. 잔액(balance)은 여기서만 존재함 (Closure - 은닉화)
  let balance = initialBalance;

  return {
    // 입금 기능
    deposit: function (amount) {
      balance += amount;
      return balance;
    },
    // 출금 기능 (비밀번호 확인 필요)
    withdraw: function (amount, password) {
      // 1. 비밀번호가 틀리면 "접근 거부" 리턴
      // 2. 비밀번호 맞으면 잔액 차감 후 리턴
    },
    // 잔액 조회 (비밀번호 확인 필요)
    getBalance: function (password) {
      // 비밀번호 맞으면 잔액 리턴
    },
  };
}

// 테스트
const myAccount = createAccount(1000, '1234');

console.log(myAccount.balance); // undefined (이게 핵심! 밖에서 못 봄)
myAccount.deposit(500); // 1500
console.log(myAccount.withdraw(200, '0000')); // "접근 거부"
console.log(myAccount.withdraw(200, '1234')); // 1300
