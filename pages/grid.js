import { useCallback, useEffect, useMemo, useState } from 'react'

import { useRouter } from 'next/router'
import { useTable, useBlockLayout } from 'react-table'
import { FixedSizeList } from 'react-window'
import Table from '../components/table/table'

const Grid = () => {
  const router = useRouter()
  const { name } = router.query

  const initData = [
    {
      id: 1,
      model_name: 'PND-A6081RF/KAN',
      mac_address: '00-09-18-68-AA-10',
      serail_number: 'ZRA370GR10000GN',
      ip_address: null,
      gateway: null,
      subnet_mask: null,
      dns1: null,
      dns2: null,
      http: null,
      https: null,
      rtsp: null,
    },
    {
      id: 2,
      model_name: 'PND-A9081RV/KDO',
      mac_address: '00-09-18-6A-27-9A',
      serail_number: 'ZNKH70GR40001JZ',
      ip_address: null,
      gateway: null,
      subnet_mask: null,
      dns1: null,
      dns2: null,
      http: null,
      https: null,
      rtsp: null,
    },
    {
      id: 3,
      model_name: 'XND-9083RV/KAN',
      mac_address: '00-09-18-6A-C1-17',
      serail_number: 'ZRF170GR50000CT',
      ip_address: null,
      gateway: null,
      subnet_mask: null,
      dns1: null,
      dns2: null,
      http: null,
      https: null,
      rtsp: null,
    },
  ]

  const columns = useMemo(
    () => [
      { Header: '번호', accessor: 'id' },
      { Header: '모델명', accessor: 'model_name' },
      { Header: 'MAC', accessor: 'mac_address' },
      { Header: 'S/N', accessor: 'serail_number' },
      { Header: 'IP', accessor: 'ip_address' },
      { Header: '게이트웨이', accessor: 'gateway' },
      { Header: '서브넷 마스크', accessor: 'subnet_mask' },
      { Header: 'DNS1', accessor: 'dns1' },
      { Header: 'DNS2', accessor: 'dns2' },
      { Header: 'HTTP', accessor: 'http' },
      { Header: 'HTTPS', accessor: 'https' },
      { Header: 'RTSP', accessor: 'rtsp' },
    ],
    [],
  )

  const [data, setData] = useState(initData)
  const [originalData] = useState(data)
  const [skipPageReset, setSkipPageReset] = useState(false)

  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true)
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          }
        }
        return row
      }),
    )
  }

  // After data chagnes, we turn the flag back off
  // so that if data actually changes when we're not
  // editing it, the page is reset
  useEffect(() => {
    setSkipPageReset(false)
    console.log(data)
  }, [data])

  // Let's add a data resetter/randomizer to help
  // illustrate that flow...
  const resetData = () => setData(originalData)

  return (
    <div>
      <button onClick={resetData}>Reset Data</button>
      <Table
        columns={columns}
        data={data}
        updateMyData={updateMyData}
        skipPageReset={skipPageReset}
      />
    </div>
  )
}

export default Grid
