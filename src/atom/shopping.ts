import { atom } from 'jotai';
import { atomWithReset } from 'jotai/utils';

const key = 'calculator.shopping.state';

export interface IShoppingItem {
  name?: string;
  uid: string;
  price: number;
}

const defaultValue: { items: IShoppingItem[] } = {
  items: [],
};

function getInitialValue() {
  try {
    const item = localStorage.getItem(key);

    if (item !== null) {
      return JSON.parse(item) as { items: IShoppingItem[] };
    }

    return defaultValue;
  } catch {
    return defaultValue;
  }
}

export const mainAtom = atomWithReset(getInitialValue());

const onReadableShoppingItems = atom<IShoppingItem[]>((get) => {
  const state = get(mainAtom);
  return state.items;
});

const onReadableSumShoppingItems = atom<number>((get) => {
  const state = get(mainAtom);
  const sum = state.items.reduce<number>((sum, current) => {
    return sum + current.price;
  }, 0);

  return sum;
});

const onReadableSplitSumShoppingItems = atom<{ upper3: string; less3: string }>((get) => {
  const state = get(mainAtom);
  const sum = state.items.reduce<number>((sum, current) => {
    return sum + current.price;
  }, 0);

  const strSum = `${sum}`;

  if (strSum.length <= 3) {
    return { upper3: '', less3: strSum };
  }

  const upper = strSum.substring(0, strSum.length - 3);
  const less = strSum.substring(strSum.length - 3, strSum.length);

  return {
    upper3: Number.parseInt(upper).toLocaleString('en-US'),
    less3: less,
  };
});

const onReadableRatioShoppingItems = atom<number>((get) => {
  const state = get(mainAtom);
  const sum = state.items.reduce<number>((sum, current) => {
    return sum + current.price;
  }, 0);

  const strSum = `${sum}`;
  const last3Number = strSum.substring(strSum.length - 3, strSum.length);
  return Number.parseInt(last3Number);
});

const onWritableAppendShoppingItem = atom<null, IShoppingItem>(null, (get, set, update) => {
  const state = get(mainAtom);
  state.items = [...state.items, update];

  localStorage.setItem(key, JSON.stringify(state));
  return set(mainAtom, { ...state });
});

const onWritableRemoveShoppingItem = atom<null, string>(null, (get, set, uid) => {
  const state = get(mainAtom);
  state.items = state.items.filter((item) => item.uid !== uid);

  localStorage.setItem(key, JSON.stringify(state));
  return set(mainAtom, { ...state });
});

const onWritableRemoveAllShoppingItem = atom<null, undefined>(null, (get, set) => {
  const state = get(mainAtom);

  localStorage.setItem(key, JSON.stringify(state));
  return set(mainAtom, { ...state, items: [] });
});

export const writable = {
  onWritableAppendShoppingItem,
  onWritableRemoveAllShoppingItem,
  onWritableRemoveShoppingItem,
};
export const readable = {
  onReadableShoppingItems,
  onReadableSumShoppingItems,
  onReadableSplitSumShoppingItems,
  onReadableRatioShoppingItems,
};
