import { Assurance, Customer, Payment, Prescription, TypeGlasses } from "./admin";



 


export interface Cart {

  items: any[];
  total_command: number;
  total_payment: number;
  rest_a_pay: number;
  nbr_items: number;
  prescription: Prescription | null;
  payment: Payment | null;
  customer: Customer | null;
  is_customer: boolean;
  glass_types: TypeGlasses[] ;
  assurance: Assurance | null;
  discount: number;
  is_invoice : Boolean;
  advance : number


}
