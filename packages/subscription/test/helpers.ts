import { Operation, sleep } from '@effection/core';

// TODO: move this to core?
export function race<T>(...ops: Operation<T>[]): Operation<T> {
  return function(scope) {
    return (resolve, reject) => {
      for(let op of ops) {
        let task = scope.spawn(op);
        task.ensure(() => {
          if(task.state === 'completed') {
            resolve(task.result as T);
          }
          if(task.state === 'errored') {
            reject(task.error as Error);
          }
        })
      }
    }
  }
}

export function abortAfter<T>(op: Operation<T>, ms: number): Operation<T | undefined> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return race<any>(sleep(ms), op);
}