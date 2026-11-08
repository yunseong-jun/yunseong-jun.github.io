/* ==========================================================================
   Supabase 연결 설정
   - 아래 두 값은 Supabase 프로젝트의 공개(publishable) 정보입니다.
   - 이 키는 프론트엔드에 노출되어도 되는 공개 키입니다. (비밀 키 아님)
   - 데이터 접근 제한은 Supabase의 RLS(Row Level Security) 정책으로 관리합니다.
   ========================================================================== */

const SUPABASE_URL = "https://pwrxdhueivalhsykpisa.supabase.co";
const SUPABASE_KEY = "sb_publishable_q4T5GDlnwJPbCi-dJZ0z_Q_nwKlGnor";

// CDN으로 불러온 supabase 전역 객체에서 클라이언트를 만듭니다.
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
