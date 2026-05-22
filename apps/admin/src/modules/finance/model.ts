import type {NixID} from "#/models/Models.ts"

export namespace FinanceModel {
  export type RangedQuery<T> = {
    start?: T
    end?: T
    value?: T
  }

  export type AuditQuery = {
    createdBy?: NixID
    createdDate?: RangedQuery<string>
    modifiedDate?: RangedQuery<string>
  }
}
