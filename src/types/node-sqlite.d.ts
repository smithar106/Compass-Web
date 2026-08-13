declare module "node:sqlite" {
  export class DatabaseSync {
    constructor(location: string, options?: { open?: boolean; readOnly?: boolean; strict?: boolean });
    exec(sql: string): void;
    prepare(sql: string): StatementSync;
    close(): void;
  }

  export class StatementSync {
    run(...params: any[]): { changes: number; lastInsertRowid: number | bigint };
    get(...params: any[]): any;
    all(...params: any[]): any[];
  }

  export function backup(db: DatabaseSync, destination: string, options?: { progress?: (total: number, remaining: number) => void }): void;
}
