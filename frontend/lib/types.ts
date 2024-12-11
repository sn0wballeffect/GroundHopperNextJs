export interface Match {
  id: number;
  league: string | null;
  sport: string;
  home_team: string | null;
  away_team: string | null;
  event_date: string | null;
  event_time: string | null;
  stadium: string | null;
  latitude: number | null;
  longitude: number | null;
  date_string: string | null;
}
