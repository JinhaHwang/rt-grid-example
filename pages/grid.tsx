import { useCallback, useMemo } from 'react'

import { useRouter } from 'next/router'
import { useTable, useBlockLayout } from 'react-table'
import { FixedSizeList } from 'react-window'

const Grid = () => {
  const router = useRouter()
  const { name } = router.query

  return <div>{name}</div>
}

export default Grid
