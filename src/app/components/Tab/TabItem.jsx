import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { ThemeConsumer } from '../Context'
import { ColumnCSS, AlignCenter, JustifyCenter } from '../../styles'

const Label = styled.label`
  ${ColumnCSS}
  ${AlignCenter}
    ${JustifyCenter}
    position: relative;
  width: 100%;
  height: 100%;
  padding: 10px;

  &:hover {
    font-weight: 400;
  }

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    width: 50%;
    height: 5px;
    border-radius: 5px;
    background-color: ${(props) =>
      props.active
        ? props.dark
          ? '#92CBF7'
          : '#81D3FA'
        : props.dark
          ? '#2963FF'
          : '#046fdb'};
  }

  color: ${(props) => (props.dark ? '#fff' : '#000')};
  font-weight: ${(props) => (props.active ? '500' : '300')};
  font-size: calc(17px + 0.1vw);
  cursor: pointer;
`

const TabItem = ({ onClick, label, active }) => {
  return (
    <ThemeConsumer>
      {({ state: { dark } }) => (
        <Label
          onClick={(e) => {
            e.preventDefault()
            onClick()
          }}
          active={active ? 1 : undefined}
          dark={dark ? 1 : undefined}
        >
          {label}
        </Label>
      )}
    </ThemeConsumer>
  )
}

TabItem.propTypes = {
  label: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
}

TabItem.defaultProps = {
  label: '',
  active: false,
}

export default TabItem
