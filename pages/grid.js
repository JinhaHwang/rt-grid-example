import { useEffect, useMemo, useState } from 'react'

import { useRouter } from 'next/router'
// import { useTable, useBlockLayout } from 'react-table'
// import { FixedSizeList } from 'react-window'
import { gql, useSubscription, useMutation } from '@apollo/client'

import Table from '../components/table/table'
import { withApollo } from '../lib/withApollo'

const Grid = () => {
  const router = useRouter()
  const { name } = router.query

  const [skipPageReset, setSkipPageReset] = useState(false)

  const columns = useMemo(
    () => [
      { Header: '번호', accessor: 'id' },
      { Header: '모델명', accessor: 'model_name' },
      { Header: 'MAC', accessor: 'mac_address' },
      { Header: 'S/N', accessor: 'serial_number' },
      { Header: 'IP', accessor: 'ip_v4' },
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

  const { loading, error, data } = useSubscription(
    gql`
      subscription subDevices {
        devices(order_by: { id: asc }) {
          id
          model_name
          subnet_mask
          serial_number
          rtsp
          mac_address
          ip_v4
          https
          http
          gateway
          dns2
          dns1
        }
      }
    `,
  )

  const [updateDeviceMutation] = useMutation(gql`
    mutation updDevice(
      $id: Int!
      $mac_address: String
      $model_name: String
      $serial_number: String
      $ip_v4: String
      $gateway: String
      $subnet_mask: String
      $dns1: String
      $dns2: String
      $http: Int
      $https: Int
      $rtsp: Int
    ) {
      update_devices(
        where: { id: { _eq: $id } }
        _set: {
          mac_address: $mac_address
          model_name: $model_name
          serial_number: $serial_number
          ip_v4: $ip_v4
          gateway: $gateway
          subnet_mask: $subnet_mask
          dns1: $dns1
          dns2: $dns2
          http: $http
          https: $https
          rtsp: $rtsp
        }
      ) {
        affected_rows
      }
    }
  `)

  const updateMyData = async (row, column, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true)
    if (row.original[column.id] !== value) {
      await updateDeviceMutation({
        variables: {
          ...row.values,
          [column.id]: value,
        },
      })
    }
  }

  // After data chagnes, we turn the flag back off
  // so that if data actually changes when we're not
  // editing it, the page is reset
  useEffect(() => {
    setSkipPageReset(false)
  }, [data])

  return (
    <div>
      {error && <span>error</span>}
      {loading && <span>loading...</span>}
      {data?.devices && (
        <Table
          columns={columns}
          data={data?.devices}
          updateMyData={updateMyData}
          skipPageReset={skipPageReset}
        />
      )}
    </div>
  )
}

export default withApollo()(Grid)
