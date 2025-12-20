import { lastValueFrom, Observable } from 'rxjs';
import { chunkArray } from './ChunkArray';

interface IProps<T> {
  observables: Observable<T>[];
  concurrency?: number;
  retryOnCatch?: boolean;
  catchErrorOnResult?: boolean;
  checkContinue?(): boolean;
  onResult(result: T, index: number): Promise<void>;
  onError?(index: number): void;
  onFinish?(total: number): void;
}

export async function runObserversInBatches<T>(props: IProps<T>) {
  const concurrency = props.concurrency || 3;
  const observables = chunkArray(props.observables, concurrency);

  console.info(
    `ObserversInBatches: Recortado en ${observables.length} de ${concurrency}`,
  );

  let index = 0;

  for (const tasks of observables) {
    let loaded = false;

    const _continue = props.checkContinue?.() ?? true;

    if (!_continue) {
      loaded = true;
      props.onFinish?.(index);
      return;
    }

    while (!loaded) {
      try {
        console.info(
          `ObserversInBatches: Ejecutando ${observables.indexOf(tasks)} de ${observables.length}...`,
        );
        const results = await Promise.all(
          tasks.map((task) => lastValueFrom(task)),
        );

        console.info(
          `ObserversInBatches: Ejecucion ${observables.indexOf(tasks)} completada!`,
        );

        for (const result of results) {
          const _continue = props.checkContinue?.() ?? true;

          if (!_continue) {
            loaded = true;
            props.onFinish?.(index);
            return;
          }

          console.info(
            `ObserversInBatches: Esperando ${results.indexOf(result)} resultado...`,
          );
          try {
            await props.onResult(result, index);
            index++;
          } catch (error) {
            console.error('Error in "OnResult" ->', error);

            if (props.catchErrorOnResult) {
              throw error;
            } else {
              index++;
            }
          }
        }

        loaded = true;
      } catch (error) {
        console.error('Error in "RunPromisesInBatches" ->', error);

        loaded = !props.retryOnCatch;
      }
    }
  }

  props.onFinish?.(index);
}
