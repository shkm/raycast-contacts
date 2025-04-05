export type Contact = {
  pk: number;
  globalId: string;
  fullName: string;
  firstName: string | null;
  lastName: string | null;
  jobTitle: string | null;
  organization: string | null;
  database: string | null;
};
