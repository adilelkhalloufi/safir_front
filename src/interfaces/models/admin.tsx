export interface Admin {
  token?: string
  user?: User
}

export interface User {
  id?: number
  name?: string
  email?: string
  password?: string
  role?: string
  token?: string
  stores?: Store[]
}
export interface Store {
  id?: number
  name?: string
  address?: string
  phone?: string
  email?: string
  city?: City
  user_id?: number
}
export interface City {
  id?: number
  name?: string
  code_postal?: string
}

export interface ModalOption {
  handleCancel?: any
  isModalVisible?: any
  isUpdate?: any
}

export interface Company {
  id: string
  name?: string
  email?: string
  phone?: string
  address?: string
  logo?: string
  website?: string
  zip_code?: string
}

export interface Assurance {
  id: string
  name?: string
  description?: string
  value?: string

}

export interface OrderPurchase {
  id: string
  order_number?: string
  reference?: string
  created_at?: string
  total_command?: number
  discount?: number
  advance?: number
  total_payment?: number
  invoice_total?: number
  rest_a_pay?: number
  status?: string
  color?: string
  supplier?: Supplier
  details?: Product[] | any[]
  payments?: Payment[]
  user?: User
  paid_method_id?: number
  payment_term?: string
  due_date?: string
  public_note?: string
  private_note?: string
  customer?: Customer
  prescription?: Prescription
}

export interface OrderSale {
  id: string
  order_number?: string
  created_at?: string
  total_command?: number
  discount?: number
  advance?: number
  is_invoice?: boolean
  total_payment?: number
  rest_a_pay?: number
  status?: string
  customer?: Customer
  details?: Product[]
  payments?: Payment[]
  prescription?: Prescription
  user?: User
  invoice_total?: number


}

export interface Setting {
  id: string
  licence?: string
  expired?: boolean
  expired_date?: Date
  invoice_number?: number
  order_purchase_number?: number
  order_sale_number?: number
  header?: string
  footer?: string
  company_name?: string
}

export interface Doctor {
  id: string
  name?: string
  email?: string
  phone?: string
  specialization?: string
  address?: string
  image?: string
}
export interface Categorie {
  id: number
  name: string
  slug?: string
  description?: string
}
export interface Brand {
  id: number
  name: string
  slug?: string
  logo?: string
  description?: string
}

export interface ModePayemnt {
  id: string
  name?: string
  code?: string
  description?: string
  icon?: string
}
export interface PayementTerme {
  id: string
  name?: string

}

export interface OrderItem {
  prodcut_id?: string
  quantity: number
  qte: number
  invoice_price: number
  price: number
  name?: string
  discount?: number
  product?: Product
  order_id?: string
  order?: OrderPurchase
}
export interface Product {
  id: any
  name?: string
  reference?: string
  codebar?: string
  slug?: string
  description?: string
  image?: string
  price: number
  stock_min?: string
  stock_max?: string
  brand?: Brand
  categorie?: Categorie
  archive?: boolean
  quantity: number
  qte: number
  category_id: null | number




}

export interface Warehouse {
  id: string
  name?: string
  address?: string
  products?: Product
}

export interface Supplier {
  id: string
  first_name?: string
  last_name?: string
  company_name?: string
  email?: string
  phone?: string
  address?: string
  city?: City
  country?: string
  zip_code?: string
  value?: string
  name?: string
}

export interface Customer {
  id: string
  cin?: string
  first_name?: string
  last_name?: string
  adress?: string
  phone?: string
  email?: string
  birthday?: string
  gender?: string
  status?: string
  name?: string
  value?: string


}

export interface TypeGlasses {
  id: string
  name?: string
  value?: number
  price: number
  image?: string
  key?: string
}

export interface Prescription {
  id?: number;
  loin_od_sph?: string;
  loin_og_sph?: string;
  loin_od_cyl?: string;
  loin_og_cyl?: string;
  loin_od_axe?: string;
  loin_og_axe?: string;
  loin_od_add?: string;
  loin_og_add?: string;
  loin_od_prisme?: string;
  loin_og_prisme?: string;
  loin_od_base?: string;
  loin_og_base?: string;
  pres_od_sph?: string;
  pres_og_sph?: string;
  pres_od_cyl?: string;
  pres_og_cyl?: string;
  pres_od_axe?: string;
  pres_og_axe?: string;
  pres_od_prisme?: string;
  pres_og_prisme?: string;
  pres_od_base?: string;
  pres_og_base?: string;
  pres_od_add?: string;
  pres_og_add?: string;
  lentille_od_sph?: string;
  lentille_og_sph?: string;
  lentille_od_cyl?: string;
  lentille_og_cyl?: string;
  lentille_od_axe?: string;
  lentille_og_axe?: string;
  lentille_od_rayon?: string;
  lentille_og_rayon?: string;
  lentille_od_diametre?: string;
  lentille_og_diametre?: string;
  lentille_od_edgeu?: string;
  lentille_og_edgeu?: string;
  od_ecart?: string;
  og_ecart?: string;
  od_ht?: string;
  og_ht?: string;
  p?: string;
  od_mv?: string;
  og_mv?: string;
  od_mh?: string;
  og_mh?: string;
  od_rv?: string;
  og_rv?: string;
  od_rh?: string;
  og_rh?: string;
  user_id?: number;
  customer_id?: number;
  order_id?: number;
  type_glasse_id?: string;
  type_prescription?: string;

}

export interface Payment {
  id?: number;
  amount?: number
  created_at?: any;
  order_id?: number;
  payment_method?: string;
  mode_payement_id?: number;

}

export interface EnityColumnsProps {
  onEdit?: (model: any) => void;
  onDelete?: (model: any) => void;
  onAction?: (model: any, type?: string) => void;
  onShow?: (model: any) => void;
}

export interface FormModalProps {
  open: boolean;
  onClose: () => void;
  model?: any;
  title?: string;
}


export interface Suggestion {
  id: number;
  title: string;
  description: string;
  category_id: number;
  category?: string
  status?: string;
  priority?: string;
  created_at?: string;
  updated_at?: string;
}