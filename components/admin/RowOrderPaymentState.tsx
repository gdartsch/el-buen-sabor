import { MenuItem, Select } from '@mui/material'
import { useState } from 'react'

const paymentStates = ['Pagado', 'No Pagado']

const RowOrderPaymentState = ({ order, onStatusUpdated }) => {
  const [paymentState, setPaymentState] = useState(order.isPaid)
  const [isDisabled, setIsDisabled] = useState(false)

  return (
    <Select
      value={paymentState}
      label='Estado'
      onChange={({ target }) => {
        setPaymentState(target.value)
        onStatusUpdated(order.id, order.currentState, target.value)
      }}
      disabled={isDisabled}
      sx={{ width: '12rem' }}
      variant='standard'
    >
      {paymentStates.map((state) => (
        <MenuItem key={state} value={state === 'Pagado' ? 'true' : 'false'}>
          {state}
        </MenuItem>
      ))}
    </Select>
  )
}

export default RowOrderPaymentState
