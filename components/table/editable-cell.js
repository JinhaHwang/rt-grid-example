import React, { useEffect, useState } from 'react'
import { animated, useSpring } from 'react-spring'

const EditableCell = (props) => {
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

  const styles = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 200,
  })

  return (
    <animated.div style={styles}>
      <input
        value={value}
        onChange={onChange}
        onBlur={(e) => {
          updateMyData(row, column, value)
        }}
      />
    </animated.div>
  )
}

export default EditableCell
