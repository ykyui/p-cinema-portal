import { Seat } from "./seat";

export interface TicketsTransaction {
  transactionId: number;
  fieldId: number;
  status: string;
  lastUpdateTime: string;
  adult: number;
  student: number;
  child: number;
  disabled: number;
  boughtSeat: Seat[];
}
