import * as stylex from '@stylexjs/stylex';
import { colors } from '../../tokens.stylex';

const right_arm = stylex.keyframes({
  '0%': { transform: 'rotate(70deg)' },
  '10%': { transform: 'rotate(8deg)' },
  '15%': { transform: 'rotate(20deg)' },
  '20%': { transform: 'rotate(10deg)' },
  '25%': { transform: 'rotate(26deg)' },
  '30%': { transform: 'rotate(10deg)' },
  '35%': { transform: 'rotate(28deg)' },
  '40%': { transform: 'rotate(9deg)' },
  '45%': { transform: 'rotate(28deg)' },
  '50%': { transform: 'rotate(8deg)' },
  '58%': { transform: 'rotate(74deg)' },
  '62%': { transform: 'rotate(70deg)' }
});

const left_arm = stylex.keyframes({
  '0%': { transform: 'rotate(-70deg)' },
  '10%': { transform: 'rotate(6deg)' },
  '15%': { transform: 'rotate(-18deg)' },
  '20%': { transform: 'rotate(5deg)' },
  '25%': { transform: 'rotate(-18deg)' },
  '30%': { transform: 'rotate(5deg)' },
  '35%': { transform: 'rotate(-17deg)' },
  '40%': { transform: 'rotate(5deg)' },
  '45%': { transform: 'rotate(-18deg)' },
  '50%': { transform: 'rotate(6deg)' },
  '58%': { transform: 'rotate(-74deg)' },
  '62%': { transform: 'rotate(-70deg)' }
});

const right_hand = stylex.keyframes({
  '0%': { transform: 'rotate(-40deg)' },
  '10%': { transform: 'rotate(-20deg)' },
  '15%': { transform: 'rotate(-5deg)' },
  '20%': { transform: 'rotate(-60deg)' },
  '25%': { transform: 'rotate(0deg)' },
  '30%': { transform: 'rotate(-60deg)' },
  '35%': { transform: 'rotate(0deg)' },
  '40%': { transform: 'rotate(-40deg)' },
  '45%': { transform: 'rotate(-60deg)' },
  '50%': { transform: 'rotate(10deg)' },
  '60%': { transform: 'rotate(-40deg)' }
});

const right_finger = stylex.keyframes({
  '0%': { transform: 'translateY(16px)' },
  '10%': { transform: 'none' },
  '50%': { transform: 'none' },
  '60%': { transform: 'translateY(16px)' }
});

const left_finger = stylex.keyframes({
  '0%': { transform: 'scaleX(0)' },
  '10%': { transform: 'scaleX(1) rotate(6deg)' },
  '15%': { transform: 'scaleX(1) rotate(0deg)' },
  '20%': { transform: 'scaleX(1) rotate(8deg)' },
  '25%': { transform: 'scaleX(1) rotate(0deg)' },
  '30%': { transform: 'scaleX(1) rotate(7deg)' },
  '35%': { transform: 'scaleX(1) rotate(0deg)' },
  '40%': { transform: 'scaleX(1) rotate(5deg)' },
  '45%': { transform: 'scaleX(1) rotate(0deg)' },
  '50%': { transform: 'scaleX(1) rotate(6deg)' },
  '58%': { transform: 'scaleX(0)' }
});

const head = stylex.keyframes({
  '0%': { transform: 'rotate(-3deg)' },
  '10%': { transform: 'translateX(10px) rotate(7deg)' },
  '50%': { transform: 'translateX(0px) rotate(0deg)' },
  '56%': { transform: 'rotate(-3deg)' }
});

const path_circle = stylex.keyframes({
  '0%': { transform: 'translateY(0)' },
  '10%': { transform: 'translateY(-100px) rotate(-5deg)' },
  '55%': { transform: 'translateY(-100px) rotate(-360deg)' },
  '58%': { transform: 'translateY(-100px) rotate(-360deg)' },
  '63%': { transform: 'rotate(-360deg)' }
});

const path_square = stylex.keyframes({
  '0%': { transform: 'translateY(0)' },
  '10%': { transform: 'translateY(-155px) translatex(-15px) rotate(10deg)' },
  '55%': { transform: 'translateY(-155px) translatex(-15px) rotate(-350deg)' },
  '57%': { transform: 'translateY(-155px) translatex(-15px) rotate(-350deg)' },
  '63%': { transform: 'rotate(-360deg)' }
});

const path_triangle = stylex.keyframes({
  '0%': { transform: 'translateY(0)' },
  '10%': { transform: 'translateY(-172px) translatex(10px) rotate(-10deg)' },
  '55%': { transform: 'translateY(-172px) translatex(10px) rotate(-365deg)' },
  '58%': { transform: 'translateY(-172px) translatex(10px) rotate(-365deg)' },
  '63%': { transform: 'rotate(-360deg)' }
});

export const styles = stylex.create({
  scene: {
    display: 'flex'
  },
  wizard: {
    height: '240px',
    position: 'relative',
    width: '190px'
  },
  body: {
    backgroundColor: colors.brand80,
    bottom: 0,
    height: '100px',
    left: '68px',
    position: 'absolute',
    width: '60px',
    '::after': {
      backgroundColor: colors.brand80,
      bottom: 0,
      content: '',
      height: '100px',
      left: '20px',
      position: 'absolute',
      transform: 'skewX(14deg)',
      width: '60px'
    }
  },
  right_arm: {
    animationDuration: '10s',
    animationIterationCount: 'infinite',
    animationName: right_arm,
    animationTimingFunction: 'ease-in-out',
    backgroundColor: colors.brand80,
    borderRadius: '22px',
    bottom: '74px',
    height: '44px',
    left: '110px',
    position: 'absolute',
    transform: 'rotate(70deg)',
    transformOrigin: '16px 22px',
    width: '90px'
  },
  right_hand: {
    animationDuration: '10s',
    animationIterationCount: 'infinite',
    animationName: right_hand,
    animationTimingFunction: 'ease-in-out',
    background: '#f1c5b4',
    borderRadius: '50%',
    bottom: '8px',
    height: '30px',
    position: 'absolute',
    right: '8px',
    transform: 'rotate(-40deg)',
    transformOrigin: 'center center',
    width: '30px',
    '::after': {
      animationDuration: '10s',
      animationIterationCount: 'infinite',
      animationName: right_finger,
      animationTimingFunction: 'ease-in-out',
      background: '#f1c5b4',
      borderRadius: '10px',
      content: '',
      height: '30px',
      position: 'absolute',
      right: '0px',
      top: '-8px',
      transform: 'translateY(16px)',
      width: '15px'
    }
  },
  left_arm: {
    animationDuration: '10s',
    animationIterationCount: 'infinite',
    animationName: left_arm,
    animationTimingFunction: 'ease-in-out',
    backgroundColor: colors.brand80,
    borderBottomLeftRadius: '8px',
    bottom: '74px',
    height: '44px',
    left: '26px',
    position: 'absolute',
    transform: 'rotate(-70deg)',
    transformOrigin: '60px 26px',
    width: '70px'
  },
  left_hand: {
    background: '#f1c5b4',
    borderBottomLeftRadius: '35px',
    borderTopLeftRadius: '35px',
    height: '30px',
    left: '-18px',
    position: 'absolute',
    top: '0',
    width: '18px',
    '::after': {
      animationDuration: '10s',
      animationIterationCount: 'infinite',
      animationName: left_finger,
      animationTimingFunction: 'ease-in-out',
      background: '#f1c5b4',
      borderRadius: '20px',
      content: '',
      height: '15px',
      position: 'absolute',
      right: '0',
      top: '0',
      transform: 'scaleX(0)',
      transformOrigin: 'right bottom',
      width: '30px'
    }
  },
  head: {
    animationDuration: '10s',
    animationIterationCount: 'infinite',
    animationName: head,
    animationTimingFunction: 'ease-in-out',
    height: '210px',
    left: '14px',
    position: 'absolute',
    top: '0',
    transform: 'rotate(-3deg)',
    transformOrigin: 'center center',
    width: '160px'
  },
  beard: {
    background: 'white',
    borderBottomRightRadius: '55%',
    bottom: '0',
    height: '106px',
    left: '38px',
    position: 'absolute',
    width: '80px',
    '::after': {
      background: 'white',
      borderRadius: '20px',
      content: '',
      height: '20px',
      left: '-10px',
      position: 'absolute',
      top: '16px',
      width: '40px'
    }
  },
  face: {
    background: '#f1c5b4',
    bottom: '76px',
    height: '30px',
    left: '38px',
    position: 'absolute',
    width: '60px',
    '::before': {
      background: '#f1c5b4',
      borderBottomLeftRadius: '20px',
      borderBottomRightRadius: '20px',
      content: '',
      height: '40px',
      left: '40px',
      position: 'absolute',
      top: '0px',
      width: '20px'
    },
    '::after': {
      background: 'white',
      borderBottomRightRadius: '0px',
      borderRadius: '20px',
      content: '',
      height: '20px',
      left: '-10px',
      position: 'absolute',
      top: '16px',
      width: '50px'
    }
  },
  adds: {
    background: '#f1c5b4',
    borderRadius: '20px',
    height: '20px',
    left: '-10px',
    position: 'absolute',
    top: '0px',
    width: '40px',
    '::after': {
      background: '#f1c5b4',
      borderBottomRightRadius: '20px',
      borderTopRightRadius: '20px',
      content: '',
      height: '20px',
      left: '80px',
      position: 'absolute',
      top: '5px',
      width: '15px'
    }
  },
  hat: {
    backgroundColor: colors.brand80,
    borderRadius: '20px',
    bottom: '106px',
    height: '20px',
    left: '0',
    position: 'absolute',
    width: '160px',
    '::before': {
      borderColor: `transparent transparent ${colors.brand80} transparent`,
      borderStyle: 'solid',
      borderWidth: '0 34px 70px 50px',
      content: '',
      height: '0',
      left: '50%',
      position: 'absolute',
      top: '-70px',
      transform: 'translatex(-50%)',
      width: '0'
    },
    '::after': {
      backgroundColor: colors.brand80,
      borderRadius: '20px',
      content: '',
      height: '20px',
      left: '0',
      position: 'absolute',
      top: '0',
      width: '160px'
    }
  },
  hatOfTheHat: {
    borderColor: `transparent transparent ${colors.brand80} transparent`,
    borderStyle: 'solid',
    borderWidth: '0 25px 25px 19px',
    bottom: '78px',
    height: '0',
    left: '79px',
    position: 'absolute',
    width: '0',
    '::after': {
      backgroundColor: colors.brand80,
      borderBottomLeftRadius: '0px',
      borderRadius: '10px',
      content: '',
      height: '10px',
      left: '-4px',
      position: 'absolute',
      top: '6px',
      transform: 'rotate(40deg)',
      width: '35px'
    }
  },
  star: {
    height: '12px',
    position: 'absolute',
    width: '12px',
    '::before': {
      background: 'white',
      borderRadius: '10%',
      bottom: '0',
      content: '',
      display: 'block',
      left: '0',
      position: 'absolute',
      top: '0',
      transform: 'rotate(66.66deg) skewX(45deg)',
      width: '141.4213%'
    },
    '::after': {
      background: 'white',
      borderRadius: '10%',
      bottom: '0',
      content: '',
      display: 'block',
      left: '0',
      position: 'absolute',
      top: '0',
      transform: 'rotate(156.66deg) skew(45deg)',
      width: '141.4213%'
    }
  },
  first: {
    bottom: '28px',
    left: '46px'
  },
  second: {
    bottom: '40px',
    left: '80px'
  },
  third: {
    bottom: '15px',
    left: '108px'
  },
  objects: {
    height: '240px',
    position: 'relative',
    width: '200px'
  },
  square: {
    animationDuration: '10s',
    animationIterationCount: 'infinite',
    animationName: path_square,
    animationTimingFunction: 'ease-in-out',
    borderRadius: '50%',
    bottom: '-60px',
    height: '120px',
    left: '-5px',
    position: 'absolute',
    transform: 'rotate(-360deg)',
    width: '120px',
    '::after': {
      background: '#9ab3f5',
      content: '',
      height: '50px',
      left: '0',
      position: 'absolute',
      top: '10px',
      width: '50px'
    }
  },
  circle: {
    animationDuration: '10s',
    animationIterationCount: 'infinite',
    animationName: path_circle,
    animationTimingFunction: 'ease-in-out',
    borderRadius: '50%',
    bottom: '10px',
    height: '100px',
    left: '0',
    position: 'absolute',
    transform: 'rotate(-360deg)',
    width: '100px',
    '::after': {
      backgroundColor: '#c56183',
      borderRadius: '50%',
      bottom: '-10px',
      content: '',
      height: '50px',
      left: '25px',
      position: 'absolute',
      width: '50px'
    }
  },
  triangle: {
    animationDuration: '10s',
    animationIterationCount: 'infinite',
    animationName: path_triangle,
    animationTimingFunction: 'ease-in-out',
    borderRadius: '50%',
    bottom: '-62px',
    height: '110px',
    left: '-10px',
    position: 'absolute',
    transform: 'rotate(-360deg)',
    width: '110px',
    '::after': {
      borderColor: 'transparent transparent #89beb3 transparent',
      borderStyle: 'solid',
      borderWidth: '0 28px 48px 28px',
      content: '',
      height: '0',
      position: 'absolute',
      right: '-10px',
      top: '0',
      width: '0'
    }
  }
});
