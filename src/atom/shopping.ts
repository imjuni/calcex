import { atom } from 'jotai';
import { atomWithReset } from 'jotai/utils';

export interface IShoppingItem {
  name?: string;
  uid: string;
  price: number;
}

const defaultValue: { items: IShoppingItem[] } = {
  items: [],
};

export const mainAtom = atomWithReset(defaultValue);

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

const onWritableAppendShoppingItem = atom<null, IShoppingItem>(null, (get, set, update) => {
  const state = get(mainAtom);
  state.items = [...state.items, update];

  return set(mainAtom, { ...state });
});

const onWritableREmoveShoppingItem = atom<null, string>(null, (get, set, uid) => {
  const state = get(mainAtom);
  state.items = state.items.filter((item) => item.uid !== uid);

  return set(mainAtom, { ...state });
});

export const writable = { onWritableAppendShoppingItem, onWritableREmoveShoppingItem };
export const readable = { onReadableShoppingItems, onReadableSumShoppingItems };
