import React, {useCallback, useEffect, useState} from 'react';
import styled from "styled-components";
import FlappyBird from "./flappyBird";

const GAME_HEIGHT = document.body.scrollHeight;
const GAME_WIDTH = document.body.scrollWidth;

function between(x, min, max) {
    return x >= min && x <= max;
}

function App() {


    return (
        <FlappyBird/>
    );
}

export default App;

const Game = styled.div`
  position: relative;
  width: ${GAME_WIDTH}px;
  height: ${GAME_HEIGHT}px;
  display: flex;
  margin: 0 auto;
  overflow: hidden;
  cursor: pointer;
  background: aqua;
`