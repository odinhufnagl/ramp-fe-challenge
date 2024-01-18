import { useCallback } from "react"
import { useCustomFetch } from "src/hooks/useCustomFetch"
import { SetTransactionApprovalParams } from "src/utils/types"
import { TransactionPane } from "./TransactionPane"
import { SetTransactionApprovalFunction, TransactionsComponent } from "./types"

export const Transactions: TransactionsComponent = ({ transactions }) => {
  const { fetchWithoutCache, loading, clearCacheByEndpoint } = useCustomFetch()

  const setTransactionApproval = useCallback<SetTransactionApprovalFunction>(
    async ({ transactionId, newValue }) => {
      await fetchWithoutCache<void, SetTransactionApprovalParams>("setTransactionApproval", {
        transactionId,
        value: newValue,
      })
      //Bug 7: TODO: this works, but based on what we want for behaviour, this is not guaranteed the best way
      //for example if we will update the state of the transactions in other ways, we will have to use this clearing of the
      //cache each time. Another way is in some way updating the transaction directly, but this does not fit with the current architecture
      //because as of now the <Transactions/> is not possible to update the transactions, and therefore we would have to have a callback function
      //like onTransactionChange, but that is not implemented right now and therefore I assume that is not what you are looking for
      //therefore I see this solution as the best for not. It depends but in this scenario it feels like the checkbox is not used all too much and
      //then it might be better to just be on the safe side and clear the cache, but as I said before that depends on how the app will be used, and
      //if it will be a lot of toggles and switching between employees, then I would go with onTransactionChange.

      await clearCacheByEndpoint(["paginatedTransactions", "transactionsByEmployee"])
    },
    [fetchWithoutCache, clearCacheByEndpoint]
  )

  if (transactions === null) {
    return <div className="RampLoading--container">Loading...</div>
  }

  return (
    <div data-testid="transaction-container">
      {transactions.map((transaction) => (
        <TransactionPane
          key={transaction.id}
          transaction={transaction}
          loading={loading}
          setTransactionApproval={setTransactionApproval}
        />
      ))}
    </div>
  )
}
