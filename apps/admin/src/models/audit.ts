import type {NixID} from "#/models/Models.ts";

export interface Auditable {
    audit: Audit
}

export interface Audit {
    createdBy_id: NixID,
    createdDate: Date | string | any,
    modifiedBy_id: NixID,
    modifiedDate: Date | string | any
}

export interface Audit_Query {
    createdBy: NixID,
    createdDate: Date | string | any,
    modifiedBy: NixID,
    modifiedDate: Date | string | any
    // "audit.createdBy"?: string;
    // "audit.createdDate"?: string;
    // "audit.modifiedBy"?: string;
    // "audit.modifiedDate"?: string;
}

export type Audit_RangedQuery = {
    "createdBy"?: string
    "createdDate"?: {
        "start"?: Date | string | any
        "end"?: Date | string | any
        "value"?: Date | string | any
    },
    "modifiedBy"?: string
    "modifiedDate"?: {
        "start"?: Date | string | any
        "end"?: Date | string | any
        "value"?: Date | string | any
    }
}
