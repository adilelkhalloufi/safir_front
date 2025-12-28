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
}


export interface ModalOption {
  handleCancel?: any
  isModalVisible?: any
  isUpdate?: any
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


