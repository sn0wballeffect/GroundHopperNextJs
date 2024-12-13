export type SportType =
  | "football"
  | "basketball"
  | "ice_hockey"
  | "handball"
  | "volleyball"
  | "tennis";

export interface SportColors {
  [key: string]: string;
}

export interface SportIcons {
  [key: string]: string;
}
