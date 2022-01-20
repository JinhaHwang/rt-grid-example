import React, { useEffect, useState } from 'react'

const EditableCell = (props) => {
  console.log(props)
  const {
    value: initialValue = '',
    column,
    row,
    updateMyData, // This is a custom function that we supplied to our table instance
  } = props
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue)

  const onChange = (e) => {
    setValue(e.target.value)
  }

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <input
      value={value}
      onChange={onChange}
      onBlur={(e) => {
        updateMyData(row.values.id, column.id, value)
      }}
    />
  )
}

export default EditableCell
