export type EnrollmentStatus = 'pending' | 'active' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded';

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  status: EnrollmentStatus;
  enrolled_at: Date;
  completed_at: Date | null;
  amount_paid: number | null;
}

export interface Payment {
  id: string;
  enrollment_id: string;
  user_id: string;
  course_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  hesabe_order_id: string | null;
  hesabe_payment_id: string | null;
  hesabe_result_code: string | null;
  gateway_response: any | null;
  created_at: Date;
  updated_at: Date;
}
