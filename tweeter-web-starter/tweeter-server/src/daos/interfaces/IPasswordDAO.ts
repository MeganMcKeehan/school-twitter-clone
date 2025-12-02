export interface IPasswordDAO {
  getPassword(alias: string): Promise<string>;
  addPassword(alias: string, password: string): Promise<void>;
}
