import React, { useEffect, useState } from 'react'

const InfoCell = ({ value: initialValue, row: { index }, column: { id } }) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue)

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return <span>{value}</span>
}
export default InfoCell
