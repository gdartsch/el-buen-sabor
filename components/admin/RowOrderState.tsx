import { MenuItem, Select } from '@mui/material'
import { useState } from 'react'

const orderStates = [
  'Ingresado',
  'En Cocina',
  'En delivery',
  'Entregado',
  'Cancelado',
]

const RowOrderState = ({ order, onSatusUpdated }) => {
  const [state, setState] = useState(order.currentState)
  const [isDisabled, setIsDisabled] = useState(false)

  return (
    <Select
      defaultValue={order.currentState[0]}
      value={state}
      label='Estado'
      onChange={({ target }) => {
        setState(target.value)
        onSatusUpdated(order.id, target.value, order.isPaid)
        if (target.value === 'Cancelado' || target.value === 'Entregado') {
          setIsDisabled(true)
        } else {
          setIsDisabled(false)
        }
      }}
      disabled={isDisabled}
      sx={{ width: '12rem' }}
      variant='standard'
    >
      {orderStates.map((state) => (
        <MenuItem key={state} value={state} disabled={order.isPaid}>
          {state}
        </MenuItem>
      ))}
    </Select>
  )
}

export default RowOrderState
