import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"

import type {Paged} from "@suiteonix/models"
import {useResponseFieldErrorHandler} from "../../utils"
import {Page_EMPTY} from "@suiteonix/models"
import accountApi from "./api.ts"
import type {AccountModel} from "./model.ts"
import {FinanceQueryKeys} from "../query-keys.ts"

type SuccessHandler<T> = (data: T) => void

export namespace AccountRequest {
  export const useGetSupportedCurrencies = (accountType: AccountModel.AccountType) => {
    const errHandler = useResponseFieldErrorHandler()

    return {
      ...useQuery({
        queryKey: [...FinanceQueryKeys.supportedCurrencies, accountType],
        queryFn: () => accountApi.getSupportedCurrencies(accountType, {errHandler}),
        initialData: [] as AccountModel.SupportedCurrency[],
      }),
      errHandler,
    }
  }

  export const useQueryAccounts = (query?: AccountModel.Query) => {
    const errHandler = useResponseFieldErrorHandler()

    return {
      ...useQuery({
        queryKey: FinanceQueryKeys.accounts(query),
        queryFn: () => accountApi.query(query, {errHandler}),
        initialData: Page_EMPTY as Paged<AccountModel.Account>,
      }),
      errHandler,
    }
  }

  export const useGetAccount = (accountId?: AccountModel.AccountID) => {
    const errHandler = useResponseFieldErrorHandler()

    return {
      ...useQuery({
        queryKey: FinanceQueryKeys.accountRecord(accountId || ""),
        queryFn: () => accountApi.getById(accountId!, {errHandler}),
        enabled: !!accountId,
      }),
      errHandler,
    }
  }

  export const useGetAccountDetailed = (accountId?: AccountModel.AccountID) => {
    const errHandler = useResponseFieldErrorHandler()

    return {
      ...useQuery({
        queryKey: FinanceQueryKeys.accountDetailed(accountId || ""),
        queryFn: () => accountApi.getDetailed(accountId!, {errHandler}),
        enabled: !!accountId,
      }),
      errHandler,
    }
  }

  export function useCreateNixAccount(successHandler?: SuccessHandler<AccountModel.Detailed>) {
    const queryClient = useQueryClient()
    const errHandler = useResponseFieldErrorHandler()

    return {
      ...useMutation({
        mutationFn: (body: AccountModel.CreateNix) => accountApi.createNix(body, {errHandler}),
        onSuccess: async (data) => {
          await queryClient.invalidateQueries({queryKey: FinanceQueryKeys.accountsRoot})
          successHandler?.(data)
        },
      }),
      errHandler,
    }
  }

  export function useCreateAggregateAccount(successHandler?: SuccessHandler<AccountModel.Detailed>) {
    const queryClient = useQueryClient()
    const errHandler = useResponseFieldErrorHandler()

    return {
      ...useMutation({
        mutationFn: (body: AccountModel.CreateAggregate) => accountApi.createAggregate(body, {errHandler}),
        onSuccess: async (data) => {
          await queryClient.invalidateQueries({queryKey: FinanceQueryKeys.accountsRoot})
          successHandler?.(data)
        },
      }),
      errHandler,
    }
  }
}
