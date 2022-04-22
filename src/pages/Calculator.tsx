import styled from '@emotion/styled';
import { DefaultButton, PrimaryButton, Stack, Text } from '@fluentui/react';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import { isFalse } from 'my-easy-fp';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import * as uuid from 'uuid';
import { readable, wirtable } from '../atom/calculator';
import { readable as shoppingReadable, writable as shoppingWritable } from '../atom/shopping';
import { uiPrimaryFont, uiPrimaryUX } from '../design/color';
import { StyledDivPageBody, StyledDivPageBox, StyledDivPageHeading } from './Layout';

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

const StyledStackFormular = styled.h1`
  color: ${uiPrimaryFont.lighten(0.1).toString()};
  font-size: 13pt;
  line-height: 15pt;
  height: 15pt;
`;

const StyledRegisteredShoppingItemBox = styled(Stack)`
  height: calc(100vh - 310px - 30pt);
  padding-left: 10px;
  padding-right: 10px;
`;

const StyledRegisteredShoppingItems = styled(Stack)`
  height: calc(100vh - 340px - 30pt);
`;

const StyledRegisteredShoppingEachItem = styled(Stack)`
  height: 30px;
  align-items: center;
`;

const StyledStackFormularBox = styled(Stack)`
  padding-left: 10px;
  padding-right: 10px;
`;

const StyledStackButtonBox = styled(Stack)`
  .ms-Button {
    width: 25vw;
    height: 50px;
  }
`;

const StyledStackControlButtonBox = styled(Stack)`
  .ms-Button {
    width: 50vw;
    height: 50px;
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
  const shoppingItems = useAtomValue(shoppingReadable.onReadableShoppingItems);
  const sumShoppingItems = useAtomValue(shoppingReadable.onReadableSumShoppingItems);

  const onHandleClickCalcularButton = useCallback(
    (num: string) => onAppendFormular(num),
    [onAppendFormular],
  );

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
          <StyledRegisteredShoppingItems>
            {shoppingItems.map((item) => {
              return (
                <StyledRegisteredShoppingEachItem horizontal>
                  <StyledShoppingItemBox>
                    <span>{item.price}</span>
                  </StyledShoppingItemBox>
                  <DefaultButton>x</DefaultButton>
                </StyledRegisteredShoppingEachItem>
              );
            })}
          </StyledRegisteredShoppingItems>

          <StyledStackFormularBox style={{ textAlign: 'right' }}>
            <StyledStackFormular>{sumShoppingItems}</StyledStackFormular>
          </StyledStackFormularBox>
        </StyledRegisteredShoppingItemBox>

        <Stack>
          <StyledStackFormularBox>
            <StyledStackFormular>{formular}</StyledStackFormular>
          </StyledStackFormularBox>

          <StyledStackFormularBox>
            <StyledStackFormular style={{ textAlign: 'right' }}>
              {evaluation !== '' ? `= ${evaluation}` : evaluation}
            </StyledStackFormular>
          </StyledStackFormularBox>
        </Stack>

        <StyledStackControlButtonBox horizontal>
          <PrimaryButton
            onClick={() => {
              try {
                const parsedPrice = Number.parseInt(evaluation);
                if (isFalse(Number.isNaN(parsedPrice))) {
                  const uid = uuid.v4().replace(/-/g, '');

                  onAppendShoppingItem({ price: parsedPrice, uid });
                  onClearFormular();
                }
              } catch {
                console.debug('오류 ㅠㅠ ');
              }
            }}
          >
            등록
          </PrimaryButton>
          <DefaultButton onClick={() => onClearFormular()}>C</DefaultButton>
        </StyledStackControlButtonBox>

        <Stack>
          <StyledStackButtonBox horizontal>
            <DefaultButton onClick={() => onHandleClickCalcularButton('9')}>9</DefaultButton>
            <DefaultButton onClick={() => onHandleClickCalcularButton('8')}>8</DefaultButton>
            <DefaultButton onClick={() => onHandleClickCalcularButton('7')}>7</DefaultButton>
            <DefaultButton onClick={() => onHandleClickCalcularButton('/')}>÷</DefaultButton>
          </StyledStackButtonBox>

          <StyledStackButtonBox horizontal>
            <DefaultButton onClick={() => onHandleClickCalcularButton('6')}>6</DefaultButton>
            <DefaultButton onClick={() => onHandleClickCalcularButton('5')}>5</DefaultButton>
            <DefaultButton onClick={() => onHandleClickCalcularButton('4')}>4</DefaultButton>
            <DefaultButton onClick={() => onHandleClickCalcularButton('*')}>×</DefaultButton>
          </StyledStackButtonBox>

          <StyledStackButtonBox horizontal>
            <DefaultButton onClick={() => onHandleClickCalcularButton('3')}>3</DefaultButton>
            <DefaultButton onClick={() => onHandleClickCalcularButton('2')}>2</DefaultButton>
            <DefaultButton onClick={() => onHandleClickCalcularButton('1')}>1</DefaultButton>
            <DefaultButton onClick={() => onHandleClickCalcularButton('-')}>-</DefaultButton>
          </StyledStackButtonBox>

          <StyledStackButtonBox horizontal>
            <DefaultButton onClick={() => onHandleClickCalcularButton('0')}>0</DefaultButton>
            <DefaultButton onClick={() => onHandleClickCalcularButton('00')}>00</DefaultButton>
            <DefaultButton onClick={() => onRemoveFormular()}>{'<'}</DefaultButton>
            <DefaultButton onClick={() => onHandleClickCalcularButton('+')}>+</DefaultButton>
          </StyledStackButtonBox>
        </Stack>
      </StyledDivPageBody>
    </StyledDivPageBox>
  );
};

export default Calculator;
