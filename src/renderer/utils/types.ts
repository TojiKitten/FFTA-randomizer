export type Config = {
  setting: string;
  value: number | boolean | string | Array<Unit> | Map<string,Array<Job>>;
};

export type Unit = {
  name: string;
  raceChangeable: boolean;
  race: string;
  job: string;
  rngEquip: boolean;
  level: number;
  masteredAbilities: number;
};

export type Job = {
    name: string;
    enabled: boolean;
}