// 4. Create lib/supabase/database.types.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      // Add your Supabase tables here
      profiles: {
        Row: {
          id: string;
          created_at: string;
          email: string;
          name: string | null;
        };
        Insert: {
          id: string;
          created_at?: string;
          email: string;
          name?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          email?: string;
          name?: string | null;
        };
      };
    };
  };
}
