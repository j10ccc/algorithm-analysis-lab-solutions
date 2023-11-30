import { IInput } from "../interfaces";

function sort(arr: number[]) {
  if (arr.length <= 1) return;

  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  sort(left);
  sort(right);

  let i = 0, j = 0, k = 0;
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      arr[k++] = left[i++];
    } else {
      arr[k++] = right[j++];
    }
  }

  while (i < left.length) {
    arr[k++] = left[i++];
  }

  while (j < right.length) {
    arr[k++] = right[j++];
  }
}

export default function merge(data: IInput) {
  const { arr } = data;

  sort(arr);

  return arr;
} 
