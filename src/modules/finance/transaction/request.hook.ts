import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"

import type {Paged} from "#/models/PagedModel.ts"
import {useResponseFieldErrorHandler} from "#/lib/request.types.tsx"
import {Page_EMPTY} from "#/models/PagedModel.ts"
import type {AccountModel} from "#/modules/finance/account/model.ts"
import {FinanceQueryKeys} from "#/modules/finance/query-keys.ts"
import transactionApi from "#/modules/finance/transaction/api.ts"
import type {TransactionModel} from "#/modules/finance/transaction/model.ts"

type SuccessHandler<T> = (data: T) => void

export namespace TransactionRequest {
  export const useQueryTransactions = (query?: TransactionModel.Query) => {
    const errHandler = useResponseFieldErrorHandler()

    return {
      ...useQuery({
        queryKey: FinanceQueryKeys.transactions(query),
        queryFn: () => transactionApi.query(query, {errHandler}),
        initialData: Page_EMPTY as Paged<TransactionModel.Transaction>,
      }),
      errHandler,
    }
  }

  export const useGetTransaction = (transactionId?: TransactionModel.TransactionID) => {
    const errHandler = useResponseFieldErrorHandler()

    return {
      ...useQuery({
        queryKey: FinanceQueryKeys.transaction(transactionId || ""),
        queryFn: () => transactionApi.getById(transactionId!, {errHandler}),
        enabled: !!transactionId,
      }),
      errHandler,
    }
  }

  export function useCreateTransaction(successHandler?: SuccessHandler<TransactionModel.Transaction>) {
    const queryClient = useQueryClient()
    const errHandler = useResponseFieldErrorHandler()

    return {
      ...useMutation({
        mutationFn: ({accountId, body}: { accountId: AccountModel.AccountID; body: TransactionModel.Create }) =>
          transactionApi.create(accountId, body, {errHandler}),
        onSuccess: async (data, variables) => {
          await Promise.all([
            queryClient.invalidateQueries({queryKey: FinanceQueryKeys.transactionsRoot}),
            queryClient.invalidateQueries({queryKey: FinanceQueryKeys.accountRecord(variables.accountId)}),
            queryClient.invalidateQueries({queryKey: FinanceQueryKeys.accountDetailed(variables.accountId)}),
          ])
          successHandler?.(data)
        },
      }),
      errHandler,
    }
  }
}
