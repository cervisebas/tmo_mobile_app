import { chunkArray } from "./ChunkArray";

interface IProps<T> {
  promises: Promise<T>[];
  concurrency?: number;
  retryOnCatch?: boolean;
  checkContinue?(): boolean;
  onResult(result: T, index: number): Promise<void>;
  onError?(index: number): void;
  onFinish?(total: number): void;
}

export async function runPromisesInBatches<T>(props: IProps<T>) {
  const concurrency = props.concurrency || 3;
  const promises = chunkArray(props.promises, concurrency);

  console.info(`PromiseInBatches: Recortado en ${promises.length} de ${concurrency}`);

  let index = 0;

  for (const tasks of promises) {
    let loaded = false;

    const _continue = props.checkContinue?.() ?? true;

    if (!_continue) {
      loaded = true;
      return;
    }

    while (!loaded) {
      try {
        console.info(`PromiseInBatches: Ejecutando ${promises.indexOf(tasks)} de ${promises.length}...`);
        const results = await Promise.all(tasks);
    
        for (const result of results) {
          const _continue = props.checkContinue?.() ?? true;
    
          if (!_continue) {
            loaded = true;
            return;
          }
    
          try {
            await props.onResult(result, index);
          } catch (error) {
            console.error(error);
          }
          index++;
        }

        loaded = true;
      } catch (error) {
        console.error(error);

        loaded = !props.retryOnCatch;
      }
    }
  }

  props.onFinish?.(index);
}