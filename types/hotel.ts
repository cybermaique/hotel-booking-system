export interface Hotel {
  id: string;
  name: string;
  location: string;
  images: string[];
  description: string;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  category: string;
  featured: boolean;
  amenities: string[];
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
    pets: boolean;
  };
}

export interface SearchParams {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  rooms?: string | number;
  guests?: string | number;
  sort?: "price" | "rating" | "name";
  ids?: string;
}

export interface ReservationPayload {
  hotelId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  guests: number;
  paymentMethod: "credit_card" | "debit_card" | "pix";
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  cardName?: string;
  specialRequests?: string;
}

export interface ReservationResponse {
  success: boolean;
  reservationId?: string;
  message?: string;
  error?: string;
}

export interface ApiError {
  statusCode: number;
  statusMessage: string;
  message: string;
}
