export interface BlogPost {
  /** Stable id for blog detail routes */
  id: string;
  img: string;
  alt?: string;
  date: string;
  title: string;
  desc: string;
  /** Optional tag label (e.g. "WOOD", "CONSTRUCTION") */
  tag?: string;
}
