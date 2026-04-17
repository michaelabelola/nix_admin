import {useEffect, useState} from "react";

type ResponseProperties = {
    fields: ErrorFieldType[]
    message?: string
}

export type ResponseError = {
    title: string
    detail: string
    message: string
    instance: string //URI
    type?: string //URI
    status: number //HTTP status code
    properties: ResponseProperties
} & Error

export type FetchError = {
    _internal: string & Pick<Response, "status" | "redirected" | "statusText" | "headers"> & {
        body?: string
    }
} & ResponseError

export type ErrorFieldType = Record<string, string>
export type ErrorHandlerType = {
    hasError: (id: keyof ErrorFieldType | string | undefined) => boolean,
    toErrorField: (id: keyof ErrorFieldType | string | undefined) => { message?: string | undefined; },
    errorKeys: (keyof ErrorFieldType | string | undefined)[]
    errors: ErrorFieldType[],
    // add: (newError: ErrorFieldType) => void,
    // addMultiple: (newErrors: ErrorFieldType[]) => void,
    // remove: (fieldID: keyof ErrorFieldType) => void,
    // removeMultiple: (fieldIDs: (keyof ErrorFieldType)[]) => void,
    // replaceAll: (newErrors: ErrorFieldType[]) => void,
    getErrorMessage: (id: keyof ErrorFieldType | string | undefined) => string
    _errInit: (err: FetchError) => void
};

const useResponseFieldErrorHandler = (): ErrorHandlerType => {

    const [errors, setErrors] = useState<ErrorFieldType[]>([] as ErrorFieldType[])

    const [errorKeys, setErrorKeys] = useState<string[]>([]);

    useEffect(() => {
        setErrorKeys(errors.map(value => Object.keys(value)[0]) || []);
    }, [errors]);

    const hasError = (fieldID: keyof ErrorFieldType | string | undefined) => {
        if (!fieldID) return false
        return errorKeys.some((key) => key === fieldID)
    }
    const getErrorMessage = (fieldID: keyof ErrorFieldType | string | undefined) => {
        if (!fieldID)
            return undefined as any;
        return errors.find(error => Object.keys(error)[0] === fieldID)?.[fieldID] as string;
    }
    const toErrorField = (fieldID: keyof ErrorFieldType | string | undefined) => {
        const message = getErrorMessage(fieldID)
        if (message) return {message: message}
        return undefined as any
    }
    const initErrors = (err: FetchError) => {
        if (err.properties?.fields) setErrors(err.properties.fields)
    }

    return {
        toErrorField,
        errors,
        getErrorMessage,
        errorKeys,
        hasError,
        _errInit: initErrors
    }
}
export {useResponseFieldErrorHandler};
export type ErrorFieldProcessorConfig = { errorHandler?: ErrorHandlerType, errorToast?: boolean }
