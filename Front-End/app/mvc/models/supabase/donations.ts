import { supabase } from './supabaseClient';

export type DonationInsertResult = {
  data: any | null;
  error: any | null;
};

export async function insertDonation(
  amount: number,
  email: string,
  userId: string | null,
  status: string
): Promise<DonationInsertResult> {
  try {
    const insertObj: any = {
      amount,
      status,
      email: email || null,
    };

    if (userId) insertObj.user_id = userId;

    const { data, error } = await supabase.from('donaciones').insert(insertObj).select();

    if (error) {
      console.log('[donations] insert error:', error);
      return { data: null, error };
    }

    console.log('[donations] inserted:', data);
    return { data, error: null };
  } catch (err) {
    console.log('[donations] unexpected error:', err);
    return { data: null, error: err };
  }
}
