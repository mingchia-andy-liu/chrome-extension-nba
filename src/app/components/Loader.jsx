import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
`

const StyledLoader = styled.img`
    width: 100px;
    height: 100px;
    -webkit-animation: spin 3s infinite linear;
    animation: spin 3s infinite linear;

    @keyframes spin{
        0%{
            transform:rotate(0deg)
        }
        to{
            transform:rotate(1turn)
        }
    }

    @-webkit-keyframes spin{
        0%{
            -webkit-transform:rotate(0deg)
        }
        to{
            -webkit-transform:rotate(1turn)
        }
    }
`


class Loader extends React.PureComponent {
    render() {
        return (
            <Wrapper >
                <StyledLoader src="assets/png/icon-2-color-512.png"/>
                <h2>Loading...</h2>
            </Wrapper>
        )
    }
}

export default Loader
