import type {NixID} from "./Models.ts";
import type {Ownable} from "./PagedModel.ts";

const EntityID = {
    SYSTEM: "0" as NixID,
};


class OwnableUtil {

    isSystemOwned(id?: Ownable | NixID) {
        if (id === undefined || id === null) return false;
        // @ts-ignore
        if (id.entityID === EntityID.SYSTEM || id === EntityID.SYSTEM) return true;
        return false;
    }
}

const ownableUtil = new OwnableUtil();
export default ownableUtil;
export {EntityID}