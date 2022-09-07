// Credits https://github.com/huckbit/extract-urls

import * as fs from 'fs'
import moment from 'moment'
import {dirname as getDirName, dirname} from 'path'

export const extractUrls = (str: string, lower = false) => {
    const regexp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?!&//=]*)/gi;


    if (str) {
        let urls = str.match(regexp);
        if (urls) {
            return lower ? urls.map((item) => item.toLowerCase()) : urls;
        } else {
            undefined;
        }
    } else {
        undefined;
    }
};

export const isValidTenorUrl = (urlString: string) => {
    try {
        const url = new URL(urlString)
        return Boolean(url) && url.host === 'tenor.com'
    }
    catch(e){
        return false
    }
}

export type StateData = {
    counter: number
    lastSave: Date
}

const parseStateData = (rawdata:  Buffer): StateData | null => {
    try {
        let state = JSON.parse(rawdata.toString()) as StateData | null
        return state
    } catch (e) {
        if (e instanceof SyntaxError) {
            return null
        }

        throw e
    }
}

const convertStateData = (state: StateData): string => {
    return JSON.stringify(state)
}

const readStateFromFile = (fileName: string) => {
    const rawdata = fs.readFileSync(fileName)
    if (!rawdata) {
        return null
    }

    return parseStateData(rawdata)
}

export const writeStateToFile = (fileName: string, state: StateData) => {
    const writableData = convertStateData(state)
    fs.writeFileSync(fileName, writableData)
}

export const createFileIfNotExists = (fileName: string): Promise<boolean> => {
    const promise = new Promise<boolean>((resolve, reject) => {
            // create empty file, because it wasn't found
            const dirname = getDirName(fileName)
            fs.mkdir(dirname, { recursive: true}, function (err) {
                if (err) {
                    reject(err)
                    return
                }
                try {
                    // try to read file
                    const state = readStateFromFile(fileName)
                    if (!state) {
                        throw new Error('File has not been created yet!')
                    }

                    resolve(false)
                } catch (error) {
                    fs.writeFileSync(fileName, '')
                    resolve(true)
                }
        });
    })
    return promise
}

const createInitialState = (): StateData => {
    return {
        counter: 0,
        lastSave: new Date(),
    }
}

export const readOrCreateInitialState = (fileName: string): StateData => {
    let state = readStateFromFile(fileName)

    // Pokud nemáme initial state
    if (!state) {
        state = createInitialState()

        writeStateToFile(fileName, state)
    }

    return state
}

export const resetStateEveryWeekInterval = (fileName: string, state: StateData): StateData | null => {
    // Last save has been previous week
    if (moment(state.lastSave).diff(new Date(), 'days') > 7) {
        const newState = {
            lastSave: new Date(),
            counter: 0
        }

        writeStateToFile(fileName, newState)

        return newState
    }

    return null
}