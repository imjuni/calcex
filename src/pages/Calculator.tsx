import styled from '@emotion/styled';
import { DefaultButton, PrimaryButton, Stack, Text } from '@fluentui/react';
import classnames from 'classnames';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import * as mathjs from 'mathjs';
import { isFalse, isNotEmpty } from 'my-easy-fp';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import * as uuid from 'uuid';
import { readable, wirtable } from '../atom/calculator';
import { readable as shoppingReadable, writable as shoppingWritable } from '../atom/shopping';
import {
  uiPrimaryFont,
  uiPrimaryGreen,
  uiPrimaryOrange,
  uiPrimaryRed,
  uiPrimaryUX,
} from '../design/color';
import { StyledDivPageBody, StyledDivPageBox, StyledDivPageHeading } from './Layout';
import { nanoid } from 'nanoid';

const buttonHeight = 40;
const textHeight = 15;

const StyledStackHeading = styled(Stack)`
  width: 100%;
  height: 100%;
  background-color: ${uiPrimaryUX.toString()};
  justify-content: center;
  padding-left: 2em;

  h1 {
    color: ${uiPrimaryUX.lighten(0.7).toString()};
  }
`;

const StyledH1Formular = styled.h1`
  color: ${uiPrimaryFont.lighten(0.1).toString()};
  font-size: 13pt;
  line-height: ${textHeight}pt;
  height: ${textHeight}pt;
`;

// 제목이 60px라서 60을 더해줘야 제대로 계산이 된다
const StyledRegisteredShoppingItemBox = styled(Stack)`
  height: calc(100vh - ${buttonHeight * 6 + 60}px - ${textHeight * 3}pt);
  padding-left: 10px;
  padding-right: 10px;
`;

const StyledRegisteredShoppingItems = styled(Stack)`
  overflow-y: scroll;
  padding-bottom: 8px;
`;

const StyledRegisteredShoppingEachItem = styled(Stack)`
  height: 30px;
  align-items: center;
`;

const StyledStackFormularBox = styled(Stack)`
  padding-left: 10px;
  padding-right: 10px;

  .warn-red {
    color: ${uiPrimaryRed.alpha(0.8).toString()};
  }

  .warn-orange {
    color: ${uiPrimaryOrange.alpha(0.8).toString()};
  }

  .good-green {
    color: ${uiPrimaryGreen.alpha(0.8).toString()};
  }
`;

const StyledStackButtonBox = styled(Stack)`
  .ms-Button {
    width: 25vw;
    height: ${buttonHeight}px;
  }
`;

const StyledStackControlButtonBox = styled(Stack)`
  .btn-register {
    width: 40vw;
    height: ${buttonHeight}px;
  }

  .btn-clear,
  .btn-register-clear {
    width: 30vw;
    height: ${buttonHeight}px;
  }
`;

const StyledShoppingItemBox = styled(Stack)`
  width: 90vw;

  span {
    font-size: 13pt;
  }
`;

const Calculator: React.FC = () => {
  const intl = useIntl();
  const formular = useAtomValue(readable.onReadableFormular);
  const evaluation = useAtomValue(readable.onReadableEvaluation);
  const onAppendFormular = useUpdateAtom(wirtable.onWritableAppendFormular);
  const onRemoveFormular = useUpdateAtom(wirtable.onWritableRemoveFormular);
  const onClearFormular = useUpdateAtom(wirtable.onWritableClearFormular);
  const onAppendShoppingItem = useUpdateAtom(shoppingWritable.onWritableAppendShoppingItem);
  const onRemoveShoppingItem = useUpdateAtom(shoppingWritable.onWritableRemoveShoppingItem);
  const onRemoveAllShoppingItem = useUpdateAtom(shoppingWritable.onWritableRemoveAllShoppingItem);
  const shoppingItems = useAtomValue(shoppingReadable.onReadableShoppingItems);
  const sumShoppingItems = useAtomValue(shoppingReadable.onReadableSumShoppingItems);
  const splitSumShoppingItems = useAtomValue(shoppingReadable.onReadableSplitSumShoppingItems);
  const ratioShoppingItems = useAtomValue(shoppingReadable.onReadableRatioShoppingItems);
  const minimumPrice = 5000;
  const goalLastPrice = 990;

  const onHandleClickCalcularButton = useCallback(
    (num: string) => onAppendFormular(num),
    [onAppendFormular],
  );

  const onHandleCalculateRatio = useCallback((price: number) => {
    if (price < minimumPrice) {
      return 0;
    }

    const currentPrice = mathjs.bignumber(price);
    const goalPrice = mathjs.bignumber(goalLastPrice);

    const ratio = currentPrice.div(goalPrice).mul(mathjs.bignumber(100));
    const flooredRatio = ratio.mul(mathjs.bignumber(100)).floor().div(mathjs.bignumber(100));

    return flooredRatio.toNumber();
  }, []);

  const onHandleCalculatePrice = useCallback((total: number, price: number) => {
    if (total < minimumPrice) {
      return mathjs
        .bignumber(minimumPrice + goalLastPrice)
        .sub(mathjs.bignumber(total))
        .toNumber();
    }

    const currentPrice = mathjs.bignumber(price);
    const goalPrice = mathjs.bignumber(goalLastPrice);

    return goalPrice.sub(currentPrice).toNumber();
  }, []);

  const onHandleReachPrice = useCallback((total: number, price: number) => {
    if (total < minimumPrice) {
      return 'red';
    }

    if (price < 300) {
      return 'red';
    }

    if (price < 600) {
      return 'orange';
    }

    return 'green';
  }, []);

  return (
    <StyledDivPageBox>
      <StyledDivPageHeading>
        <StyledStackHeading>
          <Text as="h1" variant="xxLarge">
            {intl.formatMessage({ id: 'calc.heading' })}
          </Text>
        </StyledStackHeading>
      </StyledDivPageHeading>

      <StyledDivPageBody>
        <StyledRegisteredShoppingItemBox>
          <StyledRegisteredShoppingItems id="styled-registered-shopping-item-box">
            {shoppingItems.map((item) => {
              return (
                <StyledRegisteredShoppingEachItem key={nanoid()} horizontal>
                  <StyledShoppingItemBox>
                    <span>{item.price.toLocaleString('en-US')}</span>
                  </StyledShoppingItemBox>
                  <DefaultButton onClick={() => onRemoveShoppingItem(item.uid)}>x</DefaultButton>
                </StyledRegisteredShoppingEachItem>
              );
            })}
          </StyledRegisteredShoppingItems>
        </StyledRegisteredShoppingItemBox>

        <Stack>
          <StyledStackFormularBox horizontal>
            <Stack horizontal style={{ width: '60vw' }}>
              <StyledH1Formular
                style={{ width: '50%' }}
                className={classnames({
                  'warn-red': onHandleReachPrice(sumShoppingItems, ratioShoppingItems) === 'red',
                  'warn-orange':
                    onHandleReachPrice(sumShoppingItems, ratioShoppingItems) === 'orange',
                  'good-green':
                    onHandleReachPrice(sumShoppingItems, ratioShoppingItems) === 'green',
                })}
              >
                {onHandleCalculateRatio(ratioShoppingItems)}
                {'%'}
              </StyledH1Formular>
              <StyledH1Formular
                style={{ width: '50%' }}
                className={classnames({
                  'warn-red': onHandleReachPrice(sumShoppingItems, ratioShoppingItems) === 'red',
                  'warn-orange':
                    onHandleReachPrice(sumShoppingItems, ratioShoppingItems) === 'orange',
                  'good-green':
                    onHandleReachPrice(sumShoppingItems, ratioShoppingItems) === 'green',
                })}
              >
                {onHandleCalculatePrice(sumShoppingItems, ratioShoppingItems)}원 부족
              </StyledH1Formular>
            </Stack>

            <Stack style={{ width: '40vw', textAlign: 'right' }}>
              {splitSumShoppingItems.upper3 !== '' ? (
                <Stack horizontal style={{ justifyContent: 'flex-end' }}>
                  <StyledH1Formular>
                    {splitSumShoppingItems.upper3}
                    {','}
                  </StyledH1Formular>
                  <StyledH1Formular style={{ fontWeight: 'bold' }}>
                    {splitSumShoppingItems.less3}
                  </StyledH1Formular>
                </Stack>
              ) : (
                <StyledH1Formular style={{ fontWeight: 'bold' }}>
                  {splitSumShoppingItems.less3}
                </StyledH1Formular>
              )}
            </Stack>
          </StyledStackFormularBox>

          <StyledStackFormularBox>
            <StyledH1Formular>{formular}</StyledH1Formular>
          </StyledStackFormularBox>

          <StyledStackFormularBox>
            <StyledH1Formular style={{ textAlign: 'right' }}>
              {evaluation !== '' ? `= ${evaluation}` : evaluation}
            </StyledH1Formular>
          </StyledStackFormularBox>
        </Stack>

        <Stack className="stack-calculator-btn-box">
          <StyledStackControlButtonBox horizontal>
            <PrimaryButton
              className="btn-register"
              onClick={() => {
                try {
                  const parsedPrice = Number.parseInt(evaluation);
                  if (isFalse(Number.isNaN(parsedPrice))) {
                    const uid = uuid.v4().replace(/-/g, '');

                    onAppendShoppingItem({ price: parsedPrice, uid });
                    onClearFormular();

                    setTimeout(() => {
                      const div = document.getElementById('styled-registered-shopping-item-box');

                      if (isNotEmpty(div)) {
                        console.log();
                        div.scrollTop = div.scrollHeight;
                      }
                    }, 100);
                  }
                } catch {
                  console.debug('오류 ㅠㅠ ');
                }
              }}
            >
              등록
            </PrimaryButton>
            <DefaultButton className="btn-register-clear" onClick={() => onRemoveAllShoppingItem()}>
              등록 초기화
            </DefaultButton>
            <DefaultButton className="btn-clear" onClick={() => onClearFormular()}>
              C
            </DefaultButton>
          </StyledStackControlButtonBox>

          <StyledStackButtonBox horizontal>
            <DefaultButton onClick={() => onHandleClickCalcularButton('7')}>7</DefaultButton>
            <DefaultButton onClick={() => onHandleClickCalcularButton('8')}>8</DefaultButton>
            <DefaultButton onClick={() => onHandleClickCalcularButton('9')}>9</DefaultButton>
            <DefaultButton onClick={() => onHandleClickCalcularButton('/')}>÷</DefaultButton>
          </StyledStackButtonBox>

          <StyledStackButtonBox horizontal>
            <DefaultButton onClick={() => onHandleClickCalcularButton('4')}>4</DefaultButton>
            <DefaultButton onClick={() => onHandleClickCalcularButton('5')}>5</DefaultButton>
            <DefaultButton onClick={() => onHandleClickCalcularButton('6')}>6</DefaultButton>
            <DefaultButton onClick={() => onHandleClickCalcularButton('*')}>×</DefaultButton>
          </StyledStackButtonBox>

          <StyledStackButtonBox horizontal>
            <DefaultButton onClick={() => onHandleClickCalcularButton('1')}>1</DefaultButton>
            <DefaultButton onClick={() => onHandleClickCalcularButton('2')}>2</DefaultButton>
            <DefaultButton onClick={() => onHandleClickCalcularButton('3')}>3</DefaultButton>
            <DefaultButton onClick={() => onHandleClickCalcularButton('-')}>-</DefaultButton>
          </StyledStackButtonBox>

          <StyledStackButtonBox horizontal>
            <DefaultButton onClick={() => onHandleClickCalcularButton('0')}>0</DefaultButton>
            <DefaultButton onClick={() => onHandleClickCalcularButton('.')}>.</DefaultButton>
            <DefaultButton onClick={() => onRemoveFormular()}>{'<'}</DefaultButton>
            <DefaultButton onClick={() => onHandleClickCalcularButton('+')}>+</DefaultButton>
          </StyledStackButtonBox>

          <StyledStackButtonBox horizontal>
            <DefaultButton onClick={() => onHandleClickCalcularButton('00')}>00</DefaultButton>
            <DefaultButton onClick={() => onHandleClickCalcularButton('000')}>000</DefaultButton>
            <DefaultButton onClick={() => onHandleClickCalcularButton('990')}>990</DefaultButton>
            <DefaultButton onClick={() => onHandleClickCalcularButton('90')}>90</DefaultButton>
          </StyledStackButtonBox>
        </Stack>
      </StyledDivPageBody>
    </StyledDivPageBox>
  );
};

export default Calculator;
