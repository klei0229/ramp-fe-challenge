import { useCallback, useState } from "react"
import { PaginatedRequestParams, PaginatedResponse, Transaction } from "../utils/types"
import { PaginatedTransactionsResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"

export function usePaginatedTransactions(): PaginatedTransactionsResult {

  
  const { fetchWithoutCache, loading } = useCustomFetch()
  const [paginatedTransactions, setPaginatedTransactions] = useState<PaginatedResponse<
  Transaction[]
  > | null>(null)
  
  const fetchAll = useCallback(async () => {
    //uses fetchwithoutcache to fix bug 7 
    const response = await fetchWithoutCache<PaginatedResponse<Transaction[]>, PaginatedRequestParams>(
      "paginatedTransactions",
      {
        page: paginatedTransactions === null ? 0 : paginatedTransactions.nextPage,
      }
    )



    setPaginatedTransactions((previousResponse) => {
      if (response === null || previousResponse === null) {
        return response
      }

      //Bug Fix 4: instead of passing in the new response, make sure to merge the array from the previousResponses to the current response.data 
      
      //Old
      // return { data: response.data, nextPage: response.nextPage }
      return { data: [...previousResponse.data,...response.data], nextPage: response.nextPage }
    })
  }, [fetchWithoutCache, paginatedTransactions])

  const invalidateData = useCallback(() => {
    setPaginatedTransactions(null)
  }, [])
  return { data: paginatedTransactions, loading, fetchAll, invalidateData }
}
