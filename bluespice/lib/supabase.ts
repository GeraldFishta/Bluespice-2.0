// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipi per il database (opzionale ma utile)
export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    email: string;
                    first_name: string;
                    last_name: string;
                    role: 'admin' | 'hr' | 'employee';
                    // department, position, hire_date rimossi (ora sono in employees)
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    email: string;
                    first_name: string;
                    last_name: string;
                    role: 'admin' | 'hr' | 'employee';
                    // department, position, hire_date rimossi (ora sono in employees)
                };
                Update: {
                    email?: string;
                    first_name?: string;
                    last_name?: string;
                    role?: 'admin' | 'hr' | 'employee';
                    // department, position, hire_date rimossi (ora sono in employees)
                };
            };
            // ... altri tipi per employees, payroll_periods, etc.
        };
    };
};