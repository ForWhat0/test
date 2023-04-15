import React, {useCallback, useEffect, useMemo, useState} from 'react';
import styled, {keyframes} from "styled-components";

const GAME_HEIGHT = 500;
const GAME_WIDTH = document.body.scrollWidth;
const GAME_LEFT_PADDING = 5 * GAME_HEIGHT / 100;

const BIRD_INITIAL_POSITION = 20 * GAME_HEIGHT / 100;
const BIRD_HEIGHT = 5 * GAME_WIDTH / 100;
const BIRD_WIDTH = 5 * GAME_WIDTH / 100;
const BIRD_JUMP = 15 * GAME_HEIGHT / 100;
const BIRD_ROTATE = 20;

const TUBE_WIDTH = 10 * GAME_WIDTH / 100;
const TUBE_GAP =  25 * GAME_HEIGHT / 100;
const TUBE_START_CHECK = GAME_LEFT_PADDING - TUBE_WIDTH;
const TUBE_END_CHECK = BIRD_WIDTH + GAME_LEFT_PADDING;
const TUBE_MAX_HEIGHT_PROCENT = 60;
const TUBE_MIN_HEIGHT_PROCENT = 15;

const INITIAL_TOP_TUBE_HEIGHT = 60 * GAME_HEIGHT / 100;

const BOTTOM_WIDTH = GAME_WIDTH * 3;
const BOTTOM_LEFT = GAME_WIDTH + TUBE_WIDTH;


const START = 'START';
const EASY = 'EASY';
const MEDIUM = 'MEDIUM';
const HARD = 'HARD';
const ULTRA_HARD = 'ULTRA_HARD';

const DIFF_SETTINGS = {
    START: {
        min: 0,
        max: 1,
        game_gravity: 6,
        tube_speed: 4,
        type: START
    },
    EASY: {
        min: 2,
        max: 5,
        game_gravity: 6,
        tube_speed: 5,
        type: EASY
    },
    MEDIUM: {
        min: 6,
        max: 10,
        game_gravity: 6,
        tube_speed: 6,
        type: MEDIUM
    },
    HARD: {
        min: 11,
        max: 20,
        game_gravity: 6,
        tube_speed: 7,
        type: HARD
    },
    ULTRA_HARD: {
        min: 21,
        max: 22,
        game_gravity: 6,
        tube_speed: 8,
        type: ULTRA_HARD
    },
};

function between(x, min, max) {
    return x >= min && x <= max;
}

function FlappyBird() {
    const [diff, setDiff] = useState(DIFF_SETTINGS.START.type);
    const [gameIsStarted, setGameIsStarted] = useState(false);
    const [birdPosition, setBirdPosition] = useState(BIRD_INITIAL_POSITION);
    const [birdRotate, setBirdRotate] = useState(0);
    const [tubePosition, setTubePosition] = useState(GAME_WIDTH - TUBE_WIDTH);
    const [topTubeHeight, setTopTubeHeight] = useState(INITIAL_TOP_TUBE_HEIGHT);
    const [score, setScore] = useState(0);

    const bottomTubeHeight = GAME_HEIGHT - TUBE_GAP - topTubeHeight;

    useEffect(() => {
        if (!gameIsStarted) return;
        let intervalId;
        if (birdPosition < (GAME_HEIGHT - BIRD_HEIGHT)) {
            intervalId = setInterval(() => {
                setBirdPosition((oldPosition) => oldPosition + DIFF_SETTINGS[diff].game_gravity);
            }, 24);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [birdPosition, gameIsStarted, diff]);

    useEffect(() => {
        if (!gameIsStarted) return;
        let intervalId;
        if (tubePosition >= -TUBE_WIDTH) {
            intervalId = setInterval(() => {
                setTubePosition((oldPosition) => oldPosition - DIFF_SETTINGS[diff].tube_speed);
            }, 24);

            return () => {
                clearInterval(intervalId);
            };
        } else {
            const randomPercentage = Math.floor(Math.random() * (TUBE_MAX_HEIGHT_PROCENT - TUBE_MIN_HEIGHT_PROCENT + 1)) + TUBE_MIN_HEIGHT_PROCENT;
            setTopTubeHeight((GAME_HEIGHT * randomPercentage) / 100);
            setTubePosition(GAME_WIDTH + TUBE_WIDTH);
            setScore((oldScore) => ++oldScore)
        }
    }, [tubePosition, gameIsStarted, diff]);

    useEffect(() => {
        if (!gameIsStarted) return;
        let intervalId;

        if (birdRotate < BIRD_ROTATE) {
            intervalId = setInterval(() => {
                setBirdRotate( birdRotate + DIFF_SETTINGS[diff].game_gravity );
            }, 24);

            return () => {
                clearInterval(intervalId);
            };
        }
    }, [birdRotate, gameIsStarted]);

    useEffect(() => {
        if (gameIsStarted && between(tubePosition, TUBE_START_CHECK, TUBE_END_CHECK)) {
            const hitTop = between(birdPosition, 0, topTubeHeight);
            const hitBottom = between(birdPosition, topTubeHeight + TUBE_GAP - BIRD_HEIGHT, GAME_HEIGHT);

            if (hitTop || hitBottom) setGameIsStarted(false);
        }
    }, [tubePosition, gameIsStarted, birdPosition]);

    useEffect(() => {
        if (!gameIsStarted) return;

        for (const key in DIFF_SETTINGS) {
            if (between(score,DIFF_SETTINGS[key].min, DIFF_SETTINGS[key].max))  {
                setDiff(DIFF_SETTINGS[key].type);
                break;
            }
        }
    }, [gameIsStarted, score])

    const handleClick = useCallback(() => {
        if (!gameIsStarted) {
            setGameIsStarted(true);
            setDiff(DIFF_SETTINGS.EASY.type);
            setBirdPosition(BIRD_INITIAL_POSITION);
            setTubePosition(GAME_WIDTH + TUBE_WIDTH);
            setScore(0);
            setBirdRotate(0);
        } else {
            const newPosition = birdPosition - BIRD_JUMP;
            if (newPosition > 0) {
                setBirdPosition(birdPosition - BIRD_JUMP)
            } else {
                setBirdPosition(0);
            }
            setBirdRotate(-BIRD_ROTATE);
        }
    }, [gameIsStarted, birdPosition])

    const bottom = useMemo(()=>{
        return -BOTTOM_LEFT + tubePosition;
    },[tubePosition])

    return (
        <Body onClick={handleClick}>
            <Game>
                <Score
                    score={score}
                />
                <Bird
                    src='https://img.itch.zone/aW1nLzcwNDU0NzcucG5n/315x250%23c/2zRXoU.png'
                    birdRotate={birdRotate}
                    top={birdPosition}
                />
                <Tube
                    width={TUBE_WIDTH}
                    top={0}
                    left={tubePosition}
                    height={topTubeHeight}
                />
                <Tube
                    width={TUBE_WIDTH}
                    top={GAME_HEIGHT - bottomTubeHeight}
                    left={tubePosition}
                    height={bottomTubeHeight}
                />
            </Game>
            <Bottom
                left={bottom}
                width={BOTTOM_WIDTH}
            />
        </Body>
    );
}

export default FlappyBird;

const Bottom = styled.div`
  width: ${props => props.width}px;
  height: 20px;
  position: relative;
  left: ${props => props.left}px;
  background: repeating-linear-gradient(
          -45deg,
          greenyellow,
          greenyellow 10px,
          green 10px,
          green 20px
  );
`

const Body = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #C2B280;
  overflow: hidden;
  background: linear-gradient(to bottom, #C2B280 0%, #B3A371 100%);
  background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #C2B280), color-stop(100%, #B3A371));
  background: -webkit-linear-gradient(top, #C2B280 0%, #B3A371 100%);
  background: -moz-linear-gradient(top, #C2B280 0%, #B3A371 100%);
  background: -o-linear-gradient(top, #C2B280 0%, #B3A371 100%);
  background: -ms-linear-gradient(top, #C2B280 0%, #B3A371 100%);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#C2B280', endColorstr='#B3A371', GradientType=0);
`

const Game = styled.div`
  position: relative;
  width: ${GAME_WIDTH}px;
  height: ${GAME_HEIGHT}px;
  display: flex;
  margin: 0 auto;
  overflow: hidden;
  cursor: pointer;
  background: rgb(135, 206, 235);
`

const Bird = styled.img`
  position: absolute;
  left: ${GAME_LEFT_PADDING}px;
  top: ${props => props.top}px;
  height: ${BIRD_HEIGHT}px;
  width: ${BIRD_WIDTH}px;
  transform: rotate(${props=>props.birdRotate}deg);
`

const Tube = styled.div`
  position: absolute;
  height: ${props => props.height}px;
  width: ${TUBE_WIDTH}px;
  left: ${props => props.left}px;
  top: ${props => props.top}px;
  background: green;
`

const Score = styled.div`
  font-size: 24px;
  color: red;
  margin: 20px auto;
  z-index: 100;

  &:after {
    content: '${props => props.score}';
  }
`;