import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"

import {useResponseFieldErrorHandler} from "#/lib/request.types.tsx"
import {Page_EMPTY} from "#/models/PagedModel.ts"
import accountApi from "#/modules/finance/account/api.ts"
import type {AccountModel} from "#/modules/finance/account/model.ts"
import {FinanceQueryKeys} from "#/modules/finance/query-keys.ts"

type SuccessHandler<T> = (data: T) => void

export namespace AccountRequest {
  export const useGetSupportedCurrencies = () => {
    const errHandler = useResponseFieldErrorHandler()

    return {
      ...useQuery({
        queryKey: FinanceQueryKeys.supportedCurrencies,
        queryFn: () => accountApi.getSupportedCurrencies({errHandler}),
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
        initialData: Page_EMPTY,
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

  export function useCreateAccount(successHandler?: SuccessHandler<AccountModel.Account>) {
    const queryClient = useQueryClient()
    const errHandler = useResponseFieldErrorHandler()

    return {
      ...useMutation({
        mutationFn: (body: AccountModel.Create) => accountApi.create(body, {errHandler}),
        onSuccess: async (data) => {
          await queryClient.invalidateQueries({queryKey: FinanceQueryKeys.accountsRoot})
          successHandler?.(data)
        },
      }),
      errHandler,
    }
  }
}
