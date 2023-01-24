import { useState } from "react"
import React from "react"


const GameCardContext = React.createContext();

const GameCardProvider = ({children}) => {
    const [dataStore, setDataStore] = useState({})

    const updateDataStore = (modelName, models) => {
        setDataStore(dataStore => {
            const copiedDataStore = {...dataStore}
            // Makes dataStore expandable to have other keys if needed.
            copiedDataStore[modelName] = copiedDataStore[modelName] ?? {}
            // Models will change based on server response, for each thing we want to change, check dataStore, if existing update, if not add new one with new value = also called an "Upsert - update/insert"
            models.forEach(model => copiedDataStore[modelName][model.id] = model)
            return copiedDataStore
        })
    }
    return (
        <GameCardContext.Provider value={{dataStore, setDataStore, updateDataStore}}>
            {children}
        </GameCardContext.Provider>
    )
}

export {GameCardContext, GameCardProvider}