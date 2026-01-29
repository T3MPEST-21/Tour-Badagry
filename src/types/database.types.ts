export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          phone: string | null
          role: 'passenger' | 'driver' | 'admin'
          driver_status: 'available' | 'busy' | 'offline' | null
          created_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          phone?: string | null
          role?: 'passenger' | 'driver' | 'admin'
          driver_status?: 'available' | 'busy' | 'offline' | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          phone?: string | null
          role?: 'passenger' | 'driver' | 'admin'
          driver_status?: 'available' | 'busy' | 'offline' | null
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          driver_id: string | null
          service_type: 'fleet' | 'tour' | 'airport'
          service_id: string
          date: string
          pickup_details: Json
          price: number | null
          status: 'pending' | 'assigned' | 'driver_accepted' | 'completed' | 'cancelled'
          contact_info: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          driver_id?: string | null
          service_type: 'fleet' | 'tour' | 'airport'
          service_id: string
          date: string
          pickup_details?: Json
          price?: number | null
          status?: 'pending' | 'assigned' | 'driver_accepted' | 'completed' | 'cancelled'
          contact_info?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          driver_id?: string | null
          service_type?: 'fleet' | 'tour' | 'airport'
          service_id?: string
          date?: string
          pickup_details?: Json
          price?: number | null
          status?: 'pending' | 'assigned' | 'driver_accepted' | 'completed' | 'cancelled'
          contact_info?: Json
          created_at?: string
        }
      }
    }
  }
}
