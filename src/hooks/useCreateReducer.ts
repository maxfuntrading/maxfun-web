import { useMemo, useReducer } from "react";

export type FieldNames<T> = {
    [K in keyof T]: T[K] extends string ? K : K;
  }[keyof T];

 export type ActionType<T> =
    | { type: 'reset' }
    | { type?: 'change'; field: FieldNames<T>; value: any };

export const useCreateReducer = <T>({ initialState }: {initialState: T}) => {
    type Action = {type: 'reset'} | {type?: 'change'; field: FieldNames<T>; value: any}

    const reducer = (state: T, action: Action) => {
        if (!action.type) {
            return {
                ...state,
                [action.field]: action.value
            }
        }

        if (action.type === 'reset') return initialState

        throw new Error()
    }

    const [state, dispatch] = useReducer(reducer, initialState)

    return useMemo(() => ({
        state,
        dispatch
    }), [state, dispatch])
}