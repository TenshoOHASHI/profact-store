import { Email} from './'

export interface OrderProps {
  id: string;
  coustomerEmail: Email;
  customerName: string;
  items: OrderStatus[];
  status: OrderStatus;
  stripePaymentIntentId?: string;
  guestSessionId?: stirng;
  createdAt: Date;
  updateAt: Date;
}

export class Order {
  // private fields
  private readonly _id: string;
  private readonly _customerEmail: Email:
  private readonly _customerName: string;
  private readonly _items: OrderItem[];
  private _state: OrderState;
  private _stripePaymentIntentId?: string;
  private readonly _guestSessionId: string;
  private readonly _createAt: Date;
  private readonly _updateAt: Date;

  // constracter

  constructor(props: OrderProps) {
    this._id = props.id
    this._customerEmail = props.coustomerEmail
    this._customerName = props.customerName
    this._items = props.items
    this._state = props.status
    this._stripePaymentIntentId = props.stripePaymentIntentId
    this._guestSessionId = props.guestSessionId
    this._createAt = props.createdAt
    this._updateAt = props.updateAt
  }

}
