import {createStore} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";

const raw = {
    location: {
        country: 'CA',
        state: 'ON',
    }
}
type DefaultDataStoreActionType = { initializeData: () => void }

type DefaultDataStoreType = (typeof raw) & DefaultDataStoreActionType

const defaultData = createStore<DefaultDataStoreType>()(persist(
        (setState) => {
            return {
                location: raw.location,
                initializeData: () => setState({location: raw.location})
            }
        },
        {
            name: "defaultData",
            storage: createJSONStorage(() => localStorage)
        }
    )
)

export default defaultData