import { v4 as uuidGen } from 'uuid';

class User {
   token: string;
   transactions: Transaction[];
   constructor(public name: string, public cpf: string, public email: string, public age: number) {
      this.name = name;
      this.cpf = cpf;
      this.token = uuidGen();
      this.email = email;
      this.age = age;
      this.transactions = [];
   }
}

class Transaction {
   constructor(public naoSei: string) {
      this.naoSei = naoSei;
   }
}

let users: User[] = [];

export { users, User, Transaction };
